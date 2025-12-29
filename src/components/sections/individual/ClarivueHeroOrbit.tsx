"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type OrbitKey =
  | "roleSpecific"
  | "instantFeedback"
  | "starCoaching"
  | "followUps"
  | "confidence"
  | "weeklyProgress"
  | "jobLinkMock";

type OrbitItem = {
  key: OrbitKey;
  title: string;
  description: string;
  angleDeg: number;
  icon: React.ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 20v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconPulse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3 12h4l2-5 4 10 2-5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IconStarBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l2.2 6.7H21l-5.4 3.9 2.1 6.7L12 15.7 6.3 19.3l2.1-6.7L3 8.7h6.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7.5 22h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function IconMessages(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M21 12a7 7 0 0 1-7 7H8l-4 3v-6a7 7 0 1 1 17-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 12h8M8 9.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconBoltUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 20.5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M7 2v3M17 2v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 6.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6 4.5h12a2 2 0 0 1 2 2V19a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 19V6.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 11h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 15h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconLinkPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M10.5 13.5 12 12l-1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 15.5H8a4 4 0 1 1 0-8h1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.5 8.5H16a4 4 0 1 1 0 8h-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 12l-5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.2 14.2v3.2l2.8-1.6-2.8-1.6Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function Tooltip({
  title,
  description,
  side = "top",
  open,
}: {
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  open: boolean;
}) {
  const sideClasses =
    side === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 -translate-y-3"
      : side === "bottom"
        ? "top-full left-1/2 -translate-x-1/2 translate-y-3"
        : side === "left"
          ? "right-full top-1/2 -translate-y-1/2 -translate-x-3"
          : "left-full top-1/2 -translate-y-1/2 translate-x-3";

  const arrowSide =
    side === "top"
      ? "left-1/2 top-full -translate-x-1/2"
      : side === "bottom"
        ? "left-1/2 bottom-full -translate-x-1/2 rotate-180"
        : side === "left"
          ? "top-1/2 left-full -translate-y-1/2 -rotate-90"
          : "top-1/2 right-full -translate-y-1/2 rotate-90";

  return (
    <div
      className={cx(
        "pointer-events-none absolute z-50 w-[260px] sm:w-[300px]",
        "transition-all duration-200",
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        sideClasses,
      )}
      role="tooltip"
      aria-hidden={!open}
    >
      <div className="relative rounded-2xl bg-white shadow-[0_18px_60px_-22px_rgba(0,0,0,0.35)] ring-1 ring-black/10 p-4">
        <div className="text-[13px] font-semibold text-[#003366]">{title}</div>
        <div className="mt-1 text-[12.5px] leading-relaxed text-[#003366]/70">{description}</div>

        <div className={cx("absolute h-3 w-3 bg-white ring-1 ring-black/10", "rotate-45 rounded-[3px]", arrowSide)} />
      </div>
    </div>
  );
}

function OrbitChip({
  item,
  radius,
  active,
  onActivate,
  tooltipSide,
}: {
  item: OrbitItem;
  radius: number;
  active: boolean;
  onActivate: (key: OrbitKey | null) => void;
  tooltipSide: "top" | "right" | "bottom" | "left";
}) {
  const theta = (item.angleDeg * Math.PI) / 180;
  const x = Math.cos(theta) * radius;
  const y = Math.sin(theta) * radius;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
    >
      <div className="animate-[orbitCounterRotate_44s_linear_infinite] group-hover:[animation-play-state:paused]">
        <button
          type="button"
          onMouseEnter={() => onActivate(item.key)}
          onFocus={() => onActivate(item.key)}
          onMouseLeave={() => onActivate(null)}
          onBlur={() => onActivate(null)}
          className={cx(
            "relative pointer-events-auto",
            "h-14 w-14 sm:h-16 sm:w-16",
            "rounded-2xl bg-white",
            "shadow-[0_14px_40px_-24px_rgba(0,0,0,0.45)] ring-1",
            active ? "ring-[#ff686c]/35" : "ring-black/10",
            "transition-transform duration-200 hover:-translate-y-[2px] focus:-translate-y-[2px]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[#003366]/25",
          )}
          aria-label={item.title}
        >
          <div className={cx("absolute inset-0 rounded-2xl", active ? "bg-[#ff686c]/10" : "bg-transparent")} />
          <div className="relative mx-auto h-full w-full p-3 text-[#003366]">{item.icon}</div>

          <Tooltip title={item.title} description={item.description} side={tooltipSide} open={active} />
        </button>
      </div>
    </div>
  );
}

export function ClarivueHeroOrbit() {
  const items = useMemo<OrbitItem[]>(
    () => [
      {
        key: "jobLinkMock",
        title: "Job link → mock",
        description: "Paste a job posting link. Clarivue turns it into a realistic mock interview flow in seconds.",
        angleDeg: 80,
        icon: <IconLinkPlay className="h-full w-full" />,
      },
      {
        key: "roleSpecific",
        title: "Role-specific questions",
        description: "Practice with questions tailored to the exact role—skills, responsibilities, and common patterns.",
        angleDeg: 30,
        icon: <IconTarget className="h-full w-full" />,
      },
      {
        key: "instantFeedback",
        title: "Instant feedback",
        description: "Get clarity fast: what landed, what sounded vague, and what to tighten before your next answer.",
        angleDeg: -20,
        icon: <IconPulse className="h-full w-full" />,
      },
      {
        key: "followUps",
        title: "Follow-up prompts",
        description: "Clarivue asks smart follow-ups like a real interviewer—so you learn to go deeper without rambling.",
        angleDeg: -80,
        icon: <IconMessages className="h-full w-full" />,
      },
      {
        key: "starCoaching",
        title: "STAR coaching",
        description:
          "Turn your experience into clean STAR stories (Situation, Task, Action, Result) that hiring managers understand.",
        angleDeg: -140,
        icon: <IconStarBadge className="h-full w-full" />,
      },
      {
        key: "confidence",
        title: "Confidence boost",
        description: "Practice with structure + scoring so you stop freezing, speak with clarity, and sound more certain.",
        angleDeg: 175,
        icon: <IconBoltUp className="h-full w-full" />,
      },
      {
        key: "weeklyProgress",
        title: "Weekly progress",
        description:
          "Track improvement over time—clarity, structure, and readiness—so you know you’re actually getting better.",
        angleDeg: 140,
        icon: <IconCalendar className="h-full w-full" />,
      },
    ],
    [],
  );

  const [activeKey, setActiveKey] = useState<OrbitKey | null>(null);

  const getSide = (deg: number): "top" | "right" | "bottom" | "left" => {
    const a = ((deg % 360) + 360) % 360;
    if (a >= 315 || a < 45) return "right";
    if (a >= 45 && a < 135) return "bottom";
    if (a >= 135 && a < 225) return "left";
    return "top";
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/70 via-white/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="max-w-xl space-y-5">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#003366]">
              <span className="h-px w-8 bg-[#003366]/30" />
              CLARIVUE FOR JOB SEEKERS
            </p>
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-[#003366]">
              Ace the interview before you{" "}
              <span className="italic text-[#ff686c]">enter the room.</span>
            </h1>
            <p className="text-lg text-[#003366]/70 leading-relaxed max-w-md">
              Boost your confidence with realistic AI-powered mock interviews and land your dream job.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold bg-[#ff686c] text-white hover:bg-[#ff5c61] transition shadow-lg shadow-orange-500/20 ring-1 ring-[#ff686c]/20"
              >
                Try a free mock interview
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold bg-white text-[#003366] hover:bg-[#003366]/[0.03] transition ring-1 ring-[#003366]/10"
              >
                See what you’ll get
              </a>
            </div>
            <p className="text-xs font-semibold text-[#003366]/60 pt-1">A Volta resident company</p>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-[340px] sm:w-[420px] lg:w-[520px] group">
              <div className="absolute inset-0 animate-[orbitRotate_44s_linear_infinite] group-hover:[animation-play-state:paused]">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 520" fill="none" aria-hidden="true">
                  <circle cx="260" cy="260" r="215" stroke="rgba(0,51,102,0.20)" strokeWidth="2" />
                  <circle cx="260" cy="260" r="135" stroke="rgba(0,51,102,0.16)" strokeWidth="2" />
                  <circle
                    cx="260"
                    cy="260"
                    r="215"
                    stroke="#ff686c"
                    strokeOpacity="0.9"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="240 1300"
                    strokeDashoffset="32"
                  />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 360) / 8;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 260 + Math.cos(rad) * 150;
                    const y1 = 260 + Math.sin(rad) * 150;
                    const x2 = 260 + Math.cos(rad) * 215;
                    const y2 = 260 + Math.sin(rad) * 215;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(0,51,102,0.22)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                <div className="absolute inset-0">
                  {items.map((item) => (
                    <OrbitChip
                      key={item.key}
                      item={item}
                      radius={215}
                      active={activeKey === item.key}
                      onActivate={(key) => setActiveKey(key)}
                      tooltipSide={getSide(item.angleDeg)}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-white/80 backdrop-blur ring-1 ring-black/10 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.35)] overflow-hidden">
                  <Image
                    src="/hero-image.jpg"
                    alt="Clarivue hero"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 208px, 176px"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-[#ff686c]/10 via-transparent to-[#003366]/[0.04]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes orbitRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbitCounterRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
}
