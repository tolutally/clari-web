"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type UseCaseKey = "last-minute" | "switchers" | "new-grads";

type UseCase = {
  key: UseCaseKey;
  pill: string;
  headline: string;
  subline: string;
  bullets: string[];
  accent: "coral" | "sky" | "violet";
  topImage: { src: string; alt: string };
};

const ACCENTS = {
  coral: {
    bar: "bg-[#ff686c]",
    ring: "ring-[#ff686c]/40",
    soft: "bg-[#ff686c]/10",
    text: "text-[#9f2c37]",
    icon: "text-[#ff686c]",
    meterFrom: "from-[#ff9ca1]",
    meterTo: "to-[#ff686c]",
    chip: "bg-[#ff686c]/10 ring-[#ff686c]/30 text-[#9f2c37]",
    outline: "border-[#ff686c]/25",
  },
  sky: {
    bar: "bg-sky-500",
    ring: "ring-sky-500/35",
    soft: "bg-sky-500/10",
    text: "text-sky-900",
    icon: "text-sky-600",
    meterFrom: "from-sky-300",
    meterTo: "to-sky-500",
    chip: "bg-sky-500/10 ring-sky-500/30 text-sky-900",
    outline: "border-sky-500/20",
  },
  violet: {
    bar: "bg-violet-500",
    ring: "ring-violet-500/35",
    soft: "bg-violet-500/10",
    text: "text-violet-900",
    icon: "text-violet-600",
    meterFrom: "from-violet-300",
    meterTo: "to-violet-500",
    chip: "bg-violet-500/10 ring-violet-500/30 text-violet-900",
    outline: "border-violet-500/20",
  },
} as const;

function Icon({ variant, className }: { variant: UseCaseKey; className?: string }) {
  if (variant === "last-minute") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className ?? "w-5 h-5"} aria-hidden="true">
        <path
          d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "switchers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className ?? "w-5 h-5"} aria-hidden="true">
        <path
          d="M16 3h5v5M21 3l-6 6M8 21H3v-5M3 21l6-6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 8c3 0 4.5 0 6 1.5S11 12 14 12h7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M21 12h-3c-3 0-4.5 0-6 1.5S10 16 7 16H3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "w-5 h-5"} aria-hidden="true">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M6 10v6c0 1.2 2.7 3 6 3s6-1.8 6-3v-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M22 8v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Kebab() {
  return (
    <span className="inline-flex items-center gap-1 opacity-70">
      <span className="h-1 w-1 rounded-full bg-[#003366]/35" />
      <span className="h-1 w-1 rounded-full bg-[#003366]/35" />
      <span className="h-1 w-1 rounded-full bg-[#003366]/35" />
    </span>
  );
}

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}>
      {children}
    </span>
  );
}

function Meter({
  from,
  to,
  width,
  labelLeft,
  labelRight,
}: {
  from: string;
  to: string;
  width: string;
  labelLeft: string;
  labelRight: string;
}) {
  return (
    <div className="rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#003366]/60">{labelLeft}</span>
        <span className="font-semibold text-[#003366]">{labelRight}</span>
      </div>
      <div className="mt-2 h-2.5 rounded-full bg-[#003366]/10 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${from} ${to}`} style={{ width }} />
      </div>
    </div>
  );
}

/** UI MOCKS (minimal text, mostly UI) **/
function UseCaseUIMock({ slide }: { slide: UseCase }) {
  const a = ACCENTS[slide.accent];

  if (slide.key === "last-minute") {
    return (
      <div className="space-y-4">
        {/* Job link bar */}
        <div className="rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-9 w-9 rounded-xl grid place-items-center ${a.soft} ${a.icon}`}>
                <Icon variant="last-minute" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[#003366]">Quick Prep</div>
                <div className="text-xs text-[#003366]/55">Paste a job link → generate a mini interview</div>
              </div>
            </div>
            <Chip className={a.chip}>Live</Chip>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-10 rounded-xl border border-[#003366]/10 bg-white/80 px-3 flex items-center text-sm text-[#003366]/50">
              https://job-posting.com/role…
            </div>
            <button className={`h-10 px-4 rounded-xl text-sm font-semibold text-white ${a.bar} hover:opacity-95`}>
              Generate
            </button>
          </div>
        </div>

        {/* Timer + question stack */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5 rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[#003366]/60">Session</div>
              <Chip className={a.chip}>30:00</Chip>
            </div>
            <div className="mt-3">
              <div className="h-3 rounded-lg w-3/5 bg-[#003366]/10" />
              <div className="mt-2 h-3 rounded-lg w-4/5 bg-[#003366]/12" />
              <div className="mt-2 h-3 rounded-lg w-2/3 bg-[#003366]/10" />
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 h-10 rounded-xl border border-[#003366]/12 bg-white text-sm font-semibold text-[#003366] hover:bg-white/90">
                Start
              </button>
              <button className={`flex-1 h-10 rounded-xl ${a.soft} ${a.text} text-sm font-semibold border ${a.outline}`}>
                Review
              </button>
            </div>
          </div>

          <div className="col-span-7 rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#003366]">Role-specific questions</div>
              <span className="text-xs text-[#003366]/55">3 queued</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-[#003366]/10 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#003366]/60">Question 1</div>
                  <Chip className={a.chip}>Behavioral</Chip>
                </div>
                <div className="mt-2 h-3 w-5/6 rounded-lg bg-[#003366]/12" />
                <div className="mt-2 h-3 w-4/6 rounded-lg bg-[#003366]/10" />
              </div>

              <div className="rounded-xl border border-[#003366]/10 bg-white p-3 opacity-90">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#003366]/60">Question 2</div>
                  <Chip className="bg-[#003366]/6 ring-[#003366]/15 text-[#003366]/80">Technical</Chip>
                </div>
                <div className="mt-2 h-3 w-4/5 rounded-lg bg-[#003366]/12" />
                <div className="mt-2 h-3 w-3/5 rounded-lg bg-[#003366]/10" />
              </div>
            </div>
          </div>
        </div>

        <Meter
          from={a.meterFrom}
          to={a.meterTo}
          width="78%"
          labelLeft="Readiness"
          labelRight="Quick boost"
        />
      </div>
    );
  }

  if (slide.key === "switchers") {
    return (
      <div className="space-y-4">
        {/* Translator header */}
        <div className="rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-9 w-9 rounded-xl grid place-items-center ${a.soft} ${a.icon}`}>
                <Icon variant="switchers" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[#003366]">Skill Translator</div>
                <div className="text-xs text-[#003366]/55">Your past experience → their job language</div>
              </div>
            </div>
            <Chip className={a.chip}>Mapped</Chip>
          </div>
        </div>

        {/* Mapping table */}
        <div className="rounded-2xl border border-[#003366]/10 bg-white/70 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#003366]/10 flex items-center justify-between">
            <div className="text-sm font-semibold text-[#003366]">Transferable mapping</div>
            <Kebab />
          </div>

          <div className="p-4 grid grid-cols-12 gap-3">
            <div className="col-span-6 rounded-xl border border-[#003366]/10 bg-white p-3">
              <div className="text-xs text-[#003366]/60">Past work</div>
              <div className="mt-2 space-y-2">
                <div className="h-3 w-4/5 rounded-lg bg-[#003366]/12" />
                <div className="h-3 w-3/5 rounded-lg bg-[#003366]/10" />
                <div className="h-3 w-5/6 rounded-lg bg-[#003366]/12" />
              </div>
            </div>

            <div className="col-span-6 rounded-xl border border-[#003366]/10 bg-white p-3">
              <div className="text-xs text-[#003366]/60">Target role</div>
              <div className="mt-2 space-y-2">
                <div className="h-3 w-5/6 rounded-lg bg-[#003366]/12" />
                <div className="h-3 w-4/6 rounded-lg bg-[#003366]/10" />
                <div className="h-3 w-3/5 rounded-lg bg-[#003366]/12" />
              </div>
            </div>

            {/* weak STAR highlight */}
            <div className={`col-span-12 rounded-xl border ${a.outline} ${a.soft} p-3`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#003366]">Weak STAR story detected</div>
                <Chip className={a.chip}>Rewrite</Chip>
              </div>
              <div className="mt-2 grid grid-cols-12 gap-2">
                <div className="col-span-3 h-8 rounded-lg bg-white/70 border border-[#003366]/10" />
                <div className="col-span-3 h-8 rounded-lg bg-white/70 border border-[#003366]/10" />
                <div className="col-span-3 h-8 rounded-lg bg-white/70 border border-[#003366]/10" />
                <div className="col-span-3 h-8 rounded-lg bg-white/70 border border-[#003366]/10" />
              </div>
            </div>
          </div>
        </div>

        <Meter
          from={a.meterFrom}
          to={a.meterTo}
          width="64%"
          labelLeft="Readiness"
          labelRight="Role fit"
        />
      </div>
    );
  }

  // new-grads
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-9 w-9 rounded-xl grid place-items-center ${a.soft} ${a.icon}`}>
              <Icon variant="new-grads" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-[#003366]">Guided Practice</div>
              <div className="text-xs text-[#003366]/55">Prompts + follow-ups so you don’t freeze</div>
            </div>
          </div>
          <Chip className={a.chip}>Week 2</Chip>
        </div>
      </div>

      {/* Script cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#003366]">Your scripts</div>
            <span className="text-xs text-[#003366]/55">3 saved</span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-[#003366]/10 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#003366]/60">Tell me about yourself</div>
                <Chip className={a.chip}>Ready</Chip>
              </div>
              <div className="mt-2 h-3 w-5/6 rounded-lg bg-[#003366]/12" />
              <div className="mt-2 h-3 w-4/6 rounded-lg bg-[#003366]/10" />
            </div>

            <div className="rounded-xl border border-[#003366]/10 bg-white p-3 opacity-90">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#003366]/60">Why this role?</div>
                <Chip className="bg-[#003366]/6 ring-[#003366]/15 text-[#003366]/80">Draft</Chip>
              </div>
              <div className="mt-2 h-3 w-4/5 rounded-lg bg-[#003366]/12" />
              <div className="mt-2 h-3 w-3/5 rounded-lg bg-[#003366]/10" />
            </div>
          </div>
        </div>

        <div className="col-span-5 rounded-2xl border border-[#003366]/10 bg-white/70 p-4">
          <div className="text-sm font-semibold text-[#003366]">Streak</div>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`h-6 rounded-md border border-[#003366]/10 ${
                  i % 3 === 0 ? a.soft : "bg-white"
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-[#003366]/60">This week</div>
            <Chip className={a.chip}>+2 sessions</Chip>
          </div>
        </div>
      </div>

      <Meter
        from={a.meterFrom}
        to={a.meterTo}
        width="72%"
        labelLeft="Readiness"
        labelRight="Confidence"
      />
    </div>
  );
}

export function UseCaseRotator() {
  const slides: UseCase[] = useMemo(
    () => [
      {
        key: "last-minute",
        pill: "Last-Minute Prep",
        headline: "Walk into the interview calmer—fast.",
        subline: "Paste a job link and run a quick, role-specific mock session.",
        bullets: ["Get interview-ready fast with focused practice and clear feedback - right before it counts."],
        accent: "coral",
        topImage: {
          src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
          alt: "Job seeker practicing on a laptop",
        },
      },
      {
        key: "switchers",
        pill: "Career Switchers",
        headline: "Make your past experience sound like their job.",
        subline: "Instead of bouncing between YouTube videos and outdated advice, you get one training platform with everything: expert coaching, real-world practice, and feedback that actually helps you improve",
        bullets: ["Translate your experience and tell a strong story—no matter your background."],
        accent: "sky",
        topImage: {
          src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
          alt: "Career switcher planning next steps",
        },
      },
      {
        key: "new-grads",
        pill: "New Grads",
        headline: "Stop freezing. Start answering with structure.",
        subline: "Guided scripts, prompts, and weekly practice to build confidence.",
        bullets: ["Build confidence from scratch and learn how to talk about your skills - clearly and convincingly."],
        accent: "violet",
        topImage: {
          src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
          alt: "New grad preparing for interviews",
        },
      },
    ],
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrentIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const current = slides[currentIndex];
  const a = ACCENTS[current.accent];

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      data-component="clarivue-usecase-rotator"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(0,51,102,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,51,102,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#003366]/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#003366] shadow-sm">
          WHO IS IT FOR?
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
          Built to support every kind of job seeker
        </h2>
        <p className="text-base sm:text-lg text-[#003366]/70 max-w-2xl mx-auto">
          Clarivue translates what you’ve done into the language the role expects in one session.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* TEXT LEFT (short) */}
        <div className="order-2 lg:order-1">
          <p className="mt-1 text-sm sm:text-base text-[#003366]/70 max-w-xl">{current.subline}</p>

          <div className="mt-6 space-y-4" role="tablist" aria-label="Clarivue use cases">
            {slides.map((s, idx) => {
              const active = idx === currentIndex;
              const ax = ACCENTS[s.accent];
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className="group w-full flex items-start gap-4 text-left"
                  role="tab"
                  aria-selected={active}
                >
                  <span className={`mt-1.5 h-6 w-1 rounded-full transition-colors ${active ? ax.bar : "bg-[#003366]/15"}`} />
                  <div className="min-w-0">
                    <div className={`text-sm sm:text-base font-semibold ${active ? "text-[#003366]" : "text-[#003366]/60 group-hover:text-[#003366]"}`}>
                      {s.pill}
                    </div>
                    <div className={`mt-1 text-sm text-[#003366]/70 ${active ? "opacity-100" : "opacity-70"}`}>
                      {s.bullets.join(" • ")}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white bg-[#ff686c] hover:bg-[#ff5b5f] transition-colors shadow-lg shadow-[#ff686c]/20"
            >
              See it in action
            </a>
          </div>
        </div>

        {/* UI RIGHT (big, visual) */}
        <div className="order-1 lg:order-2">
          <div className="relative rounded-[22px] border border-[#003366]/12 bg-white/85 shadow-[0_26px_90px_-28px_rgba(0,51,102,0.55)] ring-1 ring-black/[0.03] overflow-hidden">
            {/* image */}
            <div className="relative h-32 sm:h-36 md:h-40">
              <Image
                src={current.topImage.src}
                alt={current.topImage.alt}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
              <div className="absolute left-4 bottom-4 flex items-center gap-2">
                <Chip className="bg-white/80 ring-white/60 text-[#003366]">Who it’s for</Chip>
                <Chip className={a.chip}>{current.pill}</Chip>
              </div>
            </div>

            {/* fake app header */}
            <div className="flex items-center gap-2 px-4 h-12 border-t border-[#003366]/10 border-b border-[#003366]/10 bg-white/70">
              <span className="inline-flex items-center gap-2 text-sm text-[#003366]/80">
                <span className="h-2 w-2 rounded-full bg-[#ff686c]" />
                <span className="font-semibold text-[#003366]">Clarivue</span>
                <span className="opacity-50">›</span>
                <span className="truncate">{current.pill}</span>
              </span>
              <span className="ml-auto">
                <Kebab />
              </span>
            </div>

            {/* BODY: UI MOCK */}
            <div className="p-5 md:p-6">
              <UseCaseUIMock slide={current} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
