"use client";

import { useState } from "react";
import { BarChart3, Building2, LineChart, Target, TrendingUp } from "lucide-react";

const painPoints = [

  {
    label: "PLACEMENT PRESSURE",
    quote: "Placement numbers start to wobble",
    description: "When your rate dips, every conversation with leadership, funders, and employers gets harder. You don't need a post-mortem. You need to see it coming.",
    color: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200/50",
  },
  {
    label: "EMPLOYER CONFIDENCE",
    quote: "Employers slow referrals",
    description: "Partners rarely say why they're pulling back. They just get quieter. By the time you notice, the trust is already gone.",
    color: "from-rose-500/10 to-pink-500/10",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    borderColor: "border-rose-200/50",
  },
  {
    label: "COACHING CAPACITY",
    quote: "Advisors are overwhelmed",
    description: "Back-to-back mocks, shrinking depth, and the learners who need the most help are the hardest to spot. More effort isn't the answer.",
    color: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200/50",
  },
  {
    label: "READINESS VISIBILITY",
    quote: "You only find gaps after rejection",
    description: "A learner reaches the final round and falls apart on a question they should have owned. You find out after. The gap was always there.",
    color: "from-indigo-500/10 to-purple-500/10",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-200/50",
  },
];

const icons = [LineChart, TrendingUp, Building2, BarChart3, Target];

function PainPointCard({ item, index, isHovered, isSiblingHovered }: { item: typeof painPoints[number]; index: number; isHovered: boolean; isSiblingHovered: boolean }) {
  const Icon = icons[index % icons.length];
  
  return (
    <div
      className={`group relative rounded-2xl p-6 z-10 shadow-lg transition-all duration-500 ease-out cursor-default ${
        isHovered
          ? "scale-105 shadow-2xl z-20"
          : isSiblingHovered
            ? "scale-[0.96] opacity-70 blur-[0.5px]"
            : "hover:shadow-2xl"
      }`}
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
        <p className="text-sm leading-relaxed text-[#003366] font-semibold">
          {item.quote}
        </p>

        {/* Description */}
        <p className="mt-2 text-xs leading-relaxed text-[#003366]/60">
          {item.description}
        </p>
        
        {/* Decorative accent line */}
        <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${item.color} opacity-60`} />
      </div>
    </div>
  );
}

export default function InstitutionPainPoints() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 px-6">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white/70 mb-4">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#003366]">
            USE CASES
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#003366] mb-3">
          Interview prep usually feels fine, until something breaks.
        </h2>
        
        <p className="text-base text-[#003366]/70">
          These are the moments teams realize they need more than workshops.
        </p>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item, i) => (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <PainPointCard
                item={item}
                index={i}
                isHovered={hoveredIndex === i}
                isSiblingHovered={hoveredIndex !== null && hoveredIndex !== i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
