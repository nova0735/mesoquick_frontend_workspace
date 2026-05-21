import { useState } from 'react';
import { Bot, CheckCircle, Lock } from 'lucide-react';
import {
  CHAT_RESOLUTION_LABEL,
  CHAT_STATUS_LABEL,
  type Chat,
  type ChatStatus,
} from '../../../entities/chat';
import { TakeChatButton } from '../../../features/take-chat';
import { MessageList } from '../../../features/view-chat-messages';
import { MessageComposer } from '../../../features/send-chat-message';
import { CloseChatModal } from '../../../features/close-chat';

interface ChatConversationProps {
  chat: Chat;
}

/**
 * Panel central del backoffice de chats. Orquesta:
 *   - Header: solicitante, asunto, badges (estado + escalado_desde_bot) y
 *     acciones del chat (Tomar si PENDING, Cerrar si IN_ATTENTION).
 *   - Banner de resolución si CLOSED.
 *   - MessageList: historial de mensajes.
 *   - MessageComposer: input del agente (deshabilitado si no está IN_ATTENTION).
 *
 * La maquetación es flex-column con MessageList tomando el espacio sobrante
 * (`flex-1`), así el composer queda siempre fijo abajo.
 */
export function ChatConversation({ chat }: ChatConversationProps) {
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const isPending = chat.status === 'PENDING';
  const isActive = chat.status === 'IN_ATTENTION';
  const isClosed = chat.status === 'CLOSED';

  const composerDisabledHint = isPending
    ? 'Toma este chat para poder responder al usuario.'
    : 'Este chat fue cerrado y no acepta nuevos mensajes.';

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden h-full">
      <header className="px-4 py-3 border-b border-gray-200 bg-base flex items-center justify-between gap-3 flex-shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h2 className="text-sm font-bold text-primary truncate">
              {chat.requester.name}
            </h2>
            {chat.escalatedFromBot && (
              <span
                title="Caso escalado desde el chatbot"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/15 px-1.5 py-0.5 rounded"
              >
                <Bot className="w-3 h-3" />
                Bot
              </span>
            )}
            <StatusBadge status={chat.status} />
          </div>
          <p className="text-xs text-gray-600 truncate">{chat.subject}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isPending && <TakeChatButton chatId={chat.id} />}
          {isActive && (
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary bg-white border border-primary rounded-lg hover:bg-base transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Cerrar chat
            </button>
          )}
        </div>
      </header>

      {isClosed && chat.resolution && (
        <div className="px-4 py-2 bg-green-base/10 text-green-base text-xs font-semibold border-b border-green-base/20 flex items-center gap-2 flex-shrink-0">
          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Chat cerrado · {CHAT_RESOLUTION_LABEL[chat.resolution]}</span>
          {chat.closeNotes && (
            <span className="font-normal text-gray-700 truncate">
              · {chat.closeNotes}
            </span>
          )}
        </div>
      )}

      <MessageList chatId={chat.id} />

      <MessageComposer
        chatId={chat.id}
        disabled={!isActive}
        disabledHint={composerDisabledHint}
      />

      {isActive && (
        <CloseChatModal
          isOpen={isCloseModalOpen}
          chatId={chat.id}
          requesterName={chat.requester.name}
          onClose={() => setIsCloseModalOpen(false)}
        />
      )}
    </div>
  );
}

const STATUS_BADGE_CLASS: Record<ChatStatus, string> = {
  PENDING: 'bg-accent/15 text-accent',
  IN_ATTENTION: 'bg-green-base/15 text-green-base',
  CLOSED: 'bg-gray-200 text-gray-600',
};

function StatusBadge({ status }: { status: ChatStatus }) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE_CLASS[status]}`}
    >
      {CHAT_STATUS_LABEL[status]}
    </span>
  );
}
