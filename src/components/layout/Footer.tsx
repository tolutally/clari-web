import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="site-footer" className="w-full bg-[#003366] text-white py-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/clarivue-logo-light.png"
            alt="Clarivue"
            width={138}
            height={42}
            className="h-8 w-auto object-contain"
            loading="lazy"
          />

          {/* Insights Hub links — hidden for now
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
            <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Insights</span>
            <Link href="/mock-interview-scoring" className="hover:text-white transition-colors">Scoring</Link>
            <Link href="/placement-outcomes" className="hover:text-white transition-colors">Placements</Link>
            <Link href="/advisor-workflow" className="hover:text-white transition-colors">Advisors</Link>
            <Link href="/cohort-reporting" className="hover:text-white transition-colors">Cohorts</Link>
            <Link href="/employer-confidence" className="hover:text-white transition-colors">Employers</Link>
          </div>
          */}

          {/* Legal / contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/book-demo" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
          <p className="text-white/50 text-sm">© 2026 SkillConnect Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
