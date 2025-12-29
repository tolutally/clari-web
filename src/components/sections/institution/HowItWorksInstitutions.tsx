// Tailwind + Next.js (App Router). No external deps.
// Drop into: <HowItWorksInstitutions /> anywhere on your landing page.

import React from "react";

type Step = {
  step: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    step: "step 1",
    title: "Practice against real job descriptions",
    body: "Learners prepare using live job descriptions and realistic interview formats - phone screens, panels, 1:1, and culture fit.",
  },
  {
    step: "step 2",
    title: "Get actionable feedback instantly",
    body: "Every response comes with clear, usable tips learners can apply immediately—no waiting for advisor availability.",
  },
  {
    step: "step 3",
    title: "You stay in the loop",
    body: "Review responses, add your feedback, focus 1:1 time on learners who need it most and and confidently recommend candidates to partner employers.",
  },
];

function CornerAccents() {
  const s = "pointer-events-none absolute w-3 h-3";
  const b = "rgba(255,255,255,0.25)";
  return (
    <>
      <div className={`${s} left-1 top-1`} style={{ borderTop: `1px solid ${b}`, borderLeft: `1px solid ${b}` }} />
      <div className={`${s} right-1 top-1`} style={{ borderTop: `1px solid ${b}`, borderRight: `1px solid ${b}` }} />
      <div className={`${s} left-1 bottom-1`} style={{ borderBottom: `1px solid ${b}`, borderLeft: `1px solid ${b}` }} />
      <div className={`${s} right-1 bottom-1`} style={{ borderBottom: `1px solid ${b}`, borderRight: `1px solid ${b}` }} />
    </>
  );
}

function StepPill({ label }: { label: string }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <span className="absolute -left-2 h-8 w-px bg-gradient-to-b from-[#003366]/60 to-transparent" />
      <span
        className="px-4 py-1.5 text-sm font-semibold border text-[#003366] border-[#003366]/15 bg-white/70 backdrop-blur"
      >
        {label}
      </span>
      <span className="absolute -right-2 h-8 w-px bg-gradient-to-b from-[#003366]/60 to-transparent" />
    </div>
  );
}

export default function HowItWorksInstitutions() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold border tracking-[0.14em] border-[#003366]/15 text-[#003366] uppercase bg-white/80 backdrop-blur"
          >
            HOW IT WORKS
          </span>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            Scale your mock interviews without increasing headcount.
          </h2>

          <p className="mt-3 sm:text-lg text-[#003366]/70 max-w-4xl mx-auto leading-relaxed">
            Clarivue gives career educators one easy-to-use platform to reach more learners and support them at every level.
            We provide interview prep that meets students where they are, and makes your job easier.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative overflow-hidden border px-6 py-8 sm:p-8 border-[#003366]/10 bg-white/75 backdrop-blur shadow-[0_14px_50px_-30px_rgba(0,51,102,0.4)] rounded-2xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-28px_rgba(0,51,102,0.45)]"
            >
              <CornerAccents />

              {/* subtle glass layer + hue */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/70 via-white/40 to-white/15" />
              <div
                className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#ff686c]/10 blur-3xl pointer-events-none"
                aria-hidden
              />
              <div
                className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#003366]/10 blur-3xl pointer-events-none"
                aria-hidden
              />

              <div className="relative text-center max-w-3xl mx-auto">
                <StepPill label={s.step} />

                <h3 className="mt-6 sm:mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-[#003366]">
                  {s.title}
                </h3>

                <p className="mt-5 text-sm sm:text-base max-w-3xl mx-auto text-[#003366]/75">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

            {/* CTA (outside grid, correct alignment) */}
      <div className="flex justify-center pt-10">
        <a
          href="#institutions-contact"
          className="inline-flex items-center gap-2 rounded-full bg-[#ff686c] text-white px-8 py-4 text-lg font-semibold shadow-md hover:bg-[#ff5c61] transition-colors"
        >
          See the dashboard now
        </a>
      </div>
      </div>
    </section>
  );
}
