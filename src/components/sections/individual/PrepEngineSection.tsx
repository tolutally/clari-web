import { ArrowRight, MessageSquare, Sparkles, Target } from "lucide-react";
import React from "react";

type Tone = "indigo" | "sky" | "emerald";

const toneBg: Record<Tone, string> = {
  indigo: "bg-indigo-500/10 text-indigo-700",
  sky: "bg-sky-500/10 text-sky-700",
  emerald: "bg-emerald-500/10 text-emerald-700",
};

export function PrepEngineSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 md:mt-32">
      <div className="space-y-3 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#003366]/10 text-xs font-semibold text-[#003366] shadow-sm">
          How Clarivue Helps
        </div>
        <h3 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#003366]">
         Land the job 5x faster 
          <br />
          than the national average
        </h3>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 items-start">
        {/* Content */}
        <div className="order-1 lg:order-1 space-y-8 pt-20">
          <p className="text-sm md:text-base text-[#003366]/70 max-w-2xl">
            Clarivue teaches you what to say, how to say it, and how to stand out - from first application to final round.
          </p>

          <div className="space-y-4 border-t pt-6 border-[#003366]/10">
            <h4 className="text-lg font-semibold text-[#003366]">What Clarivue builds for you</h4>
            <div className="space-y-4">
              <FeatureRow
                title="Your pre-interview research (FREE)"
                body="Role signals, core skills, and question themes pulled from the job description for free"
                tone="indigo"
                icon={<Target className="w-4 h-4 text-indigo-600" />}
              />
              <FeatureRow
                title="Practice prompts that get harder"
                body="Start with baseline questions. Move into follow-ups, curveballs, and role-specific scenarios."
                tone="sky"
                icon={<Sparkles className="w-4 h-4 text-sky-600" />}
              />
              <FeatureRow
                title="Feedback loop you control"
                body="Re-run answers until you hit your target level. Track what changed each round."
                tone="emerald"
                icon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 border-t pt-6 border-[#003366]/10">
            <div className="flex gap-3 items-center hover:-translate-y-1 transition-transform duration-200">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl tracking-tight font-semibold text-[#003366]">60</span>
                </div>
                <p className="text-s text-[#003366]/60">minutes available per session</p>
              </div>
            </div>
            <div className="flex items-center gap-3 hover:-translate-y-1 transition-transform duration-200">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl tracking-tight font-semibold text-[#003366]">24/7</span>
                </div>
                <p className="text-s text-[#003366]/60">loops - practice, score, improve</p>
              </div>
            </div>
          </div>
        </div>

        {/* UI preview */}
        <div className="order-2 lg:order-2 rounded-[32px] relative">
          <article className="group relative overflow-hidden transition-shadow hover:shadow-2xl rounded-[28px] border border-white/60 shadow-xl backdrop-blur-2xl bg-white/55">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#003366]/10 blur-3xl" />
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#ff686c]/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />

            <div className="relative p-6 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight text-[#003366]">
                  Your prep workspace
                </h3>
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs border rounded-full px-2.5 py-1 backdrop-blur-sm text-[#003366]/80 bg-white border-[#003366]/15">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff686c]" />
                  AI guided
                </span>
              </div>

              {/* Illustration */}
              <div className="relative h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-[#f8fbff] to-white ring-1 ring-[#003366]/10 shadow-inner">
                <div className="absolute left-4 sm:left-6 top-4 sm:top-6 w-[88%] rounded-2xl backdrop-blur border shadow-sm bg-white/90 border-[#003366]/10">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[#003366]/10">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#003366]" />
                      <div className="text-[10px] sm:text-xs text-[#003366]/70">
                        Paste job description
                      </div>
                    </div>
                    <div className="ml-auto text-[10px] sm:text-xs text-[#003366]/50">+ resume</div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="text-[9px] sm:text-[10px] tracking-widest px-2 text-[#003366]/50">
                      CLARIVUE OUTPUT
                    </div>

                    <div className="flex items-center gap-2 border rounded-lg px-2 py-1.5 bg-[#003366]/5 border-[#003366]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <div className="h-1.5 w-28 rounded bg-[#003366]/20" />
                      <div className="ml-auto text-[10px] text-[#003366]/60">role map</div>
                    </div>

                    <div className="flex items-center gap-2 border rounded-lg px-2 py-1.5 bg-[#003366]/5 border-[#003366]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                      <div className="h-1.5 w-24 rounded bg-[#003366]/20" />
                      <div className="ml-auto text-[10px] text-[#003366]/60">likely questions</div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 w-[88%] rounded-2xl backdrop-blur border shadow-sm bg-white/90 border-[#003366]/10">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[#003366]/10">
                    <span className="text-[10px] sm:text-xs tracking-widest text-[#003366]/60">FEEDBACK</span>
                    <span className="text-[9px] sm:text-[10px] text-[#003366]">LIVE</span>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-start gap-2 bg-[#003366]/5 border border-[#003366]/10 rounded-lg px-2 py-2">
                      <MessageSquare className="w-4 h-4 text-[#003366] mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1 w-full rounded bg-[#003366]/20" />
                        <div className="h-1 w-3/4 rounded bg-[#003366]/15" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] px-2 text-[#003366]/60">
                      <div className="w-2 h-2 rounded-full bg-[#ff686c]" />
                      <span>Scoring your answer against the rubric...</span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-4 sm:right-6 top-24 sm:top-28 w-[46%] rounded-xl backdrop-blur border shadow-sm p-2 bg-white/90 border-[#003366]/10">
                  <div className="text-[9px] sm:text-[10px] tracking-widest mb-1.5 text-[#003366]/50">NEXT</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <div className="h-1 w-16 rounded bg-emerald-600/35" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <div className="h-1 w-12 rounded bg-amber-600/35" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <FeatureRow
                  title="Job to question map"
                  body="Clarivue turns the job description into practice questions and a rubric you can follow."
                  tone="indigo"
                  icon={<Target className="w-4 h-4 text-indigo-600" />}
                />
                <FeatureRow
                  title="Feedback you can act on"
                  body="Get rewrites, stronger examples, and clear gaps to fix before the next attempt."
                  tone="emerald"
                  icon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
                />
              </div>

              <div className="flex justify-center">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#003366] hover:text-[#ff686c] transition-colors"
                >
                  Explore all features
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <a
          href="#"
          className="inline-flex items-center justify-center gap-2 h-13 transition text-lg font-semibold rounded-full px-8 bg-[#ff686c] text-white hover:bg-[#ff5b5f] shadow-lg shadow-orange-500/20"
        >
          See it in action
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

function FeatureRow({ title, body, tone, icon }: { title: string; body: string; tone: Tone; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${toneBg[tone]} flex items-center justify-center mt-0.5`}>
        {icon}
      </div>
      <div>
        <h5 className="font-semibold text-[#003366]">{title}</h5>
        <p className="text-sm mt-1 text-[#003366]/70">{body}</p>
      </div>
    </div>
  );
}
