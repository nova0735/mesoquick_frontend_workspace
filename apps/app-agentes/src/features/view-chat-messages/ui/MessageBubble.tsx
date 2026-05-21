import { Bot } from 'lucide-react';
import type { ChatMessage } from '../../../entities/chat';
import { formatMessageTimestamp } from '../../../shared/lib/formatRelativeTime';

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Bubble individual de mensaje. Cambia color y alineación según el emisor:
 *   - USER:   izquierda, fondo blanco con borde.
 *   - AGENT:  derecha, fondo verde-base (color de identidad del agente).
 *   - BOT:    izquierda, fondo accent (amarillo) con badge bot.
 *   - SYSTEM: centrado, sin bubble, cursiva (avisos de transferencia, cierre, etc.).
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.sender === 'SYSTEM') {
    return (
      <div className="my-2 flex justify-center">
        <span className="text-[11px] text-gray-500 italic bg-white border border-gray-200 px-3 py-1 rounded-full">
          {message.text}
        </span>
      </div>
    );
  }

  const isAgent = message.sender === 'AGENT';
  const isBot = message.sender === 'BOT';

  const alignment = isAgent ? 'justify-end' : 'justify-start';
  const bubbleClasses = isAgent
    ? 'bg-green-base text-white'
    : isBot
      ? 'bg-accent/15 text-primary border border-accent/30'
      : 'bg-white text-primary border border-gray-200';

  return (
    <div className={`my-1 flex ${alignment}`}>
      <div className="max-w-[70%]">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1 px-1">
          {isBot && <Bot className="w-3 h-3" />}
          <span className="font-semibold">{message.senderName}</span>
          <span>·</span>
          <span>{formatMessageTimestamp(message.sentAt)}</span>
        </div>
        <div
          className={`px-3 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap break-words ${bubbleClasses}`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
