import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if Resend is installed
    let resend;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      resend = require('resend');
    } catch {
      // Resend not installed - suggest WhatsApp
      return NextResponse.json({
        error: 'Email service not configured. Please contact us via WhatsApp for immediate assistance.',
        whatsapp: 'https://wa.me/35799999999',
        suggestion: 'Use WhatsApp for fastest response'
      }, { status: 503 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      return NextResponse.json({
        error: 'Email service not configured. Please contact us via WhatsApp for immediate assistance.',
        whatsapp: 'https://wa.me/35799999999',
        suggestion: 'Configure RESEND_API_KEY in environment variables'
      }, { status: 503 });
    }

    const resendClient = new resend.Resend(resendApiKey);

    // Send notification email to CypAI
    await resendClient.emails.send({
      from: 'CypAI Contact <onboarding@resend.dev>',
      to: 'cypai.app@cypai.app',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to the sender
    await resendClient.emails.send({
      from: 'CypAI <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for contacting CypAI',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within a few hours.</p>
        <p>In the meantime, feel free to reach us on WhatsApp for faster assistance.</p>
        <p>Best regards,<br>The CypAI Team</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us via WhatsApp.' },
      { status: 500 }
    );
  }
}
