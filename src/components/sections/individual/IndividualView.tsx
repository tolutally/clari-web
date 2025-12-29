import Image from "next/image";
import { useEffect, useRef } from "react";
import { BookOpen, Globe2, Sparkles, UploadCloud } from "lucide-react";
import { PrepEngineSection } from "@/components/sections/individual/PrepEngineSection";
import { TestimonialsMarquee } from "@/components/sections/individual/TestimonialsMarquee";
import { UseCaseRotator } from "@/components/sections/individual/UseCaseRotator";
import { JobSeekerCta } from "@/components/sections/individual/JobSeekerCta";
import { ClarivueHeroOrbit } from "@/components/sections/individual/ClarivueHeroOrbit";
import JobSeekerFeatures from "@/components/sections/individual/JobSeekerFeatures";
import PainPointSection from "@/components/sections/individual/PainPointSection";

const faq = [
  "Does it work for tech roles?",
  "Is my resume data private?",
  "How accurate is the AI feedback?",
];

const IMPACT_STATS = [
  { label: "Minutes completed", target: 12480, suffix: "+", decimals: 0 },
  { label: "Avg score lift", target: 38, suffix: "%", decimals: 0, prefix: "+" },
  { label: "Reached offer stage", target: 78, suffix: "%", decimals: 0 }
];

export function IndividualView() {
  const impactRef = useRef<HTMLElement | null>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimatedImpact = useRef(false);

  useEffect(() => {
    const runAnimation = () => {
      if (hasAnimatedImpact.current) return;
      hasAnimatedImpact.current = true;
      statRefs.current.forEach((el, idx) => {
        const stat = IMPACT_STATS[idx];
        if (!el || !stat) return;
        const start = performance.now();
        const duration = 1000;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = stat.target * eased;
          const value =
            stat.decimals && stat.decimals > 0
              ? (Math.round(current * 10) / 10).toFixed(stat.decimals)
              : Math.round(current).toString();
          el.textContent = `${stat.prefix ?? ""}${value}${stat.suffix ?? ""}`;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    };

    // if it never intersects (already in view), run shortly after mount
    const fallback = setTimeout(runAnimation, 400);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) runAnimation();
        });
      },
      { threshold: 0.2 },
    );

    if (impactRef.current) observer.observe(impactRef.current);
    else runAnimation();

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100 space-y-10">
      {/* Hero */}
      <section id="individual-hero">
        <ClarivueHeroOrbit />
      </section>

      {/* Social Proof */}
      <section id="individual-proof">
        <p className="text-center text-sm font-medium text-[#003366]/60 mb-6">
          Join other Clarivue users who landed roles at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xl font-bold text-[#003366]">Google</span>
          <span className="text-xl font-bold text-[#003366] tracking-tighter">stripe</span>
          <span className="text-xl font-bold text-[#003366]">Revolut</span>
          <span className="text-xl font-bold text-[#003366] tracking-tight">Linear</span>
          <span className="text-xl font-bold text-[#003366]">Spotify</span>
        </div>
      </section>

      <PainPointSection />

      <section id="individual-impact" ref={impactRef} className="relative px-4 md:px-8 py-12 md:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#003366]/10 text-xs font-semibold text-[#003366] shadow-sm">
          OUR IMPACT SO FAR 
        </div>
        <div className="mt-4 space-y-3">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#003366]">
            Results job seekers can feel — fast.
          </h3>
          <p className="text-sm md:text-base text-[#003366]/70 max-w-3xl mx-auto">
            Interviews are not about luck, they're a skill - and skills can be trained. Clarivue helps you practice smarter, improve answers, and show up
            confident.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {IMPACT_STATS.map((stat, idx) => {
            const glows = [
              "from-[#b8ccf4]/45 via-white/30 to-[#ff686c]/25",
              "from-[#ffd5a1]/45 via-white/30 to-[#003366]/20",
              "from-[#c0f5e4]/45 via-white/25 to-[#003366]/15",
            ];
            const initialText =
              stat.decimals && stat.decimals > 0
                ? `${stat.prefix ?? ""}${stat.target.toFixed(stat.decimals)}${stat.suffix ?? ""}`
                : `${stat.prefix ?? ""}${stat.target.toLocaleString()}${stat.suffix ?? ""}`;
            return (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-3xl border border-white/40 ring-1 ring-white/30 bg-white/60 backdrop-blur-xl shadow-[0_25px_70px_-40px_rgba(0,0,0,0.4)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${glows[idx % glows.length]} opacity-70`} />
                <div className="absolute -inset-px rounded-3xl bg-white/30" />
                <div className="relative p-8 space-y-3">
                  <div className="w-10 h-1 rounded-full bg-[#003366]/15 mx-auto" />
                  <div
                    className="text-4xl md:text-5xl font-semibold tracking-tight text-[#003366] stat-pop"
                    ref={(el) => {
                      statRefs.current[idx] = el;
                    }}
                  >
                    {initialText}
                  </div>
                  <p className="text-sm md:text-base text-[#003366]/70">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-[#003366]/70 text-center">
          <span className="font-semibold text-[#ff686c]">+18%</span> average improvement after 2 practice sessions.
        </p>
      </section>

      <section id="individual-prep">
        <PrepEngineSection />
      </section>

      <section id="individual-how">
        <div className="relative py-12 md:py-16 px-4 md:px-8">
          <div className="relative text-center max-w-3xl mx-auto space-y-2 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#003366]/10 text-xs font-semibold text-[#003366] shadow-sm">
              <Sparkles className="w-3 h-3 text-[#ff686c]" />
              Your Interview Prep, Your Way
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#003366]">
              Start practicing in seconds
            </h3>
            <p className="text-sm md:text-base text-[#003366]/70">
              Pick a source, drop in context, and Clarivue spins up realistic practice instantly.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 space-y-6">
              {[
                { label: "Paste job description", icon: BookOpen },
                { label: "Pre-interview research (auto-extracted)", icon: Globe2 },
                { label: "Upload your resume (optional)", icon: UploadCloud },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="relative opacity-0"
                  style={{ animation: "liftFade 0.7s ease-out forwards", animationDelay: `${idx * 0.12}s` }}
                >
                  <div className="group relative flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg shadow-blue-900/10 border border-[#003366]/10 backdrop-blur overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#003366]/25">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#b8ccf4]/40 via-white/40 to-[#ff686c]/30" />
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#003366]/10 via-white to-[#ff686c]/10 shadow-inner shadow-blue-900/10">
                      <item.icon className="w-4 h-4 text-[#003366]" />
                    </div>
                    <span className="relative text-sm font-semibold text-[#003366]">{item.label}</span>
                  </div>
                  <span className="hidden md:block absolute right-[-140px] top-1/2 -translate-y-1/2 h-[2px] w-[220px] overflow-hidden pointer-events-none -z-10">
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#b8ccf4] to-[#003366] opacity-70"
                      style={{
                        animation: "flowLine 1.8s linear infinite",
                        animationDelay: `${idx * 0.18}s`,
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#ff686c] to-transparent opacity-45"
                      style={{
                        animation: "flowPulse 1.8s ease-in-out infinite",
                        animationDelay: `${idx * 0.18 + 0.2}s`,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>

            <div className="md:col-span-4 flex justify-center relative">
              <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#003366]/10 to-transparent -z-10" />
              <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-16 h-px bg-gradient-to-r from-transparent via-[#003366]/10 to-transparent -z-10" />
              <div className="hidden md:block absolute left-0 right-0 top-1/2 translate-y-16 h-px bg-gradient-to-r from-transparent via-[#003366]/10 to-transparent -z-10" />
              <span className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-10 h-[2px] w-[220px] overflow-hidden pointer-events-none -z-10">
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#003366] via-[#b8ccf4] to-transparent opacity-80"
                  style={{ animation: "flowLine 1.8s linear infinite", animationDelay: "0.15s" }}
                />
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#ff686c] to-transparent opacity-45"
                  style={{ animation: "flowPulse 1.8s ease-in-out infinite", animationDelay: "0.35s" }}
                />
              </span>

              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#003366] via-[#b8ccf4] to-[#ff686c] shadow-2xl shadow-blue-900/10 flex items-center justify-center">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-inner shadow-blue-900/5">
                  <Image
                    src="/clarivue-icon-deep.png"
                    alt="Clarivue icon"
                    width={56}
                    height={56}
                    className="h-12 w-12 md:h-14 md:w-14 object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="rounded-[24px] bg-white/95 shadow-2xl border border-[#003366]/10 overflow-hidden backdrop-blur relative">
                <span className="hidden md:block absolute left-[-140px] top-1/2 -translate-y-1/2 h-[2px] w-[220px] overflow-hidden pointer-events-none -z-10">
                  <span
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#b8ccf4] to-[#003366] opacity-75"
                    style={{ animation: "flowLine 1.8s linear infinite", animationDelay: "0.55s" }}
                  />
                  <span
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#ff686c] to-transparent opacity-45"
                    style={{ animation: "flowPulse 1.8s ease-in-out infinite", animationDelay: "0.75s" }}
                  />
                </span>

                <div className="h-11 bg-[#f4f7fb] border-b border-[#003366]/5 flex items-center px-4 gap-2 text-xs text-[#003366]/70">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-[#003366]">Leadership</span>
                  <span className="text-[#003366]/60">Behavioral interview</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#b8ccf4] text-[#003366] flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#003366]">Interview Question</p>
                      <p className="text-xs text-[#003366]/70 leading-relaxed">
                        What strategies do you use to motivate and inspire your team towards achieving common goals?
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-[#dbeafe] via-white to-[#ffe4e6] border border-[#003366]/10 overflow-hidden shadow-md">
                    <div className="h-44 bg-[url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
                    <div className="p-3 flex items-center justify-between text-xs text-[#003366]/80">
                      <span>Recording...</span>
                      <button className="flex items-center gap-1 rounded-full bg-[#ff686c] text-white px-3 py-1.5 text-[11px] shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Stop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-12 max-w-6xl mx-auto">
            <div className="absolute inset-x-6 md:inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-[#003366]/15 to-transparent pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  badge: "Try it for free",
                  title: "1. Research",
                  sub: "We analyze the company’s values, role expectations, interview style, and hiring manager details to ground practice in real-world context.",
                  body: "We analyze the company’s values, role expectations, interview style, and hiring manager details to ground practice in real-world context.",
                  from: "from-[#b8ccf4]",
                  to: "to-[#003366]",
                  cta: { label: "Get Your Pre-Interview Research for Free", href: "/interview-research"},
                },
                { badge: "", title: "2. Context", sub: "Paste the job description and upload your resume so questions and feedback match the role you’re targeting.", from: "from-[#ffd5a1]", to: "to-[#ff686c]" },
                { badge: "", title: "3. Practice", sub: "Practice with an AI interviewer in hyper-realistic, role-specific scenarios - phone screens, panel interviews, and culture-fit interviews", from: "from-[#c0f5e4]", to: "to-[#4fb0c6]" },
              ].map((step, idx) => (
                <div key={step.title} className="relative flex flex-col items-center text-center gap-4 hero-pop">
                  <div className="relative flex flex-col items-center gap-2">
                    {step.badge ? (
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#ff686c]/15 text-[#003366] text-[11px] font-bold uppercase tracking-wide border border-[#ff686c]/30">
                        {step.badge}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full opacity-0 select-none">
                        placeholder
                      </span>
                    )}
                    <div
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.from} ${step.to} ring-1 ring-[#003366]/10 shadow-lg shadow-blue-900/10 flex items-center justify-center text-xl md:text-2xl font-semibold text-[#003366]`}
                    >
                      {`0${idx + 1}`}
                    </div>
                    {idx < 2 && (
                      <span className="hidden md:block absolute right-[-70px] top-1/2 -translate-y-1/2 w-20 h-px bg-gradient-to-r from-[#ff686c]/40 via-[#003366]/25 to-transparent" />
                    )}
                  </div>
                  <h4 className="text-lg md:text-xl font-semibold text-[#003366] tracking-tight">{step.title}</h4>
                  <p className="text-sm md:text-base text-[#003366]/70 leading-relaxed max-w-xs">{step.sub}</p>
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#003366] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_30px_-18px_rgba(0,51,102,0.45)] transition hover:bg-[#00264f]"
                    >
                      {step.cta.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="individual-features">
        <JobSeekerFeatures />
      </section>

      {/* Journeys / use case rotator */}
      <section id="individual-journeys">
        <UseCaseRotator />
      </section>

      <TestimonialsMarquee />

      <JobSeekerCta />

      {/* FAQ */}
      <section id="individual-faq" className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#003366] text-center mb-8">Common Questions</h2>
        <div className="space-y-4">
          {faq.map((question) => (
            <div
              key={question}
              className="glass-panel rounded-2xl p-4 cursor-pointer hover:bg-white/70 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#003366]">{question}</span>
                <PlusIcon />
              </div>
            </div>
          ))}
        </div>
      </section>
      <style jsx global>{`
        @keyframes liftFade {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseLine {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes flowLine {
          0% {
            transform: translateX(-60%);
          }
          100% {
            transform: translateX(60%);
          }
        }
        @keyframes flowPulse {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.65;
          }
        }
      `}</style>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="w-4 h-4 text-[#003366]/40">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </div>
  );
}
