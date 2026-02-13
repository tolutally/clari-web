"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export function StatsConfidence() {
  const [activeTab, setActiveTab] = useState(0);
  const { count: minutesCount, ref: minutesRef } = useCountUp(120, 2000);

  const tabs = [
    {
      label: "MOCK INTERVIEWS",
      stat: <><span>{minutesCount}K+</span></>,
      statSub: "minutes analyzed",
      description: "Every session scored against structured rubrics. Role-specific practice. Breakdown patterns identified early. Less guesswork. More signal.",
      accent: "#0ea5e9",
      iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      label: "PLACEMENT OUTCOMES",
      stat: <><span>35</span><span className="text-lg sm:text-xl">%</span></>,
      statSub: "higher interview conversion within 90 days",
      description: "When readiness improves, conversion follows. Fewer failed final rounds. Faster hiring decisions. Measured performance. Not workshop attendance.",
      accent: "#10b981",
      iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    },
    {
      label: "EXTENDED VALUE",
      stat: <><span>1–3</span><span className="text-lg sm:text-xl ml-1">years</span></>,
      statSub: "alumni practice window",
      description: "Graduates continue strengthening interview performance post-graduation. You protect outcomes beyond the cohort. Without expanding advising capacity.",
      accent: "#6366f1",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  const active = tabs[activeTab];

  return (
    <section id="institutions-stats" className="w-full text-[#003366]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white">
            <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
            <span className="text-sm font-semibold text-[#003366]">NUMBERS DON'T LIE</span>
          </div>
        </div>

        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
           Turn Interview prep into your competitive advantage
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#003366]/70">
           Clarivue gives you structured practice, consistent scoring, 
           and a live readiness signal — so you reduce rework, protect employer trust, and improve conversion 
           without adding advisor load.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Tab buttons */}
          <div className="flex rounded-2xl bg-[#f5f7fb] border border-[#003366]/8 p-1 gap-1">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`flex-1 rounded-xl px-3 py-3 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                  activeTab === i
                    ? "bg-white text-[#003366] shadow-md"
                    : "text-[#003366]/50 hover:text-[#003366]/70 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 transition-colors duration-300"
                    style={{ color: activeTab === i ? tab.accent : undefined }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.iconPath} />
                  </svg>
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            ref={minutesRef as React.RefObject<HTMLDivElement>}
            className="mt-4 rounded-3xl border border-[#003366]/10 bg-white p-6 sm:p-8 transition-all duration-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Left: Stat */}
              <div className="sm:w-2/5">
                <p
                  className="text-xs font-semibold tracking-[0.18em] uppercase mb-2 transition-colors duration-300"
                  style={{ color: active.accent }}
                >
                  {active.label}
                </p>
                <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#003366] flex items-baseline gap-0.5 transition-all duration-300">
                  {active.stat}
                </p>
                <p className="mt-1 text-sm text-[#003366]/60">
                  {active.statSub}
                </p>
              </div>

              {/* Right: Description */}
              <div className="sm:w-3/5 sm:border-l sm:border-[#003366]/8 sm:pl-6 flex flex-col justify-center">
                <p className="text-sm leading-relaxed text-[#003366]/70">
                  {active.description}
                </p>
                {/* Accent bar */}
                <div
                  className="mt-4 h-1 w-16 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: `${active.accent}30` }}
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/individual/beta"
              className="group inline-flex items-center gap-2 rounded-full bg-[#003366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#003366]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#003366]/30 hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
