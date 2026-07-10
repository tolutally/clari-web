"use client";

import {
  Activity,
  ArrowRight,
  BarChart2,
  Check,
  ChevronDown,
  ClipboardCheck,
  Gift,
  GraduationCap,
  Infinity,
  Lock,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
// import { TrustShowcase } from "@/components/sections/trust/TrustShowcase";
import { CalculatorTeaser } from "@/components/sections/institution/CalculatorTeaser";
import { InstitutionBenefits } from "@/components/sections/institution/InstitutionBenefits";
import { SecurityCompliance } from "@/components/sections/institution/SecurityCompliance";

const ClarivueImpactCalculator = dynamic(
  () => import("@/components/sections/institution/ClarivueImpactCalculator"),
  { ssr: true }
);
const BlogInsights = dynamic(
  () => import("@/components/sections/institution/BlogInsights").then(m => m.BlogInsights),
  { ssr: true }
);
// import HowItWorksInstitutions from "@/components/sections/institution/HowItWorksInstitutions";
import { useEffect, useRef, useState, FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type CommunityTone =
  | "indigo"
  | "violet"
  | "emerald"
  | "amber"
  | "slate"
  | "rose"
  | "sky"
  | "zinc";

const communityCards: Array<{ tag: string; title: string; sub: string; tone: CommunityTone; img: string }> = [
  {
    tag: "Weekly structured mock interviews",
    title: "Cohort Practice Hub",
    sub: "Learners practice together",
    tone: "indigo",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Rotate interviewer, candidate, observer",
    title: "Peer Interview Circles",
    sub: "Rotate roles and improve",
    tone: "violet",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Guided feedback and calibration sessions",
    title: "Advisor Office Hours",
    sub: "Feedback tied to rubrics",
    tone: "emerald",
    img: "https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Alumni coach and support current cohorts",
    title: "Alumni Mentor Lane",
    sub: "Give back to cohorts",
    tone: "zinc",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Milestones, momentum, and progress signals",
    title: "Readiness Wins Board",
    sub: "Celebrate progress",
    tone: "sky",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Show-up streaks and practice cadence",
    title: "Engagement Tracker",
    sub: "Show-up streaks and pace",
    tone: "slate",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Real interview experiences shared and debriefed",
    title: "Interview Story Exchange",
    sub: "Shared stories and learnings",
    tone: "amber",
    img: "https://images.unsplash.com/photo-1552960562-daf630e9278b?q=80&w=800&auto=format&fit=crop",
  },
  {
    tag: "Practice by role, industry, or interview type",
    title: "Role-Focused Prep Rooms",
    sub: "Targeted practice by track",
    tone: "rose",
    img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop",
  },
];

const communityToneStyles: Record<CommunityTone, { bg: string; ring: string; wash: string }> = {
  indigo: {
    bg: "from-indigo-200/60 to-indigo-100/40",
    ring: "border-indigo-300/30 hover:border-indigo-400/50",
    wash: "bg-indigo-500/10",
  },
  violet: {
    bg: "from-violet-200/60 to-violet-100/40",
    ring: "border-violet-300/30 hover:border-violet-400/50",
    wash: "bg-violet-500/10",
  },
  emerald: {
    bg: "from-emerald-200/60 to-emerald-100/40",
    ring: "border-emerald-300/30 hover:border-emerald-400/50",
    wash: "bg-emerald-500/10",
  },
  amber: {
    bg: "from-amber-200/60 to-amber-100/40",
    ring: "border-amber-300/30 hover:border-amber-400/50",
    wash: "bg-amber-500/10",
  },
  slate: {
    bg: "from-slate-200/70 to-slate-100/40",
    ring: "border-slate-300/30 hover:border-slate-400/50",
    wash: "bg-slate-500/10",
  },
  rose: {
    bg: "from-rose-200/60 to-rose-100/40",
    ring: "border-rose-300/30 hover:border-rose-400/50",
    wash: "bg-rose-500/10",
  },
  sky: {
    bg: "from-sky-200/60 to-sky-100/40",
    ring: "border-sky-300/30 hover:border-sky-400/50",
    wash: "bg-sky-500/10",
  },
  zinc: {
    bg: "from-zinc-200/70 to-zinc-100/40",
    ring: "border-zinc-300/30 hover:border-zinc-400/50",
    wash: "bg-zinc-500/10",
  },
};

const institutionRoleCards = [
  {
    title: "Program Director",
    tagline: "See risk before it costs you",
    description:
      "Watch placement rates, advisor capacity, and cohort progress in real time, and catch the program that's slipping before the reporting cycle forces the conversation.",
    icon: Activity,
    iconWrapClass: "bg-[#ff6b57]/12",
    iconClass: "text-[#ff6b57]",
  },
  {
    title: "Funder & Compliance",
    tagline: "Stop chasing, start proving",
    description:
      "Pull every learner touchpoint into one place, so you build the funder's evidence instead of chasing advisors for case notes.",
    icon: ClipboardCheck,
    iconWrapClass: "bg-[#f59e0b]/14",
    iconClass: "text-[#d97706]",
  },
  {
    title: "Executive Director / CEO",
    tagline: "Walk into the funding conversation with proof",
    description:
      "See whether your whole program's impact holds up before a funder or board decides its future, so you defend your budget with evidence, not a story you're scrambling to assemble.",
    icon: ShieldCheck,
    iconWrapClass: "bg-[#a855f7]/14",
    iconClass: "text-[#9333ea]",
  },
  {
    title: "Career Services",
    tagline: "Spot the gap, move the advisor",
    description:
      "See mock interview scores, resume readiness, and employer follow-through across every cohort, and reallocate advisor time before placements slip.",
    icon: GraduationCap,
    iconWrapClass: "bg-[#7c82ff]/14",
    iconClass: "text-[#5a63ff]",
  },
  {
    title: "Workforce Advisor",
    tagline: "Reach the learner who's about to fall",
    description:
      "See caseloads, at-risk learners, and check-in history at a glance, and spend your hours on the people who need you, not on documenting that you did.",
    icon: Users,
    iconWrapClass: "bg-[#0ea5e9]/14",
    iconClass: "text-[#0284c7]",
  },
  {
    title: "Intake & Enrollment",
    tagline: "Know where the next cohort needs you",
    description:
      "Track enrollment volume, readiness baseline, and cohort momentum, so you aim the next intake's effort where it'll actually move.",
    icon: Send,
    iconWrapClass: "bg-[#14b8a6]/14",
    iconClass: "text-[#0f766e]",
  },
] as const;

function ResumeDiagnosticsMock() {
  return (
    <div className="resume-scene relative min-h-[300px] overflow-hidden rounded-[26px] border border-[#003366]/10 bg-[#eaf1fb] px-5 py-4 shadow-[0_30px_70px_-36px_rgba(4,43,83,0.28)] lg:min-h-[340px]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-16 h-px w-[55%] rotate-[-8deg] bg-[#b8ccf4]/80 resume-scene-wave" />
        <div className="absolute -right-10 bottom-16 h-px w-[55%] rotate-[6deg] bg-[#b8ccf4]/80 resume-scene-wave resume-scene-wave-delayed" />
        <div className="resume-scene-glow absolute left-[18%] top-10 h-56 w-56 rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="relative flex h-full items-center justify-between gap-3">
        <div className="flex w-[26%] flex-col gap-2.5 pt-3">
          <div className="resume-card-alert rounded-2xl border border-[#ff686c]/35 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(255,104,109,0.55)]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff686c]/12 text-[#ff686c]">
                <X className="h-4 w-4" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Caught</span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#102c64]">Bullet missing metric</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">Experience section · line 3</p>
          </div>

          <div className="resume-card-alert resume-card-alert-delayed rounded-2xl border border-[#ff686c]/35 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(255,104,109,0.55)]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff686c]/12 text-[#ff686c]">
                <X className="h-4 w-4" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Caught</span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#102c64]">Missing keyword</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">SQL not matched to job listing</p>
          </div>
        </div>

        <div className="relative w-[42%] shrink-0 self-stretch pt-1">
          <div className="resume-document mx-auto h-full min-h-[270px] rounded-[22px] border border-[#102c64]/15 bg-white px-5 py-4 shadow-[0_28px_70px_-34px_rgba(16,44,100,0.34)]">
            <div className="h-3 w-28 rounded-sm bg-[#102c64]" />
            <div className="mt-2 h-1.5 w-18 rounded-sm bg-[#102c64]/45" />
            <div className="mt-2 h-2 w-36 rounded-sm bg-[#5b7393]/60" />
            <div className="mt-3 h-px w-full bg-[#e2e8f2]" />

            <div className="mt-3 space-y-3">
              <div>
                <div className="h-2 w-14 rounded-sm bg-[#102c64]" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-full rounded-sm bg-[#5b7393]/50" />
                  <div className="h-1.5 w-[90%] rounded-sm bg-[#5b7393]/50" />
                  <div className="h-1.5 w-[82%] rounded-sm bg-[#5b7393]/50" />
                </div>
              </div>

              <div>
                <div className="h-2 w-16 rounded-sm bg-[#102c64]" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-[78%] rounded-sm bg-[#5b7393]/50" />
                  <div className="h-1.5 w-[96%] rounded-sm bg-[#5b7393]/50" />
                  <div className="h-1.5 w-[70%] rounded-sm bg-[#5b7393]/50" />
                </div>
              </div>

              <div>
                <div className="h-2 w-12 rounded-sm bg-[#102c64]" />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    { label: "Excel", tone: "bg-[#b8ccf4]/60 text-[#102c64]" },
                    { label: "Email", tone: "bg-[#b8ccf4]/60 text-[#102c64]" },
                    { label: "Teamwork", tone: "bg-[#b8ccf4]/60 text-[#102c64]" },
                    { label: "missing", tone: "border border-dashed border-[#ff686c]/70 bg-[#ff686c]/10 text-[#ff686c]" },
                  ].map((chip) => (
                    <span
                      key={chip.label}
                      className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${chip.tone} ${chip.label === "missing" ? "resume-chip-missing" : ""}`}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-2 w-14 rounded-sm bg-[#102c64]" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-[72%] rounded-sm bg-[#5b7393]/50" />
                  <div className="h-1.5 w-[58%] rounded-sm bg-[#5b7393]/50" />
                </div>
              </div>
            </div>
          </div>

          <div className="resume-link-alert absolute left-[-24px] top-[102px] h-16 w-px rotate-[-24deg] bg-[linear-gradient(to_bottom,rgba(255,104,109,0),rgba(255,104,109,0.7),rgba(255,104,109,0))]" />
          <div className="resume-link-fix absolute right-[-22px] top-[108px] h-px w-10 bg-[linear-gradient(to_right,rgba(16,44,100,0),rgba(16,44,100,0.35),rgba(16,44,100,0.65))]" />
          <div className="resume-link-fix resume-link-fix-delayed absolute right-[-16px] top-[178px] h-px w-9 bg-[linear-gradient(to_right,rgba(16,44,100,0),rgba(16,44,100,0.35),rgba(16,44,100,0.65))]" />
        </div>

        <div className="flex w-[26%] flex-col gap-2.5 pt-3">
          <div className="resume-card-fix rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102c64]/10 text-[#102c64]">
                <Check className="h-4 w-4" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Fixed</span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#102c64]">Margins reformatted</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">ATS-readable layout restored</p>
          </div>

          <div className="resume-card-fix resume-card-fix-delayed rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">ATS pass rate</p>
            <div className="mt-2.5 h-2 w-full rounded-full bg-[#b8ccf4]/55">
              <div className="bar-fill h-2 rounded-full bg-[#102c64]" style={{ ["--bar-width" as string]: "94%" }} />
            </div>
            <div className="mt-2.5 flex items-end gap-2">
              <span className="text-[24px] font-semibold leading-none text-[#102c64]">94%</span>
              <span className="pb-0.5 text-[11px] font-medium text-[#ff686c]">up from 47%</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[#5b7393]">Across the last 200 resumes reviewed</p>
          </div>

          <div className="resume-card-fix resume-card-fix-late rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102c64]/10 text-[#102c64]">
                <Check className="h-4 w-4" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Fixed</span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#102c64]">Average time to fix</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">2 minutes per resume</p>
          </div>

          <div className="resume-ready-pill self-end rounded-full bg-[#102c64] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_18px_34px_-24px_rgba(16,44,100,0.55)]">
            ATS ready ✓
          </div>
        </div>
      </div>
    </div>
  );
}

function MockInterviewsMock() {
  const listeningBars = [
    { height: 20, duration: "1160ms", delay: "0ms", color: "bg-[#102c64]/70" },
    { height: 30, duration: "980ms", delay: "-420ms", color: "bg-[#102c64]/70" },
    { height: 42, duration: "1080ms", delay: "-220ms", color: "bg-[#102c64]/70" },
    { height: 28, duration: "920ms", delay: "-640ms", color: "bg-[#102c64]/70" },
    { height: 54, duration: "1250ms", delay: "-160ms", color: "bg-[#ff686c]" },
    { height: 38, duration: "900ms", delay: "-560ms", color: "bg-[#ff686c]" },
    { height: 50, duration: "1180ms", delay: "-320ms", color: "bg-[#ff686c]" },
    { height: 32, duration: "960ms", delay: "-760ms", color: "bg-[#ff686c]" },
    { height: 44, duration: "1100ms", delay: "-480ms", color: "bg-[#102c64]/70" },
    { height: 24, duration: "1020ms", delay: "-680ms", color: "bg-[#102c64]/70" },
  ] as const;

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[26px] border border-[#003366]/10 bg-[#eaf1fb] px-5 py-4 shadow-[0_30px_70px_-36px_rgba(4,43,83,0.28)] lg:min-h-[340px]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-16 h-px w-[55%] rotate-[-8deg] bg-[#b8ccf4]/80" />
        <div className="absolute -right-10 bottom-16 h-px w-[55%] rotate-[6deg] bg-[#b8ccf4]/80" />
      </div>

      <div className="relative flex h-full items-center justify-between gap-3">
        <div className="flex w-[28%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Rubric scores</p>
            <div className="mt-2.5 space-y-2">
              {[
                { label: "Clarity", value: 86, tone: "bg-[#102c64]" },
                { label: "Composure", value: 92, tone: "bg-[#102c64]" },
                { label: "Specificity", value: 58, tone: "bg-[#ff686c]" },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-[1fr_auto] gap-2 text-[10px] text-[#5b7393]">
                  <span>{item.label}</span>
                  <span className={`font-semibold ${item.value < 70 ? "text-[#ff686c]" : "text-[#102c64]"}`}>{item.value}</span>
                  <div className="col-span-2 h-1.5 rounded-full bg-[#b8ccf4]/50">
                    <div className={`${item.tone} h-1.5 rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff686c]/20 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff686c]/12 text-[#ff686c]">
                <X className="h-3.5 w-3.5" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Flagged</span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#102c64]">Vague answers</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">Recommend coaching before referral</p>
          </div>
        </div>

        <div className="relative flex w-[34%] items-center justify-center self-stretch">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[210px] w-[210px] rounded-full border border-[#b8ccf4]/50" />
            <div className="absolute h-[162px] w-[162px] rounded-full border border-[#b8ccf4]/60" />
            <div className="absolute h-[116px] w-[116px] rounded-full border border-[#b8ccf4]/70" />
          </div>
          <div className="relative z-10 flex h-[156px] w-[156px] flex-col items-center justify-center rounded-full border border-[#102c64]/15 bg-white px-4 shadow-[0_24px_50px_-30px_rgba(16,44,100,0.34)]">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-[#ff686c] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              Live
            </div>
            <div className="flex h-[58px] items-end gap-1">
              {listeningBars.map((bar, index) => (
                <div
                  key={index}
                  className={`listening-wave-bar w-1.5 rounded-full ${bar.color}`}
                  style={{
                    height: `${bar.height}px`,
                    animationDuration: bar.duration,
                    animationDelay: bar.delay,
                  }}
                />
              ))}
            </div>
            <p className="mt-2.5 max-w-[92px] text-center text-[9px] uppercase tracking-[0.12em] leading-tight text-[#5b7393]">
              Interview · 12:43
            </p>
          </div>
        </div>

        <div className="flex w-[30%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Learner · Marcus J.</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102c64] text-[11px] font-semibold text-white">MJ</div>
              <div>
                <p className="text-[13px] font-semibold text-[#102c64]">79 / 100</p>
                <p className="text-[10px] text-[#5b7393]">Patient care · cohort 14</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Cohort throughput</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[24px] font-semibold leading-none text-[#102c64]">28</span>
              <span className="text-[10px] text-[#5b7393]">interviews this week</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[#5b7393]">Manually: 21 advisor hours</p>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#102c64]/10 text-[#102c64]">
                <Check className="h-3.5 w-3.5" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Verdict</span>
            </div>
            <p className="mt-1.5 text-[12px] font-semibold text-[#102c64]">Ready for referral</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">After one coaching session</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvisorWorkflowMock() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[26px] border border-[#003366]/10 bg-[#eaf1fb] px-5 py-4 shadow-[0_30px_70px_-36px_rgba(4,43,83,0.28)] lg:min-h-[340px]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-10 top-8 h-48 w-48 rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="relative flex h-full items-center justify-between gap-3">
        <div className="flex w-[25%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Caseload</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[24px] font-semibold leading-none text-[#102c64]">42</span>
              <span className="text-[10px] text-[#5b7393]">active learners</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[#5b7393]">12 need attention this week</p>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Auto-logged</p>
            <div className="mt-2 space-y-1.5 text-[10px] text-[#102c64]">
              <div className="flex items-center justify-between rounded-lg bg-[#003366]/[0.03] px-2 py-1.5"><span>Check-in notes</span><span className="font-semibold">18</span></div>
              <div className="flex items-center justify-between rounded-lg bg-[#003366]/[0.03] px-2 py-1.5"><span>Follow-ups</span><span className="font-semibold">9</span></div>
            </div>
          </div>
        </div>

        <div className="w-[42%]">
          <div className="rounded-[22px] border border-[#102c64]/15 bg-white p-4 shadow-[0_24px_50px_-30px_rgba(16,44,100,0.34)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Advisor workflow</p>
                <p className="mt-1 text-[13px] font-semibold text-[#102c64]">From session to next action</p>
              </div>
              <span className="rounded-full bg-[#102c64]/8 px-3 py-1 text-[10px] font-semibold text-[#102c64]">Live queue</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {[
                { label: "Session captured", meta: "Transcript + notes", status: "done" },
                { label: "Risk scored", meta: "Interview anxiety flagged", status: "done" },
                { label: "Follow-up drafted", meta: "Mock panel scheduled", status: "done" },
                { label: "Employer intro ready", meta: "Referral packet assembled", status: "active" },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      step.status === "done" ? "bg-[#102c64] text-white" : "border border-[#ff686c]/30 bg-[#ff686c]/12 text-[#ff686c]"
                    }`}
                  >
                    {step.status === "done" ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    )}
                  </div>
                  <div className="flex-1 rounded-xl border border-[#003366]/8 bg-[#003366]/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold text-[#102c64]">{step.label}</span>
                      <span className="text-[10px] text-[#5b7393]">{step.meta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-[25%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Backlog</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[24px] font-semibold leading-none text-emerald-600">0 days</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[#5b7393]">Down from 3 weeks</p>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Next action</p>
            <p className="mt-2 text-[12px] font-semibold text-[#102c64]">Coach Marcus on specificity</p>
            <p className="mt-1 text-[10px] text-[#5b7393]">Suggested before employer referral</p>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Time saved</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[24px] font-semibold leading-none text-[#102c64]">6 hrs</span>
              <span className="text-[10px] text-[#5b7393]">per advisor / week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ARCHIVED — FunderReportsMock (replaced by LearnerMatchMock)
function FunderReportsMock() { ... }
*/

function LearnerMatchMock() {
  const jobs = [
    { role: "Medical Assistant", employer: "City Health Clinic", match: 94, badge: "Top match", badgeStyle: "bg-emerald-500 text-white" },
    { role: "Patient Coordinator", employer: "Northeast Medical", match: 81, badge: "Referred", badgeStyle: "bg-[#102c64] text-white" },
    { role: "Care Navigator", employer: "WellPath", match: 67, badge: "1 skill gap", badgeStyle: "bg-amber-400 text-white" },
  ];

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[26px] border border-[#003366]/10 bg-[#eaf1fb] px-5 py-4 shadow-[0_30px_70px_-36px_rgba(4,43,83,0.28)] lg:min-h-[340px]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-16 h-px w-[55%] rotate-[-8deg] bg-[#b8ccf4]/80" />
        <div className="absolute -right-10 bottom-16 h-px w-[55%] rotate-[6deg] bg-[#b8ccf4]/80" />
        <div className="absolute left-[30%] top-8 h-48 w-48 rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="relative flex h-full items-center justify-between gap-3">
        {/* Left — Learner profile */}
        <div className="flex w-[28%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Learner</p>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#102c64] text-[11px] font-semibold text-white">MJ</div>
              <div>
                <p className="text-[13px] font-semibold text-[#102c64]">Marcus J.</p>
                <p className="text-[10px] text-[#5b7393]">Healthcare Bridge · cohort 14</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-end gap-1.5">
              <span className="text-[22px] font-semibold leading-none text-[#102c64]">84</span>
              <span className="pb-0.5 text-[10px] text-[#5b7393]">/100 readiness</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Skill profile</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: "Patient Care", matched: true },
                { label: "EMR Systems", matched: true },
                { label: "Communication", matched: true },
                { label: "Phlebotomy", matched: false },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                    chip.matched
                      ? "bg-[#b8ccf4]/60 text-[#102c64]"
                      : "border border-dashed border-[#ff686c]/70 bg-[#ff686c]/10 text-[#ff686c]"
                  }`}
                >
                  {chip.matched ? "✓ " : "· "}{chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center — Match engine */}
        <div className="relative flex w-[22%] items-center justify-center self-stretch">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[160px] w-[160px] rounded-full border border-[#b8ccf4]/50" />
            <div className="absolute h-[118px] w-[118px] rounded-full border border-[#b8ccf4]/60" />
            <div className="absolute h-[78px] w-[78px] rounded-full border border-[#b8ccf4]/70" />
          </div>
          <div className="relative z-10 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border border-[#102c64]/15 bg-white px-3 shadow-[0_24px_50px_-30px_rgba(16,44,100,0.34)]">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </div>
            <p className="text-center text-[11px] font-semibold leading-tight text-[#102c64]">3 roles matched</p>
            <p className="mt-1 text-center text-[9px] uppercase tracking-[0.12em] text-[#5b7393]">Matching engine</p>
          </div>
        </div>

        {/* Right — Job opportunities */}
        <div className="flex w-[44%] flex-col gap-2">
          {jobs.map((job) => (
            <div key={job.role} className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-[#102c64]">{job.role}</p>
                  <p className="text-[10px] text-[#5b7393]">{job.employer}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${job.badgeStyle}`}>{job.badge}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-[#b8ccf4]/50">
                  <div
                    className={`h-1.5 rounded-full ${
                      job.match >= 85 ? "bg-emerald-500" : job.match >= 75 ? "bg-[#102c64]" : "bg-amber-400"
                    }`}
                    style={{ width: `${job.match}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${
                  job.match >= 85 ? "text-emerald-600" : job.match >= 75 ? "text-[#102c64]" : "text-amber-500"
                }`}>{job.match}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostExitTrackingMock() {
  const checkIns = [
    { day: "7-day",  label: "Placement confirmed",    status: "done"   },
    { day: "30-day", label: "Still employed",          status: "done"   },
    { day: "60-day", label: "Role matches training",   status: "done"   },
    { day: "90-day", label: "Scheduled · in 3 days",   status: "active" },
  ];

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[26px] border border-[#003366]/10 bg-[#eaf1fb] px-5 py-4 shadow-[0_30px_70px_-36px_rgba(4,43,83,0.28)] lg:min-h-[340px]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-16 h-px w-[55%] rotate-[-8deg] bg-[#b8ccf4]/80" />
        <div className="absolute -right-10 bottom-16 h-px w-[55%] rotate-[6deg] bg-[#b8ccf4]/80" />
        <div className="absolute right-[20%] top-6 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
      </div>

      <div className="relative flex h-full items-center justify-between gap-3">
        {/* Left — Graduate snapshot */}
        <div className="flex w-[26%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Graduate</p>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#102c64] text-[11px] font-semibold text-white">NR</div>
              <div>
                <p className="text-[13px] font-semibold text-[#102c64]">Nia R.</p>
                <p className="text-[10px] text-[#5b7393]">Exited · 47 days ago</p>
              </div>
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700">Employed ✓</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[#5b7393]">Medical Assistant · City Health Clinic</p>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Cohort 14 · placed</p>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="text-[22px] font-semibold leading-none text-[#102c64]">18</span>
              <span className="pb-0.5 text-[10px] text-[#5b7393]">/22 confirmed</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#b8ccf4]/50">
              <div className="h-1.5 rounded-full bg-[#102c64]" style={{ width: "82%" }} />
            </div>
            <p className="mt-1 text-[9px] text-[#5b7393]">82% placement rate</p>
          </div>
        </div>

        {/* Center — Check-in timeline */}
        <div className="w-[44%]">
          <div className="rounded-[22px] border border-[#102c64]/15 bg-white p-4 shadow-[0_24px_50px_-30px_rgba(16,44,100,0.34)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Post-exit tracking</p>
                <p className="mt-1 text-[13px] font-semibold text-[#102c64]">Cohort 14 · check-in schedule</p>
              </div>
              <span className="rounded-full bg-[#102c64]/8 px-3 py-1 text-[10px] font-semibold text-[#102c64]">Auto</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {checkIns.map((item) => (
                <div key={item.day} className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      item.status === "done"
                        ? "bg-[#102c64] text-white"
                        : "border border-amber-400/50 bg-amber-400/10 text-amber-600"
                    }`}
                  >
                    {item.status === "done" ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                    ) : (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                    )}
                  </div>
                  <div className="flex-1 rounded-xl border border-[#003366]/8 bg-[#003366]/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold text-[#102c64]">{item.label}</span>
                      <span className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${
                        item.status === "done" ? "text-[#5b7393]" : "text-amber-500"
                      }`}>{item.day}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-center text-[9px] text-[#5b7393]">Auto-scheduled · no advisor action needed</p>
          </div>
        </div>

        {/* Right — Aggregate outcome metrics */}
        <div className="flex w-[24%] flex-col gap-2.5">
          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Retention · 60 days</p>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="text-[22px] font-semibold leading-none text-emerald-600">94%</span>
            </div>
            <p className="mt-1 text-[9px] text-[#5b7393]">Across all tracked graduates</p>
          </div>

          <div className="rounded-2xl border border-[#ff686c]/40 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(255,104,109,0.4)]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff686c]/12 text-[#ff686c]">
                <X className="h-3.5 w-3.5" strokeWidth={2.3} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff686c]">Unreachable</span>
            </div>
            <div className="mt-1.5 flex items-end gap-1.5">
              <span className="text-[22px] font-semibold leading-none text-[#ff686c]">4</span>
              <span className="pb-0.5 text-[10px] text-[#5b7393]">graduates</span>
            </div>
            <p className="mt-1.5 rounded-lg bg-[#ff686c]/8 px-2 py-1 text-[9px] font-semibold text-[#ff686c]">Follow-up queued</p>
          </div>

          <div className="rounded-2xl border border-[#102c64]/12 bg-white p-3 shadow-[0_18px_30px_-26px_rgba(16,44,100,0.4)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5b7393]">Outcome data</p>
            <p className="mt-1.5 text-[11px] font-semibold text-[#102c64]">Ready for funder report</p>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#102c64]/8 px-2 py-0.5">
              <Check className="h-3 w-3 text-[#102c64]" strokeWidth={2.5} />
              <span className="text-[9px] font-semibold text-[#102c64]">Auto-compiled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestAccessForm() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [volume, setVolume] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (val: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim());

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError("Enter a valid email.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const combinedMessage = `${message || ""}${volume ? `\nStudent volume: ${volume}` : ""}`;
      const res = await fetch("/api/institutions/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          institution: institution || undefined,
          message: combinedMessage || undefined,
          hp,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setStatus("error");
        setError(json.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setError("Network error. Try again.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#003366]/70 ml-2">Full Name</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl input-glass text-[#003366] placeholder-[#003366]/30 text-sm"
          placeholder="e.g. Jordan Lee"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#003366]/70 ml-2">Institution Name</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl input-glass text-[#003366] placeholder-[#003366]/30 text-sm"
          placeholder="e.g. State University"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#003366]/70 ml-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl input-glass text-[#003366] placeholder-[#003366]/30 text-sm"
            placeholder="jordan@edu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#003366]/70 ml-2">Student Volume</label>
          <select
            className="w-full px-4 py-3 rounded-xl input-glass text-[#003366] text-sm"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          >
            <option value="">Select volume</option>
            <option>500 - 1,000</option>
            <option>1,000 - 5,000</option>
            <option>5,000+</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#003366]/70 ml-2">Notes</label>
        <textarea
          className="w-full px-4 py-3 rounded-xl input-glass text-[#003366] placeholder-[#003366]/30 text-sm"
          placeholder="Goals, timelines, or anything we should know."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {/* honeypot */}
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
      <button
        type="submit"
        className="w-full coral-btn text-white font-semibold py-4 rounded-xl shadow-lg mt-4 text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-60"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Request Access"}
        <Send className="w-4 h-4" />
      </button>
      {status === "sent" && <p className="text-xs text-emerald-600 text-center">Thanks! We’ll reach out shortly.</p>}
      {status === "error" && error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </form>
  );
}

export function InstitutionView() {
  const readinessCardRef = useRef<HTMLDivElement>(null);
  const alumniListRef = useRef<HTMLUListElement>(null);
  const hiringBarRef = useRef<HTMLDivElement>(null);
  const hiringHasAnimated = useRef(false);
  const readyBar = useRef<HTMLDivElement>(null);
  const coachingBar = useRef<HTMLDivElement>(null);
  const readyPct = useRef<HTMLSpanElement>(null);
  const coachingPct = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const advisoryCardRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [advisoryAnimated, setAdvisoryAnimated] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const animateProgress = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      const targets = { ready: 78, coaching: 51 };
      const dur = 1000;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - t, 3);
        const readyVal = Math.round(targets.ready * ease);
        const coachingVal = Math.round(targets.coaching * ease);
        if (readyBar.current && readyPct.current) {
          readyBar.current.style.width = `${readyVal}%`;
          readyPct.current.textContent = `${readyVal}%`;
        }
        if (coachingBar.current && coachingPct.current) {
          coachingBar.current.style.width = `${coachingVal}%`;
          coachingPct.current.textContent = `${coachingVal}%`;
        }
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateProgress();
        });
      },
      { threshold: 0.4 },
    );

    if (readinessCardRef.current) observer.observe(readinessCardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setAdvisoryAnimated(true);
        });
      },
      { threshold: 0.3 },
    );
    if (advisoryCardRef.current) observer.observe(advisoryCardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const list = alumniListRef.current;
    if (!list) return undefined;
    const items = Array.from(list.children);
    items.forEach((item) => list.appendChild(item.cloneNode(true)));
    let y = 0;
    const speed = 0.1;
    let frame: number;
    const total = items.reduce((acc, el) => acc + (el as HTMLElement).offsetHeight, 0);
    const step = () => {
      y += speed;
      if (y >= total) y = 0;
      list.style.transform = `translateY(-${y}px)`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const animateBar = () => {
      if (hiringHasAnimated.current || !hiringBarRef.current) return;
      hiringHasAnimated.current = true;
      const target = 82;
      const start = performance.now();
      const dur = 900;
      const bar = hiringBarRef.current;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        bar.style.width = `${Math.round(target * eased)}%`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateBar();
        });
      },
      { threshold: 0.35 },
    );
    if (hiringBarRef.current) observer.observe(hiringBarRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start 0.85", "end 0.3"],
  });
  const dashboardScale = useTransform(scrollYProgress, [0, 1], [0.88, 1.0]);
  const dashboardBorderRadius = useTransform(scrollYProgress, [0, 1], ["28px", "16px"]);
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 space-y-8">
      {/* Hero */}
      <section
        ref={scrollContainerRef}
        id="institutions-hero"
        className="relative bg-[#f8fafe] min-h-[92vh] flex items-start justify-center px-6 pt-10 pb-12 sm:px-12 sm:pt-14 sm:pb-14 lg:px-20 lg:pt-16 lg:pb-16"
      >
        {/* Background Grid Layer */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #e2e8f080 1px, transparent 1px), linear-gradient(to bottom, #e2e8f080 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }} 
        />

        {/* Decorative Floating Elements — clipped to section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-rose-200/40 blur-[120px] animate-float" />
          <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[140px] animate-float-delayed" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full bg-white/80 backdrop-blur-sm px-5 py-2.5 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-slate-100/80">
            <div className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-100">
              <div className="absolute h-full w-full animate-ping rounded-full bg-rose-300 opacity-60" />
              <div className="relative h-1.5 w-1.5 rounded-full bg-rose-500" />
            </div>
            <span className="text-xs font-medium tracking-[0.08em] uppercase text-[#042b53]">
              Institutional Agentic AI
            </span>
          </div>

          {/* Headline */}
            <h1 className="animate-fade-in-up delay-100 mt-12 text-4xl sm:text-[2.85rem] md:text-[3rem] lg:text-[3.1rem] xl:text-[3.45rem] leading-[1.08] font-semibold tracking-[-0.03em] text-[#042b53]">
              <span className="block lg:whitespace-nowrap">Proof of impact, built as the program runs.</span>
          </h1>

          {/* Subheadline */}
            <p className="animate-fade-in-up delay-200 mt-8 max-w-3xl text-lg sm:text-[1.35rem] text-slate-500 leading-relaxed font-normal">
            Avoid the scramble: turn daily program activity into funder-ready evidence without waiting until the end of the cycle.
          </p>

          {/* Buttons */}
          <div className="animate-fade-in-up delay-300 mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="/clarivue-sample-report"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ff5a5f] px-10 py-4 text-base md:text-lg font-medium text-white hover:bg-[#fa4b50] shadow-[0_4px_14px_0_rgba(255,90,95,0.3)] hover:shadow-[0_8px_24px_0_rgba(255,90,95,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              See sample report
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="/book-demo"
              className="rounded-full bg-white px-10 py-4 text-base md:text-lg font-medium text-[#042b53] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] border border-slate-100 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              Book a 15-min walkthrough
            </a>
          </div>

          <motion.div
            ref={dashboardRef}
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
            style={{ scale: dashboardScale, borderRadius: dashboardBorderRadius }}
            className="mt-12 w-full max-w-6xl will-change-transform"
          >
            <div className="relative mx-auto aspect-[1060/580] w-full overflow-hidden border border-[#042b53]/10 bg-white shadow-[0_30px_80px_-28px_rgba(4,43,83,0.28)]" style={{ borderRadius: 'inherit' }}>
              <img
                src="/clarivue_hero_dashboard_v7.svg"
                alt="Clarivue dashboard preview"
                className="absolute left-[-6.61%] top-[-12.07%] w-[119.81%] max-w-none"
              />
              {/* Scroll-driven bottom fade — dissolves as image scales up */}
              <motion.div
                style={{ opacity: fadeOpacity }}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#f8fafe] via-[#f8fafe]/55 to-transparent z-10"
              />
            </div>
          </motion.div>

          {/* Footer Note */}
          <div className="animate-fade-in-up delay-500 mt-8 flex items-center justify-center gap-3 text-base md:text-lg text-slate-500 font-medium">
            <Gift className="w-6 h-6 text-[#ff5a5f] shrink-0" />
            <p>Run your first report free. No demo. No credit card.</p>
          </div>

        </div>
      </section>

      {/* ARCHIVED: Right side UI cards
      <div className="w-full lg:w-[55%] overflow-visible">
        <div className="relative min-h-[520px] overflow-visible">
          <div className="absolute right-0 top-0 w-[52%] aspect-[3/4] rounded-3xl overflow-hidden shadow-xl z-0 hero-card-enter" style={{ animationDelay: '0s' }}>
            <Image src="/hero-image-2.png" alt="Student ready for interview" fill className="object-cover" />
          </div>
          <div className="absolute left-0 top-6 w-[55%] bg-white rounded-2xl shadow-xl border border-[#003366]/8 p-4 z-10 hero-card-enter hero-card-float" style={{ animationDelay: '0.2s, 0s' }}>
            ... Sarah Mitchell card ...
          </div>
          <div className="absolute -right-[10%] top-[53%] w-[23%] bg-white rounded-xl shadow-xl border border-[#003366]/8 p-3 z-20 text-center hero-card-enter hero-card-float-alt hero-card-glow" style={{ animationDelay: '0.6s, 1s, 1.5s' }}>
            ... Readiness score 91% card ...
          </div>
          <div className="absolute left-4 bottom-0 w-[38%] aspect-square rounded-3xl overflow-hidden shadow-xl z-0 hero-card-enter" style={{ animationDelay: '0.4s' }}>
            <Image src="/hero-image-1.png" alt="Student preparing for interview" fill className="object-cover" />
          </div>
          <div className="absolute right-[15%] -bottom-8 w-[52%] bg-white rounded-2xl shadow-xl border border-[#003366]/8 p-4 z-10 hero-card-enter hero-card-float" style={{ animationDelay: '0.9s, 2s' }}>
            ... Cohort overview card ...
          </div>
          <svg className="absolute -bottom-4 right-8 w-20 h-28 z-20 text-[#003366]/20" viewBox="0 0 60 90" fill="none">
            <path d="M30 0 C30 40, 55 50, 55 90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      */}

      {/* Pain Points / Use Cases hidden for now */}

      {/* Last Mile Statement hidden for now */}

      {/* Features + Feature Details (bundled, no gaps) */}
      <section
        id="institutions-features"
        className="md:px-10 max-w-6xl mx-auto px-6"
      >
        {/* SECTION TITLE */}
        <div className="pl-1 text-left sm:pl-2">
          <div className="max-w-6xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[3.1rem] font-semibold tracking-[-0.04em] text-[#003366] leading-[1.05]">
              Every step captured. All of it becomes proof.
            </h2>
            <p className="mt-4 text-base md:text-lg lg:text-[1.05rem] font-normal text-[#003366]/70 max-w-2xl">
              Clarivue runs alongside the systems you already use, capturing the work between training and a job, so the evidence is ready before your funder asks.
            </p>
          </div>
        </div>

        {(() => {
          const FEATURES = [
    {
  icon: <Users className="h-5 w-5" strokeWidth={1.5} />,
  title: "Catch resumes before they fail",
  description:
    "Fix keywords, formatting, and ATS gaps automatically, and log every fix as evidence the work happened.",
  color: "bg-fuchsia-500",
  image: "/employer_bridge.mp4",
},
{
  icon: <Infinity className="h-5 w-5" strokeWidth={1.5} />,
  title: "Run mock interviews at cohort scale",
  description:
    "Score every learner on the same signals employers screen for, so readiness is a record, not a guess.",
  color: "bg-emerald-500",
  image: "/Practicing_Job_Interview_On_Laptop.mp4",
},
{
  icon: <BarChart2 className="h-5 w-5" strokeWidth={1.5} />,
  title: "Keep advisors in front of learners, not paperwork",
  description:
    "Auto-capture case notes, follow-ups, and check-ins between sessions, so nothing your team does goes undocumented.",
  color: "bg-sky-500",
  image: "/Career_Readiness_Dashboard_Video.mp4",
},
{
  icon: <ClipboardCheck className="h-5 w-5" strokeWidth={1.5} />,
  title: "Match learners to real opportunities",
  description:
    "Route each learner to roles that fit their skills, so preparation ends in a real shot at a job, not a dead end.",
  color: "bg-amber-500",
  image: "/ai-capture.mp4",
},
{
  icon: <Activity className="h-5 w-5" strokeWidth={1.5} />,
  title: "Track what happens after they leave",
  description:
    "Follow graduates past exit to establish what placement actually became, the outcome data everyone's judged on and no one can reach.",
  color: "bg-violet-500",
  image: "/ai-capture.mp4",
},
          ];

          return (
            <div className="mt-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              {/* Left: Accordion */}
              <div className="w-full lg:w-[34%] divide-y divide-[#003366]/10">
                {FEATURES.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    onMouseEnter={() => setActiveFeature(i)}
                    onFocus={() => setActiveFeature(i)}
                    className={`w-full text-left py-3 group rounded-2xl px-3 transition-all duration-300 ${
                      activeFeature === i ? "bg-[#003366]/[0.035]" : "hover:bg-[#003366]/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-[#003366]/70 group-hover:text-[#003366] transition-all duration-300 ${
                          activeFeature === i ? "scale-105 text-[#003366]" : ""
                        }`}>
                          {f.icon}
                        </span>
                        <span className={`text-[16px] font-semibold leading-tight transition-all duration-300 ${
                          activeFeature === i
                            ? "translate-x-1 text-[#003366]"
                            : "text-[#003366]/70 group-hover:translate-x-1 group-hover:text-[#003366]"
                        }`}>
                          {f.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-[#003366]/40 transition-all duration-300 ${
                          activeFeature === i ? "rotate-180 text-[#003366]" : "group-hover:text-[#003366]/70"
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-out ${
                        activeFeature === i ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        <p className={`pl-8 text-[12px] leading-relaxed text-[#003366]/60 transition-all duration-300 ${
                          activeFeature === i ? "translate-y-0" : "-translate-y-2"
                        }`}>
                          {f.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: Image area with overlapping UI card */}
              <div className="hidden lg:block w-full lg:w-[66%]">
                {activeFeature === 0 && <ResumeDiagnosticsMock />}
                {activeFeature === 1 && <MockInterviewsMock />}
                {activeFeature === 2 && <AdvisorWorkflowMock />}
                {activeFeature === 3 && <LearnerMatchMock />}
                {activeFeature === 4 && <PostExitTrackingMock />}
              </div>
            </div>
          );
        })()}

        {/* Rollup capstone — everything above flows into one report */}
        <div className="mt-14 sm:mt-16">
          {/* Converging funnel motif */}
          <div className="relative mx-auto mb-6 h-8 w-full max-w-[520px]" aria-hidden="true">
            <div className="absolute left-0 top-0 h-8 w-px origin-top rotate-[22deg] bg-gradient-to-b from-transparent to-[#003366]/25" />
            <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-[#003366]/25" />
            <div className="absolute right-0 top-0 h-8 w-px origin-top rotate-[-22deg] bg-gradient-to-b from-transparent to-[#003366]/25" />
            <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#ff5a5f]" />
          </div>

          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-[#003366]/10 bg-gradient-to-br from-white to-[#f4f8ff] px-8 py-10 text-center shadow-[0_30px_80px_-40px_rgba(4,43,83,0.3)] sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#003366]/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#003366]/60">
                <ClipboardCheck className="h-3.5 w-3.5" strokeWidth={2} />
                The report
              </span>
              <p className="mx-auto mt-5 max-w-3xl text-2xl sm:text-[1.75rem] lg:text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#042b53]">
                All of it rolls into one report, the proof that decides whether your funding{" "}
                <span className="text-[#ff5a5f]">grows or disappears</span>.
              </p>
              <div className="mt-7">
                <a
                  href="/clarivue-sample-report"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#003366] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(0,51,102,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#02294f]"
                >
                  See sample report
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="px-0 py-0">
          <div className="px-0 pb-10 sm:pb-12 lg:pb-14">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#042b53]/45">
                Built For Every Program Leader
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[3.1rem] font-semibold tracking-[-0.04em] text-[#042b53] leading-[1.05]">
                Everyone who touches a learner sees the proof they need.
              </h2>
            </div>
          </div>

          <div className="relative overflow-hidden grid lg:grid-cols-3 gap-0 border-t-2 border-[#042b53]/18">
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-[#042b53]/16" />
            <div className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 -translate-y-[4px] rounded-full bg-[#ff6b57] role-leader-dot-x" />
            <div className="pointer-events-none absolute hidden lg:block left-1/3 top-0 bottom-0 w-[2px] -translate-x-px bg-[#042b53]/14" />
            <div className="pointer-events-none absolute hidden lg:block left-1/3 top-0 h-2.5 w-2.5 -translate-x-[5px] rounded-full bg-[#5a63ff] role-leader-dot-y" />
            <div className="pointer-events-none absolute hidden lg:block left-2/3 top-0 bottom-0 w-[2px] -translate-x-px bg-[#042b53]/14" />
            <div className="pointer-events-none absolute hidden lg:block left-2/3 top-0 h-2.5 w-2.5 -translate-x-[5px] rounded-full bg-[#0ea5e9] role-leader-dot-y role-leader-dot-y-delayed" />
            {[0, 1, 2].map((columnIndex) => (
              <div
                key={columnIndex}
                className={columnIndex < 2 ? "divide-y-2 divide-[#042b53]/12 lg:border-r-2 border-[#042b53]/12" : "divide-y-2 divide-[#042b53]/12"}
              >
                {institutionRoleCards.slice(columnIndex * 2, columnIndex * 2 + 2).map((card) => {
                  const Icon = card.icon;

                  return (
                    <article key={card.title} className="p-8 sm:p-9">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconWrapClass}`}>
                          <Icon className={`h-6 w-6 ${card.iconClass}`} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-[#042b53] font-medium text-lg leading-tight">{card.title}</div>
                          <div className={`mt-0.5 text-sm font-medium ${card.iconClass}`}>{card.tagline}</div>
                        </div>
                      </div>
                      <p className="text-[#042b53]/72 leading-relaxed text-[15px] sm:text-base">
                        {card.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits — Security, Stats, Readiness */}
      <InstitutionBenefits />

      {/* Institutional stats hidden for now */}

      {/* Comparison section hidden for now */}

      {/* Security & Compliance + Responsible AI */}
      <SecurityCompliance />

      {/* Placement Cost Calculator */}
      <CalculatorTeaser />

      {/* Blog Insights */}
      <BlogInsights />

      {/* CTA Banner */}
      <section className="relative w-full bg-[#003366] py-14 md:py-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#ff686c] rounded-full blur-[140px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Prove it on your own cohort. No demo, no sales call.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Run one cohort through Clarivue and see the funder evidence build itself, before you talk to anyone here.
          </p>

          <div className="mt-10 flex items-center justify-center">
            <a
              href="/book-demo"
              className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-[#ff686c] text-white text-lg font-semibold shadow-lg shadow-[#ff686c]/30 transition-all duration-300 hover:bg-[#e55d61] hover:shadow-xl hover:-translate-y-0.5 min-w-[260px]"
            >
              See the proof for one cohort →
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white/50" />
              <span className="font-medium">FERPA, PIPEDA &amp; GDPR ready</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="hidden sm:flex items-center gap-2">
              <Lock className="w-5 h-5 text-white/50" />
              <span className="font-medium">SOC 2 aligned</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="hidden sm:flex items-center gap-2">
              <Users className="w-5 h-5 text-white/50" />
              <span className="font-medium">1,400+ learners</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - disabled
      <section id="institutions-contact" className="max-w-xl mx-auto pt-10 md:pt-12">
        <div className="glass-panel rounded-[32px] p-8 md:p-10 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-[#ff686c]" />
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#003366] mb-2 tracking-tight">
              Ready to Scale Your Outcomes?
            </h3>
            <p className="text-sm text-[#003366]/60">
              Let&apos;s discuss your institution&apos;s specific needs.
            </p>
          </div>

          <RequestAccessForm />
        </div>
      </section>
      */}

      {/* READINESS COMMUNITY section - disabled
      <section
        id="institutions-community"
        className="relative max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-12 pb-6 md:pb-10"
      >
        <div className="mb-8 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white">
            <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
            <span className="text-sm font-semibold text-[#003366]">READINESS COMMUNITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            Create a culture of practice, progress, and support.
          </h2>
          <p className="text-sm md:text-base text-[#003366]/70 leading-relaxed max-w-4xl mx-auto">
            Clarivue helps learners practice together, get feedback, build confidence, and 
            stay engaged while giving advisors a structured system to guide growth.
          </p>
        </div>

        <div className="glass-panel rounded-[32px] p-6 md:p-10 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-[#f0f9ff]/60 to-[#fff7ed]/60" />
          <div className="absolute -left-16 -top-12 w-48 h-48 bg-[#003366]/10 blur-3xl" />
          <div className="absolute -right-10 -bottom-16 w-56 h-56 bg-[#ff686c]/10 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-start">
            <div className="space-y-6 text-left self-center">
              <p className="text-sm md:text-base text-[#003366]/80 leading-relaxed max-w-3xl">
                Clarivue helps institutions create private interview communities where learners practice together, support
                one another, and build confidence over time. Instead of one-off workshops, learners join shared spaces where
                practice is social, feedback is consistent, and improvement is visible.
              </p>

              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-[#003366]">What this enables</p>
                <ul className="mt-3 space-y-2 text-sm md:text-base text-[#003366]/80 leading-relaxed text-left">
                  {[
                    "Learners practice together, not alone",
                    "Peers coach peers using shared standards",
                    "Advisors guide communities, not individuals",
                    "Alumni stay involved and give back",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ff686c]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-start">
                <a
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold transition bg-[#003366] text-white hover:bg-[#02294f] shadow-md shadow-blue-900/10"
                  href="#"
                >
                  See how readiness communities work →
                </a>
              </div>
            </div>

            <div
              className="relative h-[480px] md:h-[520px] overflow-hidden rounded-3xl border border-[#003366]/10 bg-white/70 backdrop-blur"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              }}
            >
              <div className="will-change-transform animate-[marquee-vertical_30s_linear_infinite]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {communityCards.map((card) => (
                    <CommunityCard key={card.tag} {...card} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {communityCards.map((card) => (
                    <CommunityCard key={`${card.tag}-dup`} {...card} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{\`
          @keyframes marquee-vertical {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          @keyframes listening-wave {
            0%,
            100% {
              transform: scaleY(0.38);
              opacity: 0.45;
            }
            20% {
              transform: scaleY(1);
              opacity: 1;
            }
            45% {
              transform: scaleY(0.58);
              opacity: 0.72;
            }
            70% {
              transform: scaleY(0.9);
              opacity: 0.92;
            }
          }

          .listening-wave-bar {
            transform-origin: center bottom;
            animation-name: listening-wave;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            will-change: transform, opacity;
          }
        \`}</style>
      </section>
      */}
    </div>
  );
}

function CommunityCard({
  tag,
  title,
  sub,
  tone,
  img,
}: {
  tag: string;
  title: string;
  sub: string;
  tone: CommunityTone;
  img: string;
}) {
  const t = communityToneStyles[tone];

  return (
    <article
      className={[
        "relative overflow-hidden rounded-2xl transition h-48 sm:h-52",
        t.ring,
      ].join(" ")}
    >
      <Image src={img} alt={title} fill className="object-cover" sizes="240px" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/65" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
      <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl" />

      <div className="absolute top-2 right-2">
        <span className="px-2 py-1 rounded-md backdrop-blur text-[11px] font-semibold border bg-white/80 text-[#003366] border-[#003366]/15">
          {tag}
        </span>
      </div>

      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-sm font-semibold tracking-tight text-white drop-shadow-sm">{title}</p>
        <p className="mt-1 text-[11px] text-white/80 line-clamp-2">{sub}</p>
      </div>
    </article>
  );
}
