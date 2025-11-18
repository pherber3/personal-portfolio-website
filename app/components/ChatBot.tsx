'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: "Hello. I am an AI assistant with access to Patrick's detailed technical context. I use a free-tier Gemini 1.5 Flash model so forgive me for any mistakes. How can I help?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const exampleQuestions = [
    "How did Neural ODEs handle irregular clinical data?",
    "Why did Logistic Regression beat Deep Learning for payments?",
    "What was the architecture of the sub-second Voice AI platform?",
    "Explain the Plackett-Luce differentiable ranking model."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleQuestionClick = (question: string) => {
    setShowExamples(false);
    handleSubmit(undefined, question);
  };

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const messageText = overrideInput || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    setShowExamples(false);
    
    // Add user message immediately
    const newHistory = [...messages, { role: 'user' as const, content: messageText }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          history: messages // Send history BEFORE the new message to avoid duplication logic on server if needed, or send newHistory if server expects full context. 
          // Note: Your server implementation appends the new message to history manually? 
          // Wait, your server implementation takes `history` and `message`. 
          // `generateChatResponse` builds history THEN sends message.
          // So passing `messages` (the state before this turn) is actually correct.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If error, throw with the specific message from server
        throw new Error(data.error || 'Failed to get response');
      }

      // Success: Add the actual response
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      
    } catch (error) {
      console.error(error);
      
      // Add a helpful error message to the chat
      // IMPORTANT: We use a distinct visual indicator or just text.
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          errorMessage = 'I am receiving too many requests right now. Please wait a minute and try again.';
        }
      }

      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          // Changed bg-[#1A1A1A] to bg-[#3A4D39] (Dark Green)
          // Changed hover:bg-[#3A4D39] to hover:bg-[#2A3829] (Slightly darker green)
          className="shadow-lg hover:shadow-xl transition-all duration-300 bg-[#3A4D39] text-white rounded-full px-5 py-3 flex items-center gap-2 hover:bg-[#2A3829]"
        >
          {isOpen ? (
            <>
              <span>Close</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </>
          ) : (
            <>
              <span className="font-medium text-sm">Ask AI Assistant</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[90vw] md:w-[400px] h-[550px] bg-white rounded-xl shadow-2xl border border-[#E5E2D9] flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-[#F4F2ED] p-3 border-b border-[#E5E2D9] text-xs font-mono text-[#787570] text-center uppercase tracking-wide">
            RAG Deep Dive Assistant
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFCFB]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-lg ${
                  m.role === 'user' 
                    // Updated User Bubble to match the Green Theme (was black)
                    ? 'bg-[#3A4D39] text-white' 
                    : 'bg-[#F4F2ED] text-[#1A1A1A] border border-[#E5E2D9]'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {showExamples && !isLoading && (
              <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-[10px] font-mono uppercase text-[#787570] mb-2 ml-1">Suggested Inquiries</p>
                {exampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(q)}
                    className="w-full text-left p-3 rounded-lg border border-[#E5E2D9] bg-white hover:border-[#3A4D39] hover:bg-[#F4F2ED] transition-all duration-200 text-xs text-[#1A1A1A] leading-relaxed"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="p-3 bg-white border-t border-[#E5E2D9]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about specific projects..."
                className="flex-1 px-3 py-2 bg-[#F4F2ED] border-none rounded-md text-sm focus:ring-1 focus:ring-[#3A4D39] outline-none"
              />
              <button type="submit" disabled={isLoading} className="px-3 py-2 bg-[#E5E2D9] hover:bg-[#D1CEC7] rounded-md text-[#1A1A1A] transition-colors">
                →
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}