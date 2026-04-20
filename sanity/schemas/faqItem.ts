import { defineType, defineField } from 'sanity';

/**
 * Reusable FAQ item object type.
 *
 * Embed this in any document (blog posts, landing pages) via:
 *   { type: 'array', of: [{ type: 'faqItem' }] }
 *
 * Used to power both visible FAQ accordions and FAQPage JSON-LD
 * structured data for Google rich results.
 */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'The question as it appears on the site and in Google rich snippets.',
      validation: (Rule) => Rule.required().error('Question is required'),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      description:
        'Plain-text answer. Keep it concise — Google may truncate long answers in rich snippets.',
      validation: (Rule) => [
        Rule.required().min(20).error('Answer must be at least 20 characters'),
        Rule.max(1000).warning('Answers over 1 000 characters may be truncated in search results'),
      ],
    }),
  ],
  preview: {
    select: { title: 'question' },
  },
});
