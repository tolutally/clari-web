import type { PortableTextBlock } from 'sanity';

/**
 * TypeScript types for Sanity documents
 */

export type SanityImage = {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
};

export type Author = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image?: SanityImage;
  bio?: PortableTextBlock[];
};

export type Category = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
};

export type Post = {
  _id: string;
  _createdAt: string;
  eyebrow?: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  author?: Author;
  categories?: string[];
  publishedAt: string;
  featured?: boolean;
  faqs?: FAQItem[];
};

export type Testimonial = {
  _id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: SanityImage;
  rating: number;
  published: boolean;
  order: number;
};

export type CaseStudyMetric = {
  label: string;
  value: string;
  description?: string;
};

export type CaseStudy = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  client: string;
  excerpt?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  metrics?: CaseStudyMetric[];
  industry?: 'bootcamp' | 'university' | 'workforce' | 'other';
  publishedAt: string;
  published: boolean;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type PageFaq = {
  _id: string;
  page: string;
  faqs: FAQItem[];
};
