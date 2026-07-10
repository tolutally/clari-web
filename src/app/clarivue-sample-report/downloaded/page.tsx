import { Suspense } from "react";
import type { Metadata } from "next";
import DownloadRedirect from "./DownloadRedirect";

export const metadata: Metadata = {
  title: "Your report pack is on the way… · Clarivue",
  robots: { index: false, follow: false },
};

export default function SampleReportDownloadedPage() {
  return (
    <Suspense>
      <DownloadRedirect />
    </Suspense>
  );
}
