import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import {
  DocumentIcon,
  UsersIcon,
  TagIcon,
  StarIcon,
  DocumentTextIcon,
  CogIcon,
} from '@sanity/icons';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mw8wbsmh';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Custom desk structure for better content organization
const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Blog section
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('All Posts')
                .icon(DocumentIcon)
                .child(S.documentTypeList('post').title('All Posts')),
              S.divider(),
              S.listItem()
                .title('Published Posts')
                .icon(DocumentIcon)
                .child(
                  S.documentList()
                    .title('Published Posts')
                    .filter('_type == "post" && status == "published"')
                ),
              S.listItem()
                .title('Drafts')
                .icon(DocumentIcon)
                .child(
                  S.documentList()
                    .title('Drafts')
                    .filter('_type == "post" && (status == "draft" || !defined(status))')
                ),
              S.listItem()
                .title('In Review')
                .icon(DocumentIcon)
                .child(
                  S.documentList()
                    .title('In Review')
                    .filter('_type == "post" && status == "review"')
                ),
              S.listItem()
                .title('Featured Posts')
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title('Featured Posts')
                    .filter('_type == "post" && featured == true')
                ),
            ])
        ),

      S.divider(),

      // Authors
      S.listItem()
        .title('Authors')
        .icon(UsersIcon)
        .child(S.documentTypeList('author').title('Authors')),

      // Categories
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),

      S.divider(),

      // Marketing content
      S.listItem()
        .title('Marketing')
        .icon(StarIcon)
        .child(
          S.list()
            .title('Marketing Content')
            .items([
              S.listItem()
                .title('Testimonials')
                .child(S.documentTypeList('testimonial').title('Testimonials')),
              S.listItem()
                .title('Case Studies')
                .child(S.documentTypeList('caseStudy').title('Case Studies')),
            ])
        ),
    ]);

export default defineConfig({
  name: 'default',
  title: 'Clarivue CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/admin',

  // Document actions customization
  document: {
    // Add helpful badges in the document list
    newDocumentOptions: (prev, { creationContext }) => {
      // Filter document types based on context
      if (creationContext.type === 'global') {
        return prev.filter((item) => 
          ['post', 'author', 'category', 'testimonial', 'caseStudy'].includes(item.templateId)
        );
      }
      return prev;
    },
  },
});
