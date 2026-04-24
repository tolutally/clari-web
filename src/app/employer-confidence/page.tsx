import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Confidence | Clarivue",
  description:
    "Protect employer partnerships by ensuring learners are interview-ready before they meet recruiters — preventing failed placements that erode trust.",
};

export default function EmployerConfidencePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#003366]/5 px-4 py-1.5 text-xs font-semibold text-[#003366]/60 mb-6">
            <Briefcase className="w-4 h-4" />
            Insights Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#003366] leading-tight">
            Employer Confidence
          </h1>
          <p className="mt-4 text-lg text-[#003366]/60 max-w-2xl mx-auto">
            Protecting recruiter trust and repeat hiring by ensuring every
            learner who reaches an employer is genuinely interview-ready.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              The trust erosion cycle
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              When learners fail interviews, employer partners lose confidence.
              They stop sending opportunities, referral pipelines shrink, and
              programs lose the employer relationships that drive placements.
            </p>
          </div>
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              Readiness as a quality signal
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              Clarivue gives institutions the ability to verify learner readiness
              before employer exposure — turning interview prep into a quality
              assurance step that protects and strengthens partnerships.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a2140] to-[#1a4060] p-10 text-white">
            <h2 className="text-2xl font-bold mb-3">
              Protect your employer partnerships
            </h2>
            <p className="text-white/70 mb-6">
              Learn how readiness verification keeps recruiter trust intact.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 bg-[#ff686c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ff5b5f] transition-colors"
              >
                Book a demo
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/hidden-cost"
                className="font-semibold text-white/70 underline underline-offset-4 decoration-white/30 hover:text-white transition-colors"
              >
                Find your hidden cost
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
