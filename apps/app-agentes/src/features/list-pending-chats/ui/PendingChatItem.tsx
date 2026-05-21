import type { ComponentType } from 'react';
import { Bot, Building2, Truck, User } from 'lucide-react';
import type { Chat } from '../../../entities/chat';
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

interface PendingChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Fila individual de la cola pendiente. Muestra solicitante, asunto, tiempo
 * en cola y un badge de "Bot" cuando el caso vino escalado del chatbot (§3.2,
 * `escalado_desde_bot: true`).
 */
export function PendingChatItem({
  chat,
  isSelected,
  onSelect,
}: PendingChatItemProps) {
  const TypeIcon = TYPE_ICON[chat.requester.userType];
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors border-l-4 ${
          isSelected
            ? 'bg-accent/10 border-accent'
            : 'border-transparent hover:bg-base'
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-primary truncate">
              {chat.requester.name}
            </span>
            {chat.escalatedFromBot && (
              <span
                title="Caso escalado desde el chatbot"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/15 px-1.5 py-0.5 rounded"
              >
                <Bot className="w-3 h-3" />
                Bot
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{chat.subject}</p>
          <p className="text-[11px] text-gray-400 mt-1">
            En cola {formatRelativeTime(chat.openedAt)}
          </p>
        </div>
      </button>
    </li>
  );
}
