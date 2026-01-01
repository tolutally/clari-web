"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer, FloatingNav } from "@/components/layout/Footer";
import { InstitutionView } from "@/components/sections/institution/InstitutionView";
import { IndividualView } from "@/components/sections/individual/IndividualView";

type ViewType = "institutions" | "jobseekers";

export default function Home() {
  const [view, setView] = useState<ViewType>("institutions");
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [betaEmail, setBetaEmail] = useState("");
  const [betaStatus, setBetaStatus] = useState<"idle" | "sent" | "error" | "sending">("idle");
  const [betaError, setBetaError] = useState<string | null>(null);
  const [botTrap, setBotTrap] = useState("");

  const tabTransform = useMemo(
    () => (view === "institutions" ? "translateX(0)" : "translateX(100%)"),
    [view],
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md">
          <Header />
        </div>
        <div className="w-full flex justify-center pb-3 px-4 pointer-events-none">
          <div className="glass-panel p-1.5 rounded-full flex items-center relative shadow-lg ring-1 ring-[#003366]/5 backdrop-blur-xl bg-white/85 pointer-events-auto">
            <div
              className="absolute left-1.5 top-1.5 h-[calc(100%-12px)] w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300 ease-out z-0"
              style={{ transform: tabTransform }}
            />
            <button
            type="button"
            onClick={() => setView("institutions")}
            className={`relative z-10 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
              view === "institutions"
                ? "text-[#003366]"
                : "text-[#003366]/60 hover:text-[#003366]"
            }`}
          >
            For Institutions
          </button>
          <button
            type="button"
            onClick={() => {
              setShowIndividualModal(true);
              setBetaStatus("idle");
            }}
            className={`relative z-10 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
              view === "jobseekers"
                ? "text-[#003366]"
                : "text-[#003366]/60 hover:text-[#003366]"
            }`}
          >
            For Job Seekers
            <span className="ml-1.5 text-[10px] font-bold text-[#ff686c] bg-[#ff686c]/10 px-1.5 py-0.5 rounded-full uppercase">Soon</span>
          </button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pb-32 pt-28">
        {view === "institutions" ? <InstitutionView /> : <IndividualView />}
      </main>

      <Footer />
      <FloatingNav currentView={view} />

      {showIndividualModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative max-w-lg w-full rounded-3xl bg-white shadow-2xl border border-[#003366]/10 p-6">
            <button
              type="button"
              onClick={() => setShowIndividualModal(false)}
              className="absolute right-4 top-4 text-[#003366]/60 hover:text-[#003366]"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff9db0]/40 via-[#b8ccf4]/40 to-[#003366]/20 blur-2xl animate-pulse" />
                <div className="relative h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Image
                    src="/clarivue-icon-deep.png"
                    alt="Clarivue mascot"
                    width={48}
                    height={48}
                    className="animate-bounce"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#ff686c]">Coming Soon for Job Seekers</p>
                <h3 className="text-xl font-semibold text-[#003366]">We're building the individual experience</h3>
                <p className="text-sm text-[#003366]/70 mt-1">
                  Right now, Clarivue is focused on helping institutions scale interview prep. But we're also building something for individual job seekers — want early access? Drop your email and we'll invite you to the beta.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={betaEmail}
                onChange={(e) => setBetaEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
              />
              {/* honeypot */}
              <input
                type="text"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />
              <button
                type="button"
                onClick={async () => {
                  setBetaError(null);
                  if (!betaEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(betaEmail)) {
                    setBetaStatus("error");
                    setBetaError("Please enter a valid email.");
                    return;
                  }
                  try {
                    setBetaStatus("sending");
                    const res = await fetch("/api/individual/beta", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: betaEmail, hp: botTrap }),
                    });
                    const json = await res.json();
                    if (!res.ok || json.error) {
                      setBetaStatus("error");
                      setBetaError(json.error || "Something went wrong. Try again.");
                      return;
                    }
                    setBetaStatus("sent");
                  } catch (err: any) {
                    setBetaStatus("error");
                    setBetaError("Network error. Try again.");
                  }
                }}
                className="rounded-xl bg-[#003366] text-white px-4 py-2 text-sm font-semibold hover:opacity-95 disabled:opacity-60"
                disabled={betaStatus === "sending"}
              >
                {betaStatus === "sending" ? "Joining..." : "Join beta list"}
              </button>
            </div>
            {betaStatus === "sent" && (
              <p className="mt-2 text-xs text-emerald-600">Thanks! We’ll reach out with beta invites and free sessions.</p>
            )}
            {betaStatus === "error" && (
              <p className="mt-2 text-xs text-red-500">{betaError ?? "Please enter a valid email."}</p>
            )}
            <div className="mt-4 text-[11px] text-[#003366]/55">
              Individual practice is coming soon. Institutions can continue using the platform today.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
