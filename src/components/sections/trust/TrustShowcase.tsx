import {
  Quote,
  BarChart3,
  Building2,
  ShieldCheck,
  ClipboardCheck,
  Database,
  TrendingUp,
  Target,
  Users,
  Bookmark,
  Lock,
} from "lucide-react";
import Image from "next/image";

const complianceBadges: Array<{ label: string; src: string }> = [
  { label: "GDPR", src: "/gdpr-icon.svg" },
  { label: "ISO 27001", src: "/iso2001-logo.png" },
  { label: "PIPEDA", src: "/pipeda-logo.png" },
  { label: "SOC 2", src: "/soc2-icon.jpg" },
];

export function TrustShowcase() {
  return (
    <section className="max-w-7xl mx-auto bg-transparent px-3 sm:px-6 md:px-0 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white/80 backdrop-blur border-[#003366]/15 shadow-[0_1px_0_rgba(255,255,255,0.7)]">
          <span className="w-2 h-2 rounded-full bg-[#ff686c]" />
          <span className="text-[13px] font-semibold text-[#003366]">
            WHY US?
          </span>
        </div>

        <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#003366]">
          Built for the people behind career readiness
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#003366]/70 max-w-3xl mx-auto leading-relaxed">
          Standardize interview prep across cohorts, verify readiness with evidence, and
          support every learner with measurable outcomes—without adding staff load.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-5 sm:gap-6">
        {/* Left: Testimonial */}
        <div className="relative rounded-3xl border border-[#003366]/10 bg-white/70 backdrop-blur shadow-[0_20px_70px_-30px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col min-h-[260px] sm:min-h-[300px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/testimonial-mode.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/20" />

          <div className="relative flex flex-col h-full p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <Quote className="h-4 w-4 text-[#ff9c8c]" />
              Testimonial
            </div>

            <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white">
              Interview readiness institutions can defend
            </h3>

            <div className="mt-auto pt-5 border-t border-white/15 space-y-2">
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                “Clarivue has been instrumental. It allows our career office to deliver more sessions and truly prepares
                them for real life opportunities.”
              </p>
              <div className="text-xs text-white/70 leading-snug">
                <div className="font-semibold text-white">Director of Career Services</div>
                <div>Public University</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Security / compliance */}
          <div className="relative rounded-[24px] p-5 sm:p-6 bg-[#e8eaf3] text-[#0f172a] overflow-hidden shadow-[0_30px_90px_-45px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/25 to-transparent rounded-[24px]" />
            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/50" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#003366]/70" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#003366]/60">
                  Security & compliance
                </span>
              </div>

              <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-[#003366]">
                Built for privacy-first institutions.
              </h3>

              <p className="mt-2 text-sm sm:text-base text-[#334155] leading-relaxed">
               Clarivue supports PIPEDA and GDPR requirements, follows SOC 2–aligned security controls, and provides audit-ready reporting, role-based access, and institution-owned data governance.
              </p>

              <div className="mt-4 grid grid-cols-4 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center w-full">
                {complianceBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/85 ring-1 ring-[#cbd5e1] shadow-[0_10px_35px_-18px_rgba(0,0,0,0.35)] text-[10px] sm:text-xs font-semibold text-[#111827]"
                  >
                    <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                      <Image src={badge.src} alt={badge.label} fill className="object-contain" sizes="48px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stats */}
            <div className="rounded-2xl border border-[#003366]/15 bg-white/70 backdrop-blur p-5">
              <div className="space-y-2.5">
                <div className="flex items-baseline gap-2 text-[#003366]">
                  <BarChart3 className="h-4.5 w-4.5 text-[#ff686c]" />
                  <span className="text-3xl font-bold leading-none">120k+</span>
                  <span className="text-sm text-[#003366]/60">minutes analyzed</span>
                </div>

                <div className="flex items-baseline gap-2 text-[#003366]">
                  <Building2 className="h-4.5 w-4.5 text-[#ff686c]" />
                  <span className="text-3xl font-bold leading-none">18+</span>
                  <span className="text-sm text-[#003366]/60">interview playbooks</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-[#003366]/80">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Verified readiness
                </span>
                <span className="text-[#003366]/25">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                  Enforced rubrics
                </span>
                <span className="text-[#003366]/25">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-emerald-600" />
                  Institution-owned data
                </span>
              </div>
            </div>

            {/* Impact */}
            <div className="rounded-2xl border border-[#003366]/15 bg-gradient-to-br from-emerald-50/60 to-white p-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span className="text-base sm:text-lg font-semibold text-[#003366]">
                  Measured readiness gains
                </span>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-[#003366]/65 leading-relaxed">
                A consistent readiness standard you can track, report, and improve over time.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-[#003366]/80">
                <span className="inline-flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-[#003366]/45" />
                  Standardized scoring
                </span>
                <span className="text-[#003366]/25">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#003366]/45" />
                  Advisor consistency
                </span>
                <span className="text-[#003366]/25">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-[#003366]/45" />
                  Program benchmarks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA (outside grid, correct alignment) */}
      <div className="flex justify-center pt-10">
        <a
          href="#institutions-contact"
          className="inline-flex items-center gap-2 rounded-full bg-[#ff686c] text-white px-8 py-4 text-lg font-semibold shadow-md hover:bg-[#ff5c61] transition-colors"
        >
          Get started
        </a>
      </div>
    </section>
  );
}
