// Server Action: Send Booking Confirmation Email
// Strict TypeScript, production-ready

import { sendBookingConfirmationEmail } from '@/lib/integrations/send-booking-email';

export async function sendBookingEmailAction(
  to: string,
  customerName: string,
  businessName: string,
  bookingDate: string,
  bookingTime?: string,
  serviceType?: string,
  confirmationLink?: string
): Promise<void> {
  await sendBookingConfirmationEmail({
    to,
    customerName,
    businessName,
    bookingDate,
    bookingTime,
    serviceType,
    confirmationLink,
  });
}
