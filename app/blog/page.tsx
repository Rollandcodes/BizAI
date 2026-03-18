import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://cypai.app';

export const metadata: Metadata = {
  title: 'Blog — CypAI | AI & Business Automation for Cyprus',
  description: 'Insights on AI, customer service automation, WhatsApp business, and growing your business in Cyprus and the Middle East.',
  keywords: ['CypAI blog', 'AI guides Cyprus', 'WhatsApp automation', 'Northern Cyprus business', 'customer service AI'],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'The CypAI Blog | AI & Business Automation for Cyprus',
    description: 'Insights on AI, WhatsApp automation, and growing your business in Cyprus and beyond.',
    url: `${baseUrl}/blog`,
    siteName: 'CypAI',
    type: 'website',
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getBlogPosts() {
  if (!supabaseUrl || !supabaseKey) {
    return { posts: [], featuredPost: null, total: 0 };
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get approved posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20);

    // Get featured post
    const { data: featuredPost } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { 
      posts: posts || [], 
      featuredPost: featuredPost || null, 
      total: posts?.length || 0 
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], featuredPost: null, total: 0 };
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'ai-automation', label: 'AI & Automation' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'business-tips', label: 'Business Tips' },
  { id: 'cyprus-business', label: 'Cyprus Business' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'product-updates', label: 'Product Updates' },
];

export default async function BlogPage() {
  const { posts, featuredPost, total } = await getBlogPosts();

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="inline-flex rounded-full border border-amber-500/20 bg-amber-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              The CypAI Blog
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Insights on AI, WhatsApp automation, and growing your business
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-white/60">
              Practical articles to help 200+ Cyprus businesses capture more leads and serve customers better.
            </p>
          </div>
          <Link
            href="/blog/submit"
            className="hidden rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-white hover:bg-white/10 md:inline-flex"
          >
            Write for us →
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'all' ? '/blog' : `/blog?category=${cat.id}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70 transition hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mx-auto mb-12 max-w-6xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16213e] to-[#1a2744] border border-amber-500/20 p-8 md:p-12">
            <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="inline-flex rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
                  Featured
                </span>
                <span className="ml-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60">
                  {featuredPost.category}
                </span>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-amber-400">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="mt-4 text-lg text-white/70">{featuredPost.excerpt}</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-[#0a0f1e]">
                    {getInitials(featuredPost.author_name)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{featuredPost.author_name}</p>
                    <p className="text-sm text-white/60">
                      {formatDate(featuredPost.created_at)} · {getReadingTime(featuredPost.content)} min read
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                {featuredPost.cover_image_url ? (
                  <img 
                    src={featuredPost.cover_image_url} 
                    alt={featuredPost.title}
                    className="rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="h-48 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <span className="text-6xl">📝</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="mx-auto mb-16 max-w-6xl px-6 sm:px-10">
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Record<string, unknown>) => (
              <article 
                key={post.id as string} 
                className="group rounded-2xl bg-[#16213e] border border-white/10 overflow-hidden transition hover:-translate-y-1 hover:border-amber-500/30"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="h-40 bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    {post.cover_image_url ? (
                      <img 
                        src={post.cover_image_url as string} 
                        alt={post.title as string}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">📄</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                        {post.category as string}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-white group-hover:text-amber-400">
                      {post.title as string}
                    </h3>
                    <p className="mt-2 text-sm text-white/60 line-clamp-2">
                      {post.excerpt as string}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-[#0a0f1e]">
                        {getInitials(post.author_name as string)}
                      </div>
                      <div className="text-xs text-white/60">
                        <span className="font-medium text-white">{post.author_name as string}</span>
                        <span className="mx-2">·</span>
                        <span>{formatDate(post.created_at as string)}</span>
                        <span className="mx-2">·</span>
                        <span>{getReadingTime(post.content as string)} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white">No posts yet</h3>
            <p className="mt-2 text-white/60">Be the first to write for the CypAI blog!</p>
            <Link
              href="/blog/submit"
              className="mt-6 inline-flex rounded-full bg-amber-500 px-6 py-2 text-sm font-bold text-[#0a0f1e] hover:bg-amber-400"
            >
              Submit Your Post →
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mx-auto mb-16 max-w-4xl px-6 sm:px-10">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Want to write for us?</h3>
          <p className="mt-2 text-white/60">
            Share your expertise with 200+ Cyprus businesses. All submissions are reviewed within 48 hours.
          </p>
          <Link
            href="/blog/submit"
            className="mt-6 inline-flex rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-[#0a0f1e] hover:bg-amber-400"
          >
            Submit Your Post →
          </Link>
        </div>
      </section>
    </main>
  );
}
