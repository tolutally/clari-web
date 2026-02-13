# 🚀 Sanity CMS Quick Start

## Step 1: Install Dependencies

Run the following commands to install all required packages:

```powershell
# If you encounter PowerShell execution policy issues, run:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Install Sanity packages
npm install

# If packages didn't install, manually run:
npm install sanity next-sanity @sanity/vision @sanity/image-url @portabletext/react
```

## Step 2: Create Sanity Project

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create new project"
3. Name your project (e.g., "Clarivue CMS")
4. Copy the **Project ID** (you'll need this next)

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `YOUR_PROJECT_ID_HERE` with your actual project ID from step 2.

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Access Sanity Studio

Open your browser and navigate to:

```
http://localhost:3000/admin
```

You'll be prompted to log in with your Sanity account.

## Step 6: Add Your First Content

1. Click on "Blog Post" in the sidebar
2. Click "Create new document"
3. Fill in the title, slug, and content
4. Click "Publish"

## Step 7: View Your Content

Navigate to:

```
http://localhost:3000/blog
```

You should see your published blog posts!

## 📦 What Was Set Up

✅ Sanity Studio at `/admin`  
✅ 5 Content Types: Blog Posts, Authors, Categories, Testimonials, Case Studies  
✅ TypeScript types for all content  
✅ Image optimization with Next.js  
✅ Example blog pages  
✅ Helper functions for fetching data  

## 🛠️ Troubleshooting

### PowerShell Execution Policy Error

If you see: *"cannot be loaded. The file is not digitally signed"*

Run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Or run commands with bypass:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

### "Project ID not found" Error

Make sure your `.env.local` file exists and has the correct project ID with the `NEXT_PUBLIC_` prefix.

### Studio Not Loading

Clear your browser cache and restart the dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

## 📚 Next Steps

- Read [SANITY_SETUP.md](./SANITY_SETUP.md) for detailed documentation
- Customize schemas in `sanity/schemas/`
- Add more content types as needed
- Deploy your studio: `npm run sanity:deploy`

## 🎯 Common Tasks

### Add a New Content Type

1. Create schema file in `sanity/schemas/`
2. Import in `sanity/schemas/index.ts`
3. Add TypeScript types in `sanity/lib/types.ts`
4. Create queries in `sanity/lib/queries.ts`

### Query Content in Your Pages

```typescript
import { getPosts } from '@/lib/sanity/api';

export default async function Page() {
  const posts = await getPosts();
  return <div>{/* render posts */}</div>;
}
```

### Render Images

```typescript
import { urlForImage } from '@/sanity/lib/image';
import Image from 'next/image';

<Image 
  src={urlForImage(image).width(800).url()} 
  alt="..." 
  width={800} 
  height={600}
/>
```

---

**Need help?** Check the full documentation in [SANITY_SETUP.md](./SANITY_SETUP.md)
