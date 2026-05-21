import { cn } from '@shared/lib/cn';
import type { ChatMessage as ChatMessageType } from '../model/support.types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Mensaje del sistema (info, conectando, etc.)
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className="px-3 py-1 bg-accent-bg text-accent text-xs rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  const isUser = message.role === 'user';
  const isBot = message.role === 'bot';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-line',
          isUser
            ? 'bg-accent text-white'
            : isBot
            ? 'bg-accent-bg text-text-heading'
            : 'bg-border/30 text-text-heading'
        )}
      >
        {!isUser && (
          <p className="text-xs font-semibold mb-1 opacity-70">
            {isBot ? 'Asistente' : 'Agente'}
          </p>
        )}
        <p>{message.content}</p>
      </div>
    </div>
  );
}