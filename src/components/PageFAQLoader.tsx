"use client";

import { useEffect, useState } from "react";
import { client } from "../../sanity/lib/client";
import { PAGE_FAQS_QUERY } from "../../sanity/lib/queries";
import FAQSection from "@/components/FAQSection";

interface FAQItem {
  question: string;
  answer: string;
}

interface PageFAQLoaderProps {
  page: string;
  heading?: string;
  subtitle?: string;
}

/**
 * Client component that fetches FAQ data from Sanity for a given page
 * and renders the FAQ section with JSON-LD structured data.
 *
 * Renders nothing if the page has no FAQs in Sanity.
 *
 * Usage:
 *   <PageFAQLoader page="homepage" />
 *   <PageFAQLoader page="roicalculator" heading="ROI Calculator FAQs" />
 */
export default function PageFAQLoader({
  page,
  heading,
  subtitle,
}: PageFAQLoaderProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    client
      .fetch<{ faqs: FAQItem[] } | null>(PAGE_FAQS_QUERY, { page })
      .then((data) => {
        if (data?.faqs?.length) {
          setFaqs(data.faqs);
        }
      })
      .catch(() => {
        // Silently fail — no FAQs rendered
      });
  }, [page]);

  if (faqs.length === 0) return null;

  return <FAQSection faqs={faqs} heading={heading} subtitle={subtitle} />;
}
