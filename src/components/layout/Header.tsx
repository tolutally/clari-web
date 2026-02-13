"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  Home,
  LayoutDashboard,
  LogIn,
  PenLine,
  Route,
  Target,
  UserPlus,
} from "lucide-react";

type ViewType = "institutions" | "jobseekers";

interface HeaderProps {
  currentView: ViewType;
  onSwitchView: (view: ViewType) => void;
  onJobSeekerClick: () => void;
}

const institutionLinks = [
  { href: "#institutions-hero", icon: Home, label: "Home" },
  { href: "#institutions-features", icon: LayoutDashboard, label: "Features" },
  { href: "#institutions-roi", icon: Activity, label: "ROI Calculator" },
  { href: "/blog", icon: PenLine, label: "Blog" },
];

const jobseekerLinks = [
  { href: "#individual-hero", icon: Home, label: "Home" },
  { href: "#individual-prep", icon: Target, label: "Prep engine" },
  { href: "#individual-how", icon: Route, label: "How it works" },
  { href: "#individual-impact", icon: Activity, label: "Impact" },
  { href: "#individual-faq", icon: BookOpen, label: "FAQ" },
  { href: "/blog", icon: PenLine, label: "Blog" },
];

export function Header({ currentView, onSwitchView, onJobSeekerClick }: HeaderProps) {
  const links = currentView === "institutions" ? institutionLinks : jobseekerLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#003366]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* ── Left: Logo ── */}
        <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <Image src="/clarivue-logo-v1.png" alt="Clarivue" width={120} height={30} priority />
        </Link>

        {/* ── Center: Nav links (hidden on mobile) ── */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                i === 0
                  ? "text-[#003366] hover:bg-[#003366]/5"
                  : "text-[#003366]/55 hover:text-[#003366] hover:bg-[#003366]/5"
              }`}
            >
              <link.icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* ── Right: Tab toggle + Auth ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Tab toggle pill */}
          <div className="hidden sm:flex items-center p-0.5 rounded-full bg-[#003366]/[0.04] border border-[#003366]/8">
            <button
              type="button"
              onClick={() => onSwitchView("institutions")}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                currentView === "institutions"
                  ? "bg-white text-[#003366] shadow-sm"
                  : "text-[#003366]/50 hover:text-[#003366]"
              }`}
            >
              For Institutions
            </button>
            <button
              type="button"
              onClick={onJobSeekerClick}
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#003366]/50 hover:text-[#003366] transition-all duration-200"
            >
              For Job Seekers
              <span className="ml-1 text-[8px] font-bold text-[#ff686c] bg-[#ff686c]/10 px-1 py-0.5 rounded-full uppercase">
                Soon
              </span>
            </button>
          </div>

          {/* Auth buttons */}
          <Link
            href="https://app.clarivue.io/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#003366]/60 hover:text-[#003366] transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log In</span>
          </Link>
          <Link
            href="https://app.clarivue.io/register"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#ff686c] text-white hover:bg-[#ff5b5f] transition-colors shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Up</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
