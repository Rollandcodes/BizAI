import { google } from 'googleapis';
import { createServerClient } from '@/lib/supabase';

type TenantSettingsRow = {
  tenant_id: string;
  google_refresh_token: string | null;
};

function requireGoogleEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret) {
    throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  // Fallback keeps utility usable in server-only token refresh mode.
  return {
    clientId,
    clientSecret,
    redirectUri: redirectUri || 'postmessage',
  };
}

export async function googleCalendarAuth(tenantId: string): Promise<InstanceType<typeof google.auth.OAuth2>> {
  if (!tenantId?.trim()) {
    throw new Error('tenantId is required');
  }

  const { clientId, clientSecret, redirectUri } = requireGoogleEnv();
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('tenant_settings')
    .select('tenant_id, google_refresh_token')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load tenant_settings for ${tenantId}: ${error.message}`);
  }

  const row = data as TenantSettingsRow | null;
  const refreshToken = row?.google_refresh_token?.trim();

  if (!refreshToken) {
    throw new Error(`Tenant ${tenantId} has no Google refresh token configured`);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Proactively refresh once so callers fail early with a clear message.
  try {
    await oauth2Client.getAccessToken();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown OAuth error';
    throw new Error(`Failed to refresh Google access token for tenant ${tenantId}: ${message}`);
  }

  return oauth2Client;
}
