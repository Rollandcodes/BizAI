// ============================================================================
// Business Niche Configurations for BizAI
// ============================================================================
// Each niche has specialized prompts, FAQs, and lead capture fields

export interface FAQ {
  question: string;
  answer: string;
}

export interface NicheConfig {
  systemPrompt: string;
  welcomeMessage: string;
  faqs: FAQ[];
  leadFields: string[];
  primaryColor: string;
  suggestedPrice: number;
}

// ============================================================================
// Car Rental Configuration
// ============================================================================
const CAR_RENTAL: NicheConfig = {
  systemPrompt: `You are a professional car rental assistant for {businessName}. Help customers with:
- Vehicle availability and fleet information
- Pricing: Economy $25/day, Compact $35/day, SUV $55/day
- Rental requirements (valid driver's license, passport for international, credit card for deposit)
- Pickup and dropoff options
- Insurance packages and coverage options
- Special requests and additional services

Always be helpful and professional. Try to collect the customer's name, phone number, desired rental dates, and preferred vehicle type for a booking inquiry.

When you have collected the customer's name, phone, pickup date, return date, and car preference, say EXACTLY:
'Great! I have all your details. Let me confirm your booking request with our team right away. You'll receive a confirmation shortly. 📋'
Then output a special marker: [BOOKING_READY]
followed by a JSON summary on a new line: {"name":"...","phone":"...","pickupDate":"YYYY-MM-DD","returnDate":"YYYY-MM-DD","carType":"...","totalDays":N}`,
  // Note: The [BOOKING_READY] marker and JSON are stripped before the message is shown to the customer.
  
  welcomeMessage: "Hello! 🚗 Looking to rent a car? I can help you find the perfect vehicle for your trip. What are your travel dates?",
  
  faqs: [
    {
      question: "What documents do I need to rent a car?",
      answer: "You'll need a valid driver's license, credit card, and passport (for international drivers). You must be at least 21 years old, and renters under 25 may have additional fees.",
    },
    {
      question: "Is insurance included in the rental price?",
      answer: "Basic liability insurance is included in all rentals. We offer additional coverage options including collision damage waiver, theft protection, and premium coverage for added peace of mind.",
    },
    {
      question: "What are your cancellation policies?",
      answer: "Free cancellation up to 24 hours before your pickup time. Cancellations within 24 hours of pickup may incur a one-day rental fee. No-shows will be charged for the full first day.",
    },
    {
      question: "Can I rent a car one-way?",
      answer: "Yes! One-way rentals are available for a small additional fee depending on the distance. Just select your return location when booking.",
    },
    {
      question: "Do you have child car seats available?",
      answer: "Absolutely! We offer infant car seats, booster seats, and combination seats. Reserve them when booking or call ahead to ensure availability.",
    },
  ],
  
  leadFields: ["name", "phone", "pickupDate", "returnDate", "carType"],
  primaryColor: "#1f2937",
  suggestedPrice: 79,
};

// ============================================================================
// Barbershop Configuration
// ============================================================================
const BARBERSHOP: NicheConfig = {
  systemPrompt: `You are a friendly and professional assistant for {businessName} barbershop. Help customers with:
- Appointment booking and scheduling
- Services offered: haircut, beard trim, full grooming packages, hair styling
- Pricing and service duration
- Current availability: Monday-Saturday 9am-7pm
- Barber information and specialties
- Walk-in policy and wait times

Be welcoming and helpful. Always collect the customer's name and phone number for appointment bookings and confirm their preferred date and service.`,
  
  welcomeMessage: "Hey! 💈 Welcome to {businessName}! Want to book an appointment or have any questions? I'm here to help!",
  
  faqs: [
    {
      question: "How long does a typical haircut take?",
      answer: "A standard haircut takes about 30-45 minutes depending on style complexity. Beard trims are usually 15-20 minutes, and full grooming packages take about 60 minutes.",
    },
    {
      question: "Do you accept walk-ins or is it appointment only?",
      answer: "We accept both walk-ins and appointments! However, I recommend booking ahead, especially during peak hours (3pm-7pm), to minimize wait time.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit cards (Visa, Mastercard, Amex), and mobile payments. A 15-20% tip is appreciated!",
    },
    {
      question: "How much should I tip?",
      answer: "Tipping is customary and appreciated! We recommend 15-20% of your service cost. Tips are split among the team.",
    },
    {
      question: "Can I book online or do I need to call?",
      answer: "You can book appointments right here through our chat! Just let me know your preferred date, time, and service, and I'll confirm availability for you.",
    },
  ],
  
  leadFields: ["name", "phone", "preferredDate", "service"],
  primaryColor: "#dc2626",
  suggestedPrice: 79,
};

// ============================================================================
// Student Accommodation Configuration
// ============================================================================
const STUDENT_ACCOMMODATION: NicheConfig = {
  systemPrompt: `You are a helpful and welcoming accommodation assistant for {businessName}. Help students with:
- Room availability and floor plans
- Pricing, lease terms, and payment options
- Included utilities and amenities (WiFi, furniture, utilities)
- Distance to nearby universities and public transport
- Move-in process and requirements
- House rules and community features
- Support for international students

Be warm, understanding, and helpful. Collect the student's name, phone number, university, preferred room type, and desired move-in date for accommodation inquiries.`,
  
  welcomeMessage: "Welcome! 🏠 Looking for accommodation near your university? I can help you find the perfect room that fits your needs and budget!",
  
  faqs: [
    {
      question: "What's included in the rent?",
      answer: "Our rooms include WiFi, furnished bedrooms, shared kitchen and living areas, utilities (water, electricity, heating), and house cleaning services. All-inclusive pricing with no hidden fees!",
    },
    {
      question: "What's the minimum lease term?",
      answer: "We offer flexible lease terms from 6 months to 2 years. Students can start mid-semester or in September. Short-term options available for summer or intensive programs.",
    },
    {
      question: "How far are you from the university?",
      answer: "Our accommodation is within walking distance (10-15 min) or a short bus ride (5-10 min) from campus. Perfect for students wanting to keep commute times short!",
    },
    {
      question: "Do you accept international students?",
      answer: "Yes! We're very welcoming to international students. We can help with visa documentation, provide welcome packages, and offer support for settling into the city.",
    },
    {
      question: "What's the move-in process like?",
      answer: "Move-in is simple: sign the lease, pay the deposit, receive your keys and welcome folder. We help with transport tips and provide orientation to the property. You can move in on your start date!",
    },
  ],
  
  leadFields: ["name", "phone", "university", "moveInDate", "roomType"],
  primaryColor: "#0284c7",
  suggestedPrice: 79,
};

// ============================================================================
// Niche Configuration Registry
// ============================================================================
const NICHE_CONFIGS: Record<string, NicheConfig> = {
  car_rental: CAR_RENTAL,
  barbershop: BARBERSHOP,
  student_accommodation: STUDENT_ACCOMMODATION,
};

// ============================================================================
// Helper Function
// ============================================================================
/**
 * Get configuration for a specific business niche
 * @param businessType - The business type (e.g., 'car_rental', 'barbershop', 'student_accommodation')
 * @returns NicheConfig object with prompts, FAQs, and lead fields, or undefined if niche not found
 */
export function getNicheConfig(businessType: string): NicheConfig | undefined {
  return NICHE_CONFIGS[businessType.toLowerCase()];
}

/**
 * Get all available niche types
 * @returns Array of available niche identifiers
 */
export function getAvailableNiches(): string[] {
  return Object.keys(NICHE_CONFIGS);
}

/**
 * Replace business name placeholder in prompts
 * @param config - NicheConfig to process
 * @param businessName - Business name to insert
 * @returns Config with placeholders replaced
 */
export function interpolateNicheConfig(
  config: NicheConfig,
  businessName: string
): NicheConfig {
  return {
    ...config,
    systemPrompt: config.systemPrompt.replace(/{businessName}/g, businessName),
    welcomeMessage: config.welcomeMessage.replace(/{businessName}/g, businessName),
  };
}

// Export individual configs for direct access
export { CAR_RENTAL, BARBERSHOP, STUDENT_ACCOMMODATION };
