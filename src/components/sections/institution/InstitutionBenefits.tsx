"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION: Funnel — Shows leaks being sealed, conversions improving
// ─────────────────────────────────────────────────────────────────────────────
function FunnelAnimation() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const cycle = () => {
      setPhase(0);
      setTimeout(() => setPhase(1), 1500);
      setTimeout(() => setPhase(2), 3000);
    };
    cycle();
    const interval = setInterval(cycle, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2.5 flex items-center justify-center gap-3 sm:mt-3 sm:gap-4">
      <div className="relative scale-[0.86] sm:scale-[0.93] lg:scale-100 origin-center">
        <svg width="68" height="60" viewBox="0 0 80 70">
          <path d="M5 5 L75 5 L55 35 L55 65 L25 65 L25 35 Z" fill="none" stroke="#10b981" strokeWidth="2" opacity={0.3} />
          <path d="M10 10 L70 10 L52 35 L52 60 L28 60 L28 35 Z" fill="#10b981" opacity={0.15} />
          <g className={`transition-opacity duration-500 ${phase === 0 ? "opacity-100" : "opacity-0"}`}>
            <circle cx="18" cy="25" r="3" fill="#ef4444" />
            <circle cx="62" cy="25" r="3" fill="#ef4444" />
            <circle cx="40" cy="50" r="3" fill="#ef4444" />
          </g>
          <g className={`transition-opacity duration-500 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
            <circle cx="18" cy="25" r="4" fill="#10b981" />
            <circle cx="62" cy="25" r="4" fill="#10b981" />
            <circle cx="40" cy="50" r="4" fill="#10b981" />
            <path d="M16 25 L18 27 L21 23" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M60 25 L62 27 L65 23" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M38 50 L40 52 L43 48" stroke="white" strokeWidth="1.5" fill="none" />
          </g>
        </svg>
      </div>
      <div className="space-y-1 sm:space-y-1.5">
        <div className="text-center">
          <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-medium">Budget</p>
          <p className="text-[12px] sm:text-[13px] font-bold text-[#003366]">$100K</p>
        </div>
        <div className="h-px w-6 sm:w-7 bg-[#003366]/10 mx-auto" />
        <div className="text-center">
          <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-medium">Placements</p>
          <div className="flex items-center justify-center gap-1">
            <span className={`text-[12px] sm:text-[13px] font-bold transition-all duration-500 ${phase === 2 ? "text-[#10b981]" : "text-[#003366]"}`}>
              {phase === 2 ? "18" : "12"}
            </span>
            {phase === 2 && <span className="text-[10px] text-[#10b981] font-semibold">↑50%</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION: Caseload — One advisor expanding to cover more clients
// ─────────────────────────────────────────────────────────────────────────────
function CaseloadAnimation() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setExpanded(false);
      setTimeout(() => setExpanded(true), 1500);
    };
    cycle();
    const interval = setInterval(cycle, 4500);
    return () => clearInterval(interval);
  }, []);

  const clientCount = expanded ? 8 : 4;

  return (
    <div className="mt-2.5 flex items-center justify-center gap-3 sm:mt-3 sm:gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#6366f1]/20 border-2 border-[#6366f1] flex items-center justify-center">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-[9px] font-semibold text-[#6366f1] mt-1">1 Advisor</p>
      </div>
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#003366]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center text-[6px] sm:text-[7px] font-bold transition-all duration-500 ${
              i < clientCount ? "bg-[#6366f1]/20 text-[#6366f1] scale-100 opacity-100" : "bg-[#6366f1]/5 text-[#6366f1]/30 scale-75 opacity-40"
            }`}>
              {i < clientCount ? "✓" : ""}
            </div>
          ))}
        </div>
        <p className={`text-[8px] sm:text-[9px] font-semibold mt-1 transition-colors duration-500 ${expanded ? "text-[#6366f1]" : "text-[#003366]/50"}`}>
          {expanded ? "100 clients" : "50 clients"}
        </p>
        {expanded && <p className="text-[6px] sm:text-[7px] text-[#10b981] font-medium">2x capacity</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION: Report Auto-generating — Lines typing, charts filling
// ─────────────────────────────────────────────────────────────────────────────
function ReportAnimation() {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  useEffect(() => {
    const cycle = () => {
      setStep(0);
      setTimeout(() => setStep(1), 800);
      setTimeout(() => setStep(2), 1600);
      setTimeout(() => setStep(3), 2400);
      setTimeout(() => setStep(4), 3200);
    };
    cycle();
    const interval = setInterval(cycle, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2.5 rounded-lg bg-white border border-[#f59e0b]/20 p-2 sm:mt-3 sm:p-2.5 mx-auto max-w-[156px] sm:max-w-[176px]">
      <div className="flex items-center justify-between mb-1 sm:mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-[#f59e0b]/15 flex items-center justify-center">
            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-[7px] sm:text-[8px] font-semibold text-[#003366]/60 uppercase">Q1 Report</span>
        </div>
        {step >= 4 && <span className="text-[7px] sm:text-[8px] font-bold text-[#10b981] bg-[#10b981]/10 px-1 py-0.5 rounded">Ready</span>}
      </div>
      <div className="space-y-1">
        <div className={`h-1.5 sm:h-2 bg-[#003366]/10 rounded transition-all duration-500 ${step >= 1 ? "w-full" : "w-0"}`} />
        <div className={`h-1.5 sm:h-2 bg-[#003366]/10 rounded transition-all duration-500 ${step >= 2 ? "w-3/4" : "w-0"}`} />
        <div className="flex items-end gap-0.5 h-4 sm:h-5 pt-1">
          {[30, 45, 35, 55, 50, 70].map((h, i) => (
            <div key={i} className="flex-1 bg-[#f59e0b] rounded-t-sm transition-all duration-500" style={{ height: step >= 3 ? `${h}%` : "0%", transitionDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <div className={`h-1.5 sm:h-2 bg-[#003366]/10 rounded transition-all duration-500 ${step >= 4 ? "w-1/2" : "w-0"}`} />
      </div>
      <div className="mt-1 flex items-center justify-center gap-1 sm:mt-1.5">
        {step < 4 ? (
          <>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="text-[7px] sm:text-[8px] text-[#f59e0b] font-medium">Generating...</span>
          </>
        ) : (
          <>
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[7px] sm:text-[8px] text-[#10b981] font-medium">Auto-generated</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION: Employer Pipeline — Single referral → repeat partners
// ─────────────────────────────────────────────────────────────────────────────
function PipelineAnimation() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const cycle = () => {
      setStep(0);
      setTimeout(() => setStep(1), 1200);
      setTimeout(() => setStep(2), 2400);
      setTimeout(() => setStep(3), 3600);
    };
    cycle();
    const interval = setInterval(cycle, 5800);
    return () => clearInterval(interval);
  }, []);

  const employers = [
    { initials: "TC", name: "TechCorp" },
    { initials: "FS", name: "FinServ" },
    { initials: "MH", name: "MedHealth" },
  ];

  return (
    <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
        <div className={`flex flex-col items-center transition-all duration-500 ${step >= 1 ? "opacity-100" : "opacity-40"}`}>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9] flex items-center justify-center">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-[7px] sm:text-[8px] text-[#003366]/50 mt-0.5">1 referral</span>
        </div>
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-500 ${step >= 2 ? "text-[#0ea5e9]" : "text-[#003366]/20"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <div className="flex items-center -space-x-1 sm:-space-x-1.5">
          {employers.map((emp, i) => (
            <div key={emp.initials} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white flex items-center justify-center text-[6px] sm:text-[7px] font-bold transition-all duration-500 ${
              step >= 2 + Math.floor(i / 2) ? "bg-[#0ea5e9] text-white scale-100 opacity-100" : "bg-[#0ea5e9]/10 text-[#0ea5e9]/40 scale-75 opacity-50"
            }`} style={{ transitionDelay: `${i * 200}ms`, zIndex: 3 - i }}>
              {emp.initials}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2.5 sm:gap-3">
        <div className="text-center">
          <p className={`text-[15px] sm:text-base font-bold transition-colors duration-500 ${step >= 3 ? "text-[#0ea5e9]" : "text-[#003366]/40"}`}>
            {step >= 3 ? "94%" : "—"}
          </p>
          <p className="text-[7px] sm:text-[8px] text-[#003366]/50 uppercase">Repeat rate</p>
        </div>
        <div className="h-4 sm:h-5 w-px bg-[#003366]/10" />
        <div className="text-center">
          <p className={`text-[15px] sm:text-base font-bold transition-colors duration-500 ${step >= 3 ? "text-[#10b981]" : "text-[#003366]/40"}`}>
            {step >= 3 ? "↑ 3x" : "—"}
          </p>
          <p className="text-[7px] sm:text-[8px] text-[#003366]/50 uppercase">Pipeline</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT: InstitutionBenefits
// ─────────────────────────────────────────────────────────────────────────────
export function InstitutionBenefits() {
  return (
    <section className="w-full text-[#003366]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-5 pl-1 text-left sm:pl-2 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#003366] lg:whitespace-nowrap">
              What changes when the engine runs
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-[#003366]/70 lg:whitespace-nowrap">
              Four operational shifts you can put a number on within one cohort.
            </p>
          </div>
          <Link
            href="/book-demo"
            className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#ff686c] px-6 py-3 text-white font-semibold shadow-lg transition-all hover:bg-[#00264d] hover:shadow-xl lg:mt-2 lg:ml-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-card row */}
        <div className="grid gap-3 sm:gap-3.5 lg:gap-4 lg:grid-cols-4">
          {/* Card 1: Funnel — Emerald accent */}
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-[#10b981]/5 to-[#10b981]/10 border border-[#10b981]/20 p-3 sm:p-3.5 lg:p-4">
            <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-1.5 sm:px-2 py-0.5 rounded-full mb-1.5 sm:mb-2">
              ROI
            </span>
            <h3 className="text-[15px] sm:text-base font-bold text-[#003366] mb-1 leading-snug">
              More placements per cohort, same budget
            </h3>
            <p className="text-[12px] sm:text-[13px] leading-snug text-[#003366]/60">
              The engine catches drop-offs, fixes resumes, and scores interviews — so more learners reach a paycheck.
            </p>
            <FunnelAnimation />
          </div>

          {/* Card 2: Caseload — Indigo accent */}
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-[#6366f1]/5 to-[#6366f1]/10 border border-[#6366f1]/20 p-3 sm:p-3.5 lg:p-4">
            <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#6366f1] bg-[#6366f1]/10 px-1.5 sm:px-2 py-0.5 rounded-full mb-1.5 sm:mb-2">
              Capacity
            </span>
            <h3 className="text-[15px] sm:text-base font-bold text-[#003366] mb-1 leading-snug">
             One advisor, fifty learners, no extra hiring
            </h3>
            <p className="text-[12px] sm:text-[13px] leading-snug text-[#003366]/60">
              Routine check-ins, notes, and reviews run automatically — your team only steps in when it matters.
            </p>
            <CaseloadAnimation />
          </div>

          {/* Card 3: Reports — Amber accent */}
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-[#f59e0b]/5 to-[#f59e0b]/10 border border-[#f59e0b]/20 p-3 sm:p-3.5 lg:p-4">
            <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#f59e0b] bg-[#f59e0b]/10 px-1.5 sm:px-2 py-0.5 rounded-full mb-1.5 sm:mb-2">
              Compliance
            </span>
            <h3 className="text-[15px] sm:text-base font-bold text-[#003366] mb-1 leading-snug">
              Funder reports that already know the answer
            </h3>
            <p className="text-[12px] sm:text-[13px] leading-snug text-[#003366]/60">
              WIOA, SNAP E&T, and grant narratives generate themselves from real-time learner data.
            </p>
            <ReportAnimation />
          </div>

          {/* Card 4: Pipeline — Sky accent */}
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-[#0ea5e9]/5 to-[#0ea5e9]/10 border border-[#0ea5e9]/20 p-3 sm:p-3.5 lg:p-4">
            <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9] bg-[#0ea5e9]/10 px-1.5 sm:px-2 py-0.5 rounded-full mb-1.5 sm:mb-2">
              Employers
            </span>
            <h3 className="text-[15px] sm:text-base font-bold text-[#003366] mb-1 leading-snug">
              Employers who keep saying yes
            </h3>
            <p className="text-[12px] sm:text-[13px] leading-snug text-[#003366]/60">
              Every referral is scored before it goes out — so employers stop getting candidates who weren't ready.
            </p>
            <PipelineAnimation />
          </div>
        </div>

      </div>
    </section>
  );
}
