import { useMemo } from 'react';
import { useChatsStore } from '../../../entities/chat';
import { PendingChatItem } from './PendingChatItem';

interface PendingChatsListProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

/**
 * Lista vertical de chats pendientes (status === 'PENDING'). El sort coloca
 * primero los chats más antiguos para que el agente atienda en orden de cola.
 *
 * Patrón Zustand v5: se lee la mapa cruda con un selector atómico y se deriva
 * el array con useMemo. NUNCA filtrar/mapear dentro del selector porque
 * provoca infinite loop.
 */
export function PendingChatsList({
  selectedChatId,
  onSelectChat,
}: PendingChatsListProps) {
  const chats = useChatsStore((state) => state.chats);

  const pendingChats = useMemo(
    () =>
      Object.values(chats)
        .filter((chat) => chat.status === 'PENDING')
        .sort((a, b) => a.openedAt.localeCompare(b.openedAt)),
    [chats],
  );

  if (pendingChats.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        No hay chats pendientes en este momento.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {pendingChats.map((chat) => (
        <PendingChatItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === selectedChatId}
          onSelect={() => onSelectChat(chat.id)}
        />
      ))}
    </ul>
  );
}
