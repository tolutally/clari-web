"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText, Minus } from "lucide-react";

/**
 * Floating report-pack CTA.
 *
 * Slides up from the bottom-right once the reader passes ~65% scroll depth
 * (peak conviction). Minimizable to a compact pill; restoring re-expands it.
 * The primary button calls `onGetPack`, which opens the email gate in
 * ReportClient. Appears once per session and never auto-hides.
 */
export default function ReportCtaDock({ onGetPack }: { onGetPack: () => void }) {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      if (pct >= 0.65) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // in case the page is already scrolled/short
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-[560px]:bottom-4 max-[560px]:right-4">
      <AnimatePresence mode="wait" initial={false}>
        {minimized ? (
          <motion.button
            key="pill"
            type="button"
            onClick={() => setMinimized(false)}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-[14px] font-semibold text-white shadow-[0_16px_40px_-16px_rgba(226,78,83,0.6)] transition-colors hover:bg-coral-deep"
          >
            <FileText className="h-4 w-4" />
            Get the report pack
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_30px_70px_-24px_rgba(16,44,100,0.4)]"
          >
            <button
              type="button"
              onClick={() => setMinimized(true)}
              aria-label="Minimize"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-slate transition-colors hover:bg-line/60 hover:text-navy"
            >
              <Minus className="h-4 w-4" strokeWidth={2.4} />
            </button>

            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral-deep">
              Adapt this for your program
            </div>
            <h3 className="mt-2 max-w-[24ch] font-serif text-[20px] font-semibold leading-tight text-navy">
              Want a report like this for your cohorts?
            </h3>
            <p className="mt-2 text-[13.5px] leading-snug text-slate">
              Get the sample report and the editable, funder-ready template. Fill in what you already
              track, and see what is worth capturing next.
            </p>
            <button
              type="button"
              onClick={onGetPack}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coral px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-coral-deep"
            >
              Get the report pack
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="mt-3 text-center font-mono text-[11px] text-dim">
              No demo. No credit card.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
