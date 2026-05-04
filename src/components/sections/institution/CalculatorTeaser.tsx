import { ArrowRight, Clock, DollarSign, TrendingUp, Users } from "lucide-react";

const exampleBuckets = [
  {
    label: "Time lost",
    value: "1,920h",
    tone: "border-slate-200 bg-slate-50",
    icon: Clock,
    iconClassName: "text-slate-500",
  },
  {
    label: "Money lost",
    value: "$104K",
    tone: "border-amber-200 bg-amber-50",
    icon: DollarSign,
    iconClassName: "text-amber-500",
  },
  {
    label: "People lost",
    value: "28",
    tone: "border-rose-200 bg-rose-50",
    icon: Users,
    iconClassName: "text-rose-500",
  },
] as const;

export function CalculatorTeaser() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[320px] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-[#ff686c]/5 blur-[80px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-10 space-y-4">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#003366] leading-[1.1]">
          What is the gap between training and a job costing your program?
        </h2>

        <p className="text-base md:text-lg text-[#003366]/60 leading-relaxed max-w-3xl mx-auto">
          Most programs have never put a number on it. Here&apos;s what one looks like.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <div className="relative glass-panel rounded-2xl border border-[#003366]/10 p-1 overflow-hidden shadow-2xl shadow-blue-900/10">
          <div className="bg-white/90 rounded-xl border border-[#003366]/5 overflow-hidden p-5 md:p-6">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <div className="rounded-2xl border border-[#ff686c]/20 bg-gradient-to-br from-[#ff686c]/5 to-[#ff686c]/10 p-5 md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold text-[#ff686c] uppercase tracking-wider mb-1">
                      Example program output
                    </p>
                    <p className="text-[#003366]/55 text-sm">
                      200 learners, 5 advisors, 50-person caseload
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#003366]/60 border border-[#003366]/10">
                    Workforce cohort
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] font-semibold text-[#ff686c] uppercase tracking-wider mb-1">
                    Your training-to-employment gap costs
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-[#003366] leading-none">
                    $318K
                    <span className="ml-2 text-base md:text-lg font-normal text-[#003366]/50">/year</span>
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {exampleBuckets.map((bucket) => {
                    const Icon = bucket.icon;
                    return (
                      <div key={bucket.label} className={`rounded-xl border p-4 ${bucket.tone}`}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className={`w-4 h-4 ${bucket.iconClassName}`} />
                          <span className="text-[10px] font-medium text-[#003366]/50 uppercase tracking-wider">
                            {bucket.label}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-[#003366]">{bucket.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                      With Clarivue
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-emerald-700 leading-none">+19 placements</p>
                  <p className="mt-3 text-sm text-[#003366]/65 leading-relaxed">
                    This is the kind of output programs see when they close the gap between training and hiring instead of discovering it too late.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 text-center shadow-[0_8px_24px_rgba(0,51,102,0.06)]">
                  <a
                    href="/hidden-cost"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#ff686c] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff5b5f] shadow-lg shadow-orange-500/20"
                  >
                    See your hidden cost
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  </a>
                  <p className="mt-3 text-[11px] text-[#003366]/50">
                    Run the full interactive calculator with your real program data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
