"use client";

import { BarChart3, Building2, LineChart, Target, TrendingUp } from "lucide-react";

const painPoints = [
  {
    label: "OUTCOME PROOF",
    quote: "Partners are asking for proof of outcomes — we can't keep selling 'trust us.'",
  },
  {
    label: "PLACEMENT PRESSURE",
    quote: "If placements don't improve this cycle, enrollments, referrals, and funding are at risk.",
  },
  {
    label: "EMPLOYER CONFIDENCE",
    quote: "Employers say our learners aren't interview-ready — and they stop hiring from us.",
  },
  {
    label: "READINESS VISIBILITY",
    quote: "We don't know who's ready until interviews fail — that's too late to intervene.",
  },
  {
    label: "COACHING CAPACITY",
    quote: "Our advisors can't give every learner deep interview coaching — it doesn't scale.",
  },
];

export default function InstitutionPainPoints() {
  const offsets = ["lg:translate-y-12", "lg:translate-y-4", "lg:-translate-y-2", "lg:translate-y-6", "lg:translate-y-10"];
  const icons = [LineChart, TrendingUp, Building2, BarChart3, Target];

  return (
    <section className="relative py-0 max-w-6xl mx-auto px-6 overflow-visible">
      {/* Arc layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {painPoints.map((item, i) => (
          <div
            key={item.label}
            className={[
              "group relative rounded-[28px] p-5 sm:p-6 z-10",
              "transition-all duration-300 hover:-translate-y-1 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.2)] hover:shadow-[0_26px_70px_-30px_rgba(0,0,0,0.3)]",
              offsets[i] ?? "",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-white/30 backdrop-blur-xl" />
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-white/10 to-white/5" />
            <div className="pointer-events-none absolute -inset-px rounded-[28px] ring-1 ring-white/40" />
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-black/5 blur-2xl" />

            <div className="relative flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#6b7280]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af] text-sm shadow-inner">
                {(() => {
                  const Icon = icons[i];
                  return Icon ? <Icon className="h-4 w-4 text-[#6b7280]" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#9ca3af]" />;
                })()}
              </span>
              <span>{item.label}</span>
            </div>

            <p className="relative mt-3 text-sm leading-relaxed text-[#111827]">
              “{item.quote}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
