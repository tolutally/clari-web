import {
  Activity,
  ArrowRight,
  BarChart2,
  Check,
  ClipboardCheck,
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
import { TrustShowcase } from "@/components/sections/trust/TrustShowcase";
import { StatsConfidence } from "@/components/sections/trust/StatsConfidence";
import ClarivueImpactCalculator from "@/components/sections/institution/ClarivueImpactCalculator";
import InstitutionPainPoints from "@/components/sections/institution/InstitutionPainPoints";
import HowItWorksInstitutions from "@/components/sections/institution/HowItWorksInstitutions";
import { useEffect, useRef, useState, FormEvent } from "react";

const comparisonRows = [
  {
    feature: "Readiness proof & outcomes",
    with: "Clear readiness metrics and outcome reports you can confidently share with employers and funders.",
    without: "Outcomes are anecdotal, inconsistent, and hard to prove beyond internal narratives.",
  },
  {
    feature: "Scoring consistency",
    with: "Institution-defined rubrics applied consistently across every mock interview and learner.",
    without: "Subjective scoring varies by advisor, cohort, and interview session.",
  },
  {
    feature: "Role-specific practice",
    with: "Practice interviews aligned to real roles, industries, and job descriptions.",
    without: "Generic questions that fail to reflect real hiring screens.",
  },
  {
    feature: "Feedback speed",
    with: "Instant, actionable feedback immediately after practice—while learning is still fresh.",
    without: "Delayed or missing feedback slows improvement and repetition of mistakes.",
  },
  {
    feature: "Early risk detection",
    with: "Readiness signals surface struggling learners early—before real interviews fail.",
    without: "Readiness gaps appear only after rejections and missed opportunities.",
  },
  {
    feature: "Coaching scalability",
    with: "AI handles repetition so advisors focus on high-impact, personalized coaching.",
    without: "Advisor time limits depth, frequency, and consistency of support.",
  },
  {
    feature: "Time-to-placement",
    with: "Better preparation leads to faster interviews, cleaner signals, and quicker offers.",
    without: "Longer cycles with repeated attempts and stalled momentum.",
  },
  {
    feature: "Evidence & artifacts",
    with: "Transcripts, scorecards, and readiness profiles stored for review and accountability.",
    without: "Feedback lives in scattered notes or disappears entirely.",
  },
  {
    feature: "Program improvement",
    with: "Cohort-level insights reveal curriculum gaps and improvement opportunities.",
    without: "Program changes rely on anecdotes instead of measurable signals.",
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
  const [advisoryAnimated, setAdvisoryAnimated] = useState(false);

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
    <div className="transition-opacity duration-500 ease-in-out opacity-100 space-y-12">
      {/* Hero */}
      <section
        id="institutions-hero"
        className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20"
      >
        <div className="hero-wash absolute inset-0 -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[540px] bg-[#f0f9ff]/70 blur-[160px] rounded-full -z-10" />
        <div className="absolute -right-16 top-24 w-72 h-72 bg-[#fff7ed]/70 rounded-full blur-3xl -z-10" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#003366]/10 shadow-sm backdrop-blur mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff686c] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff686c]" />
            </span>
            <span className="text-xs font-semibold text-[#003366] uppercase tracking-[0.12em]">
             Mock interview infrastructure for institutions
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#003366] mb-6 leading-[1.08]">
            The intelligence layer for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102c64] via-[#b8ccf4] to-[#ff686c]">
              post-grad support
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#003366]/70 max-w-3xl mx-auto mb-10 leading-relaxed">
            Clarivue helps career services, bootcamps, and workforce programs scale mock interviews,
            capture measurable results, and track readiness across cohorts without adding staff load.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#institutions-contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/80 border border-[#003366]/10 hover:bg-white text-[#003366] font-semibold py-3.5 px-8 rounded-full shadow-sm backdrop-blur transition-all"
            >
              Book an institution demo
            </a>
            <a
              href="#institutions-roi"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff686c] hover:bg-[#ff5b5f] text-white font-semibold py-3.5 px-8 rounded-full shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
            >
              See the ROI impact
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="relative max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-700 ease-out hero-pop">
            <div className="absolute -inset-1 bg-gradient-to-b from-[#003366]/15 via-transparent to-transparent rounded-[28px] blur-2xl opacity-70 hero-glow" />
            <div className="relative bg-white/90 border border-white/60 rounded-[28px] overflow-hidden shadow-2xl shadow-blue-900/10 backdrop-blur">
              <div className="h-11 bg-[#f4f7fb] border-b border-[#003366]/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ffb4b6]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffe3b3]" />
                  <span className="w-3 h-3 rounded-full bg-[#b8d2ff]" />
                </div>
                <div className="flex items-center justify-center text-[11px] text-[#003366]/60 font-semibold bg-white border border-[#003366]/10 w-1/3 max-w-[260px] h-7 rounded-full px-2 mx-auto gap-2">
                  <Lock className="w-3 h-3" />
                  app.clarivue.io
                </div>
              </div>

              <div className="p-8 bg-gradient-to-b from-[#f8fbff] via-white to-white grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/90 p-5 rounded-2xl border border-[#003366]/10 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-[#003366]/10 rounded-xl text-[#003366]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                  <div className="text-2xl font-semibold text-[#003366]">78%</div>
                  <div className="text-xs text-[#003366]/60 mt-1">Interview-ready (cohort)</div>
                </div>

                <div className="bg-white/90 p-5 rounded-2xl border border-[#003366]/10 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#003366]/70">This week</span>
                  </div>
                  <div className="text-2xl font-semibold text-[#003366]">51%</div>
                  <div className="text-xs text-[#003366]/60 mt-1">Needs coaching flagged</div>
                </div>

                <div className="bg-white/90 p-5 rounded-2xl border border-[#003366]/10 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-[#003366]/10 rounded-xl text-[#003366]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="text-2xl font-semibold text-[#003366]">1,204</div>
                  <div className="text-xs text-[#003366]/60 mt-1">Mock interviews scored</div>
                </div>

                <div className="md:col-span-3 bg-white/90 p-6 rounded-2xl border border-[#003366]/10 shadow-sm min-h-[240px] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#003366]">Readiness by rubric</h3>
                      <p className="text-xs text-[#003366]/60">Last 30 days</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
                        <span className="text-xs text-[#003366]/70">Aligned</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#003366]/30" />
                        <span className="text-xs text-[#003366]/70">Needs work</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-2 h-32 px-1.5">
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[30%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[60%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[45%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[50%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[40%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[70%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[60%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[65%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[55%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[80%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[80%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[50%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[75%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[90%] bar-rise" />
                    </div>
                    <div className="w-full bg-[#003366]/10 rounded-t-sm h-[90%] relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#c8a0fe] to-[#b8ccf4] h-[75%] bar-rise" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-[#003366]/70">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003366]/30" />
                      STAR structure
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003366]/30" />
                      Technical depth
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003366]/30" />
                      Communication
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003366]/30" />
                      Industry language
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <InstitutionPainPoints />

      <StatsConfidence />

      {/* Impact Calculator */}
      <section id="institutions-roi">
        <ClarivueImpactCalculator />
      </section>

      {/* How it works */}
      <HowItWorksInstitutions />

      {/* Complete Career Infrastructure */}
      <section
        id="institutions-features"
        className="md:px-10 md:pt-12 max-w-6xl mx-auto pt-12 px-6"
      >
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white/70">
            <Sparkles className="h-4 w-4 text-sky-700" strokeWidth={1.5} />
            <span className="text-sm text-[#003366]">WHAT&apos;S INSIDE</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366] text-center mt-6">
          The tool to supercharge your
          <span className="block">career center and post-grad support. </span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base md:text-lg font-normal text-[#003366]/70">
          Track readiness, standardize interviews, and move cohorts faster from practice to placement.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Placement Analytics */}
          <article
            id="card-realtime"
            ref={readinessCardRef}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.6] ring-1 p-5 md:p-6 ring-[#003366]/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="rounded-2xl bg-gradient-to-b to-white/[0.4] p-4 ring-1 backdrop-blur from-white/70 ring-[#003366]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-[#003366]/80">
                  <BarChart2 className="h-4 w-4 text-sky-700" strokeWidth={1.5} />
                  <span className="font-medium">Placement Analytics</span>
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] text-[#003366]/60">
                  <Activity className="h-3.5 w-3.5 text-emerald-700" strokeWidth={1.5} />
                  Live
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#003366]/70 mb-3">
                {["Cohort A", "Cohort B", "All"].map((label, idx) => (
                  <button
                    key={label}
                    className={`rounded-full px-3 py-1 ring-1 ${
                      idx === 0
                        ? "bg-[#003366]/10 text-[#003366] ring-[#003366]/20"
                        : "bg-white/70 text-[#003366]/70 ring-[#003366]/15 hover:text-[#003366]"
                    }`}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                  <div className="flex items-center justify-between text-xs text-[#003366]/60">
                    <span className="font-semibold text-[#003366]">Interview-ready</span>
                    <div className="flex items-center gap-2">
                      <span ref={readyPct} className="font-semibold text-[#003366]">
                        0%
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">+6 this week</span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full overflow-hidden bg-[#003366]/10">
                    <div
                      ref={readyBar}
                      className="h-full rounded-full bg-gradient-to-r from-sky-600 to-blue-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#003366]/60">
                    Real-time readiness by cohort and major.
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                  <div className="flex items-center justify-between text-xs text-[#003366]/60">
                    <span className="font-semibold text-[#003366]">Needs coaching</span>
                    <div className="flex items-center gap-2">
                      <span ref={coachingPct} className="font-semibold text-[#003366]">
                        0%
                      </span>
                      <span className="text-[11px] text-amber-600 font-semibold">-3 this week</span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full overflow-hidden bg-amber-200/50">
                    <div
                      ref={coachingBar}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#003366]/60">
                    Flags learners who need intervention this week.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-[#003366]/70">
                <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                  <p className="text-[11px] text-[#003366]/60">Avg wpm</p>
                  <p className="text-lg font-semibold text-[#003366]">142</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                  <p className="text-[11px] text-[#003366]/60">Offer rate</p>
                  <p className="text-lg font-semibold text-[#003366]">28%</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                  <p className="text-[11px] text-[#003366]/60">Mock count</p>
                  <p className="text-lg font-semibold text-[#003366]">1,204</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                <div className="text-xs font-semibold text-[#003366] mb-2">At-risk (ranked)</div>
                <div className="space-y-2 text-[11px] text-[#003366]/70">
                  {[
                    { initials: "ML", reason: "Low clarity", due: "Due Thu" },
                    { initials: "RS", reason: "Weak STAR", due: "Due Fri" },
                    { initials: "JK", reason: "Missed mock", due: "Due Mon" },
                  ].map((row) => (
                    <div
                      key={row.initials}
                      className="flex items-center justify-between rounded-lg bg-[#003366]/5 px-3 py-2"
                    >
                      <span className="text-[#003366] font-semibold">{row.initials}</span>
                      <span className="text-[#003366]/70">{row.reason}</span>
                      <span className="text-[#003366]/60">{row.due}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-[#003366]">
              Placement Analytics
            </h3>
            <p className="mt-1.5 text-sm text-[#003366]/70">
              Real-time tracking of student readiness for interviews. Know exactly who is interview-ready and
              who needs intervention.
            </p>
          </article>

          {/* Automate Advisory */}
          <article
            ref={advisoryCardRef}
            className="group relative overflow-hidden rounded-3xl bg-white/[0.6] ring-1 p-5 md:p-6 ring-[#003366]/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="rounded-2xl bg-gradient-to-b to-white/[0.4] p-4 ring-1 backdrop-blur from-white/70 ring-[#003366]/10">
              <div className="flex items-center justify-between text-sm text-[#003366]/80 mb-3">
                <Settings2 className="h-4 w-4 text-indigo-700" strokeWidth={1.5} />
                <div className="flex flex-col text-[11px] text-[#003366]/70 items-end">
                  <span className="font-semibold text-[#003366]">Rubric set: BA Internship v2</span>
                  <span>Last updated: 2 days ago</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Technical Depth", status: "Aligned", color: "bg-emerald-100 text-emerald-700" },
                  { name: "STAR Method", status: "Needs work", color: "bg-amber-100 text-amber-700" },
                  { name: "Industry Language", status: "Aligned", color: "bg-emerald-100 text-emerald-700" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10 space-y-2"
                    style={{
                      transform: advisoryAnimated ? "translateY(0)" : "translateY(8px)",
                      opacity: advisoryAnimated ? 1 : 0,
                      transition: "transform 350ms ease, opacity 350ms ease",
                    }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#003366]">{row.name}</span>
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${row.color}`}>
                        {row.status}
                      </span>
                      <span className="text-[11px] text-[#003366]/60">AI enforced</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#003366]/60">
                      <span>Evidence: 3 interviews flagged</span>
                      <span className="text-[#003366]/70">Rules loaded</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#003366]/70">
                      <div>
                        <div className="flex items-center justify-between">
                          <span>Before</span>
                          <span>62</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-[#003366]/10 overflow-hidden">
                          <div className="h-full w-[55%] bg-[#003366]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span>After</span>
                          <span>78</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-[#ff686c]/10 overflow-hidden">
                          <div className="h-full w-[78%] bg-[#ff686c]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-[#003366]/70"
                style={{
                  transform: advisoryAnimated ? "translateY(0)" : "translateY(8px)",
                  opacity: advisoryAnimated ? 1 : 0,
                  transition: "transform 400ms ease 100ms, opacity 400ms ease 100ms",
                }}
              >
                <div className="rounded-lg bg-[#003366]/5 px-3 py-2 ring-1 ring-[#003366]/10 text-[#003366] font-semibold">
                  Auto-generate coaching plan
                </div>
                <div className="rounded-lg bg-[#003366]/5 px-3 py-2 ring-1 ring-[#003366]/10 text-[#003366] font-semibold">
                  Auto-assign modules
                </div>
              </div>

              <div
                className="mt-3 flex items-center justify-between rounded-xl bg-[#003366]/5 px-3 py-2 ring-1 ring-[#003366]/10 text-sm text-[#003366]"
                style={{
                  transform: advisoryAnimated ? "translateY(0)" : "translateY(8px)",
                  opacity: advisoryAnimated ? 1 : 0,
                  transition: "transform 450ms ease 150ms, opacity 450ms ease 150ms",
                }}
              >
                <div>
                  <p className="font-semibold text-[#003366]">12 learners need coaching this week</p>
                  <p className="text-[11px] text-[#003366]/70">Prioritize sessions now</p>
                </div>
                <button className="rounded-full bg-[#ff686c] px-4 py-2 text-white text-xs font-semibold shadow-sm hover:bg-[#FF6347] transition">
                  Assign sessions
                </button>
              </div>
            </div>

            <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-[#003366]">
              Automate Advisory
            </h3>
            <p className="mt-1.5 text-sm text-[#003366]/70">
              Upload your target standards and objectives. AI enforces your curriculum&apos;s specific rubrics.
            </p>
          </article>

          {/* Alumni Portal */}
          <article className="group relative overflow-hidden rounded-3xl bg-white/[0.6] ring-1 p-5 md:p-6 ring-[#003366]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="rounded-2xl bg-gradient-to-b to-white/[0.4] p-4 ring-1 backdrop-blur from-white/70 ring-[#003366]/10">
                <div className="flex items-center gap-2 text-sm text-[#003366]/80 mb-4">
                  <Infinity className="h-4 w-4 text-emerald-700" strokeWidth={1.5} />
                  <span className="font-medium">Alumni Portal</span>
                </div>

              <div className="relative h-44 overflow-hidden">
                <ul
                  ref={alumniListRef}
                  className="space-y-3 will-change-transform absolute inset-0"
                  style={{ transform: "translateY(0)" }}
                >
                  {[
                    {
                      label: "0-2 years",
                      subtitle: "Career acceleration",
                      active: "Active: 184",
                      bullets: ["Mock interviews", "Resume refresh", "Referral prep"],
                    },
                    {
                      label: "2-5 years",
                      subtitle: "Switch support",
                      active: "Active: 132",
                      bullets: ["Mock interviews", "Resume refresh", "Referral prep"],
                    },
                    {
                      label: "5-10 years",
                      subtitle: "Executive track",
                      active: "Active: 94",
                      bullets: ["Mock interviews", "Resume refresh", "Referral prep"],
                    },
                  ].map((item, idx) => (
                    <li
                      key={`${item.label}-${idx}`}
                      className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#003366] font-semibold">{item.label}</p>
                          <p className="text-[11px] text-[#003366]/60">{item.subtitle}</p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] ring-1 ring-emerald-200">
                          {item.active}
                        </div>
                      </div>
                      <ul className="grid grid-cols-3 gap-2 text-[11px] text-[#003366]/70">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="rounded-lg bg-[#003366]/5 px-2 py-1 text-center ring-1 ring-[#003366]/10"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                <p className="text-sm font-semibold text-[#003366]">Lifetime access</p>
                <p className="text-[11px] text-[#003366]/60 mt-1">
                  Alumni keep mock interviews, scorecards, and recruiter-ready profiles forever.
                </p>
              </div>

              <div className="mt-3 rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                <p className="text-xs font-semibold text-[#003366] mb-2">Recent alumni wins</p>
                <div className="space-y-2 text-[11px] text-[#003366]/70">
                  {[
                    { role: "Product Manager", company: "Stripe", time: "Hired 3w ago" },
                    { role: "Data Analyst", company: "Spotify", time: "Hired 5w ago" },
                  ].map((win) => (
                    <div key={win.role} className="flex items-center justify-between rounded-lg bg-[#003366]/5 px-3 py-2">
                      <span className="text-[#003366] font-semibold">{win.role}</span>
                      <span>{win.company}</span>
                      <span className="text-[#003366]/60">{win.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white">
                <button className="rounded-xl bg-[#ff686c] px-3 py-2 font-semibold shadow-sm hover:bg-[#FF6347] transition text-left">
                  Launch alumni mock
                  <span className="block text-[11px] text-white/80">Spin up practice instantly</span>
                </button>
                <button className="rounded-xl bg-[#003366] px-3 py-2 font-semibold shadow-sm hover:bg-[#02294f] transition text-left">
                  Send check-in
                  <span className="block text-[11px] text-white/80">Keep alumni engaged</span>
                </button>
              </div>
            </div>

            <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-[#003366]">
              Alumni Portal
            </h3>
            <p className="mt-1.5 text-sm text-[#003366]/70">
              Support your graduates&apos; job search 2, 5, or 10 years post-grad. Turn career services into a
              lifetime value.
            </p>
          </article>

          {/* Hiring Partner Bridge */}
          <article className="group relative overflow-hidden rounded-3xl bg-white/[0.6] ring-1 p-5 md:p-6 ring-[#003366]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="rounded-2xl bg-gradient-to-b to-white/[0.4] p-4 ring-1 backdrop-blur from-white/70 ring-[#003366]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-[#003366]/80">
                  <Users className="h-4 w-4 text-fuchsia-700" strokeWidth={1.5} />
                  <span className="font-medium">Hiring Partner Bridge</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#003366]/5 px-3 py-1 text-[11px] text-[#003366]/70 ring-1 ring-[#003366]/10">
                  <LinkIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Share report
                </div>
              </div>

              <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10 mb-3">
                <div className="text-xs font-semibold text-[#003366] mb-2">Pipeline</div>
                <div className="grid grid-cols-4 gap-2 text-[11px] text-[#003366]/70">
                  {[
                    { label: "Shared", active: true },
                    { label: "Interviewing", active: true },
                    { label: "Offer", active: false },
                    { label: "Hired", active: false },
                  ].map((stage) => (
                    <div
                      key={stage.label}
                      className={`rounded-lg px-2 py-2 text-center ring-1 ${
                        stage.active
                          ? "bg-[#ff686c]/15 text-[#003366] ring-[#ff686c]/40"
                          : "bg-[#003366]/5 text-[#003366]/60 ring-[#003366]/15"
                      }`}
                    >
                      {stage.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10 mb-3">
                <div className="text-xs font-semibold text-[#003366] mb-2">Share pack</div>
                <div className="flex flex-wrap gap-2 text-[11px] text-[#003366]/70">
                  {["Scorecard", "Transcript highlights", "JD match"].map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-[#003366]/5 px-3 py-1 ring-1 ring-[#003366]/10"
                    >
                      {badge}
                    </span>
                  ))}
                </div>FF686C
                <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#FF6347] transition">
                  Share report
                </button>
              </div>

              <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10 mb-3">
                <p className="text-xs font-semibold text-[#003366] mb-1">Recruiter snippet</p>
                <p className="text-[11px] text-[#003366]/80">Top strengths: Communication, Problem solving</p>
                <p className="text-[11px] text-[#003366]/60 mt-1">Risks: STAR depth</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#003366]/70 mb-3">
                <div className="rounded-lg bg-[#003366]/5 px-3 py-2 ring-1 ring-[#003366]/10 text-[#003366] font-semibold">
                  Verified by institution
                </div>
                <div className="rounded-lg bg-[#003366]/5 px-3 py-2 ring-1 ring-[#003366]/10 text-[#003366] font-semibold">
                  Timestamped
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-[#003366]/10">
                <div className="flex items-center justify-between text-xs text-[#003366]/70">
                  <span className="font-semibold text-[#003366]">Avg time-to-decision: 4.2 days</span>
                  <span className="text-[#003366]/60">Report ID: CLV-4821</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#003366]/10 overflow-hidden">
                  <div
                    ref={hiringBarRef}
                    className="h-full w-0 bg-gradient-to-r from-[#ff686c] to-[#FF6347]"
                  />
                </div>
                <p className="mt-2 text-[11px] text-[#003366]/60">
                  Share recruiter-friendly scorecards to fast-track hiring decisions.
                </p>
              </div>
            </div>

            <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-[#003366]">
              Hiring Partner Bridge
            </h3>
            <p className="mt-1.5 text-sm text-[#003366]/70">
              Share verified readiness reports directly with recruiters and partner employers to fast-track
              hiring.
            </p>
          </article>
        </div>
      </section>

      {/* Trust showcase (replaces testimonial) */}
      <section id="institutions-testimonial" className="pt-10 md:pt-12">
        <TrustShowcase />
      </section>

      {/* Comparison */}
      <section id="institutions-comparison" className="pt-10 md:pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#003366]/70 border-[#003366]/15 bg-white/80">
              Compare
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
              The difference Clarivue makes
            </h2>
            <p className="text-sm sm:text-base text-[#003366]/70 max-w-3xl mx-auto">
              Instead of hoping learners are interview-ready, you get measurable readiness, scalable coaching, and proof you can show employers, funders, and leadership.
            </p>
          </div>

          <div className="mt-8 rounded-[32px] border border-[#e5e7eb] bg-white/90 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="grid grid-cols-12 text-[#003366] text-sm sm:text-base font-semibold tracking-tight">
              <div className="col-span-12 sm:col-span-4 px-4 sm:px-6 py-4 text-left">Product Comparison</div>
              <div className="col-span-6 sm:col-span-4 px-4 sm:px-6 py-4 text-center bg-[#f9fafb] border-l border-r border-[#e5e7eb]">
                With Clarivue
              </div>
              <div className="col-span-6 sm:col-span-4 px-4 sm:px-6 py-4 text-center">Without Clarivue</div>
            </div>

            <div className="divide-y divide-[#e5e7eb]">
              {comparisonRows.map((row) => (
                <div key={row.feature} className="grid grid-cols-12">
                  <div className="col-span-12 sm:col-span-4 px-4 sm:px-6 py-5 text-sm font-semibold text-[#003366] bg-white/80">
                    {row.feature}
                  </div>
                  <div className="col-span-6 sm:col-span-4 px-4 sm:px-6 py-5 bg-[#f9fafb] border-l border-[#e5e7eb] flex gap-3">
                    <span className="mt-1 h-4 w-4 rounded-full border border-emerald-400 text-emerald-500 grid place-items-center">
                      <Check className="h-3 w-3" strokeWidth={2.2} />
                    </span>
                    <p className="text-sm text-[#003366]/80 leading-relaxed">{row.with}</p>
                  </div>
                  <div className="col-span-6 sm:col-span-4 px-4 sm:px-6 py-5 flex gap-3">
                    <span className="mt-1 h-4 w-4 rounded-full border border-[#d1d5db] text-[#9ca3af] grid place-items-center">
                      <X className="h-3 w-3" strokeWidth={2.2} />
                    </span>
                    <p className="text-sm text-[#003366]/65 leading-relaxed">{row.without}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
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

      <section
        id="institutions-community"
        className="relative max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-12 pb-6 md:pb-10"
      >
        <div className="mb-8 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white">
            <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
            <span className="text-sm font-semibold text-[#003366]">COMMUNITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            Build a readiness community, not a one-off workshop.
          </h2>
          <p className="text-sm md:text-base text-[#003366]/70 leading-relaxed max-w-4xl mx-auto">
            Give learners a shared practice space where they show up, practice often, and improve with clear feedback. Give
            advisors a system that turns participation into consistent coaching.
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

        <style jsx global>{`
          @keyframes marquee-vertical {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
        `}</style>
      </section>
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
