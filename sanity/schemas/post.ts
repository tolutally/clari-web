import { defineType, defineField } from 'sanity';

/**
 * Enhanced Blog Post Schema with writing tools
 */
export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta & SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // ===== CONTENT GROUP =====
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      group: 'content',
      description: 'Optional small label above the title (e.g., "FEATURED", "INDUSTRY NEWS", "NEW")',
      validation: (Rule) => Rule.max(30).warning('Keep eyebrow labels short'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Keep it compelling and under 60 characters for best SEO',
      validation: (Rule) => [
        Rule.required().error('Title is required'),
        Rule.max(100).warning('Titles over 100 characters may be truncated'),
      ],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      description: 'Optional subtitle or tagline for the post',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required().error('Slug is required for the URL'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 4,
      description: 'Brief summary (150-160 chars ideal for SEO). Appears in blog cards and search results.',
      validation: (Rule) => [
        Rule.max(300).warning('Excerpts over 300 characters may be truncated'),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      description: 'Main image for the post. Recommended: 1200x630px for social sharing.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Important for accessibility and SEO. Describe the image.',
          validation: (Rule: any) => Rule.required().error('Alt text is required for accessibility'),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption to display below the image',
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'richText',
      group: 'content',
    }),

    // ===== META & SEO GROUP =====
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'meta',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override the default title for search engines (50-60 characters)',
          validation: (Rule: any) => Rule.max(70).warning('Keep under 70 characters'),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines (150-160 characters)',
          validation: (Rule: any) => Rule.max(160).warning('Keep under 160 characters'),
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
          description: 'Add relevant keywords for this post',
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'If this content exists elsewhere, specify the original URL',
        },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'meta',
      description: 'Custom image for social media (1200x630px). Falls back to featured image.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'author' }],
      description: 'Who wrote this post?',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Categorize this post for better organization',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Add tags for related content discovery',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: { type: 'post' } }],
      validation: (Rule) => Rule.max(3).warning('Recommend 3 or fewer related posts'),
      description: 'Manually select related posts to show at the end',
    }),

    // ===== SETTINGS GROUP =====
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'settings',
      description: 'When should this post go live?',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'settings',
      description: 'When was this post last updated?',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Show this post in the featured section on the blog page',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          { title: '📝 Draft', value: 'draft' },
          { title: '👀 In Review', value: 'review' },
          { title: '✅ Published', value: 'published' },
          { title: '📅 Scheduled', value: 'scheduled' },
          { title: '🗄️ Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      group: 'settings',
      description: 'Estimated reading time. Leave blank to auto-calculate.',
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: 'hideFromSearch',
      title: 'Hide from Search Engines',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Add noindex tag to prevent search engine indexing',
    }),

    // ===== FAQ (optional — generates FAQPage rich snippet) =====
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'meta',
      of: [{ type: 'faqItem' }],
      description:
        'Optional FAQ section for this post. Renders a visible accordion and generates FAQPage JSON-LD structured data for Google rich results. Each post should have unique questions.',
    }),
  ],
  orderings: [
    {
      title: 'Publish Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Publish Date, Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
      publishedAt: 'publishedAt',
    },
    prepare({ title, author, media, status, publishedAt }) {
      const statusIcons: Record<string, string> = {
        draft: '📝',
        review: '👀',
        published: '✅',
        scheduled: '📅',
        archived: '🗄️',
      };
      const icon = statusIcons[status] || '📄';
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date';
      
      return {
        title: `${icon} ${title || 'Untitled'}`,
        subtitle: `${author ? `by ${author}` : 'No author'} • ${date}`,
        media,
      };
    },
  },
});
