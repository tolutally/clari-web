import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/db/supabaseAdmin";
import { createHash } from "crypto";

/* ─── Free / disposable email domains to block ─── */
const BLOCKED_DOMAINS = new Set([
  // Major free providers
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.ca",
  "hotmail.com", "hotmail.co.uk", "outlook.com", "outlook.co.uk",
  "live.com", "live.co.uk", "msn.com", "aol.com", "icloud.com", "me.com",
  "mac.com", "mail.com", "email.com", "usa.com", "protonmail.com",
  "proton.me", "zoho.com", "yandex.com", "gmx.com", "gmx.net",
  "fastmail.com", "tutanota.com", "tuta.io", "hushmail.com",
  // Regional free providers
  "qq.com", "163.com", "126.com", "sina.com", "naver.com",
  "rediffmail.com", "web.de", "t-online.de", "libero.it",
  "laposte.net", "free.fr", "wanadoo.fr", "orange.fr",
  // Common disposable / temp email domains
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
  "yopmail.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "dispostable.com", "trashmail.com", "10minutemail.com",
  "temp-mail.org", "fakeinbox.com", "mailnesia.com", "maildrop.cc",
  "getnada.com", "emailondeck.com",
]);

/* ─── Rate limit: max 3 submissions per IP per hour ─── */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 3;

// In-memory rate limiter (resets on cold start — good enough for serverless)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ipHash) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) return true;
  timestamps.push(now);
  rateLimitMap.set(ipHash, timestamps);
  return false;
}

function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function isInstitutionalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_DOMAINS.has(domain);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, company, comment, _hp } = body;

    // ── Honeypot check: if _hp field has a value, it's a bot ──
    if (_hp) {
      // Silently accept to not reveal the trap
      return NextResponse.json({ ok: true });
    }

    // ── Timestamp check: form must take > 2 seconds to fill ──
    const submittedAt = Number(body._ts ?? 0);
    if (submittedAt > 0 && Date.now() - submittedAt < 2000) {
      return NextResponse.json({ ok: true }); // too fast = bot, silent accept
    }

    // ── Required fields ──
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    // ── Email format ──
    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // ── Institutional email check ──
    if (!isInstitutionalEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please use your institutional or work email address." },
        { status: 400 }
      );
    }

    // ── Rate limiting ──
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? req.headers.get("x-real-ip")
      ?? "unknown";
    const ipHash = hashIP(ip);

    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // ── Duplicate check: same email in last 24h ──
    const supabase = getSupabaseAdmin();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("demo_requests")
      .select("id")
      .eq("email", trimmedEmail)
      .gte("created_at", oneDayAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "You've already submitted a demo request. We'll be in touch soon!" },
        { status: 409 }
      );
    }

    // ── Insert ──
    const { error: insertError } = await supabase.from("demo_requests").insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: trimmedEmail,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      comment: comment?.trim() || null,
      source: "book-demo",
      ip_hash: ipHash,
    });

    if (insertError) {
      console.error("[book-demo] Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[book-demo] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
