import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { blogPosts, getBlogPostBySlug } from '../posts';

const baseUrl = 'https://cypai.app';

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

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | CypAI Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | CypAI Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: canonicalUrl,
      siteName: 'CypAI',
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <article className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <Link href="/blog" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
          Back to blog
        </Link>
        <p className="mt-6 inline-flex rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          {post.sectionTitle}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-zinc-500">
          {formatDate(post.publishedAt)} • {post.readingMinutes} min read
        </p>
        <p className="mt-8 text-xl leading-8 text-zinc-300">{post.excerpt}</p>

        <div className="mt-10 space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-5">
              <h2 className="text-2xl font-bold text-white">{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.heading}-${index}`} className="text-lg leading-8 text-zinc-300">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-blue-500/20 bg-blue-600/10 p-8">
          <h2 className="text-2xl font-extrabold text-white">{post.cta.heading}</h2>
          <p className="mt-4 text-lg leading-8 text-zinc-300">{post.cta.body}</p>
          <Link
            href={post.cta.buttonHref}
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
          >
            {post.cta.buttonLabel}
          </Link>
        </section>
      </article>
    </main>
  );
}
