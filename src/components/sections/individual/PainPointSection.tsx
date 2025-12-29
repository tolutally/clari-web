"use client";

import { AlertCircle, Dice5 } from "lucide-react";
import React from "react";

export default function PainPointSection() {
  return (
    <section className="relative w-full overflow-hidden py-10 md:py-14">
      {/* Ambient grid + glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-size:36px_36px] [background-image:linear-gradient(to_right,rgba(0,51,102,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,51,102,0.06)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute top-6 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-[#b8ccf4]/30 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#003366]/10 bg-white/80 px-3 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff686c] shadow-[0_0_8px_rgba(255,104,108,0.5)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#003366]/70">
              The preparation gap
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#003366] sm:text-4xl md:text-5xl leading-[1.08]">
            Most prepare to get interviews.
            <br />
            Few prepare to perform.
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-[#003366]/70">
            They spend weeks tailoring resumes and chasing callbacks -
            then walk into the interview assuming confidence or experience 
            will carry them through but it usually doesn’t.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left: Pain / Trap */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#003366]/10 bg-white/80 backdrop-blur-md transition-colors hover:border-[#003366]/25 lg:col-span-7 shadow-[0_18px_60px_-32px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-[#ff686c]/10 via-transparent to-transparent" />

            <div className="relative p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#003366]/10 bg-[#003366]/5 text-[#003366]">
                    <Dice5 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-[#003366]">The “Wing It” Strategy</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#003366]/70">
                    Confidence isn’t a plan. Without structure, strong candidates ramble, miss impact, and lose control of
                    the room.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6 rounded-xl border border-[#003366]/10 bg-white/60 p-4 shadow-inner shadow-blue-900/5">
                <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#003366]/60">
                  <span>Interview timeline</span>
                  <span className="text-[#ff686c]">Status: risky</span>
                </div>

                <div className="space-y-2">
                  <LineItem label="Resume sent" tone="muted" />
                  <LineItem label="Invite received" tone="mid" />
                  <LineItem label="The regret" tone="hot" />
                </div>

                <div className="mt-4 flex gap-3 rounded-lg border border-[#ff686c]/30 bg-[#ff686c]/10 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff686c]" />
                  <p className="text-xs leading-tight text-[#003366]">
                    “I rambled on the weakness question. I should’ve used a framework.”
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: more problem angles */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-2xl border border-[#003366]/10 bg-white/80 p-6 backdrop-blur-md transition-colors hover:border-[#003366]/25 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.25)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#b8ccf4]/25 blur-[60px]" />
              <div className="relative space-y-2">
                <p className="text-3xl font-semibold tracking-tight text-[#003366]">Most</p>
                <p className="text-sm text-[#003366]/70">
                  candidates struggle to clearly explain impact in the first few minutes.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#003366]/10 bg-white/80 p-6 backdrop-blur-md transition-colors hover:border-[#003366]/25 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.25)]">
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-[#ff686c]/15 blur-[60px]" />
              <div className="relative space-y-2">
                <p className="text-lg font-semibold tracking-tight text-[#003366]">Experience doesn’t translate automatically</p>
                <p className="text-sm text-[#003366]/70">
                  Strong work doesn’t land when stories don’t map to the role or speak the company’s language.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#003366]/10 bg-white/80 p-6 backdrop-blur-md transition-colors hover:border-[#003366]/25 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.25)]">
              <div className="pointer-events-none absolute -right-16 bottom-0 h-24 w-32 rounded-full bg-[#c0f5e4]/20 blur-[70px]" />
              <div className="relative space-y-2">
                <p className="text-lg font-semibold tracking-tight text-[#003366]">
                  Knowing your work isn’t the same as explaining it under pressure
                </p>
                <p className="text-sm text-[#003366]/70">
                  Without structure, nerves take over—answers lose clarity, impact, and credibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LineItem({ label, tone }: { label: string; tone: "muted" | "mid" | "hot" }) {
  const dot =
    tone === "hot"
      ? "bg-[#ff686c] shadow-[0_0_10px_rgba(255,104,108,0.35)]"
      : tone === "mid"
        ? "bg-[#003366]/60"
        : "bg-[#003366]/40";

  const text = tone === "hot" ? "text-[#ff686c]" : tone === "mid" ? "text-[#003366]" : "text-[#003366]/70";

  const line = tone === "hot" ? "bg-[#ff686c]/30" : "bg-[#003366]/15";

  return (
    <div className="flex items-center gap-3">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className={`h-px flex-1 ${line}`} />
      <span className={`text-xs ${text}`}>{label}</span>
    </div>
  );
}
