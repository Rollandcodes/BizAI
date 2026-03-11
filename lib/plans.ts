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
    description: 'AI Assistant Starter - 500 messages/month',
    features: [
      '500 messages/month',
      'Website chat widget',
      'Lead capture',
      'Email support',
    ],
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: '29.00',
    description: 'AI Assistant Basic - 500 messages/month',
    features: [
      '500 messages/month',
      'Website chat widget',
      'Lead capture',
      'Email support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '79.00',
    description: 'AI Assistant Pro - Unlimited',
    features: [
      'Unlimited messages',
      'WhatsApp integration',
      'Analytics',
      'Priority support',
      'Custom AI training',
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    price: '149.00',
    description: 'AI Assistant Business - Full Suite',
    features: [
      'Everything in Pro',
      'Multiple locations',
      'White-label',
      'Custom integrations',
      '24/7 phone support',
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
