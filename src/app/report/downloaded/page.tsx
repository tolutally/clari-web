import { Suspense } from "react";
import type { Metadata } from "next";
import DownloadRedirect from "./DownloadRedirect";

export const metadata: Metadata = {
  title: "Download starting… · Clarivue",
  robots: { index: false, follow: false },
};

export default function ReportDownloadedPage() {
  return (
    <Suspense>
      <DownloadRedirect />
    </Suspense>
  );
}
