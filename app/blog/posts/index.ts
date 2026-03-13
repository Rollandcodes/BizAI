import type { BlogPost } from './types';
import { aiCustomerServiceForNorthernCyprusBusinessesAPracticalGuide } from './ai-customer-service-for-northern-cyprus-businesses-a-practical-guide';
import { howCarRentalBusinessesInCyprusAreUsingAiToGetMoreBookings } from './how-car-rental-businesses-in-cyprus-are-using-ai-to-get-more-bookings';
import { howToNeverMissACustomerInquiryAgain } from './how-to-never-miss-a-customer-inquiry-again';
import { whatsappAiForSmallBusinessesCompleteGuide2026 } from './whatsapp-ai-for-small-businesses-complete-guide-2026';
import { whyYourKyreniaBusinessLosesCustomersAtNightAndHowToFixIt } from './why-your-kyrenia-business-loses-customers-at-night-and-how-to-fix-it';

export const blogPosts: BlogPost[] = [
  howCarRentalBusinessesInCyprusAreUsingAiToGetMoreBookings,
  whyYourKyreniaBusinessLosesCustomersAtNightAndHowToFixIt,
  whatsappAiForSmallBusinessesCompleteGuide2026,
  howToNeverMissACustomerInquiryAgain,
  aiCustomerServiceForNorthernCyprusBusinessesAPracticalGuide,
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
