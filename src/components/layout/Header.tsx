"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  BarChart2,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  Home,
  LayoutDashboard,
  Lightbulb,
  LogIn,
  PenLine,
  Route,
  Target,
  Users,
  UserPlus,
} from "lucide-react";

type ViewType = "institutions" | "jobseekers";

interface HeaderProps {
  currentView?: ViewType;
  onSwitchView?: (view: ViewType) => void;
  onJobSeekerClick?: () => void;
}

const institutionLinks = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/#institutions-features", icon: LayoutDashboard, label: "Platform" },
  { href: "/hidden-cost", icon: Activity, label: "The Hidden Cost" },
  { href: "/blog", icon: PenLine, label: "Blog" },
];

const insightsHubPages = [
  {
    href: "/mock-interview-scoring",
    icon: ClipboardCheck,
    label: "Mock Interview Scoring",
    description: "How AI-powered scoring detects readiness gaps",
  },
  {
    href: "/placement-outcomes",
    icon: BarChart2,
    label: "Placement Outcomes",
    description: "Connecting interview prep to placement rates",
  },
  {
    href: "/advisor-workflow",
    icon: Users,
    label: "Advisor Workflow",
    description: "Reducing unplanned remediation hours",
  },
  {
    href: "/cohort-reporting",
    icon: LayoutDashboard,
    label: "Cohort Reporting",
    description: "Real-time visibility across your entire cohort",
  },
  {
    href: "/employer-confidence",
    icon: Briefcase,
    label: "Employer Confidence",
    description: "Protecting recruiter trust and repeat hiring",
  },
];

const jobseekerLinks = [
  { href: "#individual-hero", icon: Home, label: "Home" },
  { href: "#individual-prep", icon: Target, label: "Prep engine" },
  { href: "#individual-how", icon: Route, label: "How it works" },
  { href: "#individual-impact", icon: Activity, label: "Impact" },
  { href: "#individual-faq", icon: BookOpen, label: "FAQ" },
  { href: "/blog", icon: PenLine, label: "Blog" },
];

export function Header({
  currentView = "institutions",
  onSwitchView,
  onJobSeekerClick,
}: HeaderProps) {
  const links = currentView === "institutions" ? institutionLinks : jobseekerLinks;
  const [insightsOpen, setInsightsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInsightsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* ── Insights Hub Dropdown ── */}
          {currentView === "institutions" && (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setInsightsOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  insightsOpen
                    ? "text-[#003366] bg-[#003366]/5"
                    : "text-[#003366]/55 hover:text-[#003366] hover:bg-[#003366]/5"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Insights Hub</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    insightsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {insightsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-[#003366]/10 bg-white shadow-xl shadow-[#003366]/5 py-2">
                  <div className="px-4 py-2 border-b border-[#003366]/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#003366]/40">
                      Insights Hub
                    </p>
                  </div>
                  {insightsHubPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={() => setInsightsOpen(false)}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-[#003366]/[0.03] transition-colors group"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#003366]/5 text-[#003366]/60 group-hover:bg-[#003366]/10 group-hover:text-[#003366] transition-colors">
                        <page.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#003366]">
                          {page.label}
                        </p>
                        <p className="text-[11px] text-[#003366]/45 leading-tight mt-0.5">
                          {page.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ── Right: Tab toggle + Auth ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Tab toggle pill — hidden for now (institutions only) */}
          {/* <div className="hidden sm:flex items-center p-0.5 rounded-full bg-[#003366]/[0.04] border border-[#003366]/8">
            <button
              type="button"
              onClick={() => onSwitchView?.("institutions")}
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
              onClick={() => onJobSeekerClick?.()}
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#003366]/50 hover:text-[#003366] transition-all duration-200"
            >
              For Job Seekers
              <span className="ml-1 text-[8px] font-bold text-[#ff686c] bg-[#ff686c]/10 px-1 py-0.5 rounded-full uppercase">
                Soon
              </span>
            </button>
          </div> */}

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
