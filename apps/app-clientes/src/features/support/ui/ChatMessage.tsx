import { cn } from '@shared/lib/cn';
import type { ChatMessage as ChatMessageType } from '../model/support.types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Mensaje del sistema (info, conectando, escalación, etc.)
  if (message.role === 'system') {
    // Mensajes cortos (status de conexión) → pill discreta.
    // Mensajes largos (confirmación de escalación) → tarjeta visible.
    const isShort = message.content.length < 50 && !message.content.includes('\n');
    if (isShort) {
      return (
        <div className="flex justify-center my-2">
          <div className="px-3 py-1 bg-accent-bg text-accent text-xs rounded-full">
            {message.content}
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-center my-3">
        <div className="max-w-[90%] px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-sm rounded-lg whitespace-pre-line">
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