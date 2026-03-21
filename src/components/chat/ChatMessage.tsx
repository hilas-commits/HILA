import type { ChatMessage as ChatMessageType } from '../../types';
import { Bot, User } from 'lucide-react';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-surface-200' : 'bg-primary-100'
        }`}
      >
        {isUser ? (
          <User size={16} className="text-surface-600" />
        ) : (
          <Bot size={16} className="text-primary-600" />
        )}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-surface-100 text-surface-800 rounded-bl-md'
        }`}
      >
        {message.content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {line.includes('**') ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: line.replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="font-semibold">$1</strong>'
                  ),
                }}
              />
            ) : line.startsWith('✅') || line.startsWith('•') ? (
              <span>{line}</span>
            ) : (
              line
            )}
          </p>
        ))}
        {message.skillId && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full capitalize">
            {message.skillId.replace(/-/g, ' ')}
          </span>
        )}
      </div>
    </div>
  );
}
