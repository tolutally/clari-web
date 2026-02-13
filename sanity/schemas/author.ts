import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'e.g., "Content Writer", "CEO", "Guest Author"',
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
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
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Short bio (1-2 sentences)',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      description: 'Contact email (not displayed publicly by default)',
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'twitter', type: 'url', title: 'Twitter/X URL' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn URL' },
        { name: 'github', type: 'url', title: 'GitHub URL' },
        { name: 'website', type: 'url', title: 'Personal Website' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
});
