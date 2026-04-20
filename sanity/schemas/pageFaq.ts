import { defineType, defineField } from 'sanity';

/**
 * Page-level FAQ document.
 *
 * One document per page (homepage, ROI calculator, etc.).
 * Contains an ordered array of faqItem objects that power both the
 * visible FAQ accordion and the FAQPage JSON-LD structured data.
 */
export const pageFaq = defineType({
  name: 'pageFaq',
  title: 'Page FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      description: 'Which page these FAQs belong to. One document per page.',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'ROI Calculator', value: 'roicalculator' },
          { title: 'Book a Demo', value: 'book-demo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'faqItem' }],
      description: 'Add FAQ items. They render visually AND generate FAQPage structured data.',
      validation: (Rule) => Rule.required().min(1).error('Add at least one FAQ'),
    }),
  ],
  preview: {
    select: {
      title: 'page',
      faqs: 'faqs',
    },
    prepare({ title, faqs }) {
      const pageLabels: Record<string, string> = {
        homepage: 'Homepage',
        roicalculator: 'ROI Calculator',
        'book-demo': 'Book a Demo',
      };
      return {
        title: `${pageLabels[title] || title} FAQs`,
        subtitle: `${faqs?.length || 0} question${faqs?.length === 1 ? '' : 's'}`,
      };
    },
  },
});
