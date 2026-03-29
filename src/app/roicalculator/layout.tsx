import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "The Hidden Gap | What's the training-to-employment gap costing you? | Clarivue",
  description:
    "Calculate the cost of the training-to-employment gap in your program. Quantify lost time, wasted money, and missing placements.",
  openGraph: {
    title:
      "The Hidden Gap | Clarivue",
    description:
      "See what the gap between training and employment is actually costing your program.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io/hidden-gap",
    images: [
      {
        url: "https://clarivue.io/images/roi-calculator-preview.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hidden Gap",
    description:
      "See what the gap is costing your program before it compounds.",
    images: ["https://clarivue.io/images/roi-calculator-preview.png"],
  },
  alternates: {
    canonical: "https://clarivue.io/hidden-gap",
  },
};

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
