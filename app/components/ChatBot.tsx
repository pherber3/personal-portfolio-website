'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant with detailed information about Patrick's work. I can answer technical questions about his projects, architectures, implementations, and specific technologies. Try asking about a specific project or technical detail!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "How did Patrick achieve 0.97 AUC on the glaucoma prediction model?",
    "What was the architecture of the real-time voice AI platform?",
    "How did the Plackett-Luce optimization work?",
    "What technologies were used in the RAG infrastructure?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleQuestionClick = (question: string) => {
    setShowExamples(false);
    handleSubmit(undefined, question);
  };

  const handleSubmit = async (e?: React.FormEvent, exampleQuestion?: string) => {
    e?.preventDefault();
    const userMessage = exampleQuestion || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setShowExamples(false);

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-24 md:bottom-6 right-6 z-50">
        {!isOpen && messages.length === 1 && (
          <div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-bounce"
            style={{ background: '#A89080', color: '#FAF9F6' }}
          >
            ?
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center ${!isOpen ? 'animate-shimmer' : ''}`}
          style={{ background: isOpen ? '#8B9A7E' : undefined, color: '#FAF9F6' }}
          aria-label="Toggle chat"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[calc(100vh-8rem)] md:h-[600px] max-h-[600px] rounded-3xl shadow-2xl flex flex-col z-50" style={{ background: '#FAF9F6', border: '1px solid #E8E6E1' }}>
          {/* Header */}
          <div className="px-6 py-4 rounded-t-3xl relative" style={{ background: '#8B9A7E', color: '#FAF9F6' }}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label="Close chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <p className="text-xs mt-1" style={{ color: '#F5F1E8' }}>
              Ask detailed questions about projects, tech stacks, or implementations
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
            {showExamples && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs font-medium" style={{ color: '#A89080' }}>
                  Example questions:
                </p>
                {exampleQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left text-sm p-3 rounded-xl transition-all duration-200 hover:shadow-md"
                    style={{
                      background: '#F5F1E8',
                      border: '1px solid #E8E6E1',
                      color: '#2B2B2B'
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4" style={{ borderTop: '1px solid #E8E6E1' }}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-full focus:outline-none text-sm"
                style={{
                  background: '#F5F1E8',
                  border: '1px solid #E8E6E1',
                  color: '#2B2B2B'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                style={{
                  background: '#8B9A7E',
                  color: '#FAF9F6'
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
