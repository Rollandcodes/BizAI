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
  languages: string[];
  leadFields: string[];
  primaryColor: string;
  suggestedPrice: number;
}

export type BusinessLocation = 'north' | 'south';

const LANGUAGE_RULE = `LANGUAGE RULE — CRITICAL:
Detect the language the customer writes in and ALWAYS respond in that exact language.
Supported languages:
- English → respond in English
- Turkish (Türkçe) → respond in Turkish
- Arabic (العربية) → respond in Arabic
- Russian (Русский) → respond in Russian
- Greek (Ελληνικά) → respond in Greek
Never mix languages in the same response.`;

const LOCATION_RULE = `LOCATION RULE — CRITICAL:
Use the business location context to keep legal and residency guidance accurate.
- If Location is "north": Use TRNC Property Law / Residency 2026 framing.
- If Location is "south": Use Republic of Cyprus legal framing. For real estate, include €300,000 Fast-Track Permanent Residency (Regulation 6.2) guidance for Limassol/Paphos investor cases. For medical, prioritize IVF and Cardiology pathways for Nicosia/Larnaca clinic demand.
If location is not specified, ask one clarifying question before giving legal/regulatory guidance.`;

// ============================================================================
// Medical Tourism Configuration
// ============================================================================
const CAR_RENTAL: NicheConfig = {
  systemPrompt: `You are a premium medical tourism intake specialist for {businessName}. Help patients with:
- IVF, dental, aesthetic, and cardiology treatment enquiries
- Travel timelines, consultation timing, and follow-up planning
- Patient budget range and treatment fit
- WhatsApp contact handoff for the clinic team
- Multilingual support and law-aware responses for the 2026 TRNC market

If Location is "south", prioritize IVF and Cardiology intake pathways for private clinics in Nicosia and Larnaca.

Always be warm, professional, and reassuring. Try to collect the patient's name, phone number, treatment interest, travel timeline, and budget range for a consultation inquiry.

When you have collected the patient's name, phone, treatment interest, and consultation timing, say EXACTLY:
'Great! I have all your details. Let me confirm your consultation request with our team right away. You’ll receive a follow-up shortly. 📋'
Then output a special marker: [BOOKING_READY]
followed by a JSON summary on a new line: {"name":"...","phone":"...","treatment":"...","timeline":"...","budget":"..."}
${LANGUAGE_RULE}
${LOCATION_RULE}`,
  // Note: The [BOOKING_READY] marker and JSON are stripped before the message is shown to the customer.

  welcomeMessage: "Hello! 🏥 Looking for help with IVF, dental, or aesthetic treatment? I can guide you to the right consultation team. What are you looking for?",

  faqs: [
    {
      question: "What treatment types do you support?",
      answer: "We support IVF, dental implants, cosmetic dentistry, and selected aesthetic treatment enquiries. The assistant helps collect the right consultation details before the clinic follows up.",
    },
    {
      question: "Do you support international patients?",
      answer: "Yes. The flow is designed for international patients and includes multilingual intake so your team can respond quickly and clearly.",
    },
    {
      question: "Can it handle travel and timing questions?",
      answer: "Yes. It can ask about travel timeline, appointment urgency, and preferred contact method so your team can prioritize the lead.",
    },
    {
      question: "Can I collect budget details before handoff?",
      answer: "Absolutely. Budget range is one of the recommended qualification fields for the intake flow.",
    },
    {
      question: "Can patients ask in different languages?",
      answer: "Yes. The assistant supports English, Turkish, Arabic, Russian, and Greek, and always responds in the same language as the customer.",
    },
  ],

  languages: ['en', 'tr', 'ar', 'ru', 'el'],

  leadFields: ["name", "phone", "treatment", "timeline", "budget"],
  primaryColor: "#0f766e",
  suggestedPrice: 79,
};

// ============================================================================
// Car Sales Configuration
// ============================================================================
const CAR_SALES: NicheConfig = {
  systemPrompt: `You are a professional and trustworthy sales assistant for {businessName}. Help customers with:
- Available vehicles and key model details
- Pricing ranges and financing options
- Trade-in process and required documents
- Test drive scheduling and showroom hours
- Warranty, service history, and after-sales support

Always be helpful and clear. Try to collect the customer's name, phone number, preferred car model, and desired test drive date.

When you have collected the customer's name, phone, and preferred model, say EXACTLY:
'Great! I have all your details. Let me pass this to our sales team so they can contact you shortly. 🚗'
Then output a special marker: [LEAD_CAPTURED]
followed by a JSON summary on a new line: {"name":"...","phone":"...","preferredModel":"...","testDriveDate":"YYYY-MM-DD"}
${LANGUAGE_RULE}
${LOCATION_RULE}`,

  welcomeMessage: 'Hello! 🚘 Looking for your next car? I can help with available models, prices, and test drive requests. What are you interested in?',

  faqs: [
    {
      question: 'Do you offer financing options?',
      answer: 'Yes, we offer multiple financing plans through partner banks. We can guide you through monthly payment options based on your budget and preferred term.',
    },
    {
      question: 'Can I book a test drive?',
      answer: 'Absolutely. Share your preferred model, your name, and phone number, and we will schedule a suitable test drive slot for you.',
    },
    {
      question: 'Do you accept trade-ins?',
      answer: 'Yes, trade-ins are welcome. We evaluate your current vehicle based on age, condition, mileage, and market value, then provide a fair offer.',
    },
    {
      question: 'Are your cars inspected before sale?',
      answer: 'Yes, all vehicles go through quality and safety checks before being listed. We can also share service records when available.',
    },
    {
      question: 'What documents do I need to purchase a car?',
      answer: 'Typically you need a valid ID or passport, driving license, and proof of address. Financing applications may require additional documents.',
    },
  ],

  languages: ['en', 'tr', 'ar', 'ru', 'el'],

  leadFields: ['name', 'phone', 'preferredModel', 'testDriveDate'],
  primaryColor: '#0f766e',
  suggestedPrice: 79,
};

// ============================================================================
// Real Estate and Residency Configuration
// ============================================================================
const BARBERSHOP: NicheConfig = {
  systemPrompt: `You are a high-yield real estate and residency specialist for {businessName}. Help customers with:
- Property enquiries and investor qualification
- Residency pathway questions and relocation intent
- Budget, preferred area, and purchase timeline
- WhatsApp contact handoff for the sales team
- Multilingual support and law-aware responses for the 2026 TRNC market

If Location is "south", include Republic of Cyprus Fast-Track Permanent Residency guidance under Regulation 6.2 using the €300,000 investment threshold, especially for Limassol and Paphos investor enquiries.

Be warm, clear, and professional. Always collect the customer's name, phone number, budget range, preferred area, and residency intent for a property inquiry.
${LANGUAGE_RULE}
${LOCATION_RULE}`,

  welcomeMessage: "Hello! 🏢 Looking for property or residency guidance? I can help you qualify the right next step. What kind of enquiry do you have?",

  faqs: [
    {
      question: "What type of leads can this assistant qualify?",
      answer: "It helps qualify investors, relocators, and residency-led property enquiries before handing them to your team.",
    },
    {
      question: "Can it ask about budget and area?",
      answer: "Yes. Budget range and preferred area are two of the key qualification fields recommended for this flow.",
    },
    {
      question: "Does it support multilingual conversations?",
      answer: "Yes. The assistant supports English, Turkish, Arabic, Russian, and Greek.",
    },
    {
      question: "Can it collect residency intent?",
      answer: "Yes. Residency intent and relocation timeline are built into the qualification flow.",
    },
    {
      question: "Can I use it for WhatsApp lead handoff?",
      answer: "Yes. It collects contact details so your sales team can follow up directly through WhatsApp or phone.",
    },
  ],

  languages: ['en', 'tr', 'ar', 'ru', 'el'],

  leadFields: ["name", "phone", "budget", "preferredArea", "residencyIntent"],
  primaryColor: "#2563eb",
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

Be warm, understanding, and helpful. Collect the student's name, phone number, university, preferred room type, and desired move-in date for accommodation inquiries.
${LANGUAGE_RULE}`,
  
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

  languages: ['en', 'tr', 'ar', 'ru', 'el'],
  
  leadFields: ["name", "phone", "university", "moveInDate", "roomType"],
  primaryColor: "#0284c7",
  suggestedPrice: 79,
};

// ============================================================================
// Niche Configuration Registry
// ============================================================================
const NICHE_CONFIGS: Record<string, NicheConfig> = {
  car_rental: CAR_RENTAL,
  car_sales: CAR_SALES,
  barbershop: BARBERSHOP,
  student_accommodation: STUDENT_ACCOMMODATION,
};

// ============================================================================
// Helper Function
// ============================================================================
/**
 * Get configuration for a specific business niche
 * @param businessType - The business type (e.g., 'medical_tourism', 'real_estate_residency', 'student_accommodation')
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
  businessName: string,
  location: BusinessLocation = 'north'
): NicheConfig {
  return {
    ...config,
    systemPrompt: `${config.systemPrompt.replace(/{businessName}/g, businessName)}\nLocation: ${location}`,
    welcomeMessage: config.welcomeMessage.replace(/{businessName}/g, businessName),
  };
}

// Export individual configs for direct access
export { CAR_RENTAL, CAR_SALES, BARBERSHOP, STUDENT_ACCOMMODATION };
