"use client";

import React from "react";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex text-[9px] sm:text-[10px] font-medium bg-white/40 ring-1 rounded-md px-2 py-1 items-center text-[#003366]/80 ring-[#003366]/15">
      {children}
    </span>
  );
}

function Icon({ name }: { name: string }) {
  const cls = "h-4 w-4 sm:h-5 sm:w-5 text-[#003366]/70";
  switch (name) {
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "coach":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path
            d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M8 8h8M8 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M4 19V5M4 19H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7 15l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 7h3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "mic":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "file":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path
            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M6 10v6c0 1.2 2.7 3 6 3s6-1.8 6-3v-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function JobSeekerFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-10 sm:mt-14 text-center">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff686c]" />
          <p className="text-xs sm:text-sm font-semibold text-[#003366]/80">YOUR PATH TO GETTING HIRED</p>
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#003366]">
          Everything you need to ace the interview and land your dream job.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#003366]/70 max-w-2xl mx-auto">
          Clarivue turns interview preparation into progress: context, feedback, coaching, realism, and the receipts (transcripts + highlights) to
          prove it.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[185px]">
        <div className="group relative col-span-1 sm:col-span-2 lg:col-span-7 row-span-2 rounded-xl sm:rounded-2xl border bg-gradient-to-br to-transparent ring-1 backdrop-blur p-4 sm:p-6 overflow-hidden hover:shadow-[0_20px_70px_-20px_rgba(0,51,102,0.45)] transition-all duration-500 cursor-pointer border-[#003366]/10 from-[#003366]/[0.06] via-[#003366]/[0.03] ring-[#003366]/10 hover:border-[#003366]/20">
          <div className="z-10 flex flex-col h-full relative">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <Pill>INSTANT FEEDBACK</Pill>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full animate-pulse bg-[#ff686c]" />
                <span className="text-[10px] sm:text-xs text-[#003366]/60">Analyzing…</span>
              </div>
            </div>

            <h3 className="text-base sm:text-xl font-semibold tracking-tight mb-1.5 text-[#003366]">
              Know what to fix—right after you answer.
            </h3>
            <p className="text-xs sm:text-sm mb-4 sm:mb-6 max-w-md text-[#003366]/70">
              No more guessing. Clarivue flags weak structure, missing impact, and unclear phrasing—then tells you exactly how
              to improve.
            </p>

            <div className="mt-auto">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {[
                  { score: "82", label: "Clarity" },
                  { score: "74", label: "Structure" },
                  { score: "68", label: "Impact" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg ring-1 p-2.5 sm:p-3 backdrop-blur bg-white/50 ring-[#003366]/10 hover:ring-[#003366]/20 transition"
                  >
                    <div className="text-lg sm:text-2xl font-semibold text-[#003366]">{s.score}</div>
                    <div className="text-[9px] sm:text-xs text-[#003366]/60">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#003366]/60">
                  <span>Biggest fix</span>
                  <span className="font-semibold text-[#003366]">Add measurable outcome</span>
                </div>
                <div className="h-2 rounded-full bg-[#003366]/10 overflow-hidden">
                  <div className="h-full w-[72%] bg-gradient-to-r from-[#ffb3b6] to-[#ff686c]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 bottom-0 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-[#ff686c]/10 blur-3xl group-hover:bg-[#ff686c]/20 transition-all duration-500" />
            <div className="absolute left-0 top-0 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-sky-500/10 blur-2xl group-hover:bg-sky-500/15 transition-all duration-500" />
          </div>
        </div>

        <div className="group relative col-span-1 lg:col-span-5 row-span-1 rounded-xl sm:rounded-2xl border bg-gradient-to-b ring-1 backdrop-blur p-4 sm:p-5 pb-6 overflow-hidden transition-all duration-500 cursor-pointer border-[#003366]/10 from-[#003366]/[0.06] to-[#003366]/[0.03] ring-[#003366]/10 hover:border-[#003366]/20 hover:shadow-[0_15px_50px_-15px_rgba(0,51,102,0.35)]">
          <div className="flex items-start justify-between mb-3">
            <Pill>AI COACHING</Pill>
            <div className="relative">
              <Icon name="coach" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[#003366]/90">A plan built from your gaps.</h3>
          <p className="mt-1 text-[10px] sm:text-xs text-[#003366]/70 max-w-sm">
            Targeted drills, rewrites, and follow-ups—so every session improves something real.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {["Fix STAR", "Quantify impact", "Cleaner opener"].map((t, i) => (
              <span 
                key={t} 
                className="text-[10px] sm:text-xs px-2 py-1 rounded-md bg-white/60 ring-1 ring-[#003366]/10 text-[#003366]/75 group-hover:ring-emerald-300/50 group-hover:bg-emerald-50/50 transition-all duration-300"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-emerald-500/0 blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500" />
          </div>
        </div>

        <div className="group relative col-span-1 lg:col-span-5 row-span-1 rounded-xl sm:rounded-2xl border bg-gradient-to-b ring-1 backdrop-blur p-4 sm:p-5 pb-6 overflow-hidden transition-all duration-300 cursor-pointer border-[#003366]/10 from-[#003366]/[0.06] to-[#003366]/[0.03] ring-[#003366]/10 hover:border-[#003366]/20">
          <div className="flex items-start justify-between mb-3">
            <Pill>REALISTIC PRACTICE</Pill>
            <Icon name="mic" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[#003366]/90">Practice like it’s the real interview.</h3>
          <p className="mt-1 text-[10px] sm:text-xs text-[#003366]/70 max-w-sm">
            Role-specific questions, realistic follow-ups, and live pacing that feels real.
          </p>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#003366]/60">
              <span>Interviewer</span>
              <span className="font-semibold text-[#003366]">Follow-up</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[#003366]/10 overflow-hidden">
              <div className="h-full w-[58%] bg-gradient-to-r from-sky-300 to-sky-500" />
            </div>
          </div>
        </div>

        <div className="group relative col-span-1 lg:col-span-4 row-span-1 rounded-xl sm:rounded-2xl border bg-gradient-to-br ring-1 backdrop-blur p-5 sm:p-6 pb-8 overflow-hidden transition-all duration-500 cursor-pointer border-[#003366]/10 from-[#003366]/[0.06] to-[#003366]/[0.03] ring-[#003366]/10 hover:border-[#003366]/20 min-h-[195px] sm:min-h-[240px] hover:shadow-[0_15px_50px_-15px_rgba(124,58,237,0.35)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Pill>PROGRESS</Pill>
              <h3 className="mt-3 text-sm sm:text-base font-semibold tracking-tight text-[#003366]/90">See improvement session to session.</h3>
              <p className="text-[10px] sm:text-xs mt-2 text-[#003366]/60">Confidence, clarity, structure—tracked over time.</p>
            </div>
            <div className="relative">
              <Icon name="chart" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-violet-400 group-hover:scale-150 transition-transform duration-300" />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white/55 ring-1 ring-[#003366]/10 p-3 group-hover:ring-violet-300/50 transition-all duration-300">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#003366]/60 mb-2">
              <span>Last 4 sessions</span>
              <span className="font-semibold text-[#003366] group-hover:text-violet-600 transition-colors">+18%</span>
            </div>
            <div className="space-y-1.5">
              {[45, 58, 71, 79].map((w, i) => (
                <div key={w} className="h-2 rounded-full bg-[#003366]/10 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-700 ease-out" 
                    style={{ 
                      width: `${w}%`, 
                      background: "linear-gradient(to right, #c4b5fd, #7c3aed)",
                      transitionDelay: `${i * 100}ms`
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-violet-500/0 blur-2xl group-hover:bg-violet-500/15 transition-all duration-500" />
          </div>
        </div>

        <div className="group relative col-span-1 lg:col-span-4 row-span-1 rounded-xl sm:rounded-2xl border bg-gradient-to-b ring-1 backdrop-blur p-5 sm:p-6 pb-8 overflow-hidden transition-all duration-500 cursor-pointer border-[#003366]/10 from-[#003366]/[0.06] to-[#003366]/[0.03] ring-[#003366]/10 hover:border-[#003366]/20 min-h-[195px] sm:min-h-[240px] hover:shadow-[0_15px_50px_-15px_rgba(245,158,11,0.35)]">
          <div className="flex items-start justify-between mb-4">
            <Pill>TRANSCRIPTS</Pill>
            <div className="relative">
              <Icon name="file" />
              <div className="absolute -top-0.5 left-0 w-full h-0.5 bg-amber-400/0 group-hover:bg-amber-400/80 transition-all duration-300" />
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[#003366]/90 mb-2">Replay your interview like game tape.</h3>
          <p className="mt-2 text-[10px] sm:text-xs text-[#003366]/70 leading-relaxed">
            Searchable transcript + &ldquo;moments to improve&rdquo; so you spot patterns fast.
          </p>

          <div className="mt-5 rounded-lg bg-white/55 ring-1 ring-[#003366]/10 p-3.5 text-[10px] sm:text-xs text-[#003366]/70 leading-relaxed group-hover:ring-amber-300/50 group-hover:bg-amber-50/30 transition-all duration-300 relative overflow-hidden">
            <span className="font-semibold text-[#003366] group-hover:text-amber-600 transition-colors">Highlight:</span> &ldquo;I collaborated with the team…&rdquo; → add a measurable
            outcome + your role.
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-amber-500/0 blur-2xl group-hover:bg-amber-500/15 transition-all duration-500" />
          </div>
        </div>
        <div className="group relative col-span-1 lg:col-span-4 row-span-1 rounded-xl sm:rounded-2xl border bg-gradient-to-b ring-1 backdrop-blur p-5 sm:p-6 pb-8 overflow-hidden transition-all duration-500 cursor-pointer border-[#003366]/10 from-[#003366]/[0.06] to-[#003366]/[0.03] ring-[#003366]/10 hover:border-[#003366]/20 min-h-[195px] sm:min-h-[240px] hover:shadow-[0_15px_50px_-15px_rgba(6,182,212,0.35)]">
          <div className="flex items-start justify-between mb-4">
            <Pill>PLAYBOOKS</Pill>
            <div className="relative group-hover:rotate-12 transition-transform duration-300">
              <Icon name="cap" />
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[#003366]/90 mb-2">The right strategy for every situation.</h3>
          <p className="mt-2 text-[10px] sm:text-xs text-[#003366]/70 leading-relaxed">
            Switching careers, last-minute prep, technical screens, salary chats—covered.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Career switch", "Last-minute", "Technical", "Behavioral", "Salary"].map((t, i) => (
              <span 
                key={t} 
                className="text-[10px] sm:text-xs px-2 py-1 rounded-md bg-white/60 ring-1 ring-[#003366]/10 text-[#003366]/75 group-hover:ring-cyan-300/50 group-hover:bg-cyan-50/50 group-hover:-translate-y-0.5 transition-all duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-cyan-500/0 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
