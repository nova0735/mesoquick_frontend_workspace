import type { ChatResolution } from '../../../entities/chat';
import { useChatsStore } from '../../../entities/chat';

/**
 * Mock del endpoint PATCH /api/chats/:chatId/cerrar (§3.2). Cierra el chat con
 * su estado_final (resolución) y descripción (notas).
 *
 * TODO(backend): reemplazar por http.patch('/api/chats/:chatId/cerrar') usando
 * core-network. Al recibir confirmación, llamar a closeChat() del store.
 */
const NETWORK_DELAY_MS = 200;

interface CloseChatInput {
  chatId: string;
  resolution: ChatResolution;
  notes: string;
}

export async function mockCloseChat(input: CloseChatInput): Promise<void> {
  await new Promise<void>((resolve) =>
    window.setTimeout(resolve, NETWORK_DELAY_MS),
  );
  useChatsStore.getState().closeChat(input);
}
