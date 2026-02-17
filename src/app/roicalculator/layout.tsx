import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Improve Placement Outcomes & Calculate Interview Readiness ROI | Clarivue",
  description:
    "See how early interview gap detection reduces failed placements, saves advisor hours, and improves employer outcomes. Use Clarivue's ROI calculator to model your impact.",
  openGraph: {
    title:
      "Interview Readiness ROI Calculator for Career & Workforce Programs",
    description:
      "Model the cost savings of early interview gap detection. Reduce failed interviews, save advisor time, and improve placement outcomes.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io/roi-calculator",
    images: [
      {
        url: "https://clarivue.io/images/roi-calculator-preview.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Readiness ROI Calculator",
    description:
      "See the measurable impact of improving interview readiness before employer referrals go out.",
    images: ["https://clarivue.io/images/roi-calculator-preview.png"],
  },
  alternates: {
    canonical: "https://clarivue.io/roi-calculator",
  },
};

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
