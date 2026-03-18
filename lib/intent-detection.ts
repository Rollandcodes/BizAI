// Intent detection for chat AI
// Detects booking and order intents from user messages

// Booking keywords in multiple languages
const BOOKING_KEYWORDS: Record<string, string[]> = {
  en: [
    "book", "booking", "reserve", "reservation", "appointment",
    "schedule", "scheduling", "i want to book", "can i book",
    "i'd like to book", "i would like to book", "need to book",
    "want to reserve", "make a booking", "create booking",
    "schedule appointment", "book a", "book an"
  ],
  ar: [
    "حجز", "احجز", "تحديد موعد", "موعد", "حجز موعد",
    "أريد أن أحجز", "أريد حجز", "أحتاج لحجز"
  ],
  tr: [
    "rezervasyon", "randevu", "book", "booking", "rezervasyon yap",
    "randevu al", "tarih ayırt", "book et"
  ],
  ru: [
    "бронирование", "забронировать", "запись", "назначить",
    "бронь", "хочу забронировать", "записаться"
  ],
  el: [
    "κρατηση", "κρατησης", "ραντεβου", "κλείσιμο",
    "θέλω να κλείσω", "θέλω ραντεβού"
  ]
};

// Order keywords in multiple languages
const ORDER_KEYWORDS: Record<string, string[]> = {
  en: [
    "order", "buy", "purchase", "get", "i want", "i'd like",
    "i would like", "can i get", "can i buy", "add to cart",
    "checkout", "order now", "place order", "ordering",
    "i need", "need to buy", "want to buy", "looking for"
  ],
  ar: [
    "طلب", "شراء", "أريد", "أشتري", "أريد شراء",
    "أريد طلب", "اطلب", "أضف للسلة"
  ],
  tr: [
    "sipariş", "satın al", "almak", "istiyorum", "sipariş ver",
    "satın almak", "alabilir miyim", "ürün almak"
  ],
  ru: [
    "заказ", "заказать", "купить", "покупка", "хочу купить",
    "хочу заказать", "оформить заказ", "приобрести"
  ],
  el: [
    "παραγγελία", "αγορά", "αγοράζω", "θέλω να αγοράσω",
    "θέλω να παραγγείλω", "παραγγελία τώρα"
  ]
};

export type IntentType = 'booking' | 'order' | 'general';

export interface DetectedIntent {
  type: IntentType;
  confidence: number;
  keywords: string[];
}

/**
 * Detects user intent from message
 * @param message - User's message
 * @returns Detected intent with type and confidence
 */
export function detectIntent(message: string): DetectedIntent {
  const lowerMessage = message.toLowerCase();
  
  // Check booking keywords
  for (const [lang, keywords] of Object.entries(BOOKING_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return {
          type: 'booking',
          confidence: 0.8,
          keywords: [keyword]
        };
      }
    }
  }
  
  // Check order keywords
  for (const [lang, keywords] of Object.entries(ORDER_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return {
          type: 'order',
          confidence: 0.8,
          keywords: [keyword]
        };
      }
    }
  }
  
  return {
    type: 'general',
    confidence: 0,
    keywords: []
  };
}

/**
 * Parse order intent from AI response
 * Looks for [ORDER_READY] marker in the AI response
 */
export interface OrderIntent {
  customerName: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price?: number;
  }>;
  totalAmount: number;
  notes?: string;
}

export function parseOrderIntent(rawMessage: string): OrderIntent | null {
  const marker = "[ORDER_READY]";
  const idx = rawMessage.indexOf(marker);
  if (idx === -1) return null;

  const after = rawMessage.slice(idx + marker.length).trim();
  const jsonLine = after
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("{") && line.endsWith("}"));

  if (!jsonLine) return null;

  try {
    const parsed = JSON.parse(jsonLine) as {
      customerName?: string;
      customerPhone?: string;
      items?: Array<{ name?: string; quantity?: number; price?: number }>;
      totalAmount?: number;
      notes?: string;
    };

    if (!parsed.customerName || !parsed.items || !parsed.totalAmount) {
      return null;
    }

    return {
      customerName: parsed.customerName.trim(),
      customerPhone: parsed.customerPhone?.trim(),
      items: parsed.items.map(item => ({
        name: item.name?.trim() || "Item",
        quantity: Math.max(1, item.quantity || 1),
        price: item.price
      })),
      totalAmount: Number(parsed.totalAmount) || 0,
      notes: parsed.notes?.trim()
    };
  } catch {
    return null;
  }
}

/**
 * Check if message contains any booking/order keywords
 * for quick filtering before AI processing
 */
export function containsBookingOrOrderKeywords(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const allBookingKeywords = Object.values(BOOKING_KEYWORDS).flat();
  const allOrderKeywords = Object.values(ORDER_KEYWORDS).flat();
  
  return allBookingKeywords.some(kw => lowerMessage.includes(kw.toLowerCase())) ||
         allOrderKeywords.some(kw => lowerMessage.includes(kw.toLowerCase()));
}
