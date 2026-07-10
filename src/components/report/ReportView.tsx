"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Coins,
  LineChart,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import {
  meta,
  confidenceChips,
  summary,
  costStats,
  funds,
  indicators,
  placement,
  placementNote,
  readiness,
  readinessOverall,
  activity,
  barriers,
  decisions,
  certNarrative,
  definitions,
  portability,
  disclaimer,
  type ConfidenceChip,
} from "./data";

/* -------------------------------------------------------------------------- */
/*  Shared motion + primitives                                                */
/* -------------------------------------------------------------------------- */

const rise = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const },
};

const EASE = [0.2, 0.8, 0.2, 1] as const;

function LayerBanner({ num, name, aud }: { num: string; name: string; aud: string }) {
  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-[860px] flex-wrap items-baseline gap-x-4 gap-y-1 px-[30px] py-4">
        <span className="font-mono text-[11px] tracking-[0.14em] text-blue">{num}</span>
        <span className="font-serif text-[19px] font-semibold">{name}</span>
        <span className="ml-auto text-[12.5px] text-blue max-[560px]:ml-0 max-[560px]:basis-full">
          {aud}
        </span>
      </div>
    </div>
  );
}

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-1.5 flex items-baseline gap-3.5">
      <span className="pt-[3px] font-mono text-xs font-medium text-coral">{num}</span>
      <h2 className="font-serif text-[24px] font-semibold leading-tight tracking-[-0.01em] text-navy">
        {title}
      </h2>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-2.5 max-w-[68ch] text-[14.5px] text-slate">{children}</p>;
}

const chipIcon: Record<ConfidenceChip["kind"], React.ReactNode> = {
  verified: <ShieldCheck className="h-3.5 w-3.5 text-teal" />,
  auto: <Zap className="h-3.5 w-3.5 text-navy" />,
  entered: <Coins className="h-3.5 w-3.5 text-coral" />,
  supp: <LineChart className="h-3.5 w-3.5 text-blue-strong" />,
};

/* -------------------------------------------------------------------------- */
/*  The report                                                                */
/* -------------------------------------------------------------------------- */

export default function ReportView() {
  return (
    <div className="bg-paper text-[16px] leading-[1.55] text-ink antialiased">
      {/* top bar */}
      <div className="bg-navy py-2.5 font-mono text-[11.5px] tracking-[0.04em] text-white">
        <div className="mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-2 px-[30px]">
          <span>
            Compiled by <b className="text-blue">Clarivue</b>
          </span>
          <span className="rounded-full border border-blue/50 px-2.5 py-[3px] text-blue">
            SAMPLE · ILLUSTRATIVE DATA
          </span>
        </div>
      </div>

      {/* ===================== LAYER 1 ===================== */}
      <LayerBanner num="LAYER 1" name="Executive Summary" aud="For funders, boards & leadership" />

      {/* masthead */}
      <header className="border-b-2 border-navy">
        <motion.div {...rise} className="mx-auto max-w-[860px] px-[30px] pb-9 pt-11">
          <div className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-coral-deep">
            Program Performance &amp; Readiness Report
          </div>
          <h1 className="max-w-[22ch] font-serif text-[37px] font-semibold leading-[1.1] tracking-[-0.01em] text-navy max-[560px]:text-[28px]">
            {meta.program}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[16px] text-slate">
            {meta.programType} cohort outcomes, reported in ETA-9169 format with cost, placement,
            and readiness detail for the reporting period.
          </p>
          <div className="mt-7 grid grid-cols-4 overflow-hidden rounded-[10px] border border-line max-[560px]:grid-cols-2">
            {[
              ["Program", meta.programType],
              ["Reporting period", meta.period],
              ["Prepared for", meta.preparedFor],
              ["Cohort", meta.cohort],
            ].map(([k, v]) => (
              <div key={k} className="border-r border-line bg-white px-4 py-3.5 last:border-r-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{k}</div>
                <div className="mt-1.5 text-[14.5px] font-semibold leading-tight text-navy">{v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      {/* summary + confidence */}
      <motion.div {...rise} className="mx-auto max-w-[860px] px-[30px] py-8">
        {summary.map((p, i) => (
          <p key={i} className="mt-3 max-w-[72ch] text-[16.5px] first:mt-0">
            {emphasize(p)}
          </p>
        ))}
        <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <span className="mr-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-dim">
            Data status
          </span>
          {confidenceChips.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-[5px] text-[12px] text-slate"
            >
              {chipIcon[c.kind]}
              {c.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 01 — cost */}
      <Section num="01" title="Investment & cost per outcome">
        <Note>
          What the reporting period cost, and what each outcome cost to produce. Prior-cohort figures
          shown for trend.
        </Note>
        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-line max-[640px]:grid-cols-1">
          {costStats.map((s) => (
            <div
              key={s.label}
              className={`border-r border-line px-5 py-5.5 last:border-r-0 ${
                s.feature ? "bg-navy" : "bg-white"
              }`}
            >
              <div
                className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                  s.feature ? "text-blue" : "text-dim"
                }`}
              >
                {s.label}
              </div>
              <div
                className={`mt-2.5 font-serif text-[33px] font-semibold leading-none ${
                  s.feature ? "text-white" : "text-navy"
                }`}
              >
                {s.value}
              </div>
              <div
                className={`mt-2.5 flex items-center gap-1.5 text-[12.5px] ${
                  s.feature ? "text-blue" : "text-slate"
                }`}
              >
                {s.down && (
                  <span className="inline-flex items-center gap-1 font-bold text-teal">
                    <TrendingDown className="h-3.5 w-3.5" />
                    {s.feature ? "19%" : "12%"}
                  </span>
                )}
                {s.trend}
              </div>
            </div>
          ))}
        </div>
        <table className="mt-5 w-full border-collapse text-[14px]">
          <tbody>
            {funds.map((f) => (
              <tr key={f.label} className={f.total ? "" : "border-b border-line"}>
                <td className={`py-2.5 pr-3 ${f.total ? "border-t-2 border-navy pt-3" : ""}`}>
                  <span className={f.total ? "font-semibold text-navy" : "text-slate"}>
                    {f.label}
                  </span>
                  {f.spec && (
                    <span className="mt-0.5 block font-mono text-[10px] text-dim">{f.spec}</span>
                  )}
                </td>
                <td
                  className={`py-2.5 pl-3 text-right font-semibold tabular-nums text-navy ${
                    f.total ? "border-t-2 border-navy pt-3" : ""
                  }`}
                >
                  {f.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2.5 font-mono text-[10.5px] text-dim">
          <b className="text-coral-deep">†</b> Funds figures are program-provided (entered once per
          period). All cost-per-outcome ratios are computed by Clarivue.
        </p>
      </Section>

      {/* 02 — primary indicators */}
      <Section num="02" title="Primary indicators">
        <Note>
          Negotiated targets against actuals for the reporting period. Denominators per ETA-9169
          specification.
        </Note>
        <div className="my-4 inline-block rounded-lg border border-[#D6E0F5] bg-blue-wash px-3.5 py-2.5 font-mono text-[11px] text-slate">
          ETA-9169 · Title I Adult · Items 16, 19, 26, 29, 32
        </div>
        <div className="border-b-2 border-navy" />
        {indicators.map((ind) => (
          <div key={ind.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-line py-3.5">
            <div>
              <div className="font-semibold text-ink">{ind.name}</div>
              <div className="mt-0.5 font-mono text-[10px] text-dim">{ind.spec}</div>
            </div>
            <div className="flex items-center gap-5 max-[560px]:gap-3">
              <div className="w-14 text-right tabular-nums text-slate max-[560px]:hidden">
                {ind.target}
              </div>
              <div className="w-16 text-right font-bold tabular-nums text-navy">{ind.actual}</div>
              <div className="relative h-[7px] w-[120px] overflow-visible rounded bg-line max-[560px]:hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${ind.actualPct}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1, ease: EASE }}
                  className="absolute inset-y-0 left-0 rounded bg-navy"
                />
                <span
                  className="absolute -top-[3px] bottom-[-3px] w-0.5 bg-coral"
                  style={{ left: `${ind.targetPct}%` }}
                />
              </div>
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Met
              </div>
            </div>
          </div>
        ))}
        <div className="mt-3 flex flex-wrap gap-x-[18px] font-mono text-[10.5px] text-dim">
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-[3px] w-4 rounded bg-navy" /> Actual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-[3px] w-4 rounded bg-coral" /> Negotiated target
          </span>
        </div>
      </Section>

      {/* ===================== LAYER 2 ===================== */}
      <LayerBanner
        num="LAYER 2"
        name="Director Operating View"
        aud="For running the program month to month"
      />

      {/* 03 — placement */}
      <Section num="03" title="Placement detail">
        <Note>
          Where the 37 Q2-employed participants went, and whether the placements held. Retention per
          ETA-9169 Item 11.
        </Note>
        <div className="mt-5 grid grid-cols-4 overflow-hidden rounded-xl border border-line max-[640px]:grid-cols-2">
          {placement.map((p) => (
            <div key={p.label} className="border-r border-line bg-white px-4.5 py-5 last:border-r-0">
              <div className="font-serif text-[27px] font-semibold leading-none text-navy">
                {p.value}
              </div>
              <div className="mt-2 text-[12px] leading-snug text-slate">{p.label}</div>
              <div className="mt-1 font-mono text-[9.5px] text-dim">{p.spec}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[68ch] text-[13.5px] text-slate">{emphasize(placementNote)}</p>
      </Section>

      {/* 04 — readiness */}
      <Section num="04" title="Readiness across six competencies">
        <Note>
          Mock interview performance scored on a five-point scale across the six behavioral signals
          employers screen for. Shown as cohort average, first attempt to most recent.
        </Note>
        <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-4 max-[640px]:grid-cols-1">
          {readiness.map((t) => (
            <ReadinessBar key={t.name} name={t.name} first={t.first} latest={t.latest} />
          ))}
          <div className="col-span-full mt-1 flex flex-wrap items-center gap-4.5 rounded-[10px] border border-[#D6E0F5] bg-blue-wash px-5 py-4">
            <div className="font-serif text-[30px] font-semibold leading-none text-navy">
              {readinessOverall.first}{" "}
              <span className="text-[15px] font-normal text-slate">→</span>{" "}
              {readinessOverall.latest}
            </div>
            <div className="max-w-[46ch] text-[13.5px] text-slate">
              Cohort readiness average. Coral marks the starting point; the fill shows where the
              cohort finished.
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-5 overflow-hidden rounded-xl border border-line max-[720px]:grid-cols-2">
          {activity.map((a) => (
            <div key={a.label} className="border-r border-line bg-white px-4 py-4.5 last:border-r-0">
              <div className="font-serif text-[26px] font-semibold leading-none text-navy">
                {a.value}
                {a.unit && <span className="text-[14px] text-slate">{a.unit}</span>}
              </div>
              <div className="mt-[7px] text-[12px] leading-snug text-slate">
                {a.label}
                {a.sub && <span className="text-slate"> ({a.sub})</span>}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 — barriers */}
      <Section num="05" title="Outcomes by employment barrier">
        <Note>
          Segmented by barriers recorded at entry per ETA-9169 Items 49–59. Categories overlap, so
          counts do not sum to the cohort total.
        </Note>
        <table className="mt-4 w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b-2 border-navy">
              {["Barrier at entry", "Participants", "Touchpoints (avg)", "Readiness", "Q2 employed"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`pb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-dim ${
                      i === 0 ? "text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {barriers.map((b) => (
              <tr key={b.name} className="border-b border-line last:border-b-0">
                <td className="py-3 font-semibold text-ink">{b.name}</td>
                <td className="py-3 text-right tabular-nums">{b.participants}</td>
                <td className="py-3 text-right font-bold tabular-nums text-coral-deep">
                  {b.touchpoints}
                </td>
                <td className="py-3 text-right font-mono text-[12.5px] text-navy">{b.readiness}</td>
                <td className="py-3 text-right tabular-nums">{b.q2}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 max-w-[68ch] text-[13px] text-slate">
          Advising activity scaled with barrier depth: participants facing the steepest barriers at
          entry received the highest number of touchpoints. Barrier labels follow current usage;
          &ldquo;justice-involved&rdquo; maps to ETA-9169 Item 52.
        </p>
      </Section>

      {/* 06 — decisions */}
      <Section num="06" title="Director decisions for next cycle">
        <p className="mt-2.5 max-w-[68ch] text-[14.5px] text-slate">
          Readiness and placement signals from this cohort, translated into the calls a director
          makes next. These are program-management actions, not a measure of the training curriculum.
        </p>
        <div className="mt-5 overflow-hidden rounded-xl border border-line max-[560px]:overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px] max-[560px]:min-w-[640px]">
            <thead>
              <tr className="bg-navy text-left text-white">
                {["Signal", "Risk / opportunity", "Recommended action", "Owner", "When"].map((h) => (
                  <th
                    key={h}
                    className="px-3.5 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.07em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisions.map((d) => (
                <tr key={d.signal} className="border-b border-line bg-white last:border-b-0 align-top">
                  <td className="w-[22%] px-3.5 py-3.5 font-semibold text-ink">
                    {d.signal}
                    <span className="mt-0.5 block font-mono text-[10px] font-normal text-dim">
                      {d.signalSpec}
                    </span>
                  </td>
                  <td className="w-[24%] px-3.5 py-3.5 text-slate">{d.risk}</td>
                  <td className="w-[28%] px-3.5 py-3.5 text-ink">{d.action}</td>
                  <td className="px-3.5 py-3.5">
                    <span className="inline-block whitespace-nowrap rounded-full border border-[#D6E0F5] bg-blue-wash px-2.5 py-[3px] font-mono text-[10px] text-navy">
                      {d.owner}
                    </span>
                  </td>
                  <td className="px-3.5 py-3.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-[3px] font-mono text-[10px] ${
                        d.ongoing
                          ? "border-[#C4E9DF] bg-[#E8F6F2] text-[#0F8A70]"
                          : "border-[#FBD9C8] bg-[#FFF1E8] text-coral-deep"
                      }`}
                    >
                      {d.when}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ===================== LAYER 3 ===================== */}
      <LayerBanner
        num="LAYER 3"
        name="Compliance & Appendix"
        aud="Definitions, denominators & certification"
      />

      {/* certification */}
      <motion.div {...rise} className="mx-auto max-w-[860px] px-[30px] pb-2 pt-9">
        <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
          Report certification &amp; narrative
        </div>
        <p className="max-w-[74ch] text-[15px] leading-relaxed text-ink">{certNarrative}</p>
        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-[10px] border border-line max-[560px]:grid-cols-1">
          {[
            ["Certifying official", "[ Name / Title ]", false],
            ["Telephone", "[ — ]", true],
            ["Email", "[ — ]", true],
          ].map(([k, v, thin]) => (
            <div key={k as string} className="border-r border-line bg-white px-4 py-3.5 last:border-r-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-dim">{k}</div>
              <div className={`mt-1.5 text-[14px] ${thin ? "text-slate" : "font-semibold text-navy"}`}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* methodology */}
      <motion.div {...rise} className="mx-auto max-w-[860px] px-[30px] pb-2.5 pt-7">
        <h3 className="mb-3 font-serif text-[16px] font-semibold text-navy">Methodology &amp; definitions</h3>
        <dl className="grid grid-cols-[180px_1fr] gap-x-5 gap-y-2.5 text-[13.5px] max-[560px]:grid-cols-1 max-[560px]:gap-y-3">
          {definitions.map((d) => (
            <div key={d.term} className="contents max-[560px]:block">
              <dt className="font-semibold text-navy">{d.term}</dt>
              <dd className="text-slate">{d.body}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5.5 max-w-[74ch] rounded-[10px] border border-[#D6E0F5] bg-blue-wash px-4.5 py-4 text-[13.5px] text-ink">
          {emphasize(portability)}
        </div>
        <p className="mt-5.5 font-mono text-[11px] text-dim">
          Compiled automatically by <b className="text-slate">Clarivue</b> · one program-provided
          input (funds), no other manual data entry
        </p>
      </motion.div>

      {/* disclaimer */}
      <div className="mt-7 border-t border-line bg-cream/60 py-5.5 pb-10">
        <div className="mx-auto flex max-w-[860px] items-start gap-2.5 px-[30px] text-[12px] text-slate">
          <span aria-hidden>⚠</span>
          <p>
            <b className="text-navy">Sample document.</b> {disclaimer.replace("Sample document. ", "")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section wrapper + readiness bar                                           */
/* -------------------------------------------------------------------------- */

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section {...rise} className="border-t border-line first-of-type:border-t-0">
      <div className="mx-auto max-w-[860px] px-[30px] py-10">
        <SectionHead num={num} title={title} />
        {children}
      </div>
    </motion.section>
  );
}

function ReadinessBar({ name, first, latest }: { name: string; first: number; latest: number }) {
  const latestPct = (latest / 5) * 100;
  const firstPct = (first / 5) * 100;
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-[14.5px] font-semibold text-ink">{name}</span>
        <span className="font-mono text-[12px] tabular-nums text-slate">
          {first.toFixed(1)} → <b className="text-teal">{latest.toFixed(1)}</b>
        </span>
      </div>
      <div className="relative h-2.5 rounded-md bg-line">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${latestPct}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r from-navy to-navy-2"
        />
        <span
          className="absolute -inset-y-1 w-0.5 rounded bg-coral"
          style={{ left: `${firstPct}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tiny helper: bold the strong clauses in body prose                        */
/* -------------------------------------------------------------------------- */

function emphasize(text: string): React.ReactNode {
  // bolds a few known key phrases; purely presentational.
  const phrases = [
    "All five negotiated primary indicators were met",
    "$11,838 per Q2 placement",
    "Repeat and first-time employer activity both feed the partnership base",
    "Canadian employment-services outcomes, private-grant agreements, or generic served/completed/placed/retained reporting",
  ];
  let nodes: React.ReactNode[] = [text];
  phrases.forEach((phrase, pi) => {
    const next: React.ReactNode[] = [];
    nodes.forEach((node, ni) => {
      if (typeof node !== "string" || !node.includes(phrase)) {
        next.push(node);
        return;
      }
      const [before, after] = node.split(phrase);
      next.push(
        before,
        <b key={`${pi}-${ni}`} className="font-semibold text-navy">
          {phrase}
        </b>,
        after,
      );
    });
    nodes = next;
  });
  return nodes;
}
