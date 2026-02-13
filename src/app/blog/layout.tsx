import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Clarivue - Interview Prep Insights & Career Tips',
  description: 'Discover expert insights on interview preparation, career development, and placement success. Learn how to help learners ace their interviews with AI-powered coaching.',
  openGraph: {
    title: 'Blog | Clarivue',
    description: 'Expert insights on interview preparation and career development.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
