// Booking Confirmation Email Utility
// Strict TypeScript, production-ready

import nodemailer from 'nodemailer';

export interface BookingEmailParams {
  to: string;
  customerName: string;
  businessName: string;
  bookingDate: string;
  bookingTime?: string;
  serviceType?: string;
  confirmationLink?: string;
}

export async function sendBookingConfirmationEmail(params: BookingEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `Booking Confirmed at ${params.businessName}`;
  const html = `
    <h2>Booking Confirmed</h2>
    <p>Hi ${params.customerName},</p>
    <p>Your booking at <b>${params.businessName}</b> is confirmed for <b>${params.bookingDate}${params.bookingTime ? ' at ' + params.bookingTime : ''}</b>.</p>
    ${params.serviceType ? `<p>Service: <b>${params.serviceType}</b></p>` : ''}
    ${params.confirmationLink ? `<p><a href="${params.confirmationLink}">View/Manage Booking</a></p>` : ''}
    <p>Thank you for choosing us!</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'no-reply@cypai.app',
    to: params.to,
    subject,
    html,
  });
}
