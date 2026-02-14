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
  Link as LinkIcon,
  Lock,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
// import { TrustShowcase } from "@/components/sections/trust/TrustShowcase";
import { StatsConfidence } from "@/components/sections/trust/StatsConfidence";
import { CalculatorTeaser } from "@/components/sections/institution/CalculatorTeaser";
import { InstitutionBenefits } from "@/components/sections/institution/InstitutionBenefits";
import ClarivueImpactCalculator from "@/components/sections/institution/ClarivueImpactCalculator";
import InstitutionPainPoints from "@/components/sections/institution/InstitutionPainPoints";
import { BlogInsights } from "@/components/sections/institution/BlogInsights";
// import HowItWorksInstitutions from "@/components/sections/institution/HowItWorksInstitutions";
import { useEffect, useRef, useState, FormEvent } from "react";

const comparisonRows = [
  {
    feature: "Risk detection",
    with: "Risk flagged before employer exposure",
    without: "Problems surface after rejection",
  },
  {
    feature: "Scoring consistency",
    with: "Standardized rubrics, every session",
    without: "Advisor intuition, no consistency",
  },
  {
    feature: "Role-specific practice",
    with: "Practice built from real job descriptions",
    without: "Generic prep that doesn't transfer",
  },
  {
    feature: "Readiness proof",
    with: "Scorecards and readiness data you can show",
    without: "Anecdotes when funders ask for proof",
  },
];

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
  const comparisonRef = useRef<HTMLDivElement>(null);
  const [advisoryAnimated, setAdvisoryAnimated] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Comparison slide-in animation
  useEffect(() => {
    const el = comparisonRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".compare-slide-left, .compare-slide-right").forEach(
            (card) => card.classList.add("compare-visible")
          );
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 space-y-8">
      {/* Hero */}
      <section
        id="institutions-hero"
        className="relative pt-11 pb-0 md:pt-14 md:pb-0"
      >
        <div className="hero-wash absolute inset-0 -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[540px] bg-[#f0f9ff]/70 blur-[160px] rounded-full -z-10" />
        <div className="absolute -right-16 top-24 w-72 h-72 bg-[#fff7ed]/70 rounded-full blur-3xl -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: Text — 45% */}
            <div className="w-full lg:w-[45%] text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#003366]/10 shadow-sm backdrop-blur mb-8">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff686c] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff686c]" />
                </span>
                <span className="text-xs font-semibold text-[#003366] uppercase tracking-[0.12em]">
                 For Career Centers & Workforce Programs
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#003366] mb-6 leading-[1.08]">
                Know who is interview-ready{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102c64] via-[#b8ccf4] to-[#ff686c]">
                   before employers do.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#003366]/70 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                See readiness before employer exposure. Intervene early.
                Defend outcomes.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <a
                  href="https://app.clarivue.io/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/80 border border-[#003366]/10 hover:bg-white text-[#003366] font-semibold py-3.5 px-8 rounded-full shadow-sm backdrop-blur transition-all"
                >
                  Start for free
                </a>
                <a
                  href="/book-demo"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff686c] hover:bg-[#ff5b5f] text-white font-semibold py-3.5 px-8 rounded-full shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                >
                 Speak to us
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <p className="mt-3 text-sm text-[#003366]/50 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
                <Gift className="w-4 h-4 text-[#ff686c]" />
                Get 30 minutes free after sign up — no credit card required
              </p>
            </div>

            {/* Right: UI — 55% */}
            <div className="w-full lg:w-[55%] overflow-visible">
              <div className="relative min-h-[520px] overflow-visible">

                {/* ── Top-right: Placeholder person image ── */}
                <div className="absolute right-0 top-0 w-[52%] aspect-[3/4] rounded-3xl overflow-hidden shadow-xl z-0 hero-card-enter" style={{ animationDelay: '0s' }}>
                  <Image
                    src="/hero-image-2.png"
                    alt="Student ready for interview"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* ── Top-left: Candidate profile card ── */}
                <div className="absolute left-0 top-6 w-[55%] bg-white rounded-2xl shadow-xl border border-[#003366]/8 p-4 z-10 hero-card-enter hero-card-float" style={{ animationDelay: '0.2s, 0s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#003366]">Sarah Mitchell</h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Ready</span>
                    <span className="text-[#003366]/30 ml-auto text-lg">⋮</span>
                  </div>
                  <p className="text-[11px] text-[#003366]/50 mb-3">Scored 2 hours ago</p>
                  <div className="flex gap-6 text-[11px]">
                    <div>
                      <p className="text-[#003366]/50">Program</p>
                      <p className="font-semibold text-[#003366]">Data Analytics</p>
                    </div>
                    <div>
                      <p className="text-[#003366]/50">Cohort</p>
                      <p className="font-semibold text-[#003366]">Spring 2026</p>
                    </div>
                  </div>

                  {/* Mock interview card */}
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f4f7fb] p-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#003366]/10 flex items-center justify-center text-[#003366]/50">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#003366]">Mock interview</p>
                      <p className="text-[10px] text-[#003366]/50">Watch replay</p>
                    </div>
                    <span className="text-[10px] text-[#003366]/50">12:45m</span>
                  </div>

                  {/* Rubric alignment row */}
                  <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#f4f7fb] p-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#003366]/10 flex items-center justify-center text-[#003366]/50">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#003366]">Rubric alignment</p>
                      <p className="text-[10px] text-[#003366]/50">View scorecard</p>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">4/5 aligned</span>
                  </div>
                </div>

                {/* ── Middle-right: Readiness score card ── */}
                <div className="absolute -right-[10%] top-[53%] w-[23%] bg-white rounded-xl shadow-xl border border-[#003366]/8 p-3 z-20 text-center hero-card-enter hero-card-float-alt hero-card-glow" style={{ animationDelay: '0.6s, 1s, 1.5s' }}>
                  <p className="text-[10px] font-semibold text-[#003366]/60 mb-0.5">Readiness score</p>
                  <p className="text-2xl font-bold text-[#003366] hero-score-pop">91%</p>
                  <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Interview-ready</p>
                  <button className="mt-2 w-full rounded-full border border-[#003366]/15 py-1 text-[10px] font-semibold text-[#003366] hover:bg-[#003366]/5 transition-colors">
                    View report
                  </button>
                </div>

                {/* ── Bottom-left: Second placeholder person image ── */}
                <div className="absolute left-4 bottom-0 w-[38%] aspect-square rounded-3xl overflow-hidden shadow-xl z-0 hero-card-enter" style={{ animationDelay: '0.4s' }}>
                  <Image
                    src="/hero-image-1.png"
                    alt="Student preparing for interview"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* ── Bottom-right: Cohort overview card ── */}
                <div className="absolute right-[15%] -bottom-8 w-[52%] bg-white rounded-2xl shadow-xl border border-[#003366]/8 p-4 z-10 hero-card-enter hero-card-float" style={{ animationDelay: '0.9s, 2s' }}>
                  <p className="text-sm font-bold text-[#003366] mb-3">Cohort overview</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <Image src="/avatars/avatar-2.jpg" alt="Oliver Chen" width={36} height={36} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#003366]">Oliver Chen</p>
                      <p className="text-[10px] text-[#003366]/50">Cohort: Spring 2026</p>
                    </div>
                    {/* Circular progress indicator */}
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#003366" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="16" strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#003366]">83%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-[#003366]/60">See all learners</p>
                    {/* Avatar stack */}
                    <div className="flex -space-x-2">
                      {[
                        "/avatars/avatar-1.jpg", "/avatars/avatar-2.jpg", "/avatars/avatar-3.jpg", "/avatars/avatar-4.jpg", "/avatars/avatar-5.jpg"
                      ].map((src, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                          <Image src={src} alt="" width={28} height={28} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Decorative curved line ── */}
                <svg className="absolute -bottom-4 right-8 w-20 h-28 z-20 text-[#003366]/20" viewBox="0 0 60 90" fill="none">
                  <path d="M30 0 C30 40, 55 50, 55 90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Partner Brand Strip */}
      <div className="-mt-8 pt-28 pb-6">
        <p className="text-[22px] font-bold uppercase tracking-[0.25em] text-[#003366]/55 text-center mb-6">
          Fully Canadian Built, Backed By:
        </p>
        <div className="flex items-center justify-center gap-10 sm:gap-16 md:gap-20 flex-wrap px-6">
          <Image
            src="/partners/tribe_logo.png"
            alt="Tribe"
            width={250}
            height={83}
            className="h-16 sm:h-[83px] w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
          <Image
            src="/partners/Volta-Logo.png"
            alt="Volta"
            width={208}
            height={67}
            className="h-[52px] sm:h-[58px] w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
          <Image
            src="/partners/Invest-Nova-Scotia-Logo.png"
            alt="Invest Nova Scotia"
            width={333}
            height={99}
            className="h-[76px] sm:h-[91px] w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        </div>
      </div>

      {/* Pain Points */}
      <InstitutionPainPoints />

      {/* Complete Career Infrastructure */}
      <section
        id="institutions-features"
        className="md:px-10 md:pt-8 max-w-6xl mx-auto pt-8 px-6"
      >
        {/* SECTION PILL */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white/70">
            <Sparkles className="h-4 w-4 text-sky-700" strokeWidth={1.5} />
            <span className="text-sm text-[#003366]">WHAT YOU GET</span>
          </div>
        </div>

        {/* SECTION TITLE */}
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366] text-center mt-6">
          The tool that keeps your
          <span className="block">career center interview-ready.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base md:text-lg font-normal text-[#003366]/70">
          See who is ready, who needs coaching, and how your grads move from practice to placement.
        </p>

        {(() => {
          const FEATURES = [
    {
  icon: <BarChart2 className="h-5 w-5" strokeWidth={1.5} />,
  title: "Placement intelligence",
  description:
    "You don't know who's ready until interviews fail. See readiness rates, risk flags, and conversion gaps before employer exposure. No more guessing. No more surprises.",
  color: "bg-sky-500",
  image: "/Career_Readiness_Dashboard_Video.mp4",
},
{
  icon: <Settings2 className="h-5 w-5" strokeWidth={1.5} />,
  title: "Governed advisory",
  description:
    "Manual mocks don't scale. Lock your criteria into enforced rubrics and risk queues so advisors focus where it matters. Standards stay consistent. Time stops leaking.",
  color: "bg-indigo-500",
  image: "/Focused_Coaching_Session_Video_Ready.mp4",
},
{
  icon: <Infinity className="h-5 w-5" strokeWidth={1.5} />,
  title: "Role-specific readiness",
  description:
    "Generic interview prep doesn't convert. Practice is tied to real job descriptions, real role families, and structured evaluation — so performance transfers to the actual interview.",
     color: "bg-emerald-500",
  image: "/Practicing_Job_Interview_On_Laptop.mp4",
},
{
  icon: <Users className="h-5 w-5" strokeWidth={1.5} />,
 title: "Employer Confidence Bridge",
description:
  "Share candidates who have already proven interview readiness. Partners receive consistent quality, move from shortlist to offer faster, and trust your pipeline enough to expand it.",
  color: "bg-fuchsia-500",
  image: "/employer_bridge.mp4",
},
          ];

          return (
            <div className="mt-12 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
              {/* Left: Accordion */}
              <div className="w-full lg:w-5/12 divide-y divide-[#003366]/10">
                {FEATURES.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className="w-full text-left py-5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-[#003366]/70 group-hover:text-[#003366] transition-colors`}>
                          {f.icon}
                        </span>
                        <span className={`text-lg font-semibold transition-colors ${
                          activeFeature === i ? "text-[#003366]" : "text-[#003366]/70 group-hover:text-[#003366]"
                        }`}>
                          {f.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-[#003366]/40 transition-transform duration-300 ${
                          activeFeature === i ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activeFeature === i ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm text-[#003366]/60 leading-relaxed pl-8">
                        {f.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: Image area with overlapping UI card */}
              <div className="w-full lg:w-7/12">
                <div className="relative min-h-[420px] lg:min-h-[480px]">
                  {/* GIF image area — sits to the right */}
                  <div className="absolute right-0 top-4 bottom-4 w-[75%] rounded-3xl overflow-hidden">
                    <video
                      src={FEATURES[activeFeature].image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-opacity duration-500"
                      key={activeFeature}
                    />
                    {/* Subtle gradient overlay for contrast with white card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
                  </div>

                  {/* White UI card — overlaps left edge */}
                  <div className={`absolute left-0 -translate-y-1/2 w-[39%] max-w-xs z-10 transition-all duration-500 ${activeFeature === 2 ? "top-[25%]" : "top-[80%]"}`}>
                    <div className="bg-white rounded-2xl shadow-2xl shadow-black/[0.08] border border-[#003366]/10 overflow-hidden">

                      {/* ── Placement Intelligence card ── */}
                      {activeFeature === 0 && (
                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                              <BarChart2 className="h-4 w-4 text-sky-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-sm font-bold text-[#003366]">Cohort Readiness</p>
                              <p className="text-[10px] text-[#003366]/40">Live snapshot · 247 learners</p>
                            </div>
                          </div>

                          {/* Readiness ring */}
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 shrink-0">
                              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="32" strokeLinecap="round" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#003366]">66%</span>
                            </div>
                            <div className="space-y-1 text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-[#003366]/70">Interview-ready</span>
                                <span className="ml-auto font-semibold text-[#003366]">163</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span className="text-[#003366]/70">Needs coaching</span>
                                <span className="ml-auto font-semibold text-[#003366]">52</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span className="text-[#003366]/70">At risk</span>
                                <span className="ml-auto font-semibold text-[#003366]">32</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          {/* Conversion rate */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-[#003366]/50 uppercase tracking-wider font-semibold">Employer conversion</p>
                              <p className="text-lg font-bold text-[#003366]">78%<span className="text-emerald-500 text-xs ml-1">↑ 12%</span></p>
                            </div>
                            <div className="flex gap-[2px] items-end h-8">
                              {[40, 55, 45, 65, 60, 72, 78].map((h, i) => (
                                <div key={i} className="w-2 rounded-t-sm bg-sky-400/70" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Generic card for other features (will be customized next) ── */}
                      {activeFeature !== 0 && (
                        <>

                      {/* ── Governed Advisory card ── */}
                      {activeFeature === 1 && (
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <Settings2 className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#003366]">Advisor Queue</p>
                              <p className="text-[9px] text-[#003366]/40">3 flagged · 2 rubrics active</p>
                            </div>
                          </div>

                          {/* Risk queue items */}
                          <div className="space-y-1">
                            {[
                              { name: "Sarah K.", flag: "Weak structure", status: "bg-rose-400" },
                              { name: "James T.", flag: "No follow-ups", status: "bg-amber-400" },
                              { name: "Priya M.", flag: "Low confidence", status: "bg-amber-400" },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#003366]/[0.03] px-2.5 py-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status} shrink-0`} />
                                <span className="text-[11px] font-semibold text-[#003366] flex-1">{item.name}</span>
                                <span className="text-[9px] text-[#003366]/50">{item.flag}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          {/* Rubric enforcement */}
                          <div className="space-y-1">
                            <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Enforced rubrics</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                                <div className="h-full w-[92%] rounded-full bg-indigo-500" />
                              </div>
                              <span className="text-[11px] font-bold text-[#003366]">92%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Role-Specific Readiness card ── */}
                      {activeFeature === 2 && (
                        <div className="p-4 space-y-2.5">
                          {/* Mini JD card */}
                          <div className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              </span>
                              <p className="text-[11px] font-bold text-emerald-800">Targeting: Data Analyst</p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {["SQL", "Dashboards", "Stakeholder Comm."].map((s) => (
                                <span key={s} className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">{s}</span>
                              ))}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="flex justify-center">
                            <svg className="w-4 h-4 text-[#003366]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                          </div>

                          {/* Generated questions */}
                          <div className="rounded-lg bg-[#003366]/[0.03] border border-[#003366]/[0.06] px-3 py-2 space-y-1.5">
                            <p className="text-[9px] text-[#003366]/40 uppercase tracking-wider font-semibold">Interview questions</p>
                            {[
                              "Walk me through how you'd structure a dashboard for…",
                              "A stakeholder disputes your data — what's your next step?",
                            ].map((q, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 text-[10px] mt-px font-bold">Q{i + 1}</span>
                                <p className="text-[10px] text-[#003366]/70 leading-tight">{q}</p>
                              </div>
                            ))}
                          </div>

                          {/* Tagline */}
                          <p className="text-center text-[9px] text-[#003366]/40 font-medium">
                            Only drills what the role demands
                          </p>
                        </div>
                      )}

                      {/* ── Employer Confidence Bridge card ── */}
                      {activeFeature === 3 && (
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                              <Users className="h-3.5 w-3.5 text-fuchsia-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#003366]">Partner Pipeline</p>
                              <p className="text-[9px] text-[#003366]/40">Verified-ready candidates shared</p>
                            </div>
                          </div>

                          {/* Employer partners */}
                          <div className="space-y-1">
                            {[
                              { partner: "TechCorp Inc.", sent: 12, converted: 9 },
                              { partner: "FinServ Group", sent: 8, converted: 7 },
                              { partner: "MedHealth Co.", sent: 6, converted: 5 },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#003366]/[0.03] px-2.5 py-1.5">
                                <div className="w-5 h-5 rounded bg-fuchsia-100 flex items-center justify-center text-[9px] font-bold text-fuchsia-600 shrink-0">
                                  {item.partner.charAt(0)}
                                </div>
                                <p className="text-[11px] font-semibold text-[#003366] flex-1 truncate">{item.partner}</p>
                                <p className="text-[11px] font-bold text-emerald-600">{item.converted}/{item.sent}</p>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Offer rate</p>
                              <p className="text-sm font-bold text-[#003366]">81%<span className="text-emerald-500 text-[10px] ml-1">↑ 24%</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Repeat partners</p>
                              <p className="text-sm font-bold text-[#003366]">94%</p>
                            </div>
                          </div>
                        </div>
                      )}

                        </>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Calculator Teaser */}
      <CalculatorTeaser />

      {/* Benefits — Security, Stats, Readiness */}
      <InstitutionBenefits />

      {/* How it works (disabled for now)
      <HowItWorksInstitutions />
      */}

      {/* Trust showcase (disabled for now)
      <section id="institutions-testimonial" className="pt-10 md:pt-12">
        <TrustShowcase />
      </section>
      */}

      <div className="-mt-8">
        <StatsConfidence />
      </div>

      {/* Comparison — side-by-side paired rows */}
      <section id="institutions-comparison" className="pt-7 md:pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#003366]/70 border-[#003366]/15 bg-white/80">
              WHY CLARIVUE MATTERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
              Move from guesswork to measurable readiness
            </h2>
            <p className="text-sm sm:text-base text-[#003366]/70 max-w-3xl mx-auto">
              Instead of hoping students are interview-ready, Clarivue gives you proof, visibility, early risk detection, and scalable support.
            </p>
          </div>

          <div ref={comparisonRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Without Clarivue ── */}
            <div className="compare-slide-left relative rounded-3xl border border-rose-200/60 bg-gradient-to-b from-rose-50/80 to-white p-6 pb-4 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-[#003366]">Without Clarivue</h3>
                <span className="w-9 h-9 rounded-full bg-rose-100 border border-rose-200/60 flex items-center justify-center">
                  <X className="h-4 w-4 text-rose-500" strokeWidth={2.5} />
                </span>
              </div>

              <div className="space-y-1">
                {comparisonRows.map((row, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 min-h-[44px]">
                    <span className="w-5 h-5 rounded-full border border-rose-300 text-rose-400 grid place-items-center shrink-0">
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-semibold text-[#003366]/90">
                      {row.without}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-rose-400/80 mt-4 font-semibold leading-relaxed">
                Gaps you find after it&apos;s too late.
              </p>
            </div>

            {/* ── With Clarivue ── */}
            <div className="compare-slide-right relative rounded-3xl border border-sky-200/60 bg-gradient-to-b from-sky-50/80 to-white p-6 pb-4 overflow-hidden shadow-lg shadow-sky-500/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-[#003366]">With Clarivue</h3>
                <span className="w-9 h-9 rounded-full bg-sky-100 border border-sky-200/60 flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-sky-600" strokeWidth={2.5} />
                </span>
              </div>

              <div className="space-y-1">
                {comparisonRows.map((row, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 min-h-[44px]">
                    <span className="w-5 h-5 rounded-full border border-emerald-400 text-emerald-500 grid place-items-center shrink-0">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-semibold text-[#003366]/90">
                      {row.with}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-sky-600/80 mt-4 font-semibold leading-relaxed">
                Proof you control before it matters.
              </p>

              {/* CTA bar */}
              <div className="mt-3 -mx-6 -mb-4 bg-gradient-to-r from-sky-100/80 to-sky-50/80 border-t border-sky-200/40 px-6 py-3 flex items-center justify-center">
                <a href="/roicalculator" className="text-sm font-semibold text-sky-700 hover:text-sky-900 transition-colors flex items-center gap-1.5">
                  See the impact <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Insights */}
      <BlogInsights />

      {/* CTA Banner */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        {/* Cloud background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#dce8f8]/50 to-white" />

        {/* Cloud blobs — layered, organic shapes */}
        <div className="absolute -left-20 top-[10%] w-[700px] h-[220px] rounded-[50%] bg-[#c5d9f0]/60 blur-[60px]" />
        <div className="absolute left-[15%] top-[30%] w-[500px] h-[180px] rounded-[50%] bg-[#b8ccf4]/50 blur-[50px]" />
        <div className="absolute right-[-5%] top-[5%] w-[600px] h-[200px] rounded-[50%] bg-[#c0d4ed]/55 blur-[55px]" />
        <div className="absolute right-[20%] top-[45%] w-[450px] h-[160px] rounded-[50%] bg-[#d0dff3]/45 blur-[45px]" />
        <div className="absolute left-[5%] bottom-[5%] w-[550px] h-[190px] rounded-[50%] bg-[#b8ccf4]/40 blur-[50px]" />
        <div className="absolute right-[-10%] bottom-[15%] w-[650px] h-[210px] rounded-[50%] bg-[#c5d9f0]/50 blur-[55px]" />
        <div className="absolute left-[40%] top-[15%] w-[400px] h-[140px] rounded-[50%] bg-[#dce8f8]/60 blur-[40px]" />
        <div className="absolute left-[25%] bottom-[20%] w-[480px] h-[170px] rounded-[50%] bg-[#dce8f8]/50 blur-[45px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#003366] leading-tight">
            Your learners' success is your reputation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#003366]/70">
            Ensure both are protected with Clarivue.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="/book-demo"
              className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-[#003366] text-white text-lg font-semibold shadow-lg shadow-[#003366]/20 transition-all duration-300 hover:bg-[#02294f] hover:shadow-xl hover:shadow-[#003366]/30 hover:-translate-y-0.5 min-w-[260px]"
            >
              Book a demo
            </a>
            <a
              href="/roicalculator"
              className="text-sm font-medium text-[#003366]/50 hover:text-[#003366]/80 transition-colors underline underline-offset-4 decoration-[#003366]/20 hover:decoration-[#003366]/40"
            >
              or estimate your ROI first →
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-[#003366]/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#003366]/40" />
              <span className="font-medium">PIPEDA &amp; GDPR ready</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#003366]/15" />
            <div className="hidden sm:flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#003366]/40" />
              <span className="font-medium">SOC 2 aligned</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#003366]/15" />
            <div className="hidden sm:flex items-center gap-2">
              <Users className="w-5 h-5 text-[#003366]/40" />
              <span className="font-medium">120K+ minutes analyzed</span>
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
