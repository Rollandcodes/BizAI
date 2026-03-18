import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      authorName,
      authorEmail,
      authorBio,
      authorType,
      title,
      category,
      excerpt,
      content,
      tags,
      coverImageUrl,
      agreedToRules
    } = body;

    // Validate required fields
    if (!authorName || !authorEmail || !title || !category || !excerpt || !content) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    if (!agreedToRules) {
      return NextResponse.json(
        { error: 'You must agree to the content rules to submit' },
        { status: 400 }
      );
    }

    // Validate word count (minimum 300 words)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 300) {
      return NextResponse.json(
        { error: `Content must be at least 300 words. Current: ${wordCount} words` },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = generateSlug(title);

    // Insert the blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title,
        excerpt,
        content,
        author_name: authorName,
        author_email: authorEmail,
        author_bio: authorBio || null,
        author_type: authorType || 'community',
        category,
        tags: tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        cover_image_url: coverImageUrl || null,
        status: 'pending',
        agreed_to_rules: true
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to submit blog post' }, { status: 500 });
    }

    // Send notification email to admin
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

      if (smtpConfigured) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"CypAI Blog" <noreply@cypai.app>',
          to: 'cypai.app@cypai.app',
          subject: `New blog submission: "${title}" by ${authorName}`,
          html: `
            <h2>New Blog Submission</h2>
            <p><strong>Author:</strong> ${authorName} (${authorEmail})</p>
            <p><strong>Type:</strong> ${authorType || 'community'}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Word count:</strong> ${wordCount}</p>
            <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
            <p><strong>Review it in your dashboard:</strong></p>
            <p>https://www.cypai.app/dashboard/blog</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post submitted successfully! It will be reviewed within 48 hours.',
      post
    });

  } catch (error) {
    console.error('Blog submission error:', error);
    return NextResponse.json({ error: 'Failed to submit blog post' }, { status: 500 });
  }
}
