import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite',
});

export async function generateChatResponse(
  cvContent: string,
  conversationHistory: { role: string; content: string }[],
  userMessage: string
) {
  const systemPrompt = `You are an AI assistant with access to detailed information about Patrick Herbert, an experienced AI/ML Engineer. Your role is to answer questions about Patrick's professional background, experience, and qualifications using the context provided below.

Tone: Professional but conversational - not stiff or overly formal. Be helpful and engaging.

CONTEXT:
${cvContent}

When answering:
- Speak in third person about Patrick (e.g., "Patrick has experience in...", "He worked on...")
- Be accurate and only reference information from the provided context
- If asked about something not in the available information, politely say you don't have that information
- Keep responses concise but informative - use the detailed context to give thorough answers when appropriate
- Highlight relevant accomplishments and technical details when appropriate
- You can discuss specific technologies, architectures, and implementation details that are mentioned in the context`;

  // Build conversation history for context
  const chatHistory = conversationHistory.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will answer questions about Patrick Herbert based on the provided context, using a professional but conversational tone and leveraging the detailed technical information available.' }],
      },
      ...chatHistory,
    ],
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}
