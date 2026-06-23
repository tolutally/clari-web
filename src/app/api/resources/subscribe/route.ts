import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per-IP, max 5 submissions per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: { email?: string; _hp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, _hp } = body;

  // Honeypot — silently accept (bots shouldn't get an error)
  if (_hp) {
    return NextResponse.json({ ok: true, workbookUrl: "/reports/clarivue-workbook.pdf" });
  }

  // Email validation
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (apiKey && groupId) {
    try {
      // MailerLite new API (connect.mailerlite.com)
      const mlRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          groups: [groupId],
          resubscribe: true,
        }),
      });

      if (!mlRes.ok) {
        const mlErr = await mlRes.json().catch(() => ({}));
        console.error("[MailerLite] error:", mlErr);
        // Still deliver the workbook — don't fail the user experience
      }
    } catch (err) {
      console.error("[MailerLite] request failed:", err);
    }
  }

  // Always return the workbook URL so the client can trigger the download
  return NextResponse.json({ ok: true, workbookUrl: "/reports/clarivue-workbook.pdf" });
}
