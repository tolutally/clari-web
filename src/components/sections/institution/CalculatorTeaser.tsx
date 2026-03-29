"use client";

import { ArrowRight, Clock, DollarSign, Users, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ── Animation keyframes: 4 inputs → 3 losses + hero ── */
type Frame = {
  active: string;
  learners: string;
  program: string;
  advisors: string;
  caseload: string;
  // Results
  gapCost: string;
  timeLost: string;
  moneyLost: string;
  peopleLost: string;
  placements: string;
  ms: number;
};

const FRAMES: Frame[] = [
  // Initial state
  { active: "", learners: "", program: "workforce", advisors: "", caseload: "", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 900 },
  
  // Type learners: 200
  { active: "learners", learners: "2", program: "workforce", advisors: "", caseload: "", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 140 },
  { active: "learners", learners: "20", program: "workforce", advisors: "", caseload: "", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 140 },
  { active: "learners", learners: "200", program: "workforce", advisors: "", caseload: "", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 500 },
  
  // Switch program → Bootcamp
  { active: "program", learners: "200", program: "bootcamp", advisors: "", caseload: "", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 600 },
  
  // Type advisors: 5
  { active: "advisors", learners: "200", program: "bootcamp", advisors: "5", caseload: "", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 600 },
  
  // Type caseload: 50 → results appear
  { active: "caseload", learners: "200", program: "bootcamp", advisors: "5", caseload: "5", gapCost: "$0", timeLost: "0h", moneyLost: "$0", peopleLost: "0", placements: "+0", ms: 140 },
  { active: "caseload", learners: "200", program: "bootcamp", advisors: "5", caseload: "50", gapCost: "$287,500", timeLost: "1,800h", moneyLost: "$99,000", peopleLost: "25", placements: "+16", ms: 3500 },
];

/* ── Animated calculator form ── */
function CalculatorAnimation() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    let running = false;

    function tick() {
      setStep(idx);
      timer = setTimeout(() => {
        idx = (idx + 1) % FRAMES.length;
        if (running) tick();
      }, FRAMES[idx].ms);
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          tick();
        } else if (!e.isIntersecting) {
          running = false;
          clearTimeout(timer);
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(timer); running = false; };
  }, []);

  const f = FRAMES[step];
  const prev = FRAMES[step > 0 ? step - 1 : 0];

  const fieldCls = (name: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm pointer-events-none transition-all duration-200 ${
      f.active === name
        ? "border-[#ff686c] ring-2 ring-[#ff686c]/30 bg-[#ff686c]/5 text-[#003366]"
        : "border-[#003366]/15 bg-white text-[#003366]"
    }`;

  const hasResults = f.gapCost !== "$0";
  const gapCostChanged = f.gapCost !== prev.gapCost && hasResults;

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6">
      {/* ── Left: Inputs ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-[#003366]/60 uppercase tracking-wider">
          Your program
        </h3>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#003366]">
              Learners per year
            </label>
            <input type="text" value={f.learners} readOnly tabIndex={-1} placeholder="e.g., 200" className={fieldCls("learners")} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#003366]">
              Program type
            </label>
            <select value={f.program} disabled tabIndex={-1} aria-label="Program type" className={fieldCls("program").replace("pointer-events-none", "pointer-events-none appearance-none")}>
              <option value="workforce">Workforce Development</option>
              <option value="bootcamp">Bootcamp / Skills</option>
              <option value="university">University / College</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#003366]">
              Advisors / staff
            </label>
            <input type="text" value={f.advisors} readOnly tabIndex={-1} placeholder="e.g., 5" className={fieldCls("advisors")} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#003366]">
              Current caseload
            </label>
            <input type="text" value={f.caseload} readOnly tabIndex={-1} placeholder="e.g., 40" className={fieldCls("caseload")} />
          </div>
        </div>
      </div>

      {/* ── Right: Results ── */}
      <div className="space-y-4">
        {/* Hero: Gap Cost */}
        <div className={`rounded-xl border p-4 transition-all duration-500 ${
          hasResults 
            ? "border-[#ff686c]/30 bg-gradient-to-br from-[#ff686c]/5 to-[#ff686c]/10" 
            : "border-dashed border-[#003366]/20 bg-[#003366]/[0.02]"
        } ${gapCostChanged ? "scale-[1.02] shadow-lg" : ""}`}>
          <p className="text-[10px] font-semibold text-[#ff686c] uppercase tracking-wider mb-1">
            Your training-to-employment gap costs
          </p>
          <p className={`text-3xl font-bold transition-colors duration-300 ${hasResults ? "text-[#003366]" : "text-[#003366]/25"}`}>
            {f.gapCost}<span className="text-base font-normal text-[#003366]/50">/year</span>
          </p>
        </div>

        {/* 3 Loss Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-lg border p-3 transition-all duration-300 ${hasResults ? "border-slate-200 bg-slate-50" : "border-[#003366]/10 bg-[#003366]/[0.02]"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className={`w-3.5 h-3.5 ${hasResults ? "text-slate-500" : "text-[#003366]/20"}`} />
              <span className="text-[9px] font-medium text-[#003366]/50 uppercase">Time</span>
            </div>
            <p className={`text-lg font-bold ${hasResults ? "text-[#003366]" : "text-[#003366]/25"}`}>{f.timeLost}</p>
          </div>

          <div className={`rounded-lg border p-3 transition-all duration-300 ${hasResults ? "border-amber-200 bg-amber-50" : "border-[#003366]/10 bg-[#003366]/[0.02]"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className={`w-3.5 h-3.5 ${hasResults ? "text-amber-500" : "text-[#003366]/20"}`} />
              <span className="text-[9px] font-medium text-[#003366]/50 uppercase">Money</span>
            </div>
            <p className={`text-lg font-bold ${hasResults ? "text-[#003366]" : "text-[#003366]/25"}`}>{f.moneyLost}</p>
          </div>

          <div className={`rounded-lg border p-3 transition-all duration-300 ${hasResults ? "border-red-200 bg-red-50" : "border-[#003366]/10 bg-[#003366]/[0.02]"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Users className={`w-3.5 h-3.5 ${hasResults ? "text-red-500" : "text-[#003366]/20"}`} />
              <span className="text-[9px] font-medium text-[#003366]/50 uppercase">People</span>
            </div>
            <p className={`text-lg font-bold ${hasResults ? "text-[#003366]" : "text-[#003366]/25"}`}>{f.peopleLost}</p>
          </div>
        </div>

        {/* Payoff: Clarivue Impact */}
        <div className={`rounded-xl border p-4 transition-all duration-500 ${
          hasResults 
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50" 
            : "border-dashed border-[#003366]/20 bg-[#003366]/[0.02]"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className={`w-4 h-4 ${hasResults ? "text-emerald-600" : "text-[#003366]/20"}`} />
            <span className="text-[10px] font-semibold text-emerald-700/70 uppercase tracking-wider">With Clarivue</span>
          </div>
          <p className={`text-2xl font-bold transition-colors duration-300 ${hasResults ? "text-emerald-700" : "text-[#003366]/25"}`}>
            {f.placements} placements
          </p>
        </div>
      </div>
    </div>
  );
}

export function CalculatorTeaser() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-12">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ff686c]/5 blur-[80px] rounded-full pointer-events-none -z-10" />

      {/* ── Centered Header ── */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#003366]/15 bg-white/70 backdrop-blur-md group hover:bg-white transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />
          <span className="text-[11px] font-semibold text-[#003366] tracking-[0.2em] uppercase">
            THE HIDDEN GAP
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#003366] leading-[1.1]">
          What is the training-to-employment gap actually costing your program?
        </h2>

        <p className="text-base md:text-lg text-[#003366]/60 leading-relaxed max-w-3xl mx-auto">
          Most programs absorb these costs without ever calculating them. Run your numbers. The answer is usually worse than expected.
        </p>
      </div>

      {/* ── Calculator (75% width) ── */}
      <div className="w-full max-w-[75%] mx-auto">
        <div className="relative">
          {/* Glow behind container */}
          <div className="absolute -inset-1 bg-gradient-to-b from-sky-500/10 to-transparent rounded-2xl blur opacity-40" />

          {/* Calculator Card */}
          <div className="relative glass-panel rounded-2xl border border-[#003366]/10 p-1 overflow-hidden shadow-2xl shadow-blue-900/10">
            <div className="bg-white/90 rounded-xl border border-[#003366]/5 overflow-hidden p-5 md:p-6">
              <CalculatorAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Below Calculator ── */}
      <div className="mt-8 flex justify-center">
        <div
          className="relative rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl px-8 py-6 text-center transition-all duration-300 hover:bg-white/80 hover:shadow-2xl hover:shadow-[#003366]/10"
          style={{
            boxShadow: "0 8px 32px rgba(0, 51, 102, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-3">
            <a
              href="/hidden-gap"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ff686c] text-white text-sm font-semibold hover:bg-[#ff5b5f] transition-all duration-300 shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5"
            >
              <span>Find your hidden gap</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
            <p className="text-[11px] text-[#003366]/50">
              See what the training-to-employment gap is costing you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
