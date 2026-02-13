"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: string;
  publishedAt: string;
  categories?: string[];
  author?: {
    name: string;
    image?: string;
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryLabel(categories?: string[]): string {
  if (!categories || categories.length === 0) return "Blog";
  return categories[0];
}

export function BlogInsights() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="pt-10 md:pt-12 pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
              Guides & Resources
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-[#003366]/10 overflow-hidden animate-pulse">
                <div className="h-52 bg-[#003366]/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 bg-[#003366]/10 rounded-full" />
                  <div className="h-5 w-3/4 bg-[#003366]/10 rounded" />
                  <div className="h-3 w-full bg-[#003366]/5 rounded" />
                  <div className="h-3 w-2/3 bg-[#003366]/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="pt-10 md:pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#003366]">
            Explore Clarivue insights
          </h2>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#02294f] shadow-md shadow-[#003366]/15"
          >
            Explore all
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="group rounded-3xl border border-[#003366]/10 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#003366]/8 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-[#003366]/5">
                {post.mainImage ? (
                  <Image
                    src={post.mainImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#b8ccf4]/40 to-[#003366]/10 flex items-center justify-center">
                    <span className="text-4xl text-[#003366]/20 font-bold">C</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-[#e8f4f8]/30 to-white">
                {/* Category + Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center rounded-full bg-[#e8f4f8] px-3 py-1 text-xs font-semibold text-[#003366]">
                    {getCategoryLabel(post.categories)}
                  </span>
                  <span className="text-xs text-[#003366]/50">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#003366] leading-snug tracking-tight mb-2 line-clamp-2 group-hover:text-[#003366]/80 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-sm text-[#003366]/60 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                )}

                {/* Read CTA */}
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#003366] border border-[#003366]/20 rounded-full px-4 py-2 transition-all duration-300 group-hover:bg-[#003366] group-hover:text-white group-hover:border-[#003366]">
                    Read this {getCategoryLabel(post.categories).toLowerCase()}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-[#003366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#003366]/15"
          >
            Explore all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
