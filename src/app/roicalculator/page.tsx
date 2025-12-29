"use client";

import ClarivueImpactCalculator from "@/components/sections/institution/ClarivueImpactCalculator";

export default function RoiCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e8f0ff] via-white to-[#f5f8ff]">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#003366]/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#003366]/70 backdrop-blur">
            ROI Calculator
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#003366]">
            Clarivue Impact Calculator
          </h1>
          <p className="text-sm md:text-base text-[#003366]/70 max-w-3xl">
            Estimate the value of standardizing mock interviews, improving readiness, and freeing advisor time.
            Adjust the sliders and see the cost of the gap before and after Clarivue.
          </p>
        </header>

        <ClarivueImpactCalculator />
      </div>
    </main>
  );
}
