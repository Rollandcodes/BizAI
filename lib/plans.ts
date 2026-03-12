// ============================================================================
// BizAI Subscription Plans
// ============================================================================

export interface PlanFeature {
  name: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: '29.00',
    description: 'Perfect for small local businesses',
    features: [
      '500 messages/month',
      'Website chat widget',
      'Lead capture (name + phone)',
      'Basic analytics',
      'Email support',
      'QR code for walk-in customers',
      'Mobile-friendly chat',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '79.00',
    description: 'For growing businesses that need more',
    features: [
      'Unlimited messages',
      'Website chat widget',
      'Lead capture (name + phone)',
      'WhatsApp integration',
      'Advanced analytics & reports',
      'Priority support (24h response)',
      'Custom AI training & FAQs',
      'QR code + booking system',
      'Customer satisfaction ratings',
      'Broadcast messages to leads',
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    price: '149.00',
    description: 'Full suite for serious businesses',
    features: [
      'Everything in Pro',
      'Agent Audit & compliance reports',
      'AI safety scoring per conversation',
      'Sensitive data detection',
      'Weekly PDF compliance report',
      'Multi-location support',
      'Phone support',
      'Dedicated onboarding call',
      'Custom integrations on request',
      'SLA guarantee',
    ],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get plan by ID
 */
export function getPlan(planId: string): Plan | null {
  return PLANS[planId] || null;
}

/**
 * Get all available plans
 */
export function getAllPlans(): Plan[] {
  return Object.values(PLANS);
}

/**
 * Validate plan ID
 */
export function isValidPlanId(planId: string): boolean {
  return planId in PLANS;
}
