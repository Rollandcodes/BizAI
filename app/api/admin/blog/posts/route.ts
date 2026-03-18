import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'muhanguzirollands@gmail.com';

// Helper to check admin access
async function checkAdmin(request: NextRequest): Promise<boolean> {
  // For now, we'll check a simple header or just allow access for development
  // In production, you'd use proper auth
  const adminKey = request.headers.get('x-admin-key');
  return adminKey === process.env.ADMIN_API_KEY || adminKey === 'dev-admin-key';
}

export async function GET(request: NextRequest) {
  try {
    if (!await checkAdmin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, approved, rejected, all

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get counts
    const { count: pendingCount } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approvedCount } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: rejectedCount } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'rejected');

    // Get total views
    const { data: viewData } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('status', 'approved');

    const totalViews = viewData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

    return NextResponse.json({
      posts: posts || [],
      stats: {
        pending: pendingCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
        totalViews
      }
    });

  } catch (error) {
    console.error('Admin blog posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!await checkAdmin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'ID and action are required' }, { status: 400 });
    }

    // Get the post first
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let updateData: Record<string, unknown> = {};
    let emailSubject = '';
    let emailHtml = '';

    if (action === 'approve') {
      updateData = {
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: ADMIN_EMAIL
      };
      emailSubject = `Your CypAI blog post has been approved! 🎉`;
      emailHtml = `
        <h2>Great news!</h2>
        <p>Hi ${post.author_name},</p>
        <p>Your post "<strong>${post.title}</strong>" has been approved and is now live on the CypAI blog!</p>
        <p>Read it here: <a href="https://www.cypai.app/blog/${post.slug}">https://www.cypai.app/blog/${post.slug}</a></p>
        <p>Share it with your network and let us know if you'd like to write another post!</p>
        <p>— The CypAI Team</p>
      `;
    } else if (action === 'reject') {
      updateData = {
        status: 'rejected',
        rejection_reason: rejectionReason || 'Content does not meet our guidelines'
      };
      emailSubject = 'Update on your CypAI blog submission';
      emailHtml = `
        <h2>Thank you for submitting to the CypAI blog</h2>
        <p>Hi ${post.author_name},</p>
        <p>After review, we're unable to publish "<strong>${post.title}</strong>" at this time.</p>
        <p><strong>Reason:</strong> ${rejectionReason || 'Content does not meet our guidelines'}</p>
        <p>You're welcome to revise your post and resubmit at: <a href="https://www.cypai.app/blog/submit">https://www.cypai.app/blog/submit</a></p>
        <p>If you have questions, contact us at cypai.app@cypai.app</p>
        <p>— The CypAI Team</p>
      `;
    } else if (action === 'feature') {
      // Unfeature all other posts first
      await supabase
        .from('blog_posts')
        .update({ is_featured: false })
        .eq('is_featured', true);

      updateData = { is_featured: true };
    } else if (action === 'unfeature') {
      updateData = { is_featured: false };
    } else if (action === 'reconsider') {
      updateData = { status: 'pending', rejection_reason: null };
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      });

      const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

      if (smtpConfigured && (action === 'approve' || action === 'reject')) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"CypAI Blog" <noreply@cypai.app>',
          to: post.author_email,
          subject: emailSubject,
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin blog update error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await checkAdmin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin blog delete error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
