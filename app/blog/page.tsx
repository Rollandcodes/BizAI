import type { Metadata } from 'next';
import Link from 'next/link';

import { blogPosts } from './posts';

const baseUrl = 'https://cypai.app';

export const metadata: Metadata = {
  title: 'CypAI Blog | AI Growth Guides for Cyprus Businesses',
  description:
    'Read practical guides on WhatsApp AI, lead capture, and customer service automation for businesses in Northern Cyprus.',
  keywords: [
    'CypAI blog',
    'AI guides Cyprus',
    'WhatsApp automation articles',
    'Northern Cyprus business growth',
    'customer service AI playbooks',
  ],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'CypAI Blog | AI Growth Guides for Cyprus Businesses',
    description:
      'Actionable articles on lead capture, AI customer support, and conversion workflows built for local businesses.',
    url: `${baseUrl}/blog`,
    siteName: 'CypAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CypAI Blog | AI Growth Guides for Cyprus Businesses',
    description:
      'Actionable articles on lead capture, AI customer support, and conversion workflows built for local businesses.',
  },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <p className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          CypAI Blog
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
          Practical AI playbooks for Northern Cyprus businesses
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600">
          Learn how to capture more leads, reply faster, and convert more inquiries using WhatsApp and website AI automation.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">{post.sectionTitle}</p>
              <h2 className="mt-3 text-2xl font-bold leading-snug text-slate-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-700">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-4 text-sm text-slate-500">
                {formatDate(post.publishedAt)} • {post.readingMinutes} min read
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {keyword}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-7 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Read article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
