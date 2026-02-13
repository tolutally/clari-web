import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function BlogNotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Sorry, we couldn't find the blog post you're looking for. It may have been moved or deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-white rounded-full font-medium hover:bg-foreground/90 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-foreground border-2 border-gray-200 rounded-full font-medium hover:border-foreground/30 transition-all"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
