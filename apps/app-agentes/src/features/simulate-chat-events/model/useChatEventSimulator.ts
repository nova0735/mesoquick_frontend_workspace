import { useEffect } from 'react';
import type { Chat, ChatMessage } from '../../../entities/chat';
import { useChatsStore } from '../../../entities/chat';
import { CHAT_EVENT_SCRIPT, type ScriptStep } from '../api/mockChatEvents';

/**
 * Hook que reproduce el script de eventos mock como si llegaran por WebSocket.
 * Cada paso del script se agenda con setTimeout y, al disparar, traduce el
 * template a un addIncomingChat / appendMessage del store con timestamps
 * frescos del momento del fire.
 *
 * Al desmontar el componente cancela todos los timeouts pendientes para
 * evitar fires fantasma después de navegar fuera de la página.
 *
 * TODO(backend): reemplazar este hook por uno que suscriba el SocketManager
 * de @mesoquick/core-network al canal /ws/agente/:agenteId y mapee los eventos
 * reales del servidor a las mismas mutaciones del store.
 */
export function useChatEventSimulator(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (const step of CHAT_EVENT_SCRIPT) {
      const id = setTimeout(() => fireStep(step), step.afterMs);
      timeouts.push(id);
    }

    return () => {
      for (const id of timeouts) clearTimeout(id);
    };
  }, [enabled]);
}

function fireStep(step: ScriptStep): void {
  const fireTime = Date.now();
  const fireIso = new Date(fireTime).toISOString();
  const store = useChatsStore.getState();

  if (step.kind === 'INCOMING_CHAT') {
    const tpl = step.template;
    const messages: ChatMessage[] = (tpl.initialMessages ?? []).map((m) => ({
      id: m.id,
      chatId: tpl.chatId,
      sender: m.sender,
      senderName: m.senderName,
      text: m.text,
      sentAt: new Date(
        fireTime - (m.secondsAgoFromFire ?? 0) * 1000,
      ).toISOString(),
    }));

    const chat: Chat = {
      id: tpl.chatId,
      requester: tpl.requester,
      status: 'PENDING',
      openedAt: fireIso,
      lastActivityAt: fireIso,
      escalatedFromBot: tpl.escalatedFromBot,
      subject: tpl.subject,
    };

    store.addIncomingChat({ chat, initialMessages: messages });
    return;
  }

  const tpl = step.template;
  const message: ChatMessage = {
    id: `msg-sim-${fireTime}-${tpl.chatId}`,
    chatId: tpl.chatId,
    sender: 'USER',
    senderName: tpl.senderName,
    text: tpl.text,
    sentAt: fireIso,
  };
  store.appendMessage({ chatId: tpl.chatId, message });
}
