import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/gemini';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const cvPath = join(process.cwd(), 'public', 'detailed-experience.md');
    const cvContent = readFileSync(cvPath, 'utf-8');

    const response = await generateChatResponse(
      cvContent,
      history || [],
      message
    );

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    // Check for specific Gemini API errors
    if (error.message?.includes('429') || error.status === 429) {
       return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    if (error.message?.includes('400') || error.status === 400) {
       return NextResponse.json(
        { error: 'Invalid request format. Please try refreshing the chat.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}