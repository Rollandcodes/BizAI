/**
 * One-off script to provision a business account directly into Supabase.
 * Usage: node scripts/provision-account.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually (no external dotenv dependency needed)
function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync('.env.local', 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  } catch {
    console.error('Could not read .env.local — make sure you run this from the project root.');
    process.exit(1);
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_KEY  = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// ─── Edit these values for each client ───────────────────────────────────────
const ACCOUNTS_TO_PROVISION = [
  {
    email:        'muhanguzirollands@gmail.com',
    businessName: 'Muhanguzi Rollands',
    ownerName:    'Rollands',
    businessType: 'other',
    plan:         'pro',     // 'trial' | 'basic' | 'pro' | 'business'
    daysValid:    31,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

for (const account of ACCOUNTS_TO_PROVISION) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + account.daysValid);

  // DB stores 'starter' as 'basic'
  const dbPlan = account.plan === 'starter' ? 'basic' : account.plan;

  const { data, error } = await supabase
    .from('businesses')
    .upsert(
      {
        owner_email:     account.email.toLowerCase().trim(),
        business_name:   account.businessName,
        owner_name:      account.ownerName,
        business_type:   account.businessType,
        plan:            dbPlan,
        plan_expires_at: expiresAt.toISOString(),
        widget_color:    '#2563eb',
      },
      { onConflict: 'owner_email' }
    )
    .select('id, owner_email, business_name, plan, plan_expires_at')
    .single();

  if (error) {
    console.error(`❌  Failed for ${account.email}:`, error.message);
  } else {
    console.log(`✅  Provisioned: ${data.business_name} (${data.owner_email})`);
    console.log(`    Plan:        ${data.plan}  |  Expires: ${data.plan_expires_at}`);
    console.log(`    Dashboard:   https://cypai.app/dashboard?email=${encodeURIComponent(data.owner_email)}`);
  }
  console.log('');
}
