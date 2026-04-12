import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get featured post
    const { data: featuredPost } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get total count
    let countQuery = supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');
    
    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category);
    }
    
    const { count } = await countQuery;

    return NextResponse.json({
      posts: posts || [],
      featuredPost: featuredPost || null,
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Blog posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
