export default function ReportPreview() {
  return (
    <section className="rounded-2xl border border-[#003366]/10 bg-white/70 p-6 shadow-[0_10px_40px_-28px_rgba(0,0,0,0.3)] backdrop-blur space-y-3">
      <div className="flex items-center gap-2 text-sm text-[#003366]/70">
        <span className="h-2 w-2 rounded-full bg-[#ff686c]" />
        <span className="font-semibold text-[#003366]">Sample report</span>
      </div>
      <p className="text-sm text-[#003366]/70">
        You will see company signals, leadership snapshots, recent news, and tone guidance. Full report rendering will hook into the
        research pipeline.
      </p>
      <div className="rounded-xl border border-[#003366]/10 bg-white/80 p-4 text-sm text-[#003366]/80">
        <p>• Signals: mission, product, values, hiring velocity</p>
        <p>• People: execs, likely interviewers, leadership notes</p>
        <p>• News: earnings, launches, funding, risk flags</p>
        <p>• Language: tone and phrasing the company uses</p>
      </div>
    </section>
  );
}
