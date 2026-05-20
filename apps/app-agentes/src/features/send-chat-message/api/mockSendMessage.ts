import type { ChatMessage } from '../../../entities/chat';
import { useChatsStore } from '../../../entities/chat';

/**
 * Mock del endpoint POST /api/chats/:chatId/mensaje (§3.2). Crea un mensaje
 * con sender 'AGENT' y lo agrega al hilo del chat.
 *
 * TODO(backend): reemplazar por http.post('/api/chats/:chatId/mensaje') usando
 * core-network. El servidor devolverá el ChatMessage con el id real y el
 * timestamp canónico; al recibirlo, llamar a appendMessage() del store.
 */
const NETWORK_DELAY_MS = 150;

let agentMessageCounter = 0;
function nextMessageId(chatId: string): string {
  agentMessageCounter += 1;
  return `msg-${chatId}-agent-${Date.now()}-${agentMessageCounter}`;
}

interface SendAgentMessageInput {
  chatId: string;
  agentName: string;
  text: string;
}

export async function mockSendAgentMessage(
  input: SendAgentMessageInput,
): Promise<ChatMessage> {
  await new Promise<void>((resolve) =>
    window.setTimeout(resolve, NETWORK_DELAY_MS),
  );

  const message: ChatMessage = {
    id: nextMessageId(input.chatId),
    chatId: input.chatId,
    sender: 'AGENT',
    senderName: input.agentName,
    text: input.text,
    sentAt: new Date().toISOString(),
  };

  useChatsStore.getState().appendMessage({
    chatId: input.chatId,
    message,
  });

  return message;
}
