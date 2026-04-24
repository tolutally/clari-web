import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advisor Workflow | Clarivue",
  description:
    "See how Clarivue reduces unplanned remediation hours so advisors can focus on high-impact coaching instead of reactive interview prep.",
};

export default function AdvisorWorkflowPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#003366]/5 px-4 py-1.5 text-xs font-semibold text-[#003366]/60 mb-6">
            <Users className="w-4 h-4" />
            Insights Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#003366] leading-tight">
            Advisor Workflow
          </h1>
          <p className="mt-4 text-lg text-[#003366]/60 max-w-2xl mx-auto">
            Reducing unplanned remediation hours so career advisors can focus on
            strategic coaching — not reactive firefighting after failed
            interviews.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 space-y-8">
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              The advisor bottleneck
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              Without early detection, advisor teams spend 6–10 unplanned hours
              per learner on remediation. This reactive cycle prevents programs
              from scaling enrollment without proportionally increasing staff.
            </p>
          </div>
          <div className="rounded-2xl border border-[#003366]/10 bg-white p-8">
            <h2 className="text-xl font-bold text-[#003366] mb-3">
              Automated readiness actions
            </h2>
            <p className="text-[#003366]/60 leading-relaxed">
              Clarivue&apos;s Readiness Actions assign targeted practice based
              on each learner&apos;s specific breakdown patterns — freeing
              advisors to focus on learners who need human intervention most.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a2140] to-[#1a4060] p-10 text-white">
            <h2 className="text-2xl font-bold mb-3">
              Reclaim your advisors&apos; time
            </h2>
            <p className="text-white/70 mb-6">
              See how structured readiness workflows free up hours every week.
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
