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
    context: "Mock interview minutes scored. Every session evaluated against structured rubrics — not gut feel.",
    accent: "#0ea5e9",
  },
  {
    value: "83%",
    countKey: "conversion" as const,
    label: "LEARNER PLACEMENT RATE",
    context: "Measured across pilot cohorts using structured readiness tracking.",
    accent: "#10b981",
  },
  {
    value: "230+ hrs",
    countKey: null,
    label: "Advisor time saved",
    context: "Saved per advisor across cohorts. AI handles the repetition. Advisors focus on the learners who need them most.",
    accent: "#6366f1",
  },
];

export function StatsConfidence() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { count: minutesCount } = useCountUp(120, 1200, sectionRef);
  const { count: conversionCount } = useCountUp(83, 1200, sectionRef);

  return (
    <section id="institutions-stats" className="w-full text-[#003366]">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white">
            <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
            <span className="text-sm font-semibold text-[#003366]">NUMBERS DON&apos;T LIE</span>
          </div>
        </div>

        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            The results career centers actually care about.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#003366]/10 bg-white p-6 text-center transition-shadow hover:shadow-lg"
            >
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
                style={{ backgroundColor: `${stat.accent}25` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
