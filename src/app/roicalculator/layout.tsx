import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Placement Cost Calculator for Career & Workforce Programs | Clarivue",
  description:
    "Calculate the cost of the training-to-employment gap in your program. Quantify failed placements, advisor overtime, and employer churn with hard numbers.",
  openGraph: {
    title:
      "Placement Cost Calculator for Career & Workforce Programs",
    description:
      "Run your numbers to estimate the true cost of failed placements, advisor overtime, and employer churn.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io/placement-cost-calculator",
    images: [
      {
        url: "https://clarivue.io/images/roi-calculator-preview.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Placement Cost Calculator",
    description:
      "See the measurable cost of the training-to-employment gap before it compounds.",
    images: ["https://clarivue.io/images/roi-calculator-preview.png"],
  },
  alternates: {
    canonical: "https://clarivue.io/placement-cost-calculator",
  },
};

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
