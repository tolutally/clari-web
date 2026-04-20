"use client";

import ClarivueImpactCalculator from "@/components/sections/institution/ClarivueImpactCalculator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { DollarSign, Clock, Users, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "calculator", label: "Calculator" },
  { id: "why", label: "Why" },
  { id: "impact", label: "Impact" },
  { id: "about", label: "About" },
];

/* ── Decorative shapes (like PeopleHR's scattered triangles/arrows) ──── */
function Accent({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path d="M16 4L28 28H4L16 4Z" fill="currentColor" />
    </svg>
  );
}

/* ── Benefit card ─────────────────────────────────────────────────────── */
function BenefitCard({
  icon,
  title,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all w-full ${
        active
          ? "bg-[#ff686c] text-white shadow-lg"
          : "bg-white border border-gray-200 text-[#003366] hover:border-[#003366]/30"
      }`}
    >
      <span className="text-lg shrink-0">{icon}</span>
      <span>{title}</span>
    </button>
  );
}

/* ── Step pill for "How it works" sidebar ─────────────────────────────── */
function StepPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
        active
          ? "bg-[#ff686c] text-white shadow-md"
          : "bg-white border border-gray-200 text-[#003366]/70 hover:border-[#ff686c]/40"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Benefit descriptions & How-it-works step content ─────────────────── */
const BENEFITS = [
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: "Current Prep Cost",
    description:
      "How much is your team actually spending on mock interviews, coaching sessions, and remediation? The calculator totals the real cost of your current interview prep operation — most teams underestimate it by 2–3x.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Advisor Time Recovered",
    description:
      "Your advisors spend hours running mock interviews and re-coaching learners who aren't ready. The calculator shows how much of that time you could reclaim — and what it's worth in dollars.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Additional Learners Served",
    description:
      "When advisors aren't stuck in remediation loops, they can serve more learners. See exactly how many additional students your team could support with the time recovered.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Placement Rate Lift",
    description:
      "Better interview readiness means more learners convert employer conversations into offers. The calculator estimates the placement rate improvement based on your program's current readiness gap.",
  },
];

const STEPS = [
  {
    pill: "Your Program",
    title: "Cohort size & program type",
    description:
      "Start with numbers you already know — how many learners complete your program each year and what kind of program you run. This sets the baseline for everything else.",
  },
  {
    pill: "Mock Interviews",
    title: "How many mocks does each learner get?",
    description:
      "Enter the average number of mock interviews per learner. This drives the prep cost calculation — even a rough estimate works.",
  },
  {
    pill: "Readiness Gap",
    title: "How many learners need extra coaching?",
    description:
      "Estimate how many learners need additional coaching before they're interview-ready. This shapes the remediation cost and time recovery calculations.",
  },
  {
    pill: "Prep Spend",
    title: "What you invest in interview readiness",
    description:
      "Enter your annual spend on interview prep — staff time, tools, mock sessions. The calculator uses this to show your return.",
  },
  {
    pill: "Your Snapshot",
    title: "Four metrics, instantly",
    description:
      "Results update as you type. You'll see your current prep cost, advisor time recovered, additional learners you could serve, and your expected placement rate lift. Then generate a detailed report.",
  },
];

export default function RoiCalculatorPage() {
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [activeSection, setActiveSection] = useState("calculator");
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 300);
      const ids = NAV_ITEMS.map((n) => n.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />

      {/* Floating nav */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/80 backdrop-blur-lg shadow-lg shadow-black/[0.08] px-2 py-1.5">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <a
                key={item.id}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all text-[#003366]/60 hover:text-[#003366] hover:bg-[#003366]/5"
              >
                {item.label}
              </a>
            ) : (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeSection === item.id
                  ? "bg-[#ff686c] text-white shadow-sm"
                  : "text-[#003366]/60 hover:text-[#003366] hover:bg-[#003366]/5"
              }`}
            >
              {item.label}
            </a>
            )
          )}
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-b from-[#e8f0ff] via-white to-[#f5f8ff]">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — Centered Intro
         ═══════════════════════════════════════════════ */}
      <section id="top" className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center scroll-mt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#003366]/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#003366]/70 backdrop-blur mb-5">
          Placement Cost Calculator
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#003366] leading-tight mb-5">
          What is the training-to-employment gap actually costing your program?
        </h1>

        <p className="text-sm text-[#003366]/60 leading-relaxed mb-6">
          Most career teams know interview readiness is a challenge. Few know
          what it costs in real dollars — advisor hours, remediation cycles,
          and learners who never get served. Enter five numbers about your
          program. See your current prep cost, the advisor time you could
          recover, and the impact on placement rates — instantly.
        </p>

        <ul className="inline-flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#003366]/70">
          <li className="flex items-center gap-1.5">
            <span className="text-[#ff686c] font-bold">✓</span>
            Results update as you type
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#ff686c] font-bold">✓</span>
            No sign-up required
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#ff686c] font-bold">✓</span>
            Generate a shareable report
          </li>
        </ul>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Calculator (left) + How It Works (right)
         ═══════════════════════════════════════════════ */}
      <section id="calculator" className="max-w-7xl mx-auto px-6 pb-16 scroll-mt-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          {/* Left: Calculator (60%) */}
          <div className="w-full lg:w-[60%] rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-lg shadow-black/[0.03] p-6 md:p-8">
            <ClarivueImpactCalculator />
          </div>

          {/* Right: How It Works (40%) */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-16 space-y-6 pt-2">
            <h2 className="text-xl md:text-2xl font-semibold text-[#003366]">
              How it works
            </h2>
            <p className="text-sm text-[#003366]/60 leading-relaxed">
              You answer a few simple questions. No digging. No complex
              spreadsheets. The calculator does the rest.
            </p>

            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-start gap-3 w-full rounded-xl px-4 py-3 text-left text-sm transition-all ${
                    activeStep === i
                      ? "bg-[#003366] text-white shadow-lg"
                      : "bg-white border border-gray-200 text-[#003366] hover:border-[#003366]/30"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                      activeStep === i
                        ? "bg-[#ff686c] text-white"
                        : "bg-[#003366]/10 text-[#003366]/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-semibold block">{s.pill}</span>
                    {activeStep === i && (
                      <p className={`text-xs mt-1 leading-relaxed ${
                        activeStep === i ? "text-white/70" : "text-[#003366]/50"
                      }`}>
                        {s.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — Benefits (3 cards + detail)
         ═══════════════════════════════════════════════ */}
      <section id="why" className="relative bg-white py-20 overflow-hidden scroll-mt-16">
        {/* Decorative accents */}
        <Accent className="absolute top-8 right-12 text-[#ff686c]/20 rotate-12 hidden md:block" />
        <Accent className="absolute bottom-12 left-8 text-[#003366]/10 -rotate-45 hidden md:block" />
        <Accent className="absolute top-1/3 right-1/4 text-emerald-400/15 rotate-[30deg] hidden lg:block" />

        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#003366] mb-4">
              What the calculator reveals
            </h2>
            <p className="text-sm text-[#003366]/60 leading-relaxed">
              Four metrics that turn interview prep from a line item into a
              measurable operation. Each one maps to a number your leadership
              team can act on.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Left: benefit cards */}
            <div className="w-full md:w-[38%] space-y-3">
              {BENEFITS.map((b, i) => (
                <BenefitCard
                  key={i}
                  icon={b.icon}
                  title={b.title}
                  active={activeBenefit === i}
                  onClick={() => setActiveBenefit(i)}
                />
              ))}
            </div>

            {/* Right: active benefit detail */}
            <div className="w-full md:w-[62%] relative">
              <div className="rounded-2xl bg-gradient-to-br from-[#f0f9ff] to-[#f5f3ff] border border-gray-200/60 p-8 md:p-10 min-h-[200px]">
                {/* decorative triangles */}
                <Accent className="absolute -top-3 -right-3 text-[#ff686c]/30 rotate-45" />
                <Accent className="absolute -bottom-2 right-16 text-emerald-400/25 -rotate-12" />

                <h3 className="text-lg font-semibold text-[#003366] mb-3">
                  {BENEFITS[activeBenefit].title}
                </h3>
                <p className="text-sm text-[#003366]/60 leading-relaxed">
                  {BENEFITS[activeBenefit].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2b — Stop tracking effort. Start pricing impact.
         ═══════════════════════════════════════════════ */}
      <section id="impact" className="relative bg-gradient-to-b from-white to-[#f5f8ff] py-16 overflow-hidden scroll-mt-16">
        <Accent className="absolute top-12 left-16 text-emerald-400/15 rotate-[50deg] hidden md:block" />
        <Accent className="absolute bottom-8 right-20 text-[#ff686c]/15 -rotate-[30deg] hidden md:block" />

        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#003366] mb-4">
              Stop counting sessions. Start measuring outcomes.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto">
            {/* Left: Most teams measure */}
            <div className="flex-1 rounded-2xl bg-white border border-gray-200/60 shadow-sm p-6">
              <h3 className="text-sm font-bold text-[#003366]/50 uppercase tracking-wider mb-4">
                Most teams measure
              </h3>
              <ul className="space-y-3 text-sm text-[#003366]/70">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-300">—</span>
                  Coaching sessions delivered
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-300">—</span>
                  Mock interviews completed
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-300">—</span>
                  Workshop attendance
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-gray-300">—</span>
                  Student satisfaction scores
                </li>
              </ul>
            </div>

            {/* Right: Few measure */}
            <div className="flex-1 rounded-2xl bg-[#003366] border border-[#003366] shadow-md p-6">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
                Few measure
              </h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#ff686c] font-bold">→</span>
                  Actual cost of running mock interviews & coaching
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#ff686c] font-bold">→</span>
                  Advisor hours recoverable through better tools
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#ff686c] font-bold">→</span>
                  Extra learners your team could serve
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#ff686c] font-bold">→</span>
                  Expected lift in placement rates
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-[#003366]/40 mt-6">
            This calculator quantifies the second column.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — CTA Banner
         ═══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#003366] to-[#002244] py-14">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          {/* Left: copy */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
              See your numbers
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-lg">
              Five inputs. Four metrics. One shareable report for leadership.
              Takes under two minutes.
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="coral-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white"
            >
              Run the Calculator
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Right: illustrative graphic */}
          <div className="w-full md:w-[38%] flex justify-center">
            <div className="relative w-56 h-56">
              {/* Abstract chart graphic */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 flex flex-col justify-end gap-2">
                <div className="flex items-end gap-2 h-full">
                  <div className="w-1/4 bg-white/20 rounded-t-md bar-rise" style={{ height: "40%" }} />
                  <div className="w-1/4 bg-white/30 rounded-t-md bar-rise" style={{ height: "60%", animationDelay: "0.1s" }} />
                  <div className="w-1/4 bg-[#ff686c]/80 rounded-t-md bar-rise" style={{ height: "85%", animationDelay: "0.2s" }} />
                  <div className="w-1/4 bg-emerald-400/80 rounded-t-md bar-rise" style={{ height: "95%", animationDelay: "0.3s" }} />
                </div>
                <p className="text-[10px] text-white/50 text-center mt-1">
                  Value recovered over time →
                </p>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 rounded-full bg-[#ff686c] px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
                Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — What this is really about
         ═══════════════════════════════════════════════ */}
      <section id="about" className="relative bg-white py-20 overflow-hidden scroll-mt-16">
        <Accent className="absolute top-8 left-12 text-[#003366]/10 rotate-[25deg] hidden md:block" />
        <Accent className="absolute bottom-10 right-16 text-emerald-400/15 -rotate-[40deg] hidden md:block" />

        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#003366]">
            What this is really about
          </h2>
          <p className="text-sm text-[#003366]/60 leading-relaxed">
            Interview prep isn&apos;t just a student problem — it&apos;s a program
            operations question. Every hour an advisor spends running mock
            interviews is an hour they can&apos;t spend advising new learners.
            Every learner who isn&apos;t interview-ready is a placement that
            could slip.
          </p>
          <ul className="inline-block text-left space-y-2 text-sm text-[#003366]/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#ff686c] font-bold">•</span>
              Know the real cost of your current prep operation
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#ff686c] font-bold">•</span>
              See how much advisor time you could recover
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#ff686c] font-bold">•</span>
              Understand capacity gains in learners served
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#ff686c] font-bold">•</span>
              Estimate the placement rate improvement
            </li>
          </ul>
          <p className="text-sm font-semibold text-[#003366] pt-2">
            Run it. Share the report. Make the case.
          </p>
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="coral-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white"
            >
              Run the Calculator
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
