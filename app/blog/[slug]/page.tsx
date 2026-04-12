import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { blogPosts, getBlogPostBySlug } from '../posts';
import CopyButton from '@/components/CopyButton';

const baseUrl = 'https://cypai.app';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

async function getBlogPost(slug: string) {
  // Try to get from database first
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'approved')
        .single();
      
      if (post) {
        return { ...post, source: 'database' };
      }
    } catch (error) {
      console.error('Error fetching from database:', error);
    }
  }
  
  // Fall back to static posts
  const staticPost = getBlogPostBySlug(slug);
  if (staticPost) {
    return {
      ...staticPost,
      id: staticPost.slug,
      source: 'static',
      content: staticPost.sections?.map(s => `${s.heading}\n\n${s.paragraphs.join('\n\n')}`).join('\n\n\n') || staticPost.excerpt
    };
  }
  
  return null;
}

export async function generateStaticParams() {
  // Generate params from both database (would need API) and static posts
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | CypAI Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  const title = post.title as string;
  const description = (post.excerpt as string) || '';

  return {
    title: `${title} | CypAI Blog`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'CypAI',
      type: 'article',
      publishedTime: post.created_at || post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const content = post.content as string;
  const readingTime = post.readingMinutes || getReadingTime(content);
  const title = post.title as string;
  const excerpt = post.excerpt as string;
  const authorName = post.author_name as string || post.authorName;
  const category = post.category as string || post.sectionTitle || 'Blog';
  const createdAt = post.created_at || post.publishedAt;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <article className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <Link href="/blog" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
          ← Back to blog
        </Link>
        
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            {category}
          </span>
          {post.views > 0 && (
            <span className="text-sm text-white/40">
              {post.views} views
            </span>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-white/60">
          <span>{formatDate(createdAt)}</span>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-[#0a0f1e]">
            {authorName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'A'}
          </div>
          <div>
            <p className="font-medium text-white">By {authorName}</p>
          </div>
        </div>

        {post.cover_image_url && (
          <div className="mt-10 overflow-hidden rounded-xl">
            <img 
              src={post.cover_image_url as string} 
              alt={title}
              className="w-full object-cover"
            />
          </div>
        )}

        <p className="mt-10 text-xl leading-8 text-white/80">
          {excerpt}
        </p>

        {/* Article Content */}
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-white/80">
          {content.split('\n\n').map((paragraph, index) => {
            // Check if it's a heading (starts with # or is all caps short line)
            if (paragraph.startsWith('# ')) {
              return (
                <h2 key={index} className="mt-10 text-2xl font-bold text-white">
                  {paragraph.replace('# ', '')}
                </h2>
              );
            }
            if (paragraph.match(/^[A-Z][A-Z\s]+$/)) {
              return (
                <h3 key={index} className="mt-8 text-xl font-bold text-white">
                  {paragraph}
                </h3>
              );
            }
            // Check if it's a list
            if (paragraph.includes('\n- ') || paragraph.match(/^[-•]\s/m)) {
              const items = paragraph.split('\n').filter(line => line.trim());
              return (
                <ul key={index} className="list-disc pl-6 space-y-2">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace(/^[-•]\s/, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {(post.tags as string[]).map((tag: string) => (
              <span 
                key={tag} 
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
          <span className="text-sm text-white/60">Share this post:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(`${baseUrl}/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Twitter
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${baseUrl}/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            WhatsApp
          </a>
          <CopyButton text={`${baseUrl}/blog/${slug}`} />
        </div>

        {/* CTA Section */}
        <section className="mt-14 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h2 className="text-2xl font-extrabold text-white">About CypAI</h2>
          <p className="mt-4 text-lg leading-8 text-white/70">
            CypAI helps 200+ businesses in Cyprus capture more leads and serve customers better with AI-powered WhatsApp and website chat.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-[#0a0f1e] transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
          >
            Start Free Trial →
          </Link>
        </section>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mt-14">
            <h3 className="text-xl font-bold text-white">Related Posts</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {post.relatedPosts.map((related: Record<string, unknown>) => (
                <Link
                  key={related.id as string}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-500/30"
                >
                  <h4 className="font-bold text-white group-hover:text-amber-400">
                    {related.title as string}
                  </h4>
                  <p className="mt-2 text-sm text-white/60 line-clamp-2">
                    {related.excerpt as string}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
