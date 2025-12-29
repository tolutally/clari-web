import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "10minutemail.com",
  "yopmail.com",
  "guerrillamail.com",
  "tempmail.com",
  "trashmail.com",
  "dispostable.com",
  "sharklasers.com",
  "spamgourmet.com",
];

function isValidEmail(email: string) {
  if (!email) return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 6) return false;
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!re.test(trimmed)) return false;
  const domain = trimmed.split("@")[1]?.toLowerCase();
  if (!domain || DISPOSABLE_DOMAINS.some((d) => domain.endsWith(d))) return false;
  return true;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; hp?: string };
    const rawEmail = body.email?.trim().toLowerCase() ?? "";

    // simple honeypot
    if (body.hp) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("individual_beta_signups")
      .upsert({ email: rawEmail })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Could not save email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
