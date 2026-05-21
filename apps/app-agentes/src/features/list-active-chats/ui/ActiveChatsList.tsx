import { useMemo } from 'react';
import { useChatsStore } from '../../../entities/chat';
import { useSessionStore } from '../../../entities/session';
import { ActiveChatItem } from './ActiveChatItem';

interface ActiveChatsListProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

/**
 * Chats que el agente actual tomó (status IN_ATTENTION + assignedAgentId
 * coincide con el id de la sesión). El sort coloca primero los chats con
 * actividad más reciente — los que probablemente requieren atención inmediata.
 */
export function ActiveChatsList({
  selectedChatId,
  onSelectChat,
}: ActiveChatsListProps) {
  const chats = useChatsStore((state) => state.chats);
  const agentId = useSessionStore((state) => state.user?.id);

  const activeChats = useMemo(
    () =>
      Object.values(chats)
        .filter(
          (chat) =>
            chat.status === 'IN_ATTENTION' && chat.assignedAgentId === agentId,
        )
        .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt)),
    [chats, agentId],
  );

  if (activeChats.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        No tienes chats activos. Toma uno de la cola pendiente para empezar.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {activeChats.map((chat) => (
        <ActiveChatItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === selectedChatId}
          onSelect={() => onSelectChat(chat.id)}
        />
      ))}
    </ul>
  );
}
