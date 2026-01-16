 "use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  Compass,
  Home,
  LayoutDashboard,
  MessageSquare,
  Route,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ViewType = "institutions" | "jobseekers";

export function Footer() {
  return (
    <footer id="site-footer" className="w-full bg-[#003366] text-white py-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/clarivue-logo-v1.png"
            alt="Clarivue"
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
          <p className="text-white/50 text-sm">© 2026 SkillConnect Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingNav({ currentView }: { currentView: ViewType }) {
  const [footerVisible, setFooterVisible] = useState(false);

  const links =
    currentView === "institutions"
      ? [
          { href: "#institutions-hero", icon: Home, label: "Overview" },
          { href: "#institutions-features", icon: LayoutDashboard, label: "Features" },
          { href: "#institutions-roi", icon: Activity, label: "ROI Calculator" },
          { href: "#institutions-comparison", icon: Compass, label: "Compare" },
        ]
      : [
          { href: "#individual-hero", icon: Home, label: "Overview" },
          { href: "#individual-prep", icon: Target, label: "Prep engine" },
          { href: "#individual-how", icon: Route, label: "How it works" },
          { href: "#individual-impact", icon: Activity, label: "Impact" },
          { href: "#individual-faq", icon: BookOpen, label: "FAQ" },
        ];

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setFooterVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        footerVisible ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <nav className="glass-panel px-6 py-3 rounded-full flex items-center gap-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl bg-white/80">
        {links.map((link, index) => (
          <Link
            key={link.label}
            href={link.href}
            className={`flex items-center gap-2 text-xs font-semibold ${
              index === 0 ? "text-[#003366] hover:text-[#FF7F50]" : "text-[#003366]/60 hover:text-[#003366]"
            } transition-colors`}
            aria-label={link.label}
          >
            <link.icon className="w-4 h-4" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
