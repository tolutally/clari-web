import { getPosts } from '@/lib/sanity/api';
import { urlForImage } from '../../../../../sanity/lib/image';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  try {
    const posts = await getPosts();
    
    // Transform posts to include image URLs
    const transformedPosts = posts?.map((post: any) => ({
      ...post,
      mainImage: post.mainImage ? urlForImage(post.mainImage).width(800).height(600).url() : null,
      author: post.author ? {
        ...post.author,
        image: post.author.image ? urlForImage(post.author.image).width(80).height(80).url() : null,
      } : null,
    })) || [];

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json([]);
  }
}
