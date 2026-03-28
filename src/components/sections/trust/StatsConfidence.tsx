"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(end: number, duration: number = 2000, externalRef?: React.RefObject<HTMLDivElement | null>) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const internalRef = useRef<HTMLDivElement | null>(null);
  const ref = externalRef ?? internalRef;

  useEffect(() => {
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
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let frame: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

const stats = [
  {
    value: "120K+",
    countKey: "minutes" as const,
    label: "minutes analyzed",
    context: "Resume reviews, mock interviews, job search check-ins, and advisor sessions — all scored, all tracked, all actionable insights.",
    accent: "#0ea5e9",
  },
  {
    value: "83%",
    countKey: "conversion" as const,
    label: "LEARNER PLACEMENT RATE",
    context: "From enrolled to employed. Tracked across the full client journey — not just the interview. Programs see the impact on their bottom line.",
    accent: "#10b981",
  },
  {
    value: "230+ hrs",
    countKey: null,
    label: "Advisor time saved",
    context: "Hours back in your team's week. Less time on admin, documentation, and repetitive prep. More time on the people who need it.",
    accent: "#6366f1",
  },
];

export function StatsConfidence() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { count: minutesCount } = useCountUp(120, 1200, sectionRef);
  const { count: conversionCount } = useCountUp(83, 1200, sectionRef);

  return (
    <section id="institutions-stats" className="w-full text-[#003366]">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/50 px-3 py-1.5 bg-white/60 backdrop-blur-lg shadow-lg shadow-[#003366]/5">
            <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
            <span className="text-sm font-semibold text-[#003366]">NUMBERS DON&apos;T LIE</span>
          </div>
        </div>
       
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            Programs are already seeing the difference.
          </h2>
           <p className="text-center text-sm sm:text-base text-[#003366]/70 max-w-lg mx-auto mb-8">
          We&apos;re early. But the numbers are real — and they&apos;re moving in the right direction.
        </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-[#003366]/10 hover:bg-white/80 hover:scale-[1.02]"
              style={{
                boxShadow: "0 8px 32px rgba(0, 51, 102, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <p
                  className="text-4xl sm:text-5xl font-semibold tracking-tight"
                  style={{ color: stat.accent }}
                >
                  {stat.countKey === "minutes"
                    ? `${minutesCount}K+`
                    : stat.countKey === "conversion"
                    ? `${conversionCount}%`
                    : stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#003366]/80 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#003366]/60">
                  {stat.context}
                </p>
                <div
                  className="mt-4 mx-auto h-1 w-12 rounded-full"
                  style={{ backgroundColor: `${stat.accent}30` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
