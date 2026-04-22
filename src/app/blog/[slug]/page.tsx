import { getPostBySlug, getRelatedPosts } from '@/lib/sanity/api';
import { PortableText, toPlainText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '../../../../sanity/lib/image';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Share2, 
  Twitter,
  Linkedin,
  Link2,
  BookOpen,
  ChevronRight,
  Tag
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShareButtons } from '@/components/blog/ShareButtons';
import FAQSection from '@/components/FAQSection';
import type { Metadata } from 'next';

export const revalidate = 60;

// Helper to safely render content that might be plain text or portable text blocks
function getPlainText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    // It's a portable text array, convert to plain text
    try {
      return toPlainText(content);
    } catch {
      return '';
    }
  }
  return String(content);
}

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  const ogImage = post.mainImage 
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : '/og-default.jpg';

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || `Read ${post.title} on Clarivue Blog`,
    keywords: post.seo?.keywords?.join(', '),
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: post.author ? [post.author.name] : undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || '',
      images: [ogImage],
    },
    robots: post.hideFromSearch ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: post.seo?.canonicalUrl || `/blog/${slug}`,
    },
  };
}

// Calculate reading time from body content
function calculateReadingTime(body: any[]): number {
  if (!body) return 5;
  const text = body
    .filter((block: any) => block._type === 'block')
    .map((block: any) => block.children?.map((c: any) => c.text).join(' '))
    .join(' ');
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Extract headings for table of contents
function extractHeadings(body: any[]): { text: string; level: number; id: string }[] {
  if (!body) return [];
  return body
    .filter((block: any) => 
      block._type === 'block' && 
      ['h2', 'h3'].includes(block.style)
    )
    .map((block: any) => {
      const text = block.children?.map((c: any) => c.text).join('') || '';
      return {
        text,
        level: block.style === 'h2' ? 2 : 3,
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };
    });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readingTime = post.readingTime || calculateReadingTime(post.body);
  const headings = extractHeadings(post.body);
  const relatedPosts = await getRelatedPosts(slug, post.categories?.[0] || null, 3);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage ? urlForImage(post.mainImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Clarivue',
      logo: {
        '@type': 'ImageObject',
        url: 'https://clarivue.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clarivue.com/blog/${slug}`,
    },
  };

  return (
    <>
      <Header />
      
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* FAQ JSON-LD (only if post has FAQs) — rendered via FAQSection below */}

      <article className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0a2140] transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/blog" className="hover:text-[#0a2140] transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <header className="bg-gradient-to-br from-[#0a2140] via-[#0f2d50] to-[#1a4060] text-white pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category: string, index: number) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}

              {/* Eyebrow + Title */}
              {post.eyebrow && (
                <span className="inline-block px-3 py-1 bg-[#ff686c] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
                  {post.eyebrow}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Subtitle */}
              {post.subtitle && (
                <p className="text-xl text-gray-300 mb-6">{post.subtitle}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-300 text-sm sm:text-base">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                      {post.author.image ? (
                        <Image
                          src={urlForImage(post.author.image).width(80).height(80).url()}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#ff686c]">
                          <span className="text-white font-bold">
                            {post.author.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-white">{post.author.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-gray-300">
                  {post.publishedAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Main Content */}
            <main className="lg:col-span-8">
              {/* Featured Image */}
              {post.mainImage && (
                <figure className="mb-10 -mt-20 relative">
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={urlForImage(post.mainImage).width(1200).height(675).url()}
                      alt={post.mainImage.alt || post.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                  {post.mainImage.caption && (
                    <figcaption className="text-center text-sm text-gray-500 mt-3">
                      {post.mainImage.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Excerpt/Lead */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed mb-10 font-medium border-l-4 border-[#ff686c] pl-6">
                  {getPlainText(post.excerpt)}
                </p>
              )}

              {/* Article Body */}
              {post.body && (
                <div className="prose prose-lg max-w-none font-[family-name:var(--font-jakarta)]
                  prose-headings:font-bold prose-headings:text-[#0a2140]
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:scroll-mt-24
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-24
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-[#ff686c] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#0a2140]
                  prose-blockquote:border-l-[#ff686c] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
                  prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-[#0a2140] prose-pre:text-gray-100
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-li:text-gray-700
                  prose-ul:my-6 prose-ol:my-6
                ">
                  <PortableText
                    value={post.body}
                    components={{
                      types: {
                        // Image with caption and alignment
                        image: ({ value }) => (
                          <figure className={`my-8 ${value.alignment === 'full' ? '-mx-4 sm:-mx-8' : ''}`}>
                            <div className={`relative overflow-hidden rounded-xl shadow-lg ${
                              value.alignment === 'left' ? 'float-left mr-6 mb-4 w-1/2' :
                              value.alignment === 'right' ? 'float-right ml-6 mb-4 w-1/2' :
                              'w-full'
                            }`}>
                              <Image
                                src={urlForImage(value).width(1200).url()}
                                alt={value.alt || ''}
                                width={1200}
                                height={0}
                                sizes="(max-width: 768px) 100vw, 800px"
                                className="w-full h-auto rounded-xl"
                                style={{ height: 'auto' }}
                              />
                            </div>
                            {value.caption && (
                              <figcaption className="text-center text-sm text-gray-500 mt-3">
                                {value.caption}
                              </figcaption>
                            )}
                          </figure>
                        ),

                        // Callout boxes
                        callout: ({ value }) => {
                          const styles: Record<string, { bg: string; border: string; icon: string }> = {
                            tip: { bg: 'bg-blue-50', border: 'border-blue-400', icon: '💡' },
                            note: { bg: 'bg-gray-50', border: 'border-gray-400', icon: '📝' },
                            warning: { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: '⚠️' },
                            important: { bg: 'bg-red-50', border: 'border-red-400', icon: '🚨' },
                            success: { bg: 'bg-green-50', border: 'border-green-400', icon: '✅' },
                          };
                          const style = styles[value.type] || styles.note;
                          return (
                            <aside className={`my-8 p-5 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
                              {value.title && (
                                <p className="font-bold text-gray-900 mb-2">
                                  {style.icon} {value.title}
                                </p>
                              )}
                              <p className="text-gray-700 m-0">{value.content}</p>
                            </aside>
                          );
                        },

                        // Code blocks
                        codeBlock: ({ value }) => (
                          <div className="my-8 rounded-xl overflow-hidden shadow-lg">
                            {value.filename && (
                              <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                                {value.filename}
                              </div>
                            )}
                            <pre className="!mt-0 !rounded-t-none">
                              <code className={`language-${value.language}`}>
                                {value.code}
                              </code>
                            </pre>
                          </div>
                        ),

                        // YouTube embeds
                        youtube: ({ value }) => {
                          const videoId = value.url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                          if (!videoId) return null;
                          return (
                            <figure className="my-8">
                              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  title="YouTube video"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="absolute inset-0 w-full h-full"
                                />
                              </div>
                              {value.caption && (
                                <figcaption className="text-center text-sm text-gray-500 mt-3">
                                  {value.caption}
                                </figcaption>
                              )}
                            </figure>
                          );
                        },

                        // Pull quotes
                        pullQuote: ({ value }) => {
                          const isLandscape = value.layout === 'landscape';

                          if (isLandscape) {
                            return (
                              <blockquote className="my-10 not-italic border-none bg-transparent p-0">
                                <div className="overflow-hidden rounded-[2rem] border border-[#7c6aa6]/14 bg-[linear-gradient(135deg,rgba(236,231,247,0.9),rgba(250,248,255,0.98)_32%,rgba(255,255,255,0.94)_100%)] shadow-[0_24px_70px_-42px_rgba(124,106,166,0.35)]">
                                  <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[35%_65%] lg:items-center lg:gap-10 lg:p-10">
                                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                                      <div className="relative mb-5 h-28 w-28 overflow-hidden rounded-full border-4 border-white/90 shadow-[0_18px_36px_-24px_rgba(124,106,166,0.45)] sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                                        {value.authorImage ? (
                                          <Image
                                            src={urlForImage(value.authorImage).width(288).height(288).url()}
                                            alt={value.authorImage.alt || value.attribution || 'Quote author'}
                                            fill
                                            sizes="144px"
                                            className="object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center bg-[#8f79b8] text-3xl font-semibold text-white">
                                            {value.attribution?.charAt(0) || 'Q'}
                                          </div>
                                        )}
                                      </div>
                                      {value.attribution && (
                                        <div className="max-w-xs">
                                          <div className="text-xl font-semibold tracking-tight text-[#0a2140] sm:text-2xl">
                                            {value.attribution}
                                          </div>
                                          {value.role && (
                                            <div className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-[#8f79b8] sm:text-base">
                                              {value.role}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <div className="relative border-t border-[#8f79b8]/16 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                                      <span className="mb-4 block text-5xl leading-none text-[#8f79b8]/55 sm:text-6xl">“</span>
                                      <p className="m-0 text-2xl font-medium leading-tight tracking-tight text-[#0a2140] sm:text-[2rem] lg:text-[2.35rem]">
                                        {value.quote}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </blockquote>
                            );
                          }

                          return (
                            <blockquote className="my-10 not-italic border-none bg-transparent p-0">
                              <div className="flex flex-col items-center text-center gap-4">
                                {value.authorImage && (
                                  <Image
                                    src={urlForImage(value.authorImage).width(96).height(96).url()}
                                    alt={value.authorImage.alt || value.attribution || 'Quote author'}
                                    width={96}
                                    height={96}
                                    className="h-16 w-16 rounded-full object-cover"
                                  />
                                )}
                                <p className="text-2xl font-medium text-[#0a2140] italic">
                                  "{value.quote}"
                                </p>
                                {value.attribution && (
                                  <footer className="text-gray-600">
                                    — <cite className="not-italic font-medium">{value.attribution}</cite>
                                    {value.role && <span className="text-gray-400">, {value.role}</span>}
                                  </footer>
                                )}
                              </div>
                            </blockquote>
                          );
                        },

                        // Dividers
                        divider: ({ value }) => {
                          if (value.style === 'dots') {
                            return (
                              <div className="my-12 text-center">
                                <span className="text-gray-300 text-2xl tracking-widest">• • •</span>
                              </div>
                            );
                          }
                          if (value.style === 'space') {
                            return <div className="my-12" />;
                          }
                          return <hr className="my-12 border-gray-200" />;
                        },

                        // Buttons/CTAs
                        button: ({ value }) => (
                          <div className={`my-8 ${
                            value.alignment === 'center' ? 'text-center' :
                            value.alignment === 'right' ? 'text-right' : ''
                          }`}>
                            <a
                              href={value.url}
                              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                                value.style === 'primary' 
                                  ? 'bg-[#ff686c] text-white hover:bg-[#ff686c]/90 shadow-lg' :
                                value.style === 'secondary'
                                  ? 'bg-[#0a2140] text-white hover:bg-[#0a2140]/90 shadow-lg' :
                                  'border-2 border-[#0a2140] text-[#0a2140] hover:bg-[#0a2140] hover:text-white'
                              }`}
                            >
                              {value.text}
                              <ChevronRight className="w-4 h-4" />
                            </a>
                          </div>
                        ),

                        // Tables
                        table: ({ value }) => (
                          <figure className="my-8 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                              <tbody className="divide-y divide-gray-200">
                                {value.rows?.map((row: any, rowIndex: number) => (
                                  <tr key={rowIndex} className={row.isHeader ? 'bg-gray-50' : ''}>
                                    {row.cells?.map((cell: string, cellIndex: number) => (
                                      row.isHeader ? (
                                        <th key={cellIndex} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                          {cell}
                                        </th>
                                      ) : (
                                        <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                                          {cell}
                                        </td>
                                      )
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {value.caption && (
                              <figcaption className="text-center text-sm text-gray-500 mt-3">
                                {value.caption}
                              </figcaption>
                            )}
                          </figure>
                        ),
                      },
                      block: {
                        normal: ({ children }) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p>,
                        h2: ({ children, value }) => {
                          const id = value.children?.[0]?.text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
                          return <h2 id={id} className="text-2xl font-bold text-[#0a2140] mt-12 mb-4 scroll-mt-24">{children}</h2>;
                        },
                        h3: ({ children, value }) => {
                          const id = value.children?.[0]?.text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
                          return <h3 id={id} className="text-xl font-bold text-[#0a2140] mt-8 mb-3 scroll-mt-24">{children}</h3>;
                        },
                        h4: ({ children, value }) => {
                          const id = value.children?.[0]?.text?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
                          return <h4 id={id} className="text-lg font-bold text-[#0a2140] mt-6 mb-2">{children}</h4>;
                        },
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[#ff686c] bg-gray-50 py-4 px-6 rounded-r-lg my-6 text-gray-700 italic">
                            {children}
                          </blockquote>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => <strong className="font-bold text-[#0a2140]">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        underline: ({ children }) => <span className="underline">{children}</span>,
                        'strike-through': ({ children }) => <del className="line-through">{children}</del>,
                        code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                        highlight: ({ children }) => (
                          <mark className="bg-yellow-100 px-1 rounded">{children}</mark>
                        ),
                        link: ({ children, value }) => (
                          <a 
                            href={value.href}
                            target={value.openInNewTab ? '_blank' : undefined}
                            rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="text-[#ff686c] font-medium hover:underline"
                          >
                            {children}
                          </a>
                        ),
                        internalLink: ({ children, value }) => (
                          <Link 
                            href={`/blog/${value.reference?.slug?.current || ''}`}
                            className="text-[#ff686c] font-medium hover:underline"
                          >
                            {children}
                          </Link>
                        ),
                      },
                      list: {
                        bullet: ({ children }) => <ul className="list-disc pl-6 my-6 space-y-2 text-gray-700">{children}</ul>,
                        number: ({ children }) => <ol className="list-decimal pl-6 my-6 space-y-2 text-gray-700">{children}</ol>,
                        checklist: ({ children }) => <ul className="list-none pl-0 my-6 space-y-3">{children}</ul>,
                      },
                      listItem: {
                        bullet: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                        number: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                        checklist: ({ children, value }) => {
                          const checked = (value as any).checked;
                          return (
                            <li className="flex items-start gap-2">
                              <span className="mt-1 flex-shrink-0">
                                {checked ? (
                                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </span>
                              <span className={checked ? 'text-gray-500 line-through' : 'text-gray-700'}>{children}</span>
                            </li>
                          );
                        },
                      },
                      unknownType: ({ value }) => {
                        console.warn('Unknown Portable Text type:', (value as any)?._type);
                        return null;
                      },
                      unknownMark: ({ children }) => <span>{children}</span>,
                      unknownList: ({ children }) => <ul className="list-disc pl-6 my-6 text-gray-700">{children}</ul>,
                      unknownListItem: ({ children }) => <li className="text-gray-700">{children}</li>,
                      unknownBlockStyle: ({ children }) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p>,
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag className="w-5 h-5 text-gray-400" />
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Card */}
              {post.author && (
                <>
                  {/* Divider */}
                  <div className="mt-12 mb-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <span className="text-gray-400 text-sm font-medium">About the Author</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                  
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="w-20 h-20 rounded-full bg-[#ff686c]/10 flex-shrink-0 overflow-hidden">
                      {post.author.image ? (
                        <Image
                          src={urlForImage(post.author.image).width(160).height(160).url()}
                          alt={post.author.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#ff686c]">
                          <span className="text-white font-bold text-3xl">
                            {post.author.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#ff686c] mb-1">Written by</p>
                      <h4 className="text-xl font-bold text-[#0a2140] mb-1">
                        {post.author.name}
                      </h4>
                      {post.author.role && (
                        <p className="text-sm text-gray-500 mb-3">{post.author.role}</p>
                      )}
                      {post.author.bio && (
                        <p className="text-gray-600 leading-relaxed">{getPlainText(post.author.bio)}</p>
                      )}
                      {post.author.social && (
                        <div className="flex items-center gap-3 mt-4">
                          {post.author.social.twitter && (
                            <a href={post.author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors">
                              <Twitter className="w-5 h-5" />
                            </a>
                          )}
                          {post.author.social.linkedin && (
                            <a href={post.author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077B5] transition-colors">
                              <Linkedin className="w-5 h-5" />
                            </a>
                          )}
                          {post.author.social.website && (
                            <a href={post.author.social.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0a2140] transition-colors">
                              <Link2 className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4 mt-12 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-[#0a2140] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      In This Article
                    </h3>
                    <nav>
                      <ul className="space-y-2">
                        {headings.map((heading, index) => (
                          <li key={index}>
                            <a
                              href={`#${heading.id}`}
                              className={`block text-sm text-gray-600 hover:text-[#ff686c] transition-colors ${
                                heading.level === 3 ? 'pl-4' : ''
                              }`}
                            >
                              {heading.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}

                {/* Share Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-[#0a2140] uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share This Post
                  </h3>
                  <ShareButtons 
                    title={post.title} 
                    url={`https://clarivue.com/blog/${slug}`} 
                  />
                </div>

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-[#0a2140] uppercase tracking-wide mb-4">
                      Related Articles
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost: any) => (
                        <Link
                          key={relatedPost.slug}
                          href={`/blog/${relatedPost.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            {relatedPost.mainImage && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                <Image
                                  src={urlForImage(relatedPost.mainImage).width(128).height(128).url()}
                                  alt={relatedPost.title}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#ff686c] transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter/CTA */}
                <div className="bg-gradient-to-br from-[#0a2140] to-[#1a4060] rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-2">Stay Updated</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Get the latest interview tips and career insights delivered to your inbox.
                  </p>
                  <Link
                    href="/#waitlist"
                    className="block w-full text-center bg-[#ff686c] hover:bg-[#ff686c]/90 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                  >
                    Join Waitlist
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* FAQ Section (if post has FAQs) */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection
              faqs={post.faqs}
              heading={`FAQs: ${post.title}`}
              subtitle=""
            />
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-[#0a2140] to-[#1a4060] text-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Stop guessing who&apos;s interview-ready.</h2>
            <p className="text-lg text-gray-300 mb-8">
              See how Clarivue gives career centers the visibility, structure, and proof they need to improve placement outcomes.
            </p>
            <Link
              href="/book-demo"
              className="inline-flex items-center gap-2 bg-[#ff686c] text-white px-8 py-4 rounded-full font-medium hover:bg-[#ff686c]/90 transition-all shadow-lg"
            >
              Book a Demo
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
