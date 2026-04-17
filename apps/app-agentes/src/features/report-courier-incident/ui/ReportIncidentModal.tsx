import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import type { SupportUser } from '../../../entities/support-user';
import {
  INCIDENT_TYPE_LABEL,
  useAdminStore,
  type IncidentType,
} from '../../../entities/admin-action';
import { useSessionStore } from '../../../entities/session';

interface ReportIncidentModalProps {
  isOpen: boolean;
  courier: SupportUser;
  onClose: () => void;
}

const INCIDENT_ORDER: readonly IncidentType[] = [
  'LATE_DELIVERY',
  'RUDE_BEHAVIOR',
  'DAMAGED_ORDER',
  'ABANDONED_ORDER',
  'OTHER',
];

/**
 * Modal para reportar un incidente sobre un repartidor.
 * Se dispara desde el widget de acciones admin en UserDetailPage, solo
 * cuando el usuario consultado es tipo COURIER.
 *
 * TODO(backend): POST /api/support/incidents al confirmar.
 */
export function ReportIncidentModal({
  isOpen,
  courier,
  onClose,
}: ReportIncidentModalProps) {
  const [incidentType, setIncidentType] = useState<IncidentType>('LATE_DELIVERY');
  const [description, setDescription] = useState('');
  const [relatedOrderId, setRelatedOrderId] = useState('');

  const reportedBy = useSessionStore((s) => s.user?.name ?? 'Agente');
  const reportIncident = useAdminStore((s) => s.reportIncident);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedDescription = description.trim();
    if (!trimmedDescription) return;

    reportIncident({
      courierId: courier.id,
      courierType: courier.type,
      incidentType,
      description: trimmedDescription,
      reportedBy,
      relatedOrderId: relatedOrderId.trim() || undefined,
    });
    setDescription('');
    setRelatedOrderId('');
    setIncidentType('LATE_DELIVERY');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Reportar incidente"
      description={`Registra un incidente contra ${courier.name}.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Tipo de incidente
          </span>
          <select
            value={incidentType}
            onChange={(event) =>
              setIncidentType(event.target.value as IncidentType)
            }
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {INCIDENT_ORDER.map((type) => (
              <option key={type} value={type}>
                {INCIDENT_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Descripción
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            required
            placeholder="Describe lo sucedido, hora, evidencias si aplica..."
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Orden relacionada (opcional)
          </span>
          <input
            type="text"
            value={relatedOrderId}
            onChange={(event) => setRelatedOrderId(event.target.value)}
            placeholder="ORD-10001"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono"
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
            disabled={!description.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Registrar incidente
          </button>
        </div>
      </form>
    </Modal>
  );
}
