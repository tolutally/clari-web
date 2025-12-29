"use client";

import Image from "next/image";
import { useMemo } from "react";

type Props = {
  eyebrow?: string;
  ratingText?: string;
  ratingSubtext?: string;
  headline?: string;
  description?: string;
  leftImageSrc?: string;
  rightImageSrc?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function JobSeekerCta({
  eyebrow = "WHY CLARIVUE",
  ratingText = "4.9/5 Rating",
  ratingSubtext = "Based on 1,200+ job seeker reviews",
  headline = "Accelerate your journey from applicant to hire.",
  description = "Clarivue turns practice into performance — role-specific mock interviews, instant feedback, and a clear plan to improve your weak spots before the real interview.",
  leftImageSrc = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
  rightImageSrc = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  ctaLabel = "Try a free mock interview",
  ctaHref = "#",
}: Props) {
  const avatars = useMemo(
    () => [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
    ],
    [],
  );

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white/80 px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 shadow-[0_18px_70px_-40px_rgba(0,51,102,0.2)] ring-1 ring-[#003366]/10 backdrop-blur">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 text-[12px] tracking-[0.18em] font-semibold text-[#003366]/70">
                <span className="inline-block h-[1px] w-10 bg-[#003366]/30" />
                <span>{eyebrow}</span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {avatars.map((src, i) => (
                    <div
                      key={src}
                      className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white"
                      style={{ zIndex: 10 - i }}
                    >
                      <Image src={src} alt={`Reviewer ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-semibold text-[#003366]">{ratingText}</div>
                  </div>
                  <div className="text-sm text-[#003366]/60">{ratingSubtext}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <a
                href={ctaHref}
                className="group relative h-56 sm:h-64 lg:h-[220px] w-full overflow-hidden rounded-[28px] bg-[#003366] shadow-[0_22px_70px_-45px_rgba(0,51,102,0.5)] flex items-center justify-center px-6 text-center"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#ff686c]/15 blur-2xl" />
                </div>

                <div className="relative flex flex-col items-center gap-3">
                  <span className="text-base sm:text-lg font-semibold text-white">{ctaLabel}</span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 group-hover:bg-white/20 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
                      <path d="M5 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>

                  <span className="text-xs text-white/70">No credit card • 3 minutes</span>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
            <div className="lg:col-span-6">
              <div className="relative h-56 sm:h-64 lg:h-[260px] overflow-hidden rounded-[28px] shadow-[0_22px_70px_-45px_rgba(0,51,102,0.35)]">
                <Image src={leftImageSrc} alt="Clarivue preview 1" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/10 to-transparent" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-56 sm:h-64 lg:h-[260px] overflow-hidden rounded-[28px] shadow-[0_22px_70px_-45px_rgba(0,51,102,0.35)]">
                <Image src={rightImageSrc} alt="Clarivue preview 2" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff686c]/15 to-transparent" />
              </div>
            </div>
          </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-[#003366]/60">
          <span className="inline-flex items-center rounded-full border border-[#003366]/15 bg-white/50 px-3 py-1">
            Role-specific questions
          </span>
          <span className="inline-flex items-center rounded-full border border-[#003366]/15 bg-white/50 px-3 py-1">
            Instant scoring
            </span>
            <span className="inline-flex items-center rounded-full border border-[#003366]/15 bg-white/50 px-3 py-1">
              Improvement plan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
