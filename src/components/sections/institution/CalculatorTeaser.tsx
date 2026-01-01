"use client";

import { Calculator, Users, DollarSign, ArrowRight, Info } from "lucide-react";
import { useState } from "react";

export function CalculatorTeaser() {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <section className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-12">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ff686c]/5 blur-[80px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#003366]/15 bg-white/70 backdrop-blur-md mb-6 group hover:bg-white transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
          <span className="text-[11px] font-semibold text-[#003366] tracking-[0.2em] uppercase">
            Program Value
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#003366] mb-4 max-w-2xl leading-[1.1]">
          Curious what this looks like for your program? 
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#003366] via-[#003366] to-[#003366]/40">
           
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#003366]/70 max-w-xl leading-relaxed mb-10">
          Estimate the impact of low placements and see how improving interview readiness helps protect enrollment and income. 
        </p>

        {/* Calculator Tool */}
        <div className="relative w-full max-w-3xl mx-auto mb-10">
          {/* Glow behind container */}
          <div className="absolute -inset-1 bg-gradient-to-b from-sky-500/10 to-transparent rounded-2xl blur opacity-40" />

          {/* Calculator Card */}
          <div className="relative glass-panel rounded-2xl border border-[#003366]/10 p-1 overflow-hidden shadow-2xl shadow-blue-900/10">
            {/* Inner Window Frame */}
            <div className="bg-white/90 rounded-xl border border-[#003366]/5 overflow-hidden flex flex-col md:flex-row">
              {/* Sidebar / Controls */}
              <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-[#003366]/10 p-5 flex flex-col gap-5 bg-white/95">
                <div className="flex items-center gap-2 text-[#003366]/60 mb-1">
                  <Calculator className="h-4 w-4 text-sky-600" strokeWidth={1.5} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Parameters
                  </span>
                </div>

                {/* Input Group 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[#003366]/70 font-medium">Cohort Size</label>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#003366]/20 rounded-lg px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-sky-500/20">
                    <Users className="h-4 w-4 text-[#003366]/40" strokeWidth={1.5} />
                    <input
                      type="text"
                      value="125"
                      className="bg-transparent border-none outline-none text-[#003366] text-sm w-full font-mono placeholder-[#003366]/30"
                      readOnly
                    />
                    <span className="text-[11px] text-[#003366]/50 font-mono">Students</span>
                  </div>
                </div>

                {/* Input Group 2 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[#003366]/70 font-medium">Placement Rate</label>
                    <span className="text-sky-600 font-mono text-[11px] bg-sky-100 px-2 py-0.5 rounded">
                      42%
                    </span>
                  </div>
                  {/* Custom Slider UI */}
                  <div className="relative w-full h-4 flex items-center">
                    <div className="w-full h-1.5 bg-[#003366]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 w-[42%]" />
                    </div>
                    <div className="absolute left-[42%] w-3.5 h-3.5 bg-white border-2 border-sky-500 rounded-full shadow-md -translate-x-1/2 cursor-grab" />
                  </div>
                </div>

                {/* Input Group 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="text-[#003366]/70 font-medium">Avg. Tuition</label>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#003366]/20 rounded-lg px-3 py-2">
                    <DollarSign className="h-4 w-4 text-[#003366]/40" strokeWidth={1.5} />
                    <input
                      type="text"
                      value="12,500"
                      className="bg-transparent border-none outline-none text-[#003366] text-sm w-full font-mono"
                      readOnly
                    />
                    <span className="text-[11px] text-[#003366]/50 font-mono">USD</span>
                  </div>
                </div>
              </div>

              {/* Main Visualization Area */}
              <div className="w-full md:w-7/12 p-5 flex flex-col relative min-h-[240px] bg-gradient-to-br from-white/80 via-[#f8fbff]/80 to-white/80">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,51,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,51,102,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-[#003366]">Analysis</h3>
                    <button
                      onClick={() => setShowMethodology(!showMethodology)}
                      className="flex items-center gap-1 text-[10px] text-[#003366]/60 hover:text-[#003366] transition-colors group"
                      title="Show methodology"
                    >
                      <Info className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Methodology</span>
                    </button>
                  </div>

                  {/* Methodology Tooltip */}
                  {showMethodology && (
                    <div className="absolute top-8 right-0 w-72 bg-white border border-[#003366]/10 rounded-lg shadow-xl p-4 z-20 text-left">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xs font-semibold text-[#003366]">Calculation Method</h4>
                        <button
                          onClick={() => setShowMethodology(false)}
                          className="text-[#003366]/40 hover:text-[#003366] transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-2 text-[11px] text-[#003366]/70 leading-relaxed">
                        <p>
                          <strong className="text-[#003366]">Risk/Loss:</strong> Estimated tuition revenue at risk from
                          students who don't place (58% of cohort × avg. tuition × enrollment impact factor).
                        </p>
                        <p>
                          <strong className="text-[#003366]">Recoverable:</strong> Potential revenue protected by
                          improving placement rates through better interview readiness (estimated 15-20% improvement).
                        </p>
                        <p className="text-[10px] italic text-[#003366]/50 pt-2 border-t border-[#003366]/10">
                          These are illustrative estimates. Use the full calculator for your program's specific metrics.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Big Numbers */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-rose-50 border border-rose-200/50 rounded-xl p-3 flex flex-col gap-0.5">
                      <span className="text-[10px] text-rose-600/80 font-semibold uppercase tracking-wider">
                        Risk / Loss
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-semibold text-rose-600 tracking-tight font-mono">
                          -$906k
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-3 flex flex-col gap-0.5">
                      <span className="text-[10px] text-emerald-600/80 font-semibold uppercase tracking-wider">
                        Recoverable
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-semibold text-emerald-600 tracking-tight font-mono">
                          +$475k
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Visualization */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-end h-16 gap-3 px-1 pb-2 border-b border-[#003366]/10 relative">
                      {/* Bar 1 */}
                      <div className="w-full bg-[#003366]/10 rounded-t-sm h-[42%] relative group" />
                      {/* Bar 2 */}
                      <div className="w-full bg-sky-100 rounded-t-sm h-[55%] relative group">
                        <div className="absolute bottom-0 left-0 w-full h-[76%] bg-sky-200 border-t-2 border-sky-500/50" />
                      </div>
                      {/* Bar 3 */}
                      <div className="w-full bg-emerald-100 rounded-t-sm h-[80%] relative group border-t-2 border-emerald-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-200/50 to-transparent" />
                      </div>
                    </div>
                    <div className="flex justify-between px-1 pt-2 text-[10px] text-[#003366]/50 font-mono uppercase">
                      <span>Q1</span>
                      <span>Q2</span>
                      <span>Q3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-4 -top-3 bg-white/90 text-[#003366]/60 text-[10px] font-mono px-2 py-1 rounded border border-[#003366]/10 shadow-lg backdrop-blur">
            v2.0
          </div>
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-50">
            <div className="w-1 h-1 rounded-full bg-[#003366]/30" />
            <div className="w-1 h-1 rounded-full bg-[#003366]/20" />
            <div className="w-1 h-1 rounded-full bg-[#003366]/20" />
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="/roicalculator"
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ff686c] text-white text-sm font-semibold hover:bg-[#ff5b5f] transition-all duration-300 shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 href ='/roicalculator'"
        >
          <span>Calculate your ROI</span> 
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}
