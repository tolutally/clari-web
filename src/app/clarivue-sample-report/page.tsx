import type { Metadata } from "next";
import { Lora, DM_Sans, DM_Mono } from "next/font/google";
import ReportClient from "./ReportClient";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-report-serif",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-report-sans",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-report-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Program Performance & Readiness Report — Sample | Clarivue",
  description:
    "A funder-ready program report that turns workforce activity into defensible evidence of impact. See the sample.",
};

export default function ReportPage() {
  return (
    <main
      className={`${lora.variable} ${dmSans.variable} ${dmMono.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-report-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <ReportClient />
    </main>
  );
}
