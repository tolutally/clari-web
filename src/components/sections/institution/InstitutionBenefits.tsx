"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Code2, Phone, Target, ArrowRight, Sparkles } from "lucide-react";

const JD_LINES = [
  "Product Manager — Series B SaaS",
  "Cross-functional leadership required",
  "3-5 years experience",
];
const EN_TEXT = "Tell me about a time you led a cross-functional team through a tight deadline.";
const FR_TEXT = "Parlez-moi d'une situation o\u00f9 vous avez dirig\u00e9 une \u00e9quipe interfonctionnelle sous pression.";

function MultilingualAnimation() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  // 0=typing EN, 1=EN done pause, 2=typing FR, 3=both shown pause
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (phase === 0) {
      if (chars < EN_TEXT.length) {
        const t = setTimeout(() => setChars((c) => c + 1), 22);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => { setPhase(1); setChars(0); }, 500);
      return () => clearTimeout(t);
    }
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 400);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      if (chars < FR_TEXT.length) {
        const t = setTimeout(() => setChars((c) => c + 1), 22);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase(3), 500);
      return () => clearTimeout(t);
    }
    if (phase === 3) {
      const t = setTimeout(() => { setPhase(0); setChars(0); }, 3500);
      return () => clearTimeout(t);
    }
  }, [phase, chars]);

  const enVisible = phase === 0 ? EN_TEXT.slice(0, chars) : phase >= 1 ? EN_TEXT : "";
  const frVisible = phase === 2 ? FR_TEXT.slice(0, chars) : phase >= 3 ? FR_TEXT : "";
  const showEn = phase >= 0;
  const showFr = phase >= 2;
  const showDivider = phase === 3;

  return (
    <div className="mt-4 space-y-2.5 min-h-[140px]">
      {/* English bubble */}
      <div className={`flex items-start gap-2 transition-all duration-500 ${showEn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}>
        <div className="shrink-0 w-7 h-7 rounded-full bg-[#003366]/15 flex items-center justify-center text-[10px] font-bold text-[#003366]/70">
          EN
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-white/40 backdrop-blur-sm border border-[#003366]/10 px-3 py-2 max-w-[85%]">
          <p className="text-[10px] text-[#003366]/50 font-medium mb-0.5">Mock Interview \u00b7 English</p>
          <p className="text-xs text-[#003366]/90 leading-snug">
            &ldquo;{enVisible}
            {phase === 0 && (
              <span className="inline-block w-[4px] h-[12px] bg-[#003366]/50 ml-0.5 animate-pulse align-middle" />
            )}
            {phase >= 1 && <>&rdquo;</>}
          </p>
        </div>
      </div>

      {/* French bubble */}
      <div className={`flex items-start gap-2 justify-end transition-all duration-500 ${showFr ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}`}>
        <div className="rounded-2xl rounded-tr-sm bg-white/30 backdrop-blur-sm border border-[#003366]/10 px-3 py-2 max-w-[85%]">
          <p className="text-[10px] text-[#003366]/50 font-medium mb-0.5">Entrevue simul\u00e9e \u00b7 Fran\u00e7ais</p>
          <p className="text-xs text-[#003366]/90 leading-snug">
            &ldquo;{frVisible}
            {phase === 2 && (
              <span className="inline-block w-[4px] h-[12px] bg-[#003366]/50 ml-0.5 animate-pulse align-middle" />
            )}
            {phase >= 3 && <>&rdquo;</>}
          </p>
        </div>
        <div className="shrink-0 w-7 h-7 rounded-full bg-[#003366]/15 flex items-center justify-center text-[10px] font-bold text-[#003366]/70">
          FR
        </div>
      </div>

      {/* Scoring note */}
      <div className={`flex items-center gap-2 transition-all duration-700 ${showDivider ? "opacity-100" : "opacity-0"}`}>
        <div className="h-px flex-1 bg-[#003366]/10" />
        <span className="text-[10px] font-medium text-[#003366]/40 uppercase tracking-wider">Same rubric \u00b7 Same scoring</span>
        <div className="h-px flex-1 bg-[#003366]/10" />
      </div>
    </div>
  );
}
function JdFlowAnimation() {
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0=typing, 1=processing, 2=output
  const [typedChars, setTypedChars] = useState(0);

  // Cycle: type → process → output → reset
  useEffect(() => {
    if (step === 0) {
      const fullText = JD_LINES.join("\n");
      if (typedChars < fullText.length) {
        const t = setTimeout(() => setTypedChars((c) => c + 1), 28);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setStep(1), 600);
        return () => clearTimeout(t);
      }
    }
    if (step === 1) {
      const t = setTimeout(() => setStep(2), 1800);
      return () => clearTimeout(t);
    }
    if (step === 2) {
      const t = setTimeout(() => {
        setStep(0);
        setTypedChars(0);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [step, typedChars]);

  const fullText = JD_LINES.join("\n");
  const visibleText = fullText.slice(0, typedChars);
  const visibleLines = visibleText.split("\n");

  return (
    <div className="mt-3 rounded-xl bg-[#0a1628] p-3 text-white overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/30 font-mono">clarivue — interview engine</span>
      </div>

      {/* Step 1: JD Input (typing) */}
      <div className={`transition-opacity duration-500 ${step >= 0 ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-3 h-3 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="text-[9px] font-semibold text-[#0ea5e9] uppercase tracking-wider">JD Input</span>
        </div>
        <div className="font-mono text-[10px] leading-relaxed text-white/60 min-h-[42px]">
          {visibleLines.map((line, i) => (
            <p key={i}>
              <span className="text-white/25 mr-1">&gt;</span>
              {line}
              {step === 0 && i === visibleLines.length - 1 && (
                <span className="inline-block w-[5px] h-[11px] bg-[#0ea5e9] ml-0.5 animate-pulse" />
              )}
            </p>
          ))}
        </div>
      </div>

      {/* Step 2: Processing */}
      <div className={`mt-2 transition-all duration-500 ${step >= 1 ? "opacity-100 max-h-20" : "opacity-0 max-h-0"} overflow-hidden`}>
        <div className="flex items-center gap-2 py-1.5">
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[9px] text-white/40 font-mono">
            {step === 1 ? "Extracting role context & generating interview..." : "Complete ✓"}
          </span>
        </div>
      </div>

      {/* Step 3: Output */}
      <div className={`mt-1.5 transition-all duration-700 ${step === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-3 h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[9px] font-semibold text-[#10b981] uppercase tracking-wider">Generated Interview</span>
        </div>
        <div className="space-y-1">
          {[
            "How would you align engineering and design on a compressed sprint?",
            "Describe a time you navigated competing stakeholder priorities.",
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-1.5 pl-1">
              <span className="shrink-0 w-3.5 h-3.5 rounded bg-[#10b981]/20 text-[#10b981] text-[8px] font-bold flex items-center justify-center mt-px">Q{i + 1}</span>
              <p className="text-[9px] text-white/55 leading-snug italic">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InstitutionBenefits() {
  return (
    <section className="w-full text-[#003366]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white/70">
              <Sparkles className="h-4 w-4 text-sky-700" strokeWidth={1.5} />
              <span className="text-sm text-[#003366]">LOVED BY CAREER DEVELOPMENT TEAMS</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#003366]">
            Excellent career teams deserve excellent interview prep tools
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#003366]/70">
            Clarivue gives you structured practice, consistent scoring, 
            and a live readiness signal — so you reduce rework, protect employer trust, and improve conversion 
            without adding advisor load.
          </p>
        </div>
        <div className="grid gap-5 lg:gap-6 grid-cols-1 lg:grid-cols-2">

          {/* Card 1 — Multilingual support (large left) */}
          <article className="rounded-3xl px-5 py-5 sm:px-6 sm:py-6 shadow-sm border border-[#b8ccf4]/50 flex flex-col bg-[#b8ccf4] text-[#003366]">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2 text-[#c7535a]">
                MULTILINGUAL SUPPORT
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#003366]">
                Serve diverse cohorts without splitting systems.
              </h3>
            </div>

            {/* Animated language preview bubbles */}
            <MultilingualAnimation />

            <div className="mt-3 flex flex-wrap gap-2">
              {["English interview sessions", "French interview sessions", "Localized scoring standards"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#003366]/70"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#003366]/30" />
                    {tag}
                  </span>
                )
              )}
            </div>
          </article>

          {/* Card 2 — Job-description powered interviews */}
          <article className="rounded-3xl bg-white px-5 py-5 sm:px-6 sm:py-6 border flex flex-col border-[#003366]/15">
            {/* Header */}
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-1.5 text-[#003366]/80">
              JOB-DESCRIPTION POWERED
            </p>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#003366] leading-snug">
              Every session is generated from real job descriptions and real employer expectations.
            </h3>

            {/* Feature pills — 2x2 */}
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                "No question banks.",
                "No recycled prompts.",
                "Context-aware follow-ups",
                "Scenario-based practice",
              ].map((item) => (
                <div key={item} className="rounded-lg bg-[#f5f7fb] border border-[#003366]/8 px-2 py-1.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-[#0ea5e9] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-[10px] font-medium text-[#003366]/65 leading-tight">{item}</span>
                </div>
              ))}
            </div>

            {/* Animated JD → Interview flow */}
            <JdFlowAnimation />
          </article>

          {/* Card 3 — Interview format coverage */}
          <article className="rounded-3xl bg-white px-6 py-7 sm:px-7 sm:py-8 border flex flex-col justify-between border-[#003366]/15">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-3 text-[#003366]/80">
                FORMAT COVERAGE
              </p>
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#003366]">
                Prepare learners for the formats employers actually use.
              </h3>
            </div>

            {/* Format type cards */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                { label: "Panel", Icon: Users, desc: "Multi-interviewer rounds", accent: "#6366f1" },
                { label: "Technical", Icon: Code2, desc: "Skills-based challenges", accent: "#0ea5e9" },
                { label: "Phone Screen", Icon: Phone, desc: "First-round gatekeepers", accent: "#10b981" },
                { label: "Behavioral", Icon: Target, desc: "STAR-method scenarios", accent: "#f59e0b" },
              ].map((fmt) => (
                <div
                  key={fmt.label}
                  className="group rounded-xl bg-[#f5f7fb] border border-[#003366]/8 px-3.5 py-3 flex items-start gap-3 transition-all duration-300 hover:shadow-md hover:border-[#003366]/15 hover:-translate-y-0.5 cursor-default"
                >
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${fmt.accent}15` }}
                  >
                    <fmt.Icon className="w-4 h-4 transition-colors duration-300" style={{ color: fmt.accent }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#003366]">{fmt.label}</p>
                    <p className="text-[10px] text-[#003366]/55 leading-snug">{fmt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#003366]/10 to-transparent" />
              <span className="text-[10px] font-medium text-[#003366]/40 uppercase tracking-wider">All formats · One platform</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#003366]/10 to-transparent" />
            </div>
          </article>

          {/* Card 4 — Security & Compliance (spans right 2 cols) */}
          <article className="rounded-3xl bg-white px-6 py-7 sm:px-7 sm:py-8 border flex flex-col justify-between border-[#003366]/15">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-3 text-[#003366]/80">
                SECURITY &amp; COMPLIANCE
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#003366]">
                Built for privacy-first institutions.
              </h3>
              <p className="mt-3 text-sm text-[#003366]/70 max-w-lg">
                Clarivue supports PIPEDA and GDPR requirements, follows SOC 2–aligned security controls,
                and provides audit-ready reporting, role-based access, and institution-owned data governance.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-3 max-w-md">
              {[
                { src: "/pipeda-logo.png", alt: "PIPEDA" },
                { src: "/iso2001-logo.png", alt: "ISO 27001" },
                { src: "/pipeda-logo.png", alt: "PIPEDA" },
                { src: "/soc2-icon.jpg", alt: "SOC 2" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-[#b8ccf4]/30 border border-[#003366]/10 px-3 py-3"
                >
                  <div className="relative w-8 h-8">
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#003366]/70 text-center">
                    {badge.alt}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/book-demo"
            className="group inline-flex items-center gap-2 rounded-full bg-[#003366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#003366]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#003366]/30 hover:-translate-y-0.5"
          >
            Learn more
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
