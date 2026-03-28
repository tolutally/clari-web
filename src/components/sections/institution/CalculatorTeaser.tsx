"use client";

import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ── Animation keyframes: field typing + result updates ── */
const FRAMES = [
  { active: "", learners: "", program: "bootcamp", interviews: "", coaching: "", spend: "", cost: "$0", recovered: "$0", payback: "—", roi: "—", ms: 900 },
  // Type learners: 200
  { active: "learners", learners: "2", program: "bootcamp", interviews: "", coaching: "", spend: "", cost: "$0", recovered: "$0", payback: "—", roi: "—", ms: 160 },
  { active: "learners", learners: "20", program: "bootcamp", interviews: "", coaching: "", spend: "", cost: "$0", recovered: "$0", payback: "—", roi: "—", ms: 160 },
  { active: "learners", learners: "200", program: "bootcamp", interviews: "", coaching: "", spend: "", cost: "$0", recovered: "$0", payback: "—", roi: "—", ms: 500 },
  // Switch program → University
  { active: "program", learners: "200", program: "university", interviews: "", coaching: "", spend: "", cost: "$0", recovered: "$0", payback: "—", roi: "—", ms: 600 },
  // Type interviews: 3 → results appear
  { active: "interviews", learners: "200", program: "university", interviews: "3", coaching: "", spend: "", cost: "$482,400", recovered: "$253,260", payback: "—", roi: "—", ms: 1000 },
  // Type coaching: 60 → results update
  { active: "coaching", learners: "200", program: "university", interviews: "3", coaching: "6", spend: "", cost: "$482,400", recovered: "$253,260", payback: "—", roi: "—", ms: 160 },
  { active: "coaching", learners: "200", program: "university", interviews: "3", coaching: "60", spend: "", cost: "$547,120", recovered: "$287,238", payback: "—", roi: "—", ms: 700 },
  // Type spend: 25,000 → payback & ROI appear
  { active: "spend", learners: "200", program: "university", interviews: "3", coaching: "60", spend: "2", cost: "$547,120", recovered: "$287,238", payback: "—", roi: "—", ms: 120 },
  { active: "spend", learners: "200", program: "university", interviews: "3", coaching: "60", spend: "25", cost: "$547,120", recovered: "$287,238", payback: "—", roi: "—", ms: 120 },
  { active: "spend", learners: "200", program: "university", interviews: "3", coaching: "60", spend: "250", cost: "$547,120", recovered: "$287,238", payback: "—", roi: "—", ms: 120 },
  { active: "spend", learners: "200", program: "university", interviews: "3", coaching: "60", spend: "2,500", cost: "$547,120", recovered: "$287,238", payback: "—", roi: "—", ms: 120 },
  { active: "spend", learners: "200", program: "university", interviews: "3", coaching: "60", spend: "25,000", cost: "$547,120", recovered: "$287,238", payback: "2 months", roi: "1,048%", ms: 3500 },
];

const RESULTS = [
  { key: "cost" as const, label: "Annual cost of doing nothing", accent: "bg-[#ff686c]" },
  { key: "recovered" as const, label: "Value recovered annually", accent: "bg-emerald-500" },
  { key: "payback" as const, label: "Payback period", accent: "bg-blue-500" },
  { key: "roi" as const, label: "Return on investment", accent: "bg-violet-500" },
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
    `w-full rounded border px-2.5 py-1.5 text-sm pointer-events-none transition-all duration-200 ${
      f.active === name
        ? "border-sky-400 ring-2 ring-sky-400/30 bg-sky-50/30 text-[#003366]"
        : "border-gray-300 bg-white text-[#003366]"
    }`;

  return (
    <div ref={ref} className="space-y-5">
      {/* ── Inputs ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#003366] uppercase tracking-wide">
          Your current setup
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#003366]/80">
              Learners completing your program each year?
            </label>
            <input type="text" value={f.learners} readOnly tabIndex={-1} placeholder="0" className={fieldCls("learners")} />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#003366]/80">
              What type of program do you run?
            </label>
            <select value={f.program} disabled tabIndex={-1} className={fieldCls("program").replace("pointer-events-none", "pointer-events-none appearance-none")}>
              <option value="bootcamp">Bootcamp</option>
              <option value="university">University</option>
              <option value="workforce">Workforce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#003366]/80">
              Mock interviews per learner on average?
            </label>
            <input type="text" value={f.interviews} readOnly tabIndex={-1} placeholder="0" className={fieldCls("interviews")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-w-md mx-auto">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#003366]/80">
              How many learners need extra coaching before interviews?
            </label>
            <input type="text" value={f.coaching} readOnly tabIndex={-1} placeholder="0" className={fieldCls("coaching")} />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#003366]/80">
              Annual spend on interview prep?
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-[#003366]/50 shrink-0">$</span>
              <input type="text" value={f.spend} readOnly tabIndex={-1} placeholder="0" className={fieldCls("spend")} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#003366] uppercase tracking-wide">
          Calculate savings
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RESULTS.map(({ key, label, accent }) => {
            const val = f[key];
            const prevVal = prev[key];
            const justChanged = val !== prevVal;
            const isLive = val !== "$0" && val !== "—";

            return (
              <div
                key={key}
                className={`rounded overflow-hidden shadow-sm border transition-all duration-500 ${
                  justChanged
                    ? "border-sky-300 shadow-lg scale-[1.04]"
                    : isLive
                    ? "border-sky-200/60 shadow-md"
                    : "border-gray-100"
                }`}
              >
                <div className={`${accent} px-3 py-1.5`}>
                  <span className="text-xs font-semibold text-white">{label}</span>
                </div>
                <div className={`px-3 py-2.5 transition-colors duration-500 ${justChanged ? "bg-sky-50" : "bg-white"}`}>
                  <span className={`text-xl font-bold transition-colors duration-300 ${isLive ? "text-[#003366]" : "text-[#003366]/25"}`}>
                    {val}
                  </span>
                </div>
              </div>
            );
          })}
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
            Value for money
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
              href="/placement-cost-calculator"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ff686c] text-white text-sm font-semibold hover:bg-[#ff5b5f] transition-all duration-300 shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5"
            >
              <span>Run your numbers</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
            <p className="text-[11px] text-[#003366]/50">
              Open the full placement cost calculator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
