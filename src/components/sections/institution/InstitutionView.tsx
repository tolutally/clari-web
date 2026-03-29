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
  Rocket,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { TrustShowcase } from "@/components/sections/trust/TrustShowcase";
import { StatsConfidence } from "@/components/sections/trust/StatsConfidence";
import { CalculatorTeaser } from "@/components/sections/institution/CalculatorTeaser";
import { InstitutionBenefits } from "@/components/sections/institution/InstitutionBenefits";
import { SecurityCompliance } from "@/components/sections/institution/SecurityCompliance";
import ClarivueImpactCalculator from "@/components/sections/institution/ClarivueImpactCalculator";
import InstitutionPainPoints from "@/components/sections/institution/InstitutionPainPoints";
import { BlogInsights } from "@/components/sections/institution/BlogInsights";
// import HowItWorksInstitutions from "@/components/sections/institution/HowItWorksInstitutions";
import { useEffect, useRef, useState, FormEvent } from "react";

const comparisonRows = [
  {
    feature: "Outcome timing",
    with: "Gaps flagged early",
    without: "Problems show up after the outcome",
  },
  {
    feature: "Support quality",
    with: "Consistent evaluation every time",
    without: "Support depends on the advisor",
  },
  {
    feature: "Submission quality",
    with: "Issues caught before submission",
    without: "Resumes go out with mistakes",
  },
  {
    feature: "Momentum",
    with: "Continuous check-ins",
    without: "Progress stalls between sessions",
  },
  {
    feature: "Visibility",
    with: "Live visibility across the caseload",
    without: "No clear view of who needs help",
  },
  {
    feature: "Reporting",
    with: "Data already available",
    without: "Scrambling when asked for results",
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
        className="relative bg-[#f8fafe] min-h-[85vh] overflow-hidden flex items-center justify-center py-24 px-6 sm:px-12 lg:px-24"
      >
        {/* Background Grid Layer */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #e2e8f080 1px, transparent 1px), linear-gradient(to bottom, #e2e8f080 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }} 
        />

        {/* Decorative Floating Elements */}
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-rose-200/40 blur-[100px] animate-float pointer-events-none z-0" />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-[120px] animate-float-delayed pointer-events-none z-0" />

        {/* Main Content */}
        <div className="relative z-10 max-w-[1000px] mx-auto w-full flex flex-col items-start">
          
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-slate-100/80">
            <div className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-100">
              <div className="absolute h-full w-full animate-ping rounded-full bg-rose-300 opacity-60" />
              <div className="relative h-1.5 w-1.5 rounded-full bg-rose-500" />
            </div>
            <span className="text-xs font-medium tracking-[0.08em] uppercase text-[#042b53]">
              For training & workforce programs
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 mt-10 text-5xl sm:text-6xl md:text-[5.5rem] leading-[1.05] font-semibold tracking-tight text-[#042b53] max-w-4xl">
            Move more people from training into jobs
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up delay-200 mt-8 text-lg sm:text-xl md:text-2xl text-slate-500 max-w-3xl leading-relaxed font-normal">
            More placements. Less admin. Proof that funders believe. From enrollment to employment, covered.
          </p>

          {/* Buttons */}
          <div className="animate-fade-in-up delay-300 mt-12 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <a
              href="https://app.clarivue.io/register"
              className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base md:text-lg font-medium text-[#042b53] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] border border-slate-100 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              Start for free
            </a>
            <a
              href="/book-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ff5a5f] px-8 py-4 text-base md:text-lg font-medium text-white hover:bg-[#fa4b50] shadow-[0_4px_14px_0_rgba(255,90,95,0.3)] hover:shadow-[0_8px_24px_0_rgba(255,90,95,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Speak to us
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>
          </div>

          {/* Footer Note */}
          <div className="animate-fade-in-up delay-400 mt-8 flex items-start sm:items-center gap-2.5 text-sm md:text-base text-slate-400 font-normal">
            <Gift className="w-5 h-5 text-[#ff5a5f] shrink-0 mt-0.5 sm:mt-0" />
            <p>30 minutes free. Test with a few learners and see the gaps. No credit card.</p>
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

      {/* Partner Brand Strip */}
      <div className="pt-6 pb-6">
        <p className="text-[22px] font-bold uppercase tracking-[0.25em] text-[#003366]/55 text-center mb-6">
          Selected by Canada's leading innovation ecosystem
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

      {/* Pain Points / Use Cases */}
      <InstitutionPainPoints />

      {/* Last Mile Statement */}
      <section className="w-full bg-[#003366] py-12 md:py-16 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#ff686c] rounded-full blur-[140px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md mb-5 border border-white/10">
            <Rocket className="w-5 h-5 text-[#ff686c]" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4 max-w-2xl">
            The gap between training and employment is where programs lose people.
          </h2>

          <p className="text-slate-300 text-base md:text-lg max-w-xl mb-6 font-normal leading-relaxed">
            Not because of skills. Because of resumes that don&apos;t land, interviews no one prepared them for, momentum that dies between meetings, and systems held together by spreadsheets and memory. Clarivue closes that gap.
          </p>

          <Link
            href="/book-demo"
            className="inline-flex items-center gap-2 bg-[#ff686c] hover:bg-[#e55d61] text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-xl text-sm"
          >
            <span>See how it works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features + Feature Details (bundled, no gaps) */}
      <section
        id="institutions-features"
        className="md:px-10 max-w-6xl mx-auto px-6"
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
         One platform covers
          <span className="block">the gap between trained and hired.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base md:text-lg font-normal text-[#003366]/70">
          Every step from resume to job offer — tracked, managed, and nothing falling through the cracks.
        </p>

        {(() => {
          const FEATURES = [
    {
  icon: <Users className="h-5 w-5" strokeWidth={1.5} />,
  title: "AI Resume Fixer",
  description:
    "Send job-ready resumes, not almost-ready ones. One missing keyword. One formatting mistake. That's all it takes for ATS to reject someone your program spent months training. Fix it before it goes out.",
  color: "bg-fuchsia-500",
  image: "/employer_bridge.mp4",
},
{
  icon: <Infinity className="h-5 w-5" strokeWidth={1.5} />,
  title: "Mock Interview Engine",
  description:
    "Your learners only get one shot at a first impression. Every unprepared interview costs you a placement and an employer's trust. Practice them on the real job, score them honestly, and know who's ready before the employer finds out who isn't.",
  color: "bg-emerald-500",
  image: "/Practicing_Job_Interview_On_Laptop.mp4",
},
{
  icon: <Settings2 className="h-5 w-5" strokeWidth={1.5} />,
  title: "Voice Check-In",
  description:
    "Stop losing people between meetings. Clients drop off when nobody checks in. Momentum dies in the gap between appointments. Programs that stay connected between sessions keep people moving.",
  color: "bg-indigo-500",
  image: "/check-in-clarivue.mp4",
},
{
  icon: <BarChart2 className="h-5 w-5" strokeWidth={1.5} />,
  title: "Case Autopilot",
  description:
    "Know who's falling behind before they disappear. Spreadsheets don't flag at-risk clients. Memory doesn't scale. Track every client's progress automatically and intervene early instead of finding out late.",
  color: "bg-sky-500",
  image: "/Career_Readiness_Dashboard_Video.mp4",
},
{
  icon: <ClipboardCheck className="h-5 w-5" strokeWidth={1.5} />,
  title: "AI Notes Capture",
  description:
    "Stop choosing between helping people and documenting it. Every hour spent on case notes is an hour not spent on clients. Capture insights and log it automatically to give advisors their evenings back and give funders better data.",
  color: "bg-amber-500",
  image: "/ai-capture.mp4",
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
                  <div className={`absolute left-0 -translate-y-1/2 w-[39%] max-w-xs z-10 transition-all duration-500 ${activeFeature === 1 ? "top-[25%]" : "top-[80%]"}`}>
                    <div className="bg-white rounded-2xl shadow-2xl shadow-black/[0.08] border border-[#003366]/10 overflow-hidden">

                      {/* ── AI Resume Fixer card ── */}
                      {activeFeature === 0 && (
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                              <Users className="h-3.5 w-3.5 text-fuchsia-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#003366]">ATS Optimization</p>
                              <p className="text-[9px] text-[#003366]/40">Real-time keyword analysis</p>
                            </div>
                          </div>

                          {/* Before/After comparison */}
                          <div className="space-y-1.5">
                            <div className="rounded-lg bg-rose-50 border border-rose-200/60 px-2.5 py-1.5">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-semibold text-rose-600 uppercase">Before</span>
                                <span className="text-[9px] text-rose-500">3 keywords missing</span>
                              </div>
                              <div className="flex gap-1">
                                {["SQL", "Agile", "Tableau"].map((kw) => (
                                  <span key={kw} className="rounded bg-rose-100 px-1.5 py-0.5 text-[8px] font-medium text-rose-600 line-through">{kw}</span>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-semibold text-emerald-600 uppercase">After</span>
                                <span className="text-[9px] text-emerald-500">ATS Ready ✓</span>
                              </div>
                              <div className="flex gap-1">
                                {["SQL", "Agile", "Tableau"].map((kw) => (
                                  <span key={kw} className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-medium text-emerald-700">{kw}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Pass rate</p>
                              <p className="text-sm font-bold text-[#003366]">94%<span className="text-emerald-500 text-[10px] ml-1">↑ 47%</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Avg fix time</p>
                              <p className="text-sm font-bold text-[#003366]">2 min</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Other feature cards ── */}
                      {activeFeature !== 0 && (
                        <>

                      {/* ── Mock Interview Engine / Role-Specific Readiness card ── */}
                      {activeFeature === 1 && (
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

                      {/* ── Voice Check-In card ── */}
                      {activeFeature === 2 && (
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <Settings2 className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#003366]">Engagement Pulse</p>
                              <p className="text-[9px] text-[#003366]/40">Auto check-ins · Silent alerts</p>
                            </div>
                          </div>

                          {/* Silent client alerts */}
                          <div className="space-y-1">
                            {[
                              { name: "Marcus T.", days: "7 days silent", status: "bg-rose-400", action: "Check-in sent" },
                              { name: "Aisha R.", days: "5 days silent", status: "bg-amber-400", action: "Scheduled" },
                              { name: "David L.", days: "Responded ✓", status: "bg-emerald-400", action: "Recovered" },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#003366]/[0.03] px-2.5 py-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status} shrink-0`} />
                                <span className="text-[11px] font-semibold text-[#003366] flex-1">{item.name}</span>
                                <span className="text-[9px] text-[#003366]/50">{item.days}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Recovery rate</p>
                              <p className="text-sm font-bold text-[#003366]">78%<span className="text-emerald-500 text-[10px] ml-1">↑ 31%</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Avg response</p>
                              <p className="text-sm font-bold text-[#003366]">1.2 days</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Case Autopilot card ── */}
                      {activeFeature === 3 && (
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
                              <BarChart2 className="h-3.5 w-3.5 text-sky-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#003366]">Caseload Monitor</p>
                              <p className="text-[9px] text-[#003366]/40">Auto-tracked · Zero filing</p>
                            </div>
                          </div>

                          {/* Case status list */}
                          <div className="space-y-1">
                            {[
                              { client: "Case #247", status: "Auto-logged", icon: "✓", color: "text-emerald-500" },
                              { client: "Case #198", status: "Risk flagged", icon: "!", color: "text-amber-500" },
                              { client: "Case #312", status: "Follow-up set", icon: "→", color: "text-sky-500" },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 rounded-lg bg-[#003366]/[0.03] px-2.5 py-1.5">
                                <span className={`text-[10px] font-bold ${item.color} shrink-0`}>{item.icon}</span>
                                <span className="text-[11px] font-semibold text-[#003366] flex-1">{item.client}</span>
                                <span className="text-[9px] text-[#003366]/50">{item.status}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Filing backlog</p>
                              <p className="text-sm font-bold text-emerald-600">0 days<span className="text-[#003366]/40 text-[10px] ml-1">was 3 wks</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Time saved</p>
                              <p className="text-sm font-bold text-[#003366]">6 hrs<span className="text-sky-500 text-[10px] ml-1">/week</span></p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── AI Notes Capture card ── */}
                      {activeFeature === 4 && (
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                              <ClipboardCheck className="h-3.5 w-3.5 text-amber-600" strokeWidth={2} />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#003366]">Session Intelligence</p>
                              <p className="text-[9px] text-[#003366]/40">Auto-captured · Searchable</p>
                            </div>
                          </div>

                          {/* Live capture preview */}
                          <div className="rounded-lg bg-amber-50 border border-amber-200/60 px-3 py-2 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <p className="text-[9px] font-semibold text-amber-700 uppercase tracking-wider">Live capture</p>
                            </div>
                            <p className="text-[10px] text-[#003366]/70 leading-snug italic">&ldquo;Discussed anxiety around panel interviews...&rdquo;</p>
                          </div>

                          {/* Auto-generated notes */}
                          <div className="space-y-1">
                            <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Auto-generated notes</p>
                            {[
                              "Panel interview anxiety identified",
                              "Completed 2 STAR practice scenarios",
                              "Follow-up: Mock panel scheduled",
                            ].map((note, i) => (
                              <div key={i} className="flex items-start gap-1.5 rounded-lg bg-[#003366]/[0.03] px-2.5 py-1.5">
                                <svg className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-[10px] text-[#003366]/70">{note}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-[#003366]/[0.06]" />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Filing time saved</p>
                              <p className="text-sm font-bold text-[#003366]">4.2 hrs<span className="text-amber-500 text-[10px] ml-1">/week</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-[#003366]/50 uppercase tracking-wider font-semibold">Compliance ready</p>
                              <p className="text-sm font-bold text-emerald-600">100%</p>
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

      {/* Benefits — Security, Stats, Readiness */}
      <InstitutionBenefits />

      {/* Stats */}
      <StatsConfidence />

      {/* Security & Compliance + Responsible AI */}
      <SecurityCompliance />

      {/* Placement Cost Calculator */}
      <CalculatorTeaser />

      {/* Blog Insights */}
      <BlogInsights />

      {/* Comparison — side-by-side paired rows */}
      <section id="institutions-comparison" className="pt-7 md:pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#003366]/70 border-[#003366]/15 bg-white/80">
              WHY CLARIVUE MATTERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
              Training is not the problem. What happens after is.
            </h2>
            <p className="text-sm sm:text-base text-[#003366]/70 max-w-3xl mx-auto">
              Clarivue covers the gap between training and employment.
            </p>
          </div>

          <div ref={comparisonRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Without Clarivue ── */}
            <div className="compare-slide-left relative rounded-3xl border border-rose-200/60 bg-gradient-to-b from-rose-50/80 to-white p-6 pb-4 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-[#003366]">What most programs deal with</h3>
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
                <h3 className="text-2xl font-bold text-[#003366]">What changes with Clarivue</h3>
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
                <a href="/placement-cost-calculator" className="text-sm font-semibold text-sky-700 hover:text-sky-900 transition-colors flex items-center gap-1.5">
                  See the impact <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative w-full bg-[#003366] py-14 md:py-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#ff686c] rounded-full blur-[140px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            More placements. Less admin. Reports that attract funding.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            See what Clarivue can do for your program.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="/book-demo"
              className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-[#ff686c] text-white text-lg font-semibold shadow-lg shadow-[#ff686c]/30 transition-all duration-300 hover:bg-[#e55d61] hover:shadow-xl hover:-translate-y-0.5 min-w-[260px]"
            >
              Talk to us
            </a>
            <a
              href="/placement-cost-calculator"
              className="text-xl font-semibold text-white/60 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/50"
            >
              or run your numbers →
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white/50" />
              <span className="font-medium">PIPEDA &amp; GDPR ready</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="hidden sm:flex items-center gap-2">
              <Lock className="w-5 h-5 text-white/50" />
              <span className="font-medium">SOC 2 aligned</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="hidden sm:flex items-center gap-2">
              <Users className="w-5 h-5 text-white/50" />
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
