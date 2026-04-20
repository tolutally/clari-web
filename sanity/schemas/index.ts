import { post } from './post';
import { author } from './author';
import { category } from './category';
import { testimonial } from './testimonial';
import { caseStudy } from './caseStudy';
import { faqItem } from './faqItem';
import { pageFaq } from './pageFaq';
import { richText } from './richText';

export const schemaTypes = [
  // Types (reusable)
  richText,
  faqItem,

  // Documents
  post,
  author,
  category,
  testimonial,
  caseStudy,
  pageFaq,
];
