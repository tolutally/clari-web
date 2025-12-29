import ResearchForm from "./(components)/ResearchForm";
import ReportPreview from "./(components)/ReportPreview";

export default function InterviewResearchPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#003366]/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#003366]/70">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff686c]" />
          Interview research
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#003366]">
          Pre-interview research, packaged for you.
        </h1>
        <p className="text-sm text-[#003366]/70">
          Drop a role and company, and we&apos;ll gather the signals and context you need before you walk in.
        </p>
      </header>

      <ResearchForm />
      <ReportPreview />
    </main>
  );
}
