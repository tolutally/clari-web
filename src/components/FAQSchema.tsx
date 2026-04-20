interface FAQSchemaItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQSchemaItem[];
}

export default function FAQSchema({ items }: FAQSchemaProps) {
  if (!items || !items.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
