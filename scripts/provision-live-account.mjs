import { readFileSync } from 'fs';

function loadEnv(path = '.env.local') {
  const env = {};
  const raw = readFileSync(path, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const adminSecret = env.ADMIN_SECRET || process.env.ADMIN_SECRET;

  if (!adminSecret) {
    console.error('ADMIN_SECRET is missing in .env.local and process env.');
    process.exit(1);
  }

  const payload = {
    email: 'muhanguzirollands@gmail.com',
    businessName: 'Muhanguzi Rollands',
    ownerName: 'Rollands',
    businessType: 'other',
    plan: 'pro',
    daysValid: 31,
  };

  const res = await fetch('https://www.cypai.app/api/admin/provision', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log(`status=${res.status}`);
  console.log(text);

  if (!res.ok) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
