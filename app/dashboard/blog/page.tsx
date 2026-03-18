'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_email: string;
  author_bio: string | null;
  author_type: string;
  category: string;
  tags: string | null;
  cover_image_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const categoryLabels: Record<string, string> = {
  'ai-automation': 'AI & Automation',
  'whatsapp': 'WhatsApp for Business',
  'business-tips': 'Business Tips',
  'cyprus-business': 'Cyprus Business',
  'case-studies': 'Case Studies',
  'customer-service': 'Customer Service',
  'other': 'Other',
};

export default function BlogAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      
      const response = await fetch(`/api/admin/blog/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId: string, newStatus: 'approved' | 'rejected' | 'published') => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/blog/posts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, status: newStatus })
      });

      if (response.ok) {
        fetchPosts();
        setSelectedPost(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/blog/posts?id=${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPosts();
        setSelectedPost(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPosts = posts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Blog Management</h1>
          <p className="text-[#6b7280]">Review and manage community-submitted blog posts</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/blog/submit"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
          >
            ↗ View Submit Page
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
          >
            ↗ View Public Blog
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-[#1a1a2e]">{posts.length}</div>
          <div className="text-sm text-[#6b7280]">Total Posts</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {posts.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-sm text-[#6b7280]">Pending Review</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {posts.filter(p => p.status === 'published').length}
          </div>
          <div className="text-sm text-[#6b7280]">Published</div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-[#1a1a2e]">
            {posts.reduce((acc, p) => acc + (p.views || 0), 0)}
          </div>
          <div className="text-sm text-[#6b7280]">Total Views</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'published', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#1a1a2e] text-white'
                : 'bg-white text-[#6b7280] hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && posts.filter(p => p.status === 'pending').length > 0 && (
              <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
                {posts.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6b7280]">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-[#1a1a2e]">No posts found</h3>
            <p className="text-[#6b7280]">
              {filter === 'all' 
                ? 'No blog posts have been submitted yet.'
                : `No ${filter} posts to show.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Post</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-[#1a1a2e] truncate">{post.title}</div>
                        <div className="text-sm text-[#6b7280] truncate">{post.excerpt}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-[#1a1a2e]">{post.author_name}</div>
                      <div className="text-xs text-[#6b7280]">{post.author_email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-[#1a1a2e]">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(post.status)}</td>
                    <td className="px-4 py-4 text-sm text-[#6b7280]">{post.views || 0}</td>
                    <td className="px-4 py-4 text-sm text-[#6b7280]">{formatDate(post.created_at)}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="inline-flex items-center rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2a2a4e]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white">
            {/* Modal Header */}
            <div className="sticky top-0 border-b border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="mb-2 inline-block">{getStatusBadge(selectedPost.status)}</span>
                  <h2 className="text-xl font-bold text-[#1a1a2e]">{selectedPost.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="rounded-lg p-2 text-[#6b7280] hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Author Info */}
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#1a1a2e]">Author Information</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-[#6b7280]">Name:</span>
                    <div className="font-medium text-[#1a1a2e]">{selectedPost.author_name}</div>
                  </div>
                  <div>
                    <span className="text-xs text-[#6b7280]">Email:</span>
                    <div className="font-medium text-[#1a1a2e]">{selectedPost.author_email}</div>
                  </div>
                  {selectedPost.author_bio && (
                    <div className="sm:col-span-2">
                      <span className="text-xs text-[#6b7280]">Bio:</span>
                      <div className="text-[#1a1a2e]">{selectedPost.author_bio}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-[#6b7280]">Type:</span>
                    <div className="font-medium text-[#1a1a2e] capitalize">{selectedPost.author_type}</div>
                  </div>
                </div>
              </div>

              {/* Post Details */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-[#1a1a2e]">Excerpt</h3>
                <p className="rounded-lg bg-gray-50 p-4 text-[#6b7280]">{selectedPost.excerpt}</p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-[#1a1a2e]">
                  Content ({selectedPost.content.split(/\s+/).filter(Boolean).length} words)
                </h3>
                <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4 text-[#1a1a2e] whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-[#6b7280]">
                <span>Category: {categoryLabels[selectedPost.category] || selectedPost.category}</span>
                <span>•</span>
                <span>Views: {selectedPost.views || 0}</span>
                <span>•</span>
                <span>Submitted: {formatDate(selectedPost.created_at)}</span>
                {selectedPost.tags && (
                  <>
                    <span>•</span>
                    <span>Tags: {selectedPost.tags}</span>
                  </>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 border-t border-gray-100 bg-gray-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => handleDelete(selectedPost.id)}
                  disabled={actionLoading}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  🗑 Delete Post
                </button>
                <div className="flex gap-3">
                  {selectedPost.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedPost.id, 'rejected')}
                        disabled={actionLoading}
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedPost.id, 'published')}
                        disabled={actionLoading}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        ✓ Publish Now
                      </button>
                    </>
                  )}
                  {selectedPost.status === 'published' && (
                    <button
                      onClick={() => handleStatusChange(selectedPost.id, 'rejected')}
                      disabled={actionLoading}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Unpublish
                    </button>
                  )}
                  {selectedPost.status === 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(selectedPost.id, 'published')}
                      disabled={actionLoading}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Re-publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
