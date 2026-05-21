import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import type { SupportUser } from '../../../entities/support-user';
import { useAdminStore } from '../../../entities/admin-action';
import { useSessionStore } from '../../../entities/session';

interface BlockUserModalProps {
  isOpen: boolean;
  user: SupportUser;
  onClose: () => void;
}

/**
 * Modal para bloquear o desbloquear un usuario.
 * El tipo de acción (bloqueo vs desbloqueo) se deduce del status actual.
 *
 * TODO(backend): al integrar el endpoint real, el store solo debe aplicar el
 * override si el servidor confirma el cambio.
 */
export function BlockUserModal({ isOpen, user, onClose }: BlockUserModalProps) {
  const [reason, setReason] = useState('');
  const performedBy = useSessionStore((s) => s.user?.name ?? 'Agente');
  const blockUser = useAdminStore((s) => s.blockUser);

  const isCurrentlyBlocked = user.status === 'BLOCKED';
  const makeBlocked = !isCurrentlyBlocked;

  const title = makeBlocked ? 'Bloquear usuario' : 'Desbloquear usuario';
  const description = makeBlocked
    ? `Al bloquear, ${user.name} no podrá usar la plataforma hasta que un agente lo restaure.`
    : `Se restaurará el acceso de ${user.name} a la plataforma.`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) return;

    blockUser({
      userId: user.id,
      userType: user.type,
      reason: trimmed,
      performedBy,
      makeBlocked,
    });
    setReason('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Motivo
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            required
            placeholder={
              makeBlocked
                ? 'Describe la razón del bloqueo (uso indebido, fraude, etc.)'
                : 'Describe la razón del desbloqueo'
            }
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
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
            disabled={!reason.trim()}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              makeBlocked
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-base hover:bg-green-bright'
            }`}
          >
            {makeBlocked ? 'Bloquear' : 'Desbloquear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
