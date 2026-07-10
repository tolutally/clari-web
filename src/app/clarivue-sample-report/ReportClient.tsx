"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ReportView from "@/components/report/ReportView";
import ReportCtaDock from "./ReportCtaDock";

/**
 * Thin client wrapper around the report.
 *
 * The report page itself is the ungated magnet — it must stay fully open.
 * The floating `ReportCtaDock` is the single funnel hook: it slides up after
 * ~65% scroll and its button opens the email card. On submit we capture the
 * email via MailerLite (posted through a hidden iframe) and open the tracked
 * download success page in a new tab, which fires the conversion event and
 * downloads the report-pack zip (served from /report-files).
 */
const MAILERLITE_ACTION =
  "https://assets.mailerlite.com/jsonp/2466380/forms/192568359642990002/subscribe";

const DOWNLOAD_SUCCESS_URL =
  "/clarivue-sample-report/downloaded?file=/report-files/Clarivue-Report-Pack.zip";

export default function ReportClient() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleSubmit = () => {
    // The form posts the email to MailerLite via the hidden iframe. Open the
    // tracked download page in a new tab so the conversion event fires and the
    // zip downloads, then close the card.
    window.open(DOWNLOAD_SUCCESS_URL, "_blank", "noopener,noreferrer");
    close();
  };

  return (
    <>
      <ReportView />

      <ReportCtaDock onGetPack={() => setOpen(true)} />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 text-slate transition-colors hover:text-navy"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral-deep">
              The report pack
            </div>
            <h3 className="mt-2 font-serif text-[22px] font-semibold text-navy">
              Where should we send it?
            </h3>
            <p className="mt-2 text-[14px] text-slate">
              The filled sample report, the editable funder-ready template, and the data checklist.
            </p>

            <form
              action={MAILERLITE_ACTION}
              method="post"
              target="ml-report-pack-frame"
              onSubmit={handleSubmit}
              className="mt-5 space-y-3"
            >
              <input
                aria-label="email"
                aria-required="true"
                type="email"
                name="fields[email]"
                placeholder="Email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[14px] text-navy placeholder:text-dim focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
              />
              <input type="hidden" name="ml-submit" value="1" />
              <input type="hidden" name="anticsrf" value="true" />
              <button
                type="submit"
                className="w-full rounded-lg bg-coral px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-coral-deep"
              >
                Send my report pack
              </button>
            </form>

            <p className="mt-4 text-center font-mono text-[11px] text-dim">
              No demo. No credit card.
            </p>

            <iframe
              name="ml-report-pack-frame"
              title="report-pack-submit"
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  );
}
