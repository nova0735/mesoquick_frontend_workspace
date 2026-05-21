import { useState } from 'react';
import { Loader2, UserCheck } from 'lucide-react';
import { useSessionStore } from '../../../entities/session';
import { mockTakeChat } from '../api/mockTakeChat';

interface TakeChatButtonProps {
  chatId: string;
  onTaken?: () => void;
}

/**
 * Botón "Tomar este chat". Llama al mock de PATCH /api/chats/:chatId/tomar y
 * muestra estado de carga mientras se completa la mutación local.
 *
 * Se renderiza desde el panel de conversación cuando un chat PENDING está
 * seleccionado; al tomarse, el `onTaken` opcional permite a la página
 * refrescar selección o cualquier UI dependiente.
 */
export function TakeChatButton({ chatId, onTaken }: TakeChatButtonProps) {
  const agentId = useSessionStore((state) => state.user?.id);
  const [isTaking, setIsTaking] = useState(false);

  const handleClick = async () => {
    if (!agentId || isTaking) return;
    setIsTaking(true);
    try {
      await mockTakeChat(chatId, agentId);
      onTaken?.();
    } finally {
      setIsTaking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!agentId || isTaking}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-base text-white text-sm font-semibold rounded-lg hover:bg-green-bright disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {isTaking ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserCheck className="w-4 h-4" />
      )}
      {isTaking ? 'Tomando...' : 'Tomar este chat'}
    </button>
  );
}
