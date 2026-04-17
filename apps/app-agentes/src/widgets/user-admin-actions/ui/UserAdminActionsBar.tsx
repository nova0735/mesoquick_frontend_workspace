import { useState } from 'react';
import { Ban, Gift, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { SupportUser } from '../../../entities/support-user';
import { BlockUserModal } from '../../../features/block-user';
import { ReportIncidentModal } from '../../../features/report-courier-incident';
import { GrantCompensationModal } from '../../../features/grant-compensation';

interface UserAdminActionsBarProps {
  user: SupportUser;
}

type ActiveModal = null | 'block' | 'incident' | 'compensation';

/**
 * Barra de botones con las acciones administrativas disponibles sobre el
 * usuario consultado. Qué botones se muestran depende del tipo de usuario:
 *
 * - Clientes y empresas: Bloquear/Desbloquear + Compensación.
 * - Repartidores: Bloquear/Desbloquear + Reportar incidente. (La compensación
 *   no aplica a couriers, para ellos se usa incidentes o ajustes de saldo.)
 *
 * El ajuste de tarifa NO está aquí porque se dispara por fila del historial
 * de órdenes desde OrderHistoryTable.
 */
export function UserAdminActionsBar({ user }: UserAdminActionsBarProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const isBlocked = user.status === 'BLOCKED';
  const isCourier = user.type === 'COURIER';

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Acciones administrativas
        </h2>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            onClick={() => setActiveModal('block')}
            icon={isBlocked ? ShieldCheck : Ban}
            label={isBlocked ? 'Desbloquear' : 'Bloquear'}
            variant={isBlocked ? 'success' : 'danger'}
          />

          {isCourier && (
            <ActionButton
              onClick={() => setActiveModal('incident')}
              icon={AlertTriangle}
              label="Reportar incidente"
              variant="warning"
            />
          )}

          {!isCourier && (
            <ActionButton
              onClick={() => setActiveModal('compensation')}
              icon={Gift}
              label="Otorgar compensación"
              variant="primary"
            />
          )}
        </div>
      </div>

      <BlockUserModal
        isOpen={activeModal === 'block'}
        user={user}
        onClose={() => setActiveModal(null)}
      />

      {isCourier && (
        <ReportIncidentModal
          isOpen={activeModal === 'incident'}
          courier={user}
          onClose={() => setActiveModal(null)}
        />
      )}

      {!isCourier && (
        <GrantCompensationModal
          isOpen={activeModal === 'compensation'}
          user={user}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant: 'primary' | 'danger' | 'success' | 'warning';
}

function ActionButton({ onClick, icon: Icon, label, variant }: ActionButtonProps) {
  const variantClass = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-base text-white hover:bg-green-bright',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${variantClass}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
