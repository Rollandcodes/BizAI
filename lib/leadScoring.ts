export interface ScoringEvent {
  type: 'asked_price' | 'gave_phone' | 'gave_email' | 'asked_availability'
       | 'used_urgency' | 'casual_browse' | 'gave_name' | 'asked_booking'
}

const SCORE_MAP: Record<ScoringEvent['type'], number> = {
  asked_price:       +10,  // Shows buying intent
  gave_phone:        +25,  // Highest value signal
  gave_email:        +15,  // Strong signal
  gave_name:         +10,  // Engaged visitor
  asked_availability:+15,  // Ready to act
  asked_booking:     +20,  // Direct intent
  used_urgency:      +25,  // "now", "today", "emergency", "ASAP"
  casual_browse:     -10,  // Generic questions
}

export function calculateLeadScore(events: ScoringEvent['type'][]): number {
  const raw = events.reduce((score, e) => score + (SCORE_MAP[e] || 0), 0)
  return Math.min(100, Math.max(0, raw))
}

export function getLeadHeat(score: number): 'cold' | 'warm' | 'hot' {
  if (score >= 60) return 'hot'
  if (score >= 30) return 'warm'
  return 'cold'
}

/**
 * Detects urgency in both English and Turkish/Arabic common terms
 */
export function detectUrgency(message: string): boolean {
  const urgencyWords = [
    'today', 'now', 'emergency', 'urgent', 'asap', 'immediately',
    'right now', 'tonight', 'broken', 'leak', 'flood', 'fire', 
    'شو اسرع', 'acil', 'derhal', 'hemen'
  ]
  return urgencyWords.some(w => message.toLowerCase().includes(w))
}

/**
 * Classifies the visitor's primary intent
 */
export function classifyIntent(message: string): 'pricing' | 'booking' | 'availability' | 'complaint' | 'inquiry' {
  const m = message.toLowerCase()
  if (/price|cost|how much|fee|rate|fiyat|ne kadar/i.test(m)) return 'pricing'
  if (/book|reserve|appointment|schedule|randevu|rezervasyon/i.test(m)) return 'booking'
  if (/available|availability|open|vacancy|müsait/i.test(m)) return 'availability'
  if (/complaint|problem|broken|not working|sorun|şikayet/i.test(m)) return 'complaint'
  return 'inquiry'
}
