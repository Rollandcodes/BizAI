'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogSubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorBio: '',
    authorType: 'community',
    title: '',
    category: '',
    excerpt: '',
    content: '',
    tags: '',
    coverImageUrl: '',
    agreedToRules: false
  });

  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;
  const isValid = formData.authorName && formData.authorEmail && formData.title && 
    formData.category && formData.excerpt && formData.content && 
    wordCount >= 300 && formData.agreedToRules;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/blog/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold">Post submitted successfully!</h1>
          <p className="mt-4 text-white/60">
            Thank you, {formData.authorName}! Your post "{formData.title}" has been received and is now under review.
          </p>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="font-bold text-white">What happens next:</h3>
            <ul className="mt-4 space-y-2 text-white/60">
              <li>• Our team will review your post within 48 hours</li>
              <li>• You'll receive an email at {formData.authorEmail} with our decision</li>
              <li>• If approved, your post goes live immediately</li>
              <li>• If we need changes, we'll tell you exactly what to fix</li>
            </ul>
          </div>
          <div className="mt-8">
            <Link href="/blog" className="text-amber-400 hover:text-amber-300">
              ← Explore the blog while you wait
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const categories = [
    { id: 'ai-automation', label: 'AI & Automation' },
    { id: 'whatsapp', label: 'WhatsApp for Business' },
    { id: 'business-tips', label: 'Business Tips' },
    { id: 'cyprus-business', label: 'Cyprus Business' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'customer-service', label: 'Customer Service' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blog" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
          ← Back to blog
        </Link>

        <h1 className="mt-6 text-4xl font-extrabold">Write for the CypAI Blog</h1>
        <p className="mt-4 text-lg text-white/60">
          Share your expertise with 200+ Cyprus businesses. Your post will be reviewed by our team before publishing.
        </p>

        {/* Content Rules */}
        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-lg font-bold text-white">📋 Content Rules</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>✓ Write in English (or include English translation)</li>
            <li>✓ Minimum 300 words, maximum 3,000 words</li>
            <li>✓ Original content only — no copied or AI-generated content</li>
            <li>✓ Be helpful and informative — teach something useful</li>
            <li>✓ Business-relevant topics (AI, automation, WhatsApp, customer service, Cyprus market)</li>
            <li>✓ You may mention your own business once with a link</li>
            <li>✗ No spam, fake reviews, or competitor attacks</li>
            <li>✗ No adult content, politics, religion, or illegal content</li>
          </ul>
          <p className="mt-4 text-sm text-white/50">
            Posts that violate these rules will be rejected. Repeat violations may result in your email being blocked.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Author Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white">
                Author Name *
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
                placeholder="you@example.com"
                required
              />
              <p className="mt-1 text-xs text-white/40">
                We'll email you when your post is reviewed.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Author Bio (optional)
            </label>
            <textarea
              value={formData.authorBio}
              onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              placeholder="Tell readers about yourself in 1-2 sentences"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">I am a: *</label>
            <div className="mt-2 flex gap-4">
              {['community', 'client', 'business'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="authorType"
                    value={type}
                    checked={formData.authorType === type}
                    onChange={(e) => setFormData({ ...formData, authorType: e.target.value })}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-white/70 capitalize">
                    {type === 'community' ? 'Community member' : type === 'client' ? 'CypAI customer' : 'Business owner in Cyprus'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Post Title *
              <span className="ml-2 font-normal text-white/40">({formData.title.length}/100)</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, 100) })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              placeholder="A catchy, descriptive title"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Short Description *
              <span className="ml-2 font-normal text-white/40">({formData.excerpt.length}/200)</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value.slice(0, 200) })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              placeholder="This appears in the blog listing. Make it compelling."
              maxLength={200}
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Your Post *
              <span className={`ml-2 font-normal ${wordCount >= 300 ? 'text-green-400' : 'text-white/40'}`}>
                Word count: {wordCount} / minimum 300
              </span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              placeholder="Write your post content here. Be helpful, informative, and original."
              rows={15}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Tags (optional)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              placeholder="Example: AI, WhatsApp, car rental, Cyprus"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-amber-500 focus:outline-none"
              placeholder="Paste a link to an image, or leave blank for a default"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreedToRules}
                onChange={(e) => setFormData({ ...formData, agreedToRules: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-white/30 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-white/70">
                I have read and agree to the content rules above. I confirm this is my original work and I have the right to publish it. I understand CypAI may edit my post for clarity and formatting.
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full rounded-full bg-amber-500 py-4 text-lg font-bold text-[#0a0f1e] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review →'}
          </button>

          <p className="text-center text-sm text-white/40">
            Need help? Contact us at cypai.app@cypai.app
          </p>
        </form>
      </div>
    </main>
  );
}
