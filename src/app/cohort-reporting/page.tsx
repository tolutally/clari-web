import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohort Reporting | Clarivue",
  description:
    "Get real-time visibility into which learners are interview-ready, at risk, or critical — across your entire cohort at a glance.",
};

export default function CohortReportingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#003366]/5 px-4 py-1.5 text-xs font-semibold text-[#003366]/60 mb-6">
            <LayoutDashboard className="w-4 h-4" />
            Insights Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#003366] leading-tight">
            Cohort Reporting
          </h1>
          <p className="mt-4 text-lg text-[#003366]/60 max-w-2xl mx-auto">
            Real-time visibility into interview readiness across your entire
            cohort — so program leaders can act on data, not assumptions.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              Cohort Performance Board
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              See which learners are interview-ready, at risk, or critical at a
              glance. The dashboard surfaces readiness trends so you can allocate
              resources where they matter most.
            </p>
          </div>
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              Proof for stakeholders
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              When funders and accreditors ask for evidence, cohort reports give
              you structured readiness data — not anecdotes. Track progress over
              time and demonstrate program impact with real metrics.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a2140] to-[#1a4060] p-10 text-white">
            <h2 className="text-2xl font-bold mb-3">
              See your cohort dashboard
            </h2>
            <p className="text-white/70 mb-6">
              Book a demo to explore the Cohort Performance Board with your own
              program data.
            </p>
            <Link
              href="/book-demo"
              className="inline-flex items-center gap-2 bg-[#ff686c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ff5b5f] transition-colors"
            >
              Book a Demo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
