import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

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
