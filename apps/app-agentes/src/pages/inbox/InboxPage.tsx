import { useEffect } from 'react';
import { Inbox } from 'lucide-react';
import { useChatsStore } from '../../entities/chat';
import { useAdminStore } from '../../entities/admin-action';
import { findUserByTypeAndId } from '../../features/view-user-profile';
import { MOCK_PENDING_CHATS } from '../../features/list-pending-chats';
import { MOCK_ACTIVE_CHATS } from '../../features/list-active-chats';
import { MOCK_CHAT_MESSAGES } from '../../features/view-chat-messages';
import { useChatEventSimulator } from '../../features/simulate-chat-events';
import { InboxTabs } from '../../widgets/chat-inbox';
import { ChatConversation } from '../../widgets/chat-conversation';
import { ChatUserContextPanel } from '../../widgets/chat-user-context';
import { UserAdminActionsBar } from '../../widgets/user-admin-actions';

/**
 * Bandeja de chats — implementación completa de §3.2.
 *
 * Layout backoffice de 3 columnas dentro del MainLayout:
 *   - Izquierda (280px): InboxTabs con cola pendiente / mis chats.
 *   - Centro (fluido):   ChatConversation con header + mensajes + composer.
 *   - Derecha (320px):   contexto del usuario + acciones administrativas.
 *
 * Inicialización:
 *   1. Hidrata el store con los mocks de §3.2 (una sola vez al montar).
 *   2. Arranca useChatEventSimulator para simular el WS /ws/agente/:agenteId.
 *
 * El alto de la grilla se calcula restando la altura de TopBar (3.5rem) y el
 * padding vertical de MainLayout > main (p-6 = 3rem total) al viewport, de
 * forma que el conversation panel siempre quede contenido sin scroll vertical
 * del navegador — su propio scroll vive dentro de MessageList.
 *
 * TODO(backend): la hidratación y el simulador desaparecen cuando se conecte
 * el SocketManager real. La hidratación pasa a ser una llamada inicial a los
 * endpoints REST de §3.2 y el simulador se reemplaza por la suscripción WS.
 */
export function InboxPage() {
  const selectedChatId = useChatsStore((state) => state.selectedChatId);
  const selectChat = useChatsStore((state) => state.selectChat);
  const isHydrated = useChatsStore((state) => state.isInboxHydrated);
  const selectedChat = useChatsStore((state) =>
    state.selectedChatId ? state.chats[state.selectedChatId] : undefined,
  );

  // Forzar re-render cuando cambia el estado override (bloqueo) del usuario
  // actualmente en panel — sin esto, ChatUserContextPanel no actualizaría
  // hasta el siguiente cambio del store de chats.
  useAdminStore((s) => s.userStatusOverrides);

  useEffect(() => {
    const state = useChatsStore.getState();
    if (state.isInboxHydrated) return;
    state.hydrateInbox({
      chats: [...MOCK_PENDING_CHATS, ...MOCK_ACTIVE_CHATS],
      messagesByChatId: MOCK_CHAT_MESSAGES,
    });
  }, []);

  useChatEventSimulator(true);

  const selectedUser = selectedChat
    ? findUserByTypeAndId(
        selectedChat.requester.userType,
        selectedChat.requester.userId,
      )
    : null;

  return (
    <div className="grid grid-cols-[280px_minmax(0,1fr)_320px] gap-4 h-[calc(100vh-6.5rem)] min-h-[480px]">
      <aside className="min-h-0">
        <InboxTabs
          selectedChatId={selectedChatId}
          onSelectChat={(chatId) => selectChat(chatId)}
        />
      </aside>

      <section className="min-h-0">
        {selectedChat ? (
          <ChatConversation chat={selectedChat} />
        ) : (
          <EmptyConversation isHydrated={isHydrated} />
        )}
      </section>

      <aside className="overflow-y-auto flex flex-col gap-3 min-h-0">
        {selectedUser ? (
          <>
            <ChatUserContextPanel user={selectedUser} />
            <UserAdminActionsBar user={selectedUser} />
          </>
        ) : (
          <EmptyUserPanel />
        )}
      </aside>
    </div>
  );
}

function EmptyConversation({ isHydrated }: { isHydrated: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center text-center p-8">
      <div className="max-w-sm text-gray-500">
        <Inbox className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">
          {isHydrated
            ? 'Selecciona un chat de la lista para empezar a atender.'
            : 'Cargando bandeja...'}
        </p>
      </div>
    </div>
  );
}

function EmptyUserPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center text-xs text-gray-500">
      Aquí verás los datos del usuario cuando selecciones un chat.
    </div>
  );
}
