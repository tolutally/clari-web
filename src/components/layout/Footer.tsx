"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer id="site-footer" className="w-full bg-[#003366] text-white py-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/clarivue-logo-lite.png"
            alt="Clarivue"
            width={138}
            height={42}
            className="h-8 w-auto object-contain"
            loading="lazy"
          />
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
