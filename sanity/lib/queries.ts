import { groq } from 'next-sanity';

// Example queries for common use cases

// Fetch all published blog posts
export const POSTS_QUERY = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  _createdAt,
  eyebrow,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  "author": author->{
    name,
    image
  }
}`;

// Fetch a single post by slug
export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  _createdAt,
  eyebrow,
  title,
  slug,
  excerpt,
  body,
  mainImage,
  publishedAt,
  "author": author->{
    name,
    image,
    bio
  },
  "categories": categories[]->title
}`;

// Fetch all testimonials
export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial" && published == true] | order(order asc) {
  _id,
  name,
  role,
  company,
  content,
  image,
  rating
}`;

// Fetch all case studies
export const CASE_STUDIES_QUERY = groq`*[_type == "caseStudy" && published == true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  client,
  excerpt,
  mainImage,
  metrics,
  publishedAt
}`;
