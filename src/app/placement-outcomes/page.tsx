import Link from "next/link";
import { ChevronRight, BarChart2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placement Outcomes | Clarivue",
  description:
    "Understand how structured interview preparation directly improves placement rates, protects grant funding, and strengthens employer relationships.",
};

export default function PlacementOutcomesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#003366]/5 px-4 py-1.5 text-xs font-semibold text-[#003366]/60 mb-6">
            <BarChart2 className="w-4 h-4" />
            Insights Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#003366] leading-tight">
            Placement Outcomes
          </h1>
          <p className="mt-4 text-lg text-[#003366]/60 max-w-2xl mx-auto">
            Connecting structured interview preparation to measurable
            improvements in placement rates, employer satisfaction, and program
            sustainability.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              The placement gap
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              Low placement rates put grant renewals and accreditation at risk.
              When learners fail employer interviews, the cost cascades — lost
              referrals, wasted advisor hours, and shrinking program capacity.
            </p>
          </div>
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              How Clarivue helps
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              By detecting readiness gaps before employer exposure, institutions
              can intervene early — improving first-interview success rates and
              turning placement outcomes into a scalable, predictable metric.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a2140] to-[#1a4060] p-10 text-white">
            <h2 className="text-2xl font-bold mb-3">
              Model your placement impact
            </h2>
            <p className="text-white/70 mb-6">
              Use the ROI Calculator to see how interview readiness drives
              placement outcomes.
            </p>
            <Link
              href="/roicalculator"
              className="inline-flex items-center gap-2 bg-[#ff686c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ff5b5f] transition-colors"
            >
              Try ROI Calculator
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
