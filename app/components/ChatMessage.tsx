import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
            ? { background: '#3A4D39', color: '#FFFFFF' }
            : { background: '#F5F1E8', color: '#2B2B2B', border: '1px solid #E8E6E1' }
        }
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:text-[#2B2B2B] prose-strong:text-[#2B2B2B] prose-strong:font-semibold prose-a:text-[#8B9A7E] prose-a:underline prose-li:text-[#2B2B2B] prose-ul:text-[#2B2B2B] prose-ol:text-[#2B2B2B]" style={{ color: '#2B2B2B' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
