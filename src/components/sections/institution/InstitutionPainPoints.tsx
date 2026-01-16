"use client";

import { BarChart3, Building2, LineChart, Target, TrendingUp } from "lucide-react";

const painPoints = [
  {
    label: "OUTCOME PROOF",
    quote: "Partners are asking for proof of outcomes — we can't keep selling 'trust us.'",
    color: "from-sky-500/10 to-blue-500/10",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    borderColor: "border-sky-200/50",
  },
  {
    label: "PLACEMENT PRESSURE",
    quote: "If placements don't improve this cycle, enrollments, referrals, and funding are at risk.",
    color: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200/50",
  },
  {
    label: "EMPLOYER CONFIDENCE",
    quote: "Employers say our learners aren't interview-ready — and they stop hiring from us.",
    color: "from-rose-500/10 to-pink-500/10",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    borderColor: "border-rose-200/50",
  },
  {
    label: "READINESS VISIBILITY",
    quote: "We don't know who's ready until interviews fail — that's too late to intervene.",
    color: "from-indigo-500/10 to-purple-500/10",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-200/50",
  },
  {
    label: "COACHING CAPACITY",
    quote: "Our advisors can't give every learner deep interview coaching — it doesn't scale.",
    color: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200/50",
  },
];

const icons = [LineChart, TrendingUp, Building2, BarChart3, Target];

function PainPointCard({ item, index }: { item: typeof painPoints[number]; index: number }) {
  const Icon = icons[index % icons.length];
  // Stagger the bounce animation for each card
  const bounceDelay = `${index * 0.2}s`;
  
  return (
    <div
      className={[
        "group relative rounded-2xl p-6 z-10 flex-shrink-0 w-[280px]",
        "transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]",
        "shadow-lg hover:shadow-2xl",
        "animate-bounce-gentle",
      ].join(" ")}
      style={{ animationDelay: bounceDelay }}
    >
      {/* Background with gradient */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-50 group-hover:opacity-70 transition-opacity`} />
      
      {/* White backdrop */}
      <div className="absolute inset-0 rounded-2xl bg-white/95 backdrop-blur-sm" />
      
      {/* Border glow effect */}
      <div className={`absolute inset-0 rounded-2xl border ${item.borderColor} group-hover:border-opacity-100 transition-all`} />
      
      {/* Subtle shadow at bottom */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-24 w-48 rounded-full bg-black/5 blur-xl group-hover:bg-black/8 transition-all" />

      {/* Content */}
      <div className="relative">
        {/* Icon and Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} shadow-sm group-hover:shadow-md transition-all`}>
            {Icon && <Icon className={`h-5 w-5 ${item.iconColor}`} strokeWidth={1.5} />}
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#003366]/60">
            {item.label}
          </span>
        </div>

        {/* Quote */}
        <p className="text-sm leading-relaxed text-[#003366] font-medium">
          "{item.quote}"
        </p>
        
        {/* Decorative accent line */}
        <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${item.color} opacity-60`} />
      </div>
    </div>
  );
}

export default function InstitutionPainPoints() {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...painPoints, ...painPoints];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 px-6">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white/70 mb-4">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#003366]">
            WHAT INSTITUTIONS ARE FACING
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#003366] mb-3">
          Placements depend on interview success. But readiness is hard to measure.
        </h2>
        
        <p className="text-base text-[#003366]/70">
          You prepare students for careers. But when it comes to interviews, too much still comes down to hope.
        </p>
      </div>

      {/* Scrolling marquee */}
      <div className="relative">
        {/* Gradient fade on left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        
        {/* Gradient fade on right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
          {duplicatedItems.map((item, i) => (
            <PainPointCard key={`${item.label}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
