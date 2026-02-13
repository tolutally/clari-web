# Sanity CMS Setup for Clarivue

Sanity CMS has been configured for the Clarivue application. This setup includes content types for blog posts, testimonials, case studies, authors, and categories.

## 🚀 Getting Started

### 1. Install Dependencies

If not already installed, run:
```bash
npm install
```

This will install:
- `sanity` - Core Sanity CMS
- `next-sanity` - Next.js integration
- `@sanity/vision` - GROQ query testing tool
- `@sanity/image-url` - Image URL builder

### 2. Create a Sanity Project

1. Visit [sanity.io/manage](https://www.sanity.io/manage)
2. Create a new project or use an existing one
3. Note your **Project ID**
4. Create a dataset (e.g., "production")

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `your_project_id_here` with your actual Sanity project ID.

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Access the Sanity Studio

Navigate to: **http://localhost:3000/admin**

This will open the Sanity Studio interface where you can create and manage content.

## 📁 Project Structure

```
clari-web/
├── sanity/
│   ├── lib/
│   │   ├── client.ts          # Sanity client configuration
│   │   ├── image.ts           # Image URL builder
│   │   ├── queries.ts         # GROQ queries
│   │   └── types.ts           # TypeScript types
│   └── schemas/
│       ├── author.ts          # Author schema
│       ├── category.ts        # Category schema
│       ├── post.ts            # Blog post schema
│       ├── testimonial.ts     # Testimonial schema
│       ├── caseStudy.ts       # Case study schema
│       └── index.ts           # Schema registry
├── src/
│   ├── app/
│   │   └── admin/
│   │       └── [[...tool]]/
│   │           ├── page.tsx   # Studio page
│   │           └── loading.tsx
│   └── lib/
│       └── sanity/
│           └── api.ts         # API helper functions
└── sanity.config.ts           # Sanity configuration
```

## 📝 Content Types

### Blog Posts
- Title, slug, excerpt
- Rich text body with images
- Author reference
- Categories
- Featured flag
- Publish date

### Testimonials
- Name, role, company
- Content (text)
- Image
- Rating (1-5)
- Display order
- Published status

### Case Studies
- Title, slug, client
- Excerpt and body
- Main image
- Key metrics array
- Industry type
- Publish date

### Authors
- Name, slug
- Image
- Bio (rich text)

### Categories
- Title, slug
- Description

## 🔌 Using Sanity Data in Your App

### Fetching Data

Use the helper functions in `src/lib/sanity/api.ts`:

```typescript
import { getPosts, getTestimonials } from '@/lib/sanity/api';

// In a Server Component
export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Rendering Images

```typescript
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

export function PostImage({ image }) {
  if (!image) return null;
  
  return (
    <Image
      src={urlForImage(image).width(800).height(600).url()}
      alt={image.alt || ''}
      width={800}
      height={600}
    />
  );
}
```

### Custom Queries

Create custom GROQ queries in `sanity/lib/queries.ts`:

```typescript
export const FEATURED_POSTS_QUERY = groq`*[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  excerpt,
  mainImage
}`;
```

## 🛠️ Available Scripts

```bash
# Start Next.js dev server (includes Studio at /admin)
npm run dev

# Start standalone Sanity Studio (optional)
npm run sanity

# Deploy Sanity Studio to sanity.io
npm run sanity:deploy
```

## 🔐 Authentication

The Sanity Studio at `/admin` requires authentication. You'll need to log in with your Sanity account to access it.

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/nextjs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Schema Types](https://www.sanity.io/docs/schema-types)

## 🎨 Customization

### Adding New Content Types

1. Create a new schema file in `sanity/schemas/`
2. Import and add it to `sanity/schemas/index.ts`
3. Add TypeScript types to `sanity/lib/types.ts`
4. Create queries in `sanity/lib/queries.ts`
5. Add helper functions to `src/lib/sanity/api.ts`

### Modifying Existing Schemas

Edit the schema files in `sanity/schemas/` and the Studio will automatically update.

## 🚨 Important Notes

- The Studio is accessible at `/admin` when running `npm run dev`
- Content is stored in Sanity's cloud, not your local database
- Image assets are hosted on Sanity's CDN (cdn.sanity.io)
- Always use environment variables for project ID and dataset
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser

## 📞 Support

For issues with Sanity CMS, check:
- [Sanity Slack Community](https://slack.sanity.io/)
- [Sanity GitHub Discussions](https://github.com/sanity-io/sanity/discussions)
