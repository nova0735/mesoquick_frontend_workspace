import { useChatsStore } from '../../../entities/chat';

/**
 * Mock del endpoint PATCH /api/chats/:chatId/tomar (§3.2). Marca el chat como
 * IN_ATTENTION y lo asigna al agente en sesión.
 *
 * TODO(backend): reemplazar por http.patch('/api/chats/:chatId/tomar') usando
 * core-network. Al recibir confirmación, llamar a takeChat() del store con el
 * payload del servidor (que probablemente incluya el agente asignado).
 */
const NETWORK_DELAY_MS = 200;

export async function mockTakeChat(
  chatId: string,
  agentId: string,
): Promise<void> {
  await new Promise<void>((resolve) =>
    window.setTimeout(resolve, NETWORK_DELAY_MS),
  );
  useChatsStore.getState().takeChat({ chatId, agentId });
}
