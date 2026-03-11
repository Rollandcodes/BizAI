import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey,
});

// TODO: Implement helper functions for AI responses
export const generateChatResponse = async (
  businessContext: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemPrompt = `You are a helpful customer service assistant for a local business. 
Business Information: ${businessContext}
Respond helpfully and professionally. Keep responses concise.`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || 'Unable to generate response';
};

// TODO: Add more AI functions as needed (classification, sentiment analysis, etc.)
