import type { ComponentType } from 'react';
import { Building2, Truck, User } from 'lucide-react';
import type { Chat } from '../../../entities/chat';
import { useChatsStore } from '../../../entities/chat';
import type { SupportUserType } from '../../../entities/support-user';
import { formatRelativeTime } from '../../../shared/lib/formatRelativeTime';

const TYPE_ICON: Record<
  SupportUserType,
  ComponentType<{ className?: string }>
> = {
  CLIENT: User,
  COURIER: Truck,
  BUSINESS: Building2,
};

interface ActiveChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Fila de chat activo. Muestra una vista previa del último mensaje para que
 * el agente vea de un vistazo el estado de cada conversación.
 *
 * El acceso al último mensaje usa selector atómico sobre el sub-array por
 * chatId; las mutaciones de appendMessage crean nuevo array, así que la
 * referencia se invalida correctamente y el componente se re-renderiza.
 */
export function ActiveChatItem({
  chat,
  isSelected,
  onSelect,
}: ActiveChatItemProps) {
  const messages = useChatsStore(
    (state) => state.messagesByChatId[chat.id],
  );
  const lastMessage =
    messages && messages.length > 0 ? messages[messages.length - 1] : undefined;
  const TypeIcon = TYPE_ICON[chat.requester.userType];

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors border-l-4 ${
          isSelected
            ? 'bg-green-base/10 border-green-base'
            : 'border-transparent hover:bg-base'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-green-base/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-4 h-4 text-green-base" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-sm font-semibold text-primary truncate">
              {chat.requester.name}
            </span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">
              {formatRelativeTime(chat.lastActivityAt)}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{chat.subject}</p>
          {lastMessage && (
            <p className="text-xs text-gray-700 mt-1 truncate">
              {lastMessage.sender === 'AGENT' && (
                <span className="font-semibold">Tú: </span>
              )}
              {lastMessage.text}
            </p>
          )}
        </div>
      </button>
    </li>
  );
}
