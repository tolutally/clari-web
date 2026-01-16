"use client";

import { useEffect, useRef, useState } from "react";

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
  const { count: minutesCount, ref: minutesRef } = useCountUp(120, 2000);

  return (
    <section id="institutions-stats" className="w-full text-[#003366]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur border-[#003366]/15 bg-white">
            <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
            <span className="text-sm font-semibold text-[#003366]">OUR IMPACT</span>
          </div>
        </div>

        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
           Help your grads ace interviews and land offers
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#003366]/70">
           Clarivue gives every learner meaningful practice, real feedback, 
           and measurable readiness so you can lift placement outcomes without lifting advisor workload.
          </p>
        </div>

        <div className="grid gap-5 lg:gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Stat 1 */}
          <article 
            ref={minutesRef as React.RefObject<HTMLElement>}
            className="rounded-3xl px-6 py-7 sm:px-8 sm:py-9 shadow-sm border border-[#b8ccf4]/50 flex flex-col justify-between bg-[#b8ccf4] text-[#003366]"
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-3 text-[#c7535a]">
                MOCK INTERVIEWS
              </p>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#003366]">
                {minutesCount}K+
              </p>
              <p className="mt-1 text-sm sm:text-base text-[#003366]/80">minutes analyzed</p>
            </div>
            <p className="mt-5 text-xs sm:text-sm max-w-md text-[#003366]/80">
             Students get real interview experience, structured practice, and clear guidance to improve with every attempt.
            </p>
          </article>

          {/* Stat 2 */}
          <article className="rounded-3xl bg-white px-6 py-7 sm:px-7 sm:py-8 border flex flex-col justify-between border-[#003366]/15">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-3 text-[#003366]/80">
                PLACEMENT OUTCOMES
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#003366]">35</p>
                <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#003366]">%</span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-[#003366]/70">Lift in placement outcomes within 90 days</p>
            </div>
            <p className="mt-5 text-xs sm:text-sm max-w-xs text-[#003366]/70">
               Programs using Clarivue see stronger interview performance, higher confidence, and faster hiring decisions.
            </p>
          </article>

          {/* Stat 3 */}
          <article className="rounded-3xl bg-white px-6 py-7 sm:px-7 sm:py-8 border flex flex-col justify-between border-[#003366]/15">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-3 text-[#003366]/80">
               EXTENDED VALUE
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#003366]">2–5</p>
                <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#003366]">years</span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-[#003366]/70">Alumni support window</p>
            </div>
            <p className="mt-5 text-xs sm:text-sm max-w-xs text-[#003366]/70">
              Graduates continue building interview skills and tracking progress long after they leave, without adding pressure to your advising team.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
