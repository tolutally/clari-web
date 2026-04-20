"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FAQSchema from "@/components/FAQSchema";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  heading?: string;
  subtitle?: string;
}

export default function FAQSection({
  faqs,
  heading = "Frequently Asked Questions",
  subtitle = "Everything you need to know about how Clarivue helps institutions scale interview readiness.",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-20" id="faq">
      <FAQSchema items={faqs} />

      <div className="text-center mb-10">
        <span className="inline-block rounded-full bg-[#003366]/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#003366]/70 uppercase mb-4">
          FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#003366]">
          {heading}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[#003366]/60 max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "border-[#003366]/15 bg-white shadow-sm"
                  : "border-transparent bg-white/60 hover:bg-white hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium text-[#003366]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#003366]/40 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-96 pb-5" : "max-h-0"
                }`}
              >
                <p className="px-6 text-sm leading-relaxed text-[#003366]/65">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
