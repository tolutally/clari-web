'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Helper to safely render content that might be plain text or portable text blocks
function getPlainText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    // It's a portable text array, extract text from blocks
    return content
      .filter((block) => block._type === 'block')
      .map((block) => block.children?.map((child: any) => child.text || '').join('') || '')
      .join(' ');
  }
  return String(content);
}

// This would come from Sanity in production
const CATEGORIES = ['All', 'Product Updates', 'Customer Stories', 'Interview Tips', 'Career Prep', 'Features'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from Sanity
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 relative overflow-x-clip font-[family-name:var(--font-jakarta)]">
        {/* Decorative Element - Top Right */}
        <div className="absolute top-16 right-4 sm:right-8 lg:right-16 pointer-events-none" aria-hidden="true">
          <svg
            width="120"
            height="160"
            viewBox="0 0 120 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#0a2140]"
          >
            <path
              d="M60 0C80 20 100 40 95 70C90 100 70 120 85 150C90 160 100 160 100 160H0V0H60Z"
              fill="currentColor"
              opacity="0.9"
            />
            <path
              d="M50 10C65 25 80 50 75 75C70 100 55 115 65 140"
              stroke="#ff686c"
              strokeWidth="3"
              fill="none"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Secondary decorative dot */}
        <div className="absolute top-44 right-36 w-4 h-4 bg-accent rounded-full opacity-70 hidden md:block" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8">Blog</h1>
            
            {/* Category Filter */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activeCategory === category
                      ? 'bg-foreground text-white shadow-lg shadow-foreground/20'
                      : 'bg-white text-foreground border border-gray-200 hover:border-foreground/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No blog posts yet</h3>
              <p className="text-gray-600 mb-6">Start creating content to share your insights and updates.</p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-full font-medium hover:bg-foreground/90 transition-all"
              >
                Go to Sanity Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <article className="mb-16 overflow-hidden rounded-[2rem] shadow-xl">
                  <div className="grid md:grid-cols-2 min-h-[420px]">
                    {/* Left: Content */}
                    <div className="bg-gradient-to-br from-[#0a2140] to-[#1a3a5a] p-8 sm:p-12 flex flex-col justify-center text-white order-2 md:order-1">
                      <div className="inline-block px-3 py-1 bg-accent rounded-full text-sm font-medium mb-4 w-fit">
                        Featured
                      </div>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        {featuredPost.title || "5 advantages of interview prep automation"}
                      </h2>
                      <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                        {getPlainText(featuredPost.excerpt) || "Discover how modern interview preparation tools help learners practice more effectively, get better feedback, and land offers faster."}
                      </p>
                      <Link
                        href={`/blog/${featuredPost.slug?.current || '#'}`}
                        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-medium hover:bg-accent/90 transition-all w-fit group"
                      >
                        Read full article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Right: Illustration/Image */}
                    <div className="bg-[#e8f4e8] relative overflow-hidden order-1 md:order-2 min-h-[250px] md:min-h-0">
                      {featuredPost.mainImage ? (
                        <Image
                          src={featuredPost.mainImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                          {/* Hand-drawn style illustration */}
                          <svg className="w-full h-full max-w-sm" viewBox="0 0 300 300" fill="none">
                            {/* Person figure */}
                            <ellipse cx="150" cy="100" rx="35" ry="40" stroke="#ff686c" strokeWidth="2.5" fill="none" />
                            {/* Hair */}
                            <path d="M120 80 Q130 60 150 65 Q170 60 180 80" stroke="#0a2140" strokeWidth="2.5" fill="none" />
                            {/* Body */}
                            <path d="M150 140 L150 200" stroke="#ff686c" strokeWidth="2.5" />
                            {/* Arms */}
                            <path d="M150 160 L110 190 L90 170" stroke="#ff686c" strokeWidth="2.5" fill="none" />
                            <path d="M150 160 L190 150 L220 170" stroke="#ff686c" strokeWidth="2.5" fill="none" />
                            {/* Laptop/device */}
                            <rect x="200" y="155" width="50" height="35" rx="4" stroke="#0a2140" strokeWidth="2" fill="white" />
                            <rect x="205" y="160" width="40" height="22" rx="2" fill="#0a2140" opacity="0.1" />
                            {/* Decorative circles */}
                            <circle cx="80" cy="80" r="15" fill="#ff686c" />
                            <circle cx="250" cy="220" r="8" fill="#ff686c" opacity="0.6" />
                            {/* Decorative lines - interview notes */}
                            <rect x="60" cy="180" width="45" height="60" rx="4" stroke="#0a2140" strokeWidth="1.5" fill="white" />
                            <line x1="68" y1="195" x2="95" y2="195" stroke="#0a2140" strokeWidth="1.5" opacity="0.3" />
                            <line x1="68" y1="205" x2="90" y2="205" stroke="#0a2140" strokeWidth="1.5" opacity="0.3" />
                            <line x1="68" y1="215" x2="92" y2="215" stroke="#0a2140" strokeWidth="1.5" opacity="0.3" />
                            {/* Progress bars */}
                            <rect x="180" y="250" width="80" height="8" rx="4" fill="#0a2140" opacity="0.2" />
                            <rect x="180" y="250" width="55" height="8" rx="4" fill="#ff686c" />
                            <rect x="180" y="265" width="80" height="6" rx="3" fill="#0a2140" opacity="0.15" />
                            <rect x="180" y="265" width="40" height="6" rx="3" fill="#0a2140" opacity="0.4" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )}

              {/* Blog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(regularPosts.length > 0 ? regularPosts : PLACEHOLDER_POSTS).map((post: any) => (
                  <article
                    key={post._id || post.id}
                    className="group bg-white rounded-[1.5rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <Link href={`/blog/${post.slug?.current || post.slug}`} className="block relative h-52 overflow-hidden">
                      {post.mainImage ? (
                        <Image
                          src={post.mainImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : post.illustrationType && CardIllustrations[post.illustrationType as keyof typeof CardIllustrations] ? (
                        CardIllustrations[post.illustrationType as keyof typeof CardIllustrations]()
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                            <svg className="w-10 h-10 text-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">
                          {post.category || 'Featured'}
                        </span>
                        <time className="text-gray-500">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Jan 15, 2026'}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                        <Link href={`/blog/${post.slug?.current || post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {getPlainText(post.excerpt)}
                        </p>
                      )}

                      {/* Author */}
                      {post.author && (
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center overflow-hidden">
                            {post.author.image ? (
                              <Image
                                src={post.author.image}
                                alt={post.author.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-accent font-bold text-sm">
                                {post.author.name?.charAt(0) || 'A'}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {post.author.name || 'Anonymous'}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// Placeholder posts for demonstration
const PLACEHOLDER_POSTS = [
  {
    id: '1',
    slug: 'interview-coaching-automation',
    title: 'How interview coaching automation works',
    excerpt: 'A deep dive into how AI-powered coaching helps learners prepare more effectively.',
    category: 'Features',
    publishedAt: '2026-02-10T00:00:00Z',
    author: { name: 'Sarah Chen' },
    illustrationType: 'photo',
  },
  {
    id: '2',
    slug: 'placement-success-metrics',
    title: '4 metrics that predict placement success',
    excerpt: 'Learn which readiness indicators correlate most strongly with offer rates.',
    category: 'Career Prep',
    publishedAt: '2026-02-08T00:00:00Z',
    author: { name: 'Marcus Johnson' },
    illustrationType: 'illustration',
  },
  {
    id: '3',
    slug: 'behavioral-interview-mastery',
    title: 'Mastering behavioral interviews in 2026',
    excerpt: 'Modern techniques for answering behavioral questions with confidence and clarity.',
    category: 'Interview Tips',
    publishedAt: '2026-02-05T00:00:00Z',
    author: { name: 'Elena Rodriguez' },
    illustrationType: 'person',
  },
];

// Card illustration components
const CardIllustrations = {
  photo: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0e8] to-[#d5e5d5]">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-sm transform rotate-[-8deg]" />
          <div className="absolute inset-2 bg-accent/20 rounded-xl" />
          <div className="absolute bottom-4 left-4 right-4 h-2 bg-accent/30 rounded" />
        </div>
      </div>
    </div>
  ),
  illustration: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#fff8e8] to-[#ffe8d0]">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <svg viewBox="0 0 120 120" className="w-32 h-32">
          {/* Person thinking */}
          <circle cx="60" cy="40" r="20" stroke="#ff686c" strokeWidth="2" fill="none" />
          <path d="M60 60 L60 85" stroke="#ff686c" strokeWidth="2" />
          <path d="M60 70 L45 80" stroke="#ff686c" strokeWidth="2" />
          <path d="M60 70 L75 60" stroke="#ff686c" strokeWidth="2" />
          {/* Thought bubble */}
          <circle cx="90" cy="25" r="12" fill="white" stroke="#0a2140" strokeWidth="1.5" />
          <circle cx="80" cy="35" r="4" fill="white" stroke="#0a2140" strokeWidth="1" />
          <text x="90" y="29" textAnchor="middle" fontSize="10" fill="#0a2140">?</text>
          {/* Decorative */}
          <circle cx="25" cy="90" r="8" fill="#ff686c" />
          <rect x="85" y="85" width="25" height="3" rx="1.5" fill="#0a2140" opacity="0.3" />
          <rect x="90" y="92" width="18" height="3" rx="1.5" fill="#0a2140" opacity="0.2" />
        </svg>
      </div>
    </div>
  ),
  person: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#f0f0f0] to-[#e5e5e5]">
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 140" className="h-full w-auto">
            {/* Simple person silhouette - professional look */}
            <ellipse cx="50" cy="30" rx="18" ry="20" fill="#8b7355" />
            <rect x="30" y="50" width="40" height="50" rx="4" fill="#d4c4b0" />
            <rect x="35" y="55" width="30" height="8" rx="2" fill="#0a2140" opacity="0.2" />
            {/* Arms */}
            <rect x="15" y="55" width="15" height="35" rx="4" fill="#d4c4b0" />
            <rect x="70" y="55" width="15" height="35" rx="4" fill="#d4c4b0" />
          </svg>
        </div>
      </div>
    </div>
  ),
};
