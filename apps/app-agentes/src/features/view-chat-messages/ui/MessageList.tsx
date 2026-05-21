import { useEffect, useRef } from 'react';
import { useChatsStore } from '../../../entities/chat';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  chatId: string;
}

/**
 * Lista cronológica de mensajes de un chat. Hace auto-scroll al fondo cuando
 * cambia la referencia del array de mensajes (mensaje nuevo) o cuando cambia
 * el chat seleccionado.
 *
 * Selector atómico sobre el sub-array del chatId — appendMessage crea siempre
 * un nuevo array, por lo que la referencia se invalida limpiamente.
 */
export function MessageList({ chatId }: MessageListProps) {
  const messages = useChatsStore((state) => state.messagesByChatId[chatId]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-500 bg-base">
        Aún no hay mensajes en este chat.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 bg-base">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
