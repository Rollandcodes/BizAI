import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Create transporter - using environment variables or fallback to mock
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    // Check if SMTP is configured
    const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (!smtpConfigured) {
      // Log the submission but don't fail - for development/demo
      console.log('Contact form submission (SMTP not configured):', { name, email, message });
      
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! In production, this would send an email. For now, please reach us via WhatsApp for immediate assistance.',
        whatsapp: 'https://wa.me/35799999999',
        development: true
      });
    }

    // Send notification email to CypAI
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"CypAI Website" <noreply@cypai.app>',
      to: 'cypai.app@cypai.app',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send confirmation email to the sender
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"CypAI" <noreply@cypai.app>',
      to: email,
      subject: 'Thank you for contacting CypAI',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within a few hours.</p>
        <p>In the meantime, feel free to reach us on WhatsApp for faster assistance: https://wa.me/35799999999</p>
        <p>Best regards,<br>The CypAI Team</p>
        <p>—<br>CypAI - AI Customer Service for Cyprus Businesses<br>https://www.cypai.app</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon."
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us via WhatsApp: https://wa.me/35799999999' },
      { status: 500 }
    );
  }
}
