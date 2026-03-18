import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the post by slug (only approved posts are public)
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'approved')
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', post.id);

    // Get related posts (same category)
    const { data: relatedPosts } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, author_name, category, created_at')
      .eq('status', 'approved')
      .eq('category', post.category)
      .neq('id', post.id)
      .order('created_at', { ascending: false })
      .limit(3);

    return NextResponse.json({
      post: { ...post, views: (post.views || 0) + 1 },
      relatedPosts: relatedPosts || []
    });

  } catch (error) {
    console.error('Blog post error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
