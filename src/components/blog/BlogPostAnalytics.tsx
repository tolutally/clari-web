'use client';

import { track } from '@vercel/analytics';
import { useEffect } from 'react';

type BlogPostAnalyticsProps = {
  slug: string;
  title: string;
};

export function BlogPostAnalytics({ slug, title }: BlogPostAnalyticsProps) {
  useEffect(() => {
    const sessionKey = `blog-post-view:${slug}`;

    if (typeof window !== 'undefined' && window.sessionStorage.getItem(sessionKey)) {
      return;
    }

    track('blog_post_view', {
      slug,
      title,
      path: `/blog/${slug}`,
    });

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(sessionKey, '1');
    }
  }, [slug, title]);

  return null;
}