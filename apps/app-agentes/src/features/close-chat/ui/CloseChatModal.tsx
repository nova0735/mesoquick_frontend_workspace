import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal';
import {
  CHAT_RESOLUTION_LABEL,
  type ChatResolution,
} from '../../../entities/chat';
import { mockCloseChat } from '../api/mockCloseChat';

interface CloseChatModalProps {
  isOpen: boolean;
  chatId: string;
  requesterName: string;
  onClose: () => void;
  onClosed?: () => void;
}

/**
 * Modal para registrar el cierre de un chat. Captura la resolución y una
 * descripción del caso, según §3.2 ("estado_final, descripción").
 *
 * Sigue la convención de los demás modales administrativos de app-agentes
 * (useState plano, sin react-hook-form, para mantener consistencia con
 * AdjustFareModal / BlockUserModal / etc.).
 */
const RESOLUTION_ORDER: readonly ChatResolution[] = [
  'SOLVED',
  'SOLVED_WITH_COMPENSATION',
  'SOLVED_WITH_REFUND',
  'UNSOLVED',
  'EXPIRED',
];

export function CloseChatModal({
  isOpen,
  chatId,
  requesterName,
  onClose,
  onClosed,
}: CloseChatModalProps) {
  const [resolution, setResolution] = useState<ChatResolution>('SOLVED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedNotes = notes.trim();
  const canSubmit = trimmedNotes.length >= 5 && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await mockCloseChat({ chatId, resolution, notes: trimmedNotes });
      setNotes('');
      setResolution('SOLVED');
      onClosed?.();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Cerrar chat"
      description={`Conversación con ${requesterName}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Resolución
          </span>
          <select
            value={resolution}
            onChange={(event) =>
              setResolution(event.target.value as ChatResolution)
            }
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {RESOLUTION_ORDER.map((value) => (
              <option key={value} value={value}>
                {CHAT_RESOLUTION_LABEL[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Descripción del caso
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            required
            placeholder="Resumen breve de lo que se resolvió y por qué."
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <p className="mt-1 text-[11px] text-gray-500">
            Mínimo 5 caracteres. Queda registrado en el historial del caso.
          </p>
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Cerrar chat
          </button>
        </div>
      </form>
    </Modal>
  );
}
