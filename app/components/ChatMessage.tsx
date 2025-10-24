import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3"
        style={
          isUser
            ? { background: '#8B9A7E', color: '#FAF9F6' }
            : { background: '#F5F1E8', color: '#2B2B2B', border: '1px solid #E8E6E1' }
        }
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none" style={{ color: '#2B2B2B' }}>
            <style jsx global>{`
              .prose a {
                color: #8B9A7E;
                text-decoration: underline;
              }
              .prose strong {
                color: #2B2B2B;
                font-weight: 600;
              }
              .prose p, .prose ul, .prose ol, .prose li {
                color: #2B2B2B;
              }
            `}</style>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
