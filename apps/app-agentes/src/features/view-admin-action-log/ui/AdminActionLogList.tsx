import { useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Wallet,
  Gift,
  History,
} from 'lucide-react';
import {
  ADMIN_ACTION_LABEL,
  useAdminStore,
  type AdminActionLogEntry,
  type AdminActionType,
} from '../../../entities/admin-action';

interface AdminActionLogListProps {
  userId: string;
}

const ACTION_ICON: Record<AdminActionType, React.ComponentType<{ className?: string }>> = {
  USER_BLOCKED: ShieldAlert,
  USER_UNBLOCKED: ShieldCheck,
  COURIER_INCIDENT_REPORTED: AlertTriangle,
  FARE_ADJUSTED: Wallet,
  COMPENSATION_GRANTED: Gift,
};

const ACTION_COLOR: Record<AdminActionType, string> = {
  USER_BLOCKED: 'text-red-600 bg-red-100',
  USER_UNBLOCKED: 'text-green-base bg-green-base/15',
  COURIER_INCIDENT_REPORTED: 'text-amber-600 bg-amber-100',
  FARE_ADJUSTED: 'text-primary bg-primary/10',
  COMPENSATION_GRANTED: 'text-primary bg-accent/20',
};

/**
 * Lista el log de acciones administrativas ejecutadas contra un usuario.
 * Se renderiza como sección al final de UserDetailPage.
 *
 * Se suscribe al store completo filtrando por userId; las acciones nuevas
 * aparecen al tope de la lista.
 */
export function AdminActionLogList({ userId }: AdminActionLogListProps) {
  // Suscribirse al array completo (referencia estable hasta que cambie)
  // y filtrar con useMemo: si filtraramos dentro del selector, devolvería
  // un array nuevo en cada render y dispararía "Maximum update depth".
  const log = useAdminStore((s) => s.log);
  const entries = useMemo(
    () => log.filter((entry) => entry.userId === userId),
    [log, userId],
  );

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
        <History className="w-8 h-8 mb-2 text-gray-300" />
        <p className="text-sm">
          No hay acciones administrativas registradas todavía.
        </p>
      </div>
    );
  }

  return (
    <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
      {entries.map((entry) => (
        <LogRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

function LogRow({ entry }: { entry: AdminActionLogEntry }) {
  const Icon = ACTION_ICON[entry.type];
  const colorClass = ACTION_COLOR[entry.type];

  return (
    <li className="flex items-start gap-3 p-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-primary">
            {ADMIN_ACTION_LABEL[entry.type]}
          </span>
          <span className="text-[10px] text-gray-500">
            {formatDateTime(entry.performedAt)}
          </span>
        </div>
        <p className="text-sm text-gray-800 mt-0.5">{entry.summary}</p>
        <p className="text-xs text-gray-600 mt-1 italic">
          “{entry.reason}”
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          Por {entry.performedBy}
        </p>
      </div>
    </li>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-HN', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
