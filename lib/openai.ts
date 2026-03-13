import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function isPlaceholderKey(apiKey: string): boolean {
  const normalized = apiKey.toLowerCase();
  return (
    normalized.includes('your_openai') ||
    normalized.includes('replace_me') ||
    normalized.includes('changeme') ||
    normalized.includes('placeholder')
  );
}

function getOpenAIStartupWarning(apiKey: string | undefined): string | null {
  if (!apiKey) {
    return '[OpenAI] OPENAI_API_KEY is missing. Chat responses will run in fallback mode.';
  }

  if (isPlaceholderKey(apiKey)) {
    return '[OpenAI] OPENAI_API_KEY appears to be a placeholder value. Chat responses will run in fallback mode.';
  }

  if (!apiKey.startsWith('sk-')) {
    return '[OpenAI] OPENAI_API_KEY format looks unusual (expected prefix: sk-). Verify your key to avoid runtime auth errors.';
  }

  return null;
}

async function probeOpenAIKeyOnStartup(apiKey: string): Promise<void> {
  try {
    const client = new OpenAI({ apiKey });
    await client.models.list();
  } catch (error) {
    const err = error as { status?: number; code?: string; message?: string };
    if (err?.status === 401 || err?.code === 'invalid_api_key') {
      console.warn('[OpenAI] OPENAI_API_KEY failed startup validation (401 invalid_api_key). Chat responses will run in fallback mode.');
      return;
    }

    console.warn('[OpenAI] Startup key probe could not be completed. The key may still be valid; this can happen during temporary network/provider issues.');
  }
}

function validateOpenAIEnvOnStartup(): void {
  if (typeof window !== 'undefined') {
    return;
  }

  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const warning = getOpenAIStartupWarning(apiKey);
  if (warning) {
    console.warn(warning);
    return;
  }

  // Fire-and-forget probe so startup is not blocked.
  void probeOpenAIKeyOnStartup(apiKey as string);
}

validateOpenAIEnvOnStartup();

/** Returns a singleton OpenAI client, initialised lazily at first call. */
export function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}
