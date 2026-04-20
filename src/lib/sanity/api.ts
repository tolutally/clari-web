import { client } from '../../../sanity/lib/client';
import { POSTS_QUERY, TESTIMONIALS_QUERY } from '../../../sanity/lib/queries';

/**
 * Utility functions for fetching data from Sanity CMS
 */

// Fetch all posts
export async function getPosts() {
  return client.fetch(POSTS_QUERY);
}

// Fetch a single post by slug with all fields for the blog detail page
export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      subtitle,
      slug,
      excerpt,
      body,
      mainImage {
        ...,
        "alt": alt,
        "caption": caption
      },
      publishedAt,
      updatedAt,
      readingTime,
      status,
      featured,
      hideFromSearch,
      seo {
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl
      },
      tags,
      "author": author->{
        name,
        image,
        bio,
        role,
        social {
          twitter,
          linkedin,
          github,
          website
        }
      },
      "categories": categories[]->title,
      "relatedPosts": relatedPosts[]->{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        publishedAt
      },
      faqs[] {
        question,
        answer
      }
    }`,
    { slug }
  );
}

// Fetch related posts (by category or recent)
export async function getRelatedPosts(
  currentSlug: string,
  category: string | null,
  limit: number = 3
) {
  // If we have a category, prioritize posts from the same category
  if (category) {
    const posts = await client.fetch(
      `*[_type == "post" && slug.current != $currentSlug && $category in categories[]->title && status == "published"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        publishedAt,
        "categories": categories[]->title
      }`,
      { currentSlug, category, limit }
    );
    
    // If we found enough posts, return them
    if (posts && posts.length >= limit) {
      return posts;
    }
    
    // Otherwise, fill with recent posts
    const remaining = limit - (posts?.length || 0);
    const existingIds = posts?.map((p: any) => p._id) || [];
    
    const morePosts = await client.fetch(
      `*[_type == "post" && slug.current != $currentSlug && !(_id in $existingIds) && status == "published"] | order(publishedAt desc)[0...$remaining] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        publishedAt,
        "categories": categories[]->title
      }`,
      { currentSlug, existingIds, remaining }
    );
    
    return [...(posts || []), ...(morePosts || [])].slice(0, limit);
  }
  
  // No category, just get recent posts
  return client.fetch(
    `*[_type == "post" && slug.current != $currentSlug && status == "published"] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      "categories": categories[]->title
    }`,
    { currentSlug, limit }
  );
}

// Fetch all testimonials
export async function getTestimonials() {
  return client.fetch(TESTIMONIALS_QUERY);
}

// Fetch all case studies
export async function getCaseStudies() {
  return client.fetch(
    `*[_type == "caseStudy" && published == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      client,
      excerpt,
      mainImage,
      metrics,
      industry,
      publishedAt
    }`
  );
}

// Fetch a single case study by slug
export async function getCaseStudyBySlug(slug: string) {
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      client,
      excerpt,
      body,
      mainImage,
      metrics,
      industry,
      publishedAt
    }`,
    { slug }
  );
}
