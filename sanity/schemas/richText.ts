import { defineType, defineArrayMember } from 'sanity';

/**
 * Enhanced Rich Text Schema with writing tools
 * Includes callouts, code blocks, embeds, and more
 */
export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    // Standard text blocks with annotations
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
        { title: 'Checklist', value: 'checklist' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Code', value: 'code' },
          { title: 'Highlight', value: 'highlight' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule: any) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{ type: 'post' }],
              },
            ],
          },
        ],
      },
    }),

    // Images with full options
    defineArrayMember({
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Important for accessibility',
          validation: (Rule: any) => Rule.required().error('Alt text is required'),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'alignment',
          type: 'string',
          title: 'Alignment',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' },
              { title: 'Full Width', value: 'full' },
            ],
          },
          initialValue: 'center',
        },
      ],
    }),

    // Callout/Alert boxes
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              { title: '💡 Tip', value: 'tip' },
              { title: '📝 Note', value: 'note' },
              { title: '⚠️ Warning', value: 'warning' },
              { title: '🚨 Important', value: 'important' },
              { title: '✅ Success', value: 'success' },
            ],
          },
          initialValue: 'note',
        },
        {
          name: 'title',
          type: 'string',
          title: 'Title (Optional)',
        },
        {
          name: 'content',
          type: 'text',
          title: 'Content',
          rows: 3,
        },
      ],
      preview: {
        select: {
          type: 'type',
          title: 'title',
          content: 'content',
        },
        prepare({ type, title, content }) {
          const icons: Record<string, string> = {
            tip: '💡',
            note: '📝',
            warning: '⚠️',
            important: '🚨',
            success: '✅',
          };
          return {
            title: title || `${icons[type] || '📌'} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            subtitle: content?.substring(0, 50) + (content?.length > 50 ? '...' : ''),
          };
        },
      },
    }),

    // Code block
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block',
      fields: [
        {
          name: 'language',
          type: 'string',
          title: 'Language',
          options: {
            list: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'Python', value: 'python' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash', value: 'bash' },
              { title: 'SQL', value: 'sql' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'Plain Text', value: 'text' },
            ],
          },
          initialValue: 'javascript',
        },
        {
          name: 'filename',
          type: 'string',
          title: 'Filename (Optional)',
          description: 'Show a filename tab above the code',
        },
        {
          name: 'code',
          type: 'text',
          title: 'Code',
          rows: 10,
        },
        {
          name: 'highlightLines',
          type: 'string',
          title: 'Highlight Lines',
          description: 'Comma-separated line numbers to highlight (e.g., "1,3,5-7")',
        },
      ],
      preview: {
        select: {
          language: 'language',
          filename: 'filename',
          code: 'code',
        },
        prepare({ language, filename, code }) {
          return {
            title: filename || `Code (${language})`,
            subtitle: code?.substring(0, 40) + '...',
          };
        },
      },
    }),

    // YouTube embed
    defineArrayMember({
      type: 'object',
      name: 'youtube',
      title: 'YouTube Video',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'YouTube URL',
          description: 'Paste the full YouTube video URL',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption (Optional)',
        },
      ],
      preview: {
        select: { url: 'url', caption: 'caption' },
        prepare({ url, caption }) {
          return {
            title: '🎬 YouTube Video',
            subtitle: caption || url,
          };
        },
      },
    }),

    // Table
    defineArrayMember({
      type: 'object',
      name: 'table',
      title: 'Table',
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Table Caption (Optional)',
        },
        {
          name: 'rows',
          type: 'array',
          title: 'Rows',
          of: [
            {
              type: 'object',
              name: 'row',
              fields: [
                {
                  name: 'cells',
                  type: 'array',
                  title: 'Cells',
                  of: [{ type: 'string' }],
                },
                {
                  name: 'isHeader',
                  type: 'boolean',
                  title: 'Header Row',
                  initialValue: false,
                },
              ],
              preview: {
                select: { cells: 'cells', isHeader: 'isHeader' },
                prepare({ cells, isHeader }) {
                  return {
                    title: (isHeader ? '📋 ' : '') + (cells?.join(' | ') || 'Empty row'),
                  };
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: { caption: 'caption', rows: 'rows' },
        prepare({ caption, rows }) {
          return {
            title: '📊 Table',
            subtitle: caption || `${rows?.length || 0} rows`,
          };
        },
      },
    }),

    // Divider/Separator
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      icon: () => '―',
      fields: [
        {
          name: 'style',
          type: 'string',
          title: 'Style',
          options: {
            list: [
              { title: 'Line', value: 'line' },
              { title: 'Dots', value: 'dots' },
              { title: 'Space', value: 'space' },
            ],
          },
          initialValue: 'line',
        },
      ],
      preview: {
        prepare() {
          return { title: '─── Divider ───' };
        },
      },
    }),

    // Button/CTA
    defineArrayMember({
      type: 'object',
      name: 'button',
      title: 'Button / CTA',
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Button Text',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'url',
          type: 'url',
          title: 'URL',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'style',
          type: 'string',
          title: 'Style',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Outline', value: 'outline' },
            ],
          },
          initialValue: 'primary',
        },
        {
          name: 'alignment',
          type: 'string',
          title: 'Alignment',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' },
            ],
          },
          initialValue: 'left',
        },
      ],
      preview: {
        select: { text: 'text', style: 'style' },
        prepare({ text, style }) {
          return {
            title: `🔘 ${text}`,
            subtitle: `${style} button`,
          };
        },
      },
    }),

    // Quote with attribution
    defineArrayMember({
      type: 'object',
      name: 'pullQuote',
      title: 'Pull Quote',
      fields: [
        {
          name: 'quote',
          type: 'text',
          title: 'Quote',
          rows: 3,
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'layout',
          type: 'string',
          title: 'Layout',
          options: {
            list: [
              { title: 'Centered', value: 'centered' },
              { title: 'Landscape Card', value: 'landscape' },
            ],
            layout: 'radio',
          },
          initialValue: 'centered',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
          description: 'Who said this?',
        },
        {
          name: 'role',
          type: 'string',
          title: 'Role/Title',
        },
        {
          name: 'authorImage',
          type: 'image',
          title: 'Author Image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
      ],
      preview: {
        select: { quote: 'quote', attribution: 'attribution', layout: 'layout', media: 'authorImage' },
        prepare({ quote, attribution, layout, media }) {
          return {
            title: `"${quote?.substring(0, 50)}..."`,
            subtitle: [attribution ? `— ${attribution}` : undefined, layout === 'landscape' ? 'Landscape card' : 'Centered']
              .filter(Boolean)
              .join(' • '),
            media,
          };
        },
      },
    }),
  ],
});
