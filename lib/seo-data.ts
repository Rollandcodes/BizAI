// =============================================================================
// Programmatic SEO data — niches, cities, and competitor comparisons
// =============================================================================

export type NicheSEO = {
  slug: string;
  name: string;           // "Car Rental"
  plural: string;         // "Car Rental Businesses"
  emoji: string;
  keyword: string;        // primary target keyword fragment
  useCase: string;        // short phrase used in headings
  painPoints: string[];
  features: string[];
  faqs: { q: string; a: string }[];
};

export type CitySEO = {
  slug: string;
  name: string;
  country: string;
};

export type CompetitorSEO = {
  slug: string;
  name: string;
  category: string;
  targetUser: string;
  tagline: string;
  weaknesses: string[];
  cypaiAdvantages: string[];
  pricingNote: string;
  tableComparison: Array<{
    feature: string;
    cypai: string | boolean;
    competitor: string | boolean;
  }>;
  faqs: { q: string; a: string }[];
};

// =============================================================================
// NICHES
// =============================================================================

export const SEO_NICHES: NicheSEO[] = [
  {
    slug: 'car-rental',
    name: 'Car Rental',
    plural: 'Car Rental Businesses',
    emoji: '🚗',
    keyword: 'AI chatbot for car rental',
    useCase: 'instant booking inquiries, fleet availability, and lead capture',
    painPoints: [
      'Tourists call at midnight to ask about availability and pricing',
      'Staff waste hours answering the same questions about documents and insurance',
      'Leads drop off when no one is online to respond quickly',
      'WhatsApp inquiries pile up unread over weekends and holidays',
    ],
    features: [
      'Answers vehicle, pricing, and availability questions 24/7',
      'Captures lead name, phone, and pickup/return dates automatically',
      'Sends booking summaries straight to your CRM',
      'Replies in English, Greek, Turkish, Arabic, and Russian',
      'Works on your website and via WhatsApp simultaneously',
    ],
    faqs: [
      {
        q: 'Can CypAI handle WhatsApp inquiries from tourists?',
        a: 'Yes. CypAI connects to WhatsApp via the official Meta Cloud API and replies automatically in the customer\'s language — English, Greek, Turkish, Arabic, or Russian.',
      },
      {
        q: 'Will it capture the customer\'s pickup date and car preference?',
        a: 'Absolutely. The AI is trained to collect name, phone number, desired dates, and car type before notifying you with a lead summary.',
      },
      {
        q: 'Can I still see all conversations in one place?',
        a: 'Yes — every web chat and WhatsApp message appears in your CypAI dashboard under a unified inbox, with channel badges so you always know where the inquiry came from.',
      },
    ],
  },
  {
    slug: 'car-sales',
    name: 'Car Sales',
    plural: 'Car Dealerships',
    emoji: '🚘',
    keyword: 'AI chatbot for car sales',
    useCase: 'stock inquiries, financing questions, test drives, and buyer lead capture',
    painPoints: [
      'Buyers message at night asking if a specific model is still available',
      'Sales teams lose warm leads when no one replies quickly on WhatsApp',
      'The same financing and trade-in questions are repeated all day',
      'Test-drive interest gets lost across calls, DMs, and website chats',
    ],
    features: [
      'Answers model availability, mileage, price range, and warranty questions 24/7',
      'Captures buyer name, phone, preferred model, and test-drive intent automatically',
      'Handles financing and trade-in FAQs with clear, consistent replies',
      'Unifies website and WhatsApp inquiries into one searchable dashboard',
      'Replies in English, Greek, Turkish, Arabic, and Russian',
    ],
    faqs: [
      {
        q: 'Can CypAI book test-drive requests automatically?',
        a: 'Yes. CypAI collects the customer name, phone number, preferred car, and requested date/time, then sends the complete lead to your team for confirmation.',
      },
      {
        q: 'Can it answer financing and monthly payment questions?',
        a: 'Yes. You can configure your dealership financing rules and sample payment ranges during setup, and CypAI will share that information consistently.',
      },
      {
        q: 'Will all buyer chats be visible in one place?',
        a: 'Yes. Every website and WhatsApp conversation is saved in your CypAI dashboard with lead details and conversation history for follow-up.',
      },
    ],
  },
  {
    slug: 'barbershop',
    name: 'Barbershop',
    plural: 'Barbershops',
    emoji: '💈',
    keyword: 'AI appointment chatbot for barbershop',
    useCase: '24/7 appointment booking and availability updates',
    painPoints: [
      'Customers message on Instagram or WhatsApp after hours to check slots',
      'Staff spend half the day answering "what time do you close?" and "how much for a haircut?"',
      'No-shows cost the shop real money every week',
      'Walk-in wait times frustrate customers who have no way to check ahead',
    ],
    features: [
      'Books appointments and captures name + phone automatically',
      'Answers pricing, walk-in policy, and hours questions instantly',
      'Supports Arabic, Russian, and Turkish alongside English and Greek',
      'Embeds on your website in under 10 minutes — no developer needed',
      'Delivers every lead to your CRM with full conversation history',
    ],
    faqs: [
      {
        q: 'Can CypAI send booking confirmations via WhatsApp?',
        a: 'Yes. Once a customer provides their details through WhatsApp chat, the AI logs the lead and you can follow up directly — or connect an automation to send a confirmation message.',
      },
      {
        q: 'Will it work if most of my customers speak Arabic or Russian?',
        a: 'CypAI auto-detects the language the customer writes in and replies in the same language — English, Arabic, Russian, Turkish, or Greek.',
      },
      {
        q: 'How hard is it to set up?',
        a: 'Very easy. Paste one line of code on your website and you\'re live. The AI learns your hours, pricing, and services from a short onboarding form.',
      },
    ],
  },
  {
    slug: 'hotel',
    name: 'Hotel & Accommodation',
    plural: 'Hotels & Accommodation Providers',
    emoji: '🏨',
    keyword: 'AI chatbot for hotel',
    useCase: 'guest inquiries, room availability, and direct booking capture',
    painPoints: [
      'Guests ask check-in times and amenity questions at 3am when no staff is on duty',
      'Booking.com and Airbnb take commission on every reservation you could capture directly',
      'Unanswered WhatsApp messages result in guests booking with a competitor instead',
      'Multilingual guests get poor responses from staff not fluent in their language',
    ],
    features: [
      'Handles availability, pricing, and amenity questions around the clock',
      'Captures direct booking inquiries before guests go to third-party sites',
      'Replies fluently in English, Greek, Turkish, Arabic, and Russian',
      'All conversations logged in your CRM — no message ever missed',
      'Integrates with your WhatsApp business number in one click',
    ],
    faqs: [
      {
        q: 'Can CypAI help reduce Booking.com commission fees?',
        a: 'Yes. By capturing direct inquiries through WhatsApp and your website chat, CypAI helps convert guests before they go to third-party booking platforms that charge 15–25% commission.',
      },
      {
        q: 'Can it handle requests in multiple languages?',
        a: 'Yes — CypAI detects Russian, Arabic, Turkish, Greek, and English automatically and responds in the same language, no configuration needed.',
      },
      {
        q: 'Will it answer specific questions about my property?',
        a: 'Absolutely. During setup you input your property details, amenities, policies, and FAQs. The AI uses this to answer guest questions accurately.',
      },
    ],
  },
  {
    slug: 'restaurant',
    name: 'Restaurant',
    plural: 'Restaurants',
    emoji: '🍽️',
    keyword: 'AI chatbot for restaurant',
    useCase: 'reservations, menu questions, and table booking automation',
    painPoints: [
      'Diners call during busy service hours to ask basic menu and hours questions',
      'Reservation requests on WhatsApp are missed when the team is flat out',
      'International tourists abandon enquiries when they cannot communicate easily',
      'Staff waste time on repetitive calls that could be handled automatically',
    ],
    features: [
      'Takes table reservation details and logs them to your CRM automatically',
      'Answers menu, allergen, and hours questions without staff intervention',
      'Handles multilingual tourists in 5 languages out of the box',
      'Works on your website and WhatsApp simultaneously, 24/7',
      'Sends you a notification for every new reservation lead captured',
    ],
    faqs: [
      {
        q: 'Can CypAI take reservation bookings through WhatsApp?',
        a: 'Yes. When a customer messages your WhatsApp number, the AI collects their name, party size, date, and time and sends you a full lead summary.',
      },
      {
        q: 'Can I train it on my menu?',
        a: 'Yes. You upload your menu content (or paste it) during onboarding and the AI will answer specifics about dishes, pricing, and allergens.',
      },
      {
        q: 'What happens after the AI captures a booking?',
        a: 'All leads appear in your CypAI dashboard with full conversation history. You can also connect a follow-up automation to confirm reservations by WhatsApp.',
      },
    ],
  },
  {
    slug: 'clinic',
    name: 'Clinic & Medical',
    plural: 'Clinics & Medical Practices',
    emoji: '🏥',
    keyword: 'AI patient intake chatbot for clinic',
    useCase: 'patient inquiries, appointment booking, and after-hours coverage',
    painPoints: [
      'Patients call during consultations when reception cannot pick up',
      'After-hours appointment requests are lost until morning',
      'Staff spend too much time re-explaining the same services and prices',
      'International patients cannot communicate effectively with local staff',
    ],
    features: [
      'Handles appointment booking and collects patient name and phone',
      'Answers service, pricing, and hours questions 24/7 without staff',
      'Replies in 5 languages for international patient populations',
      'GDPR-aware data handling — no patient data stored without consent',
      'All inquiries logged in a secure CRM for follow-up',
    ],
    faqs: [
      {
        q: 'Is CypAI safe to use for patient data?',
        a: 'CypAI collects only the minimum contact information needed (name, phone) for appointment booking. All data is stored securely in your Supabase-backed CRM.',
      },
      {
        q: 'Can it handle after-hours inquiries?',
        a: 'Yes — that\'s its primary strength. When your reception is closed, CypAI continues answering questions and capturing appointment requests automatically.',
      },
      {
        q: 'Will patients get accurate answers about specific treatments?',
        a: 'You train the AI on your services and standard FAQs during setup. It stays within what you teach it and refers complex medical questions back to your team.',
      },
    ],
  },
  {
    slug: 'gym',
    name: 'Gym & Fitness',
    plural: 'Gyms & Fitness Studios',
    emoji: '💪',
    keyword: 'AI membership chatbot for gym',
    useCase: 'membership enquiries, class schedules, and trial sign-up capture',
    painPoints: [
      'Prospective members ask about memberships at weekends when no one is in the office',
      'Staff spend hours every week answering the same class schedule questions',
      'Trial sign-up links get shared but there is no follow-up system',
      'Language barriers prevent some communities from enquiring at all',
    ],
    features: [
      'Captures trial and membership sign-ups with full contact details',
      'Answers class schedules, pricing, and trainer questions instantly',
      'Works on your website and WhatsApp around the clock',
      'Multilingual — handles Arabic, Russian, and Turkish speakers',
      'Delivers leads to your CRM so no sign-up enquiry falls through',
    ],
    faqs: [
      {
        q: 'Can CypAI promote specific membership offers automatically?',
        a: 'Yes. You can configure the AI with your current promotions and it will mention them naturally in conversations when relevant.',
      },
      {
        q: 'Will it handle class booking requests?',
        a: 'The AI captures the customer\'s interest, preferred class, and best contact time, then notifies you — making it easy for your team to confirm the booking.',
      },
      {
        q: 'How quickly can we go live?',
        a: 'Most gyms are live and capturing leads within 15 minutes of completing the onboarding form — no developer, no delay.',
      },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate Agency',
    plural: 'Real Estate Agencies',
    emoji: '🏠',
    keyword: 'AI lead chatbot for real estate',
    useCase: 'property inquiries, viewings, and investor lead capture',
    painPoints: [
      'Overseas buyers enquire outside office hours when agents are unavailable',
      'Serious leads go cold waiting 24+ hours for a response',
      'Agents waste hours pre-qualifying the wrong type of buyer',
      'Language barriers stop Russian, Arabic, and Turkish buyers from enquiring',
    ],
    features: [
      'Pre-qualifies buyers by collecting budget, timeline, and preferences 24/7',
      'Answers listing questions and captures viewing requests automatically',
      'Replies in Russian, Arabic, Turkish, Greek, and English',
      'All leads scored and stored in your CRM with full conversation history',
      'Works via website chat and WhatsApp — wherever buyers contact you',
    ],
    faqs: [
      {
        q: 'Can CypAI handle Russian and Arabic-speaking investors?',
        a: 'Yes — CypAI automatically detects and responds in Russian, Arabic, Turkish, Greek, or English, making it ideal for the international buyer market.',
      },
      {
        q: 'Will it pre-qualify leads before I talk to them?',
        a: 'Yes. The AI collects budget, property type, preferred area, and timeline before routing the lead to your team, saving hours of qualification time.',
      },
      {
        q: 'Does it work with WhatsApp?',
        a: 'Yes. CypAI connects to your WhatsApp Business number via Meta\'s official API, so inquiry messages on WhatsApp are handled and logged automatically.',
      },
    ],
  },
  {
    slug: 'law-firm',
    name: 'Law Firm',
    plural: 'Law Firms',
    emoji: '⚖️',
    keyword: 'AI intake chatbot for law firm',
    useCase: 'client intake, first-response answers, and consultation booking',
    painPoints: [
      'Potential clients call to ask basic questions that could be answered automatically',
      'Out-of-hours enquiries are lost — especially from international clients in different time zones',
      'Intake forms are ignored; clients prefer to ask questions in conversation',
      'Non-English speakers cannot communicate their legal needs',
    ],
    features: [
      'Captures client name, phone, and case type for consultation booking',
      'Answers general practice area and fee structure questions 24/7',
      'Multilingual — English, Greek, Russian, Arabic, and Turkish',
      'Keeps all intake conversations in a secure, searchable CRM',
      'Never gives legal advice — routes complex questions to your team',
    ],
    faqs: [
      {
        q: 'Will CypAI give legal advice to clients?',
        a: 'No. CypAI is configured to provide general information about your practice areas and intake process only, directing substantive legal questions to your attorneys.',
      },
      {
        q: 'Can it handle clients from Russia, Turkey, or the Middle East?',
        a: 'Yes — CypAI auto-detects the client\'s language and responds accordingly in Russian, Turkish, Arabic, Greek, or English. This is especially valuable for international firms.',
      },
      {
        q: 'How are client conversations stored?',
        a: 'All conversations are encrypted and stored in your CypAI CRM dashboard. You can search, filter, and export them at any time.',
      },
    ],
  },
];

// =============================================================================
// CITIES
// =============================================================================

export const SEO_CITIES: CitySEO[] = [
  { slug: 'nicosia',   name: 'Nicosia',   country: 'Cyprus' },
  { slug: 'limassol',  name: 'Limassol',  country: 'Cyprus' },
  { slug: 'kyrenia',   name: 'Kyrenia',   country: 'Northern Cyprus' },
  { slug: 'famagusta', name: 'Famagusta', country: 'Northern Cyprus' },
  { slug: 'larnaca',   name: 'Larnaca',   country: 'Cyprus' },
  { slug: 'paphos',    name: 'Paphos',    country: 'Cyprus' },
  { slug: 'protaras',  name: 'Protaras',  country: 'Cyprus' },
];

// =============================================================================
// COMPETITORS
// =============================================================================

export const SEO_COMPETITORS: CompetitorSEO[] = [
  {
    slug: 'tidio',
    name: 'Tidio',
    category: 'live chat and chatbot platform',
    targetUser: 'e-commerce stores and SaaS companies',
    tagline: 'Tidio is built for e-commerce. CypAI is built for service businesses in Cyprus and beyond.',
    weaknesses: [
      'Pricing jumps sharply as conversation volume grows',
      'No Arabic, Turkish, or Russian-first language detection',
      'WhatsApp integration requires expensive third-party add-ons',
      'Not built for service-industry lead capture (bookings, appointments, inquiries)',
      'Complex setup for non-technical business owners',
    ],
    cypaiAdvantages: [
      'Flat pricing plans — no per-conversation or per-seat fees',
      'Native WhatsApp Cloud API integration included in all plans',
      '5-language auto-detection: English, Greek, Turkish, Arabic, Russian',
      'Purpose-built for service businesses: car rental, clinic, hotel, barbershop',
      'Live in 15 minutes — no developer or code changes required',
    ],
    pricingNote: 'Tidio\'s Communicator plan starts at $29/month but real AI features require the Tidio+ plan at $329/month+. CypAI starts at $49/month with all AI features included.',
    tableComparison: [
      { feature: 'WhatsApp Integration', cypai: 'Native — included', competitor: 'Add-on required' },
      { feature: 'Arabic / Russian / Turkish', cypai: 'Auto-detected', competitor: 'Manual setup' },
      { feature: 'Lead CRM Dashboard', cypai: true, competitor: 'Basic only' },
      { feature: 'Booking / Appointment Capture', cypai: true, competitor: false },
      { feature: 'Delivery Status Tracking', cypai: true, competitor: false },
      { feature: 'Flat Monthly Pricing', cypai: true, competitor: false },
      { feature: '15-min Setup', cypai: true, competitor: false },
    ],
    faqs: [
      { q: 'Is CypAI cheaper than Tidio for a small business?', a: 'For most small businesses, yes. Tidio charges per conversation at higher tiers, while CypAI offers flat monthly plans with all AI features included from the start.' },
      { q: 'Can CypAI replace Tidio for a WhatsApp-first business?', a: 'Absolutely — CypAI has native WhatsApp Cloud API support built in. No third-party bridge or extra subscription required.' },
      { q: 'Does Tidio support Arabic or Russian language detection?', a: 'Tidio has some multilingual support but it is not automatic. CypAI auto-detects the customer\'s language from the first message.' },
    ],
  },
  {
    slug: 'gohighlevel',
    name: 'GoHighLevel',
    category: 'all-in-one marketing and CRM platform',
    targetUser: 'marketing agencies managing multiple clients',
    tagline: 'GoHighLevel is an agency platform. CypAI is a focused AI assistant any business owner can run themselves.',
    weaknesses: [
      'Steep learning curve — designed for marketing professionals, not business owners',
      'Expensive at $297/month+ to unlock full features',
      'Heavy subscription bloated with features most SMBs never use',
      'Requires significant time investment to configure properly',
      'Phone and SMS features are US/Canada-centric with added costs for international numbers',
    ],
    cypaiAdvantages: [
      'Designed for non-technical business owners — no agency needed',
      'Affordable flat plans starting at $49/month',
      'Ready to capture leads in 15 minutes from sign-up',
      'Full multilingual WhatsApp support for Cyprus and Mediterranean markets',
      'Focused AI assistant — does one thing excellently rather than 100 things poorly',
    ],
    pricingNote: 'GoHighLevel starts at $97/month for a single account and $297/month for multi-location. CypAI plans start at $49/month with all features included.',
    tableComparison: [
      { feature: 'WhatsApp Integration', cypai: 'Native Cloud API', competitor: 'Twilio bridge required' },
      { feature: 'Setup Time', cypai: '15 minutes', competitor: '1–3 days' },
      { feature: 'Arabic / Russian / Turkish', cypai: 'Auto-detected', competitor: 'Manual workflow' },
      { feature: 'Starting Price', cypai: '$49 / month', competitor: '$97 / month' },
      { feature: 'No-code Operation', cypai: true, competitor: 'Partial' },
      { feature: 'Niche-specific AI Prompts', cypai: true, competitor: false },
      { feature: 'Delivery Status Tracking', cypai: true, competitor: false },
    ],
    faqs: [
      { q: 'Is GoHighLevel worth it for a single-location business?', a: 'GoHighLevel is primarily designed for agencies managing many clients. For a single business, you pay for far more than you need. CypAI is purpose-built for exactly what a single-location business requires.' },
      { q: 'Does GoHighLevel support Arabic and Turkish WhatsApp users?', a: 'GoHighLevel\'s WhatsApp connector routes through Twilio and requires manual language configuration. CypAI auto-detects Arabic, Turkish, Russian, Greek, and English natively.' },
      { q: 'Can I self-manage CypAI without an agency?', a: 'Yes — CypAI is built specifically so business owners can manage everything themselves, with no technical knowledge or ongoing agency fees required.' },
    ],
  },
  {
    slug: 'intercom',
    name: 'Intercom',
    category: 'customer messaging and support platform',
    targetUser: 'mid-market and enterprise SaaS companies',
    tagline: 'Intercom is enterprise customer support. CypAI is AI lead capture for real-world service businesses.',
    weaknesses: [
      'Pricing starts at $74/month per seat, escalating sharply for AI features',
      'Complex product with many components — confusing for small teams',
      'No native WhatsApp integration without third-party connections',
      'Not designed for appointment-based or service-industry businesses',
      'Multilingual AI requires expensive add-ons and manual language rules',
    ],
    cypaiAdvantages: [
      'Simple, predictable flat pricing — no per-seat or per-message fees',
      'Built-in WhatsApp Cloud API, no third-party bridge',
      'One dashboard for web chat and WhatsApp conversations',
      'Trained for appointment and lead capture from day one',
      '5-language auto-detection included on all plans',
    ],
    pricingNote: 'Intercom\'s Essential plan starts at $74/seat/month. With AI features, expect $300–500/month for a small team. CypAI starts at $49/month, all-inclusive.',
    tableComparison: [
      { feature: 'WhatsApp Integration', cypai: 'Native', competitor: 'Third-party required' },
      { feature: 'Pricing Model', cypai: 'Flat monthly', competitor: 'Per seat + per resolution' },
      { feature: 'Starting Price', cypai: '$49 / month', competitor: '$74 / seat / month' },
      { feature: 'Arabic / Russian / Turkish', cypai: 'Auto-detected', competitor: 'Manual rules' },
      { feature: 'Booking / Appointment Capture', cypai: true, competitor: false },
      { feature: 'Lead CRM Dashboard', cypai: true, competitor: 'Add-on required' },
      { feature: 'Setup Time', cypai: '15 minutes', competitor: '1–2 weeks' },
    ],
    faqs: [
      { q: 'Why is CypAI a better Intercom alternative for small businesses?', a: 'Intercom is priced for SaaS companies with large support teams. CypAI is priced and designed for SMBs — one flat fee, no per-seat charges, and live in 15 minutes.' },
      { q: 'Can CypAI match Intercom\'s AI quality?', a: 'CypAI uses GPT-4o to power its responses — the same underlying AI technology used by enterprise tools. For the core use case of lead capture and customer inquiry handling, it performs excellently.' },
      { q: 'Does Intercom support WhatsApp natively?', a: 'Intercom has a WhatsApp integration but it requires third-party connectors and additional cost. CypAI has native Meta Cloud API WhatsApp support built in.' },
    ],
  },
  {
    slug: 'drift',
    name: 'Drift',
    category: 'conversational marketing platform',
    targetUser: 'B2B SaaS and enterprise sales teams',
    tagline: 'Drift is B2B enterprise sales. CypAI is AI for local service businesses that need leads today.',
    weaknesses: [
      'Pricing starts at $2,500/month — far beyond reach for most SMBs',
      'Built exclusively for B2B sales pipelines, not service-industry bookings',
      'No WhatsApp integration — website chat only',
      'Requires a full marketing/sales ops team to run effectively',
      'No multilingual or regional language support for non-English markets',
    ],
    cypaiAdvantages: [
      'Starting price of $49/month — over 50x less expensive than Drift',
      'Built for service businesses: bookings, appointments, WhatsApp, lead capture',
      'No sales ops team needed — works out of the box for any business owner',
      'Native WhatsApp included with every plan',
      'Auto-detects 5 languages for international customer bases',
    ],
    pricingNote: 'Drift starts at $2,500/month and is positioned at enterprise sales teams. CypAI plans start at $49/month — all features included.',
    tableComparison: [
      { feature: 'Starting Price', cypai: '$49 / month', competitor: '$2,500 / month' },
      { feature: 'WhatsApp Integration', cypai: 'Native', competitor: false },
      { feature: 'Service Business Fit', cypai: true, competitor: 'B2B SaaS only' },
      { feature: 'Multilingual Support', cypai: '5 languages auto', competitor: 'English only' },
      { feature: 'No-code Setup', cypai: true, competitor: 'Requires impl. team' },
      { feature: 'Appointment / Booking Capture', cypai: true, competitor: false },
      { feature: 'Delivery Status Tracking', cypai: true, competitor: false },
    ],
    faqs: [
      { q: 'Why would someone choose CypAI over Drift?', a: 'Drift is designed for large B2B enterprise sales teams with $2,500+/month budgets. CypAI is designed for local service businesses that need to capture leads and answer WhatsApp messages — at a fraction of the price.' },
      { q: 'Does Drift support WhatsApp?', a: 'No — Drift focuses exclusively on website conversational marketing. CypAI includes native WhatsApp Cloud API integration from day one.' },
      { q: 'Is CypAI as powerful as Drift for lead capture?', a: 'For the use cases relevant to service businesses — appointment booking, multilingual inquiry handling, WhatsApp lead capture — CypAI is specifically designed and more capable than Drift.' },
    ],
  },
  {
    slug: 'zendesk',
    name: 'Zendesk',
    category: 'customer support ticketing platform',
    targetUser: 'enterprise customer service teams',
    tagline: 'Zendesk manages support tickets at scale. CypAI captures leads and automates replies before a ticket is ever needed.',
    weaknesses: [
      'Ticket-based model adds friction — customers expect instant conversational replies',
      'Suite Professional plan starts at $115/seat/month',
      'Complex, slow to configure for non-enterprise use',
      'WhatsApp integration requires paid add-on at enterprise tier only',
      'No AI lead capture or appointment booking functionality',
    ],
    cypaiAdvantages: [
      'Conversational AI — no tickets, no wait queues, instant responses',
      'Flat pricing from $49/month with all features',
      'Appointment and lead capture built in from day one',
      'Native WhatsApp Cloud API — no enterprise upgrade needed',
      'Live in 15 minutes with the onboarding wizard',
    ],
    pricingNote: 'Zendesk Suite starts at $55/seat/month, with Suite Professional at $115/seat/month. A team of 3 costs $165–345/month before AI add-ons. CypAI is $49–99/month flat.',
    tableComparison: [
      { feature: 'Ticket-free Instant Replies', cypai: true, competitor: 'Ticket model' },
      { feature: 'WhatsApp Integration', cypai: 'Native', competitor: 'Enterprise add-on' },
      { feature: 'AI Lead Capture', cypai: true, competitor: false },
      { feature: 'Appointment Booking', cypai: true, competitor: false },
      { feature: 'Starting Price', cypai: '$49 / month flat', competitor: '$55 / seat / month' },
      { feature: '5-language Detection', cypai: true, competitor: 'Manual translation' },
      { feature: 'Setup Time', cypai: '15 minutes', competitor: '1–2 weeks' },
    ],
    faqs: [
      { q: 'What is the main difference between Zendesk and CypAI?', a: 'Zendesk manages inbound support tickets for large teams. CypAI proactively captures leads and answers customer questions before a ticket is ever created — it is a revenue driver, not a cost center.' },
      { q: 'Can CypAI replace Zendesk for a small business?', a: 'For small businesses that don\'t need a full ticketing system, CypAI is an effective and much more affordable replacement that adds lead capture and WhatsApp automation on top.' },
      { q: 'Does Zendesk support Arabic and Turkish?', a: 'Zendesk supports many languages but requires manual configuration. CypAI auto-detects Arabic, Turkish, Russian, Greek, and English from the first message.' },
    ],
  },
  {
    slug: 'freshdesk',
    name: 'Freshdesk',
    category: 'helpdesk and customer support platform',
    targetUser: 'SMB and mid-market support teams',
    tagline: 'Freshdesk handles inbound support. CypAI prevents the support ticket from happening in the first place.',
    weaknesses: [
      'Phone and email support focus — not built for modern WhatsApp-first communication',
      'AI Freddy features are locked behind Growth plan ($15/seat/month) and above',
      'WhatsApp requires the add-on "Freshcaller" or third-party integrations',
      'Not designed for lead capture or appointment booking',
      'Setup and configuration still requires a dedicated admin',
    ],
    cypaiAdvantages: [
      'WhatsApp Cloud API native — works where customers actually message you',
      'AI reply quality via GPT-4o, not rule-based bot trees',
      'All plans include lead capture and CRM out of the box',
      'Flat pricing with no per-seat fees for small teams',
      '15-minute setup — no admin overhead',
    ],
    pricingNote: 'Freshdesk Free supports limited agents with no AI. Growth starts at $15/seat/month. Pro at $49/seat/month. Enterprise at $79/seat/month. CypAI is $49–99/month flat for unlimited conversations.',
    tableComparison: [
      { feature: 'WhatsApp Integration', cypai: 'Native Cloud API', competitor: 'Add-on required' },
      { feature: 'AI Quality', cypai: 'GPT-4o', competitor: 'Rule-based Freddy' },
      { feature: 'Lead Capture', cypai: true, competitor: false },
      { feature: 'Appointment Booking', cypai: true, competitor: false },
      { feature: 'Pricing Model', cypai: 'Flat monthly', competitor: 'Per seat' },
      { feature: '5-language Auto Detection', cypai: true, competitor: 'Manual setup' },
      { feature: 'Delivery Status Tracking', cypai: true, competitor: false },
    ],
    faqs: [
      { q: 'Is CypAI a better Freshdesk alternative for WhatsApp-first businesses?', a: 'Yes. Freshdesk treats WhatsApp as an afterthought requiring add-ons. CypAI was built with WhatsApp as a first-class channel from day one.' },
      { q: 'How does CypAI\'s AI compare to Freshdesk\'s Freddy AI?', a: 'CypAI uses GPT-4o, one of the world\'s most capable language models. Freddy AI is primarily rule-based and intent-classification-based, which limits the quality of free-form customer conversations.' },
      { q: 'Can CypAI handle volume that Freshdesk free tier handles?', a: 'CypAI\'s paid plans support unlimited conversations. The Freshdesk free tier limits agents and features significantly. For any real business volume, CypAI is more capable at a competitive price.' },
    ],
  },
  {
    slug: 'crisp',
    name: 'Crisp Chat',
    category: 'live chat and messaging platform',
    targetUser: 'startups and indie developers',
    tagline: 'Crisp is a dev-friendly messaging tool. CypAI is a business-ready AI for owners who want leads without code.',
    weaknesses: [
      'Primarily a live chat widget — AI automation is limited without developer configuration',
      'WhatsApp integration available but limited in the lower tiers',
      'Bot builder requires technical knowledge to configure effectively',
      'No niche-specific lead capture workflows (bookings, appointments, car rentals)',
      'Limited to English in its default AI configurations',
    ],
    cypaiAdvantages: [
      'No-code setup — business owners configure it in 15 minutes via onboarding wizard',
      'Niche-specific AI configured for your industry from day one',
      'Full lead CRM with conversation history and lead scoring',
      'Native WhatsApp Cloud API with delivery status tracking',
      '5-language auto-detection with no manual configuration',
    ],
    pricingNote: 'Crisp Free is limited to 2 agents. Pro is $25/month, Unlimited is $95/month. AI add-ons cost extra. CypAI starts at $49/month with all AI features included.',
    tableComparison: [
      { feature: 'No-code Business Setup', cypai: true, competitor: 'Developer-oriented' },
      { feature: 'Niche-specific AI', cypai: true, competitor: false },
      { feature: 'WhatsApp Cloud API', cypai: 'Native', competitor: 'Limited in lower tiers' },
      { feature: 'Lead CRM', cypai: true, competitor: 'Basic' },
      { feature: '5-language Auto Detection', cypai: true, competitor: 'English primary' },
      { feature: 'Appointment Capture', cypai: true, competitor: false },
      { feature: 'Delivery Status Tracking', cypai: true, competitor: false },
    ],
    faqs: [
      { q: 'Is CypAI easier to configure than Crisp for a small business owner?', a: 'Yes. Crisp is designed for developers who want flexibility. CypAI is designed for business owners who want results on day one — the onboarding wizard takes 15 minutes and no code is needed.' },
      { q: 'Does Crisp have multilingual auto-detection?', a: 'Crisp supports multiple languages but auto-detection in responses requires bot configuration. CypAI auto-detects and responds natively in 5 languages without any setup.' },
      { q: 'Can Crisp capture appointment bookings?', a: 'Crisp can be customised to do this but it requires significant bot workflow setup. CypAI does appointment capture out of the box for barbershops, clinics, gyms, and more.' },
    ],
  },
  {
    slug: 'manychat',
    name: 'ManyChat',
    category: 'social messaging automation platform',
    targetUser: 'Instagram and Messenger marketers',
    tagline: 'ManyChat automates Instagram DMs. CypAI handles WhatsApp, website chat, and your entire lead inbox in one place.',
    weaknesses: [
      'Built around Instagram DMs and Facebook Messenger — not WhatsApp Cloud API',
      'Flow-based (rule-based) chatbots — not generative AI',
      'Website chat is an afterthought, not a core product',
      'No lead CRM or conversation management dashboard',
      'Multilingual requires separate flows for each language',
    ],
    cypaiAdvantages: [
      'Generative AI (GPT-4o) — handles nuanced, unexpected questions naturally',
      'Native WhatsApp Cloud API with two-way conversation sync',
      'Unified inbox: website chat + WhatsApp in one dashboard',
      'Full lead CRM with search, filtering, and export',
      'Auto-detects 5 languages in a single conversation flow',
    ],
    pricingNote: 'ManyChat Pro starts at $15/month but AI features are limited in scope. CypAI starts at $49/month with unlimited GPT-4o conversations on all plans.',
    tableComparison: [
      { feature: 'Generative AI (GPT-4o)', cypai: true, competitor: 'Rule-based flows only' },
      { feature: 'WhatsApp Cloud API', cypai: 'Native', competitor: 'Restricted API access' },
      { feature: 'Website Chat', cypai: true, competitor: 'Limited' },
      { feature: 'Unified Inbox Dashboard', cypai: true, competitor: false },
      { feature: 'Lead CRM', cypai: true, competitor: false },
      { feature: '5-language Auto Detection', cypai: true, competitor: 'Separate flows needed' },
      { feature: 'Appointment Capture', cypai: true, competitor: 'Manual flow setup' },
    ],
    faqs: [
      { q: 'Can CypAI replace ManyChat for WhatsApp automation?', a: 'Yes, and it goes further. ManyChat\'s WhatsApp support is limited by Meta\'s API tier access. CypAI uses the full Meta WhatsApp Cloud API with two-way messaging, delivery status tracking, and a unified dashboard.' },
      { q: 'Is CypAI\'s AI better than ManyChat\'s flow chatbots?', a: 'In flexibility and naturalness, yes. ManyChat flows handle scripted interactions well. CypAI\'s GPT-4o handles unexpected questions, free-form conversations, and multilingual replies that flows cannot manage.' },
      { q: 'Does ManyChat have a lead CRM?', a: 'ManyChat has contact tags and segments but not a full lead CRM. CypAI\'s dashboard shows every conversation, lead status, capture date, and contact details in one searchable view.' },
    ],
  },
  {
    slug: 'tawk-to',
    name: 'Tawk.to',
    category: 'free live chat platform',
    targetUser: 'businesses looking for a free live chat widget',
    tagline: 'Tawk.to is free live chat. CypAI is AI that works when you\'re not there.',
    weaknesses: [
      'Requires a human operator — the AI is very limited without paid agent subscriptions',
      'No WhatsApp integration at any pricing tier',
      'No automated lead capture; depends on someone being online to respond',
      'Branding cannot be removed on the free plan',
      'No niche-specific AI or conversation context for service businesses',
    ],
    cypaiAdvantages: [
      'Fully automated AI — captures leads even when you are asleep or on holiday',
      'Native WhatsApp integration included in all paid plans',
      'Niche-specific AI trained for your business type from day one',
      'Zero branding on your widget — looks fully like your business',
      'Lead CRM, delivery status, and WhatsApp unified inbox included',
    ],
    pricingNote: 'Tawk.to is free for the widget but charges $1/hour for AI agents and $29/month to remove their branding. CypAI starts at $49/month with full AI, WhatsApp, and branded widget included.',
    tableComparison: [
      { feature: 'AI Without Human Operator', cypai: true, competitor: 'Requires human or paid agent' },
      { feature: 'WhatsApp Integration', cypai: 'Native', competitor: false },
      { feature: 'Automated Lead Capture', cypai: true, competitor: 'Manual only' },
      { feature: 'White-label (No Branding)', cypai: true, competitor: 'Paid upgrade required' },
      { feature: 'Niche-specific AI', cypai: true, competitor: false },
      { feature: '5-language Auto Detection', cypai: true, competitor: false },
      { feature: 'Lead CRM Dashboard', cypai: true, competitor: false },
    ],
    faqs: [
      { q: 'Why is CypAI better than Tawk.to for a business owner?', a: 'Tawk.to requires someone to be online and monitoring the chat to respond. CypAI replies automatically 24/7 with AI, captures lead details, and logs everything — so you never miss an inquiry, even at 2am.' },
      { q: 'Does Tawk.to support WhatsApp?', a: 'No — Tawk.to is a website-only live chat widget with no WhatsApp support. CypAI natively integrates WhatsApp Cloud API on all paid plans.' },
      { q: 'Is "free" Tawk.to really free for a growing business?', a: 'The widget is free, but removing Tawk.to branding costs $29/month and AI Agent replies cost $1/hour — which adds up quickly. CypAI\'s $49/month covers everything with no hidden fees.' },
    ],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getNicheSEO(slug: string): NicheSEO | undefined {
  return SEO_NICHES.find((n) => n.slug === slug);
}

export function getCitySEO(slug: string): CitySEO | undefined {
  return SEO_CITIES.find((c) => c.slug === slug);
}

export function getCompetitorSEO(slug: string): CompetitorSEO | undefined {
  return SEO_COMPETITORS.find((c) => c.slug === slug);
}

export function getAllNicheCity(): Array<{ niche: string; city: string }> {
  return SEO_NICHES.flatMap((niche) =>
    SEO_CITIES.map((city) => ({ niche: niche.slug, city: city.slug }))
  );
}
