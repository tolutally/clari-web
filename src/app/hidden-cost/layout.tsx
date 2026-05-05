import type { Metadata } from "next";
import { ApolloScripts } from "@/components/ApolloScripts";

export const metadata: Metadata = {
  title: "The Hidden Cost · What's your placement workflow costing you?",
  description:
    "Most programs have never seen what their placement workflow is really costing. Every cohort that runs without it pays the same. See yours in 2 minutes.",
  openGraph: {
    title: "The Hidden Cost · What's your placement workflow costing you?",
    description:
      "Most programs have never seen what their placement workflow is really costing. Every cohort that runs without it pays the same. See yours in 2 minutes.",
    type: "website",
    siteName: "Clarivue",
    url: "https://clarivue.io/hidden-cost",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hidden Cost · What's your placement workflow costing you?",
    description:
      "Most programs have never seen what their placement workflow is really costing. Every cohort that runs without it pays the same. See yours in 2 minutes.",
  },
  alternates: {
    canonical: "https://clarivue.io/hidden-cost",
  },
};

export default function HiddenCostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ApolloScripts />
      {children}
    </>
  );
}
