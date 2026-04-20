import Image from "next/image";
import { FileText, CheckCircle2, Accessibility, Sparkles } from "lucide-react";

export function SecurityCompliance() {
  return (
    <section className="w-full text-[#003366]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 px-3 py-1.5 bg-white/60 backdrop-blur-lg shadow-lg shadow-[#003366]/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-[#003366]">SECURITY &amp; COMPLIANCE</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            Built for institutions where data governance is non-negotiable.
          </h2>
          <p className="mt-3 text-base text-[#003366]/70 max-w-2xl mx-auto">
            PIPEDA and GDPR ready. SOC 2 aligned. Role-based access. Audit-ready reporting. Your data stays yours.
          </p>
        </div>

        {/* Security & Compliance Card */}
        <article className="rounded-3xl bg-white px-6 py-7 sm:px-7 sm:py-8 border flex flex-col lg:flex-row justify-between gap-8 border-[#003366]/15">
          {/* Left side — Compliance badges */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {[
                { src: "/pipeda-logo.png", alt: "PIPEDA" },
                { src: "/iso2001-logo.png", alt: "ISO 27001" },
                { src: "/ferpa.png", alt: "FERPA (US)" },
                { src: "/soc2-icon.jpg", alt: "SOC 2" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-[#b8ccf4]/30 border border-[#003366]/10 px-3 py-3"
                >
                  <div className="relative w-8 h-8">
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={32}
                      height={32}
                      loading="lazy"
                      sizes="32px"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#003366]/70 text-center">
                    {badge.alt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — Triangular feature cards */}
          <div className="flex-1 flex flex-col justify-center gap-4 lg:gap-5">
            {/* Top item — Auditable */}
            <div className="flex gap-3 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[#0ea5e9]/15 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0ea5e9]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#003366]">Auditable</p>
                <p className="text-xs text-[#003366]/65 leading-snug">Session logs are exportable. Operational logs are retained 365+ days.</p>
              </div>
            </div>

            {/* Middle item — Independently tested */}
            <div className="flex gap-3 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[#10b981]/15 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#10b981]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#003366]">Independently tested</p>
                <p className="text-xs text-[#003366]/65 leading-snug">Third-party pen test completed. All findings are closed.</p>
              </div>
            </div>

            {/* Bottom item — Accessible */}
            <div className="flex gap-3 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f59e0b]/15 flex items-center justify-center">
                <Accessibility className="w-5 h-5 text-[#f59e0b]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#003366]">Accessible</p>
                <p className="text-xs text-[#003366]/65 leading-snug">24/7 via browser or phone. Low-bandwidth friendly.</p>
              </div>
            </div>
          </div>
        </article>

        {/* Responsible AI Principles Card */}
        <article className="rounded-3xl bg-gradient-to-br from-[#f8f0ff]/70 via-[#fef2f2]/50 to-[#fff7ed]/60 border-2 border-[#8b5cf6]/20 p-8 md:p-10 shadow-sm">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#003366] tracking-tight">
                Responsible AI principles
              </h2>
            </div>
            <a
              href="/responsible-ai"
              className="inline-flex items-center gap-2 rounded-full border border-[#ff686c]/30 bg-white px-5 py-2.5 text-sm font-medium text-[#ff686c] hover:bg-[#ff686c]/5 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Clarivue AI Principles
            </a>
          </div>

          {/* 3 column grid */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {/* Column 1 */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#003366] mb-2 italic">
                Transparent by design
              </h3>
              <p className="text-sm md:text-base text-[#003366]/60 leading-relaxed">
                AI involvement is clearly communicated. Outputs support learning, not replace evaluation.
              </p>
            </div>
            {/* Column 2 */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#003366] mb-2 italic">
                Human-in-the-loop
              </h3>
              <p className="text-sm md:text-base text-[#003366]/60 leading-relaxed">
                AI supports decisions—doesn&apos;t make them alone. Educator judgment stays central.
              </p>
            </div>
            {/* Column 3 */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#003366] mb-2 italic">
                Responsible boundaries
              </h3>
              <p className="text-sm md:text-base text-[#003366]/60 leading-relaxed">
                No model training on content. No biometrics. No unapproved AI on student data.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
