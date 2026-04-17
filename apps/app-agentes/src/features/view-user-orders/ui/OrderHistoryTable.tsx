import { PackageSearch, Pencil } from 'lucide-react';
import {
  ORDER_STATUS_LABEL,
  type OrderHistoryItem,
  type OrderStatus,
} from '../../../entities/order-history';

interface OrderHistoryTableProps {
  orders: readonly OrderHistoryItem[];
  /**
   * Callback opcional para disparar el flujo de "Ajustar tarifa" sobre una
   * orden. Si está presente, se renderiza una columna con un botón por fila.
   * La razón de ser opcional es evitar acoplar Fase 4 con Fase 5: donde no
   * aplica (ej. alguna vista de reporte), la tabla puede usarse sin acción.
   */
  onAdjustFare?: (order: OrderHistoryItem) => void;
}

/**
 * Tabla responsive con el historial de órdenes del usuario consultado.
 *
 * En mobile usa un layout de tarjetas (md:hidden) porque una tabla horizontal
 * con 6 columnas no se ve bien en pantallas estrechas.
 */
export function OrderHistoryTable({ orders, onAdjustFare }: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 bg-white border border-gray-200 rounded-lg">
        <PackageSearch className="w-10 h-10 mb-3 text-gray-300" />
        <p className="text-sm font-semibold">Sin órdenes registradas</p>
        <p className="text-xs mt-1">
          Este usuario aún no tiene órdenes en el historial.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-2.5 text-left font-bold">Orden</th>
              <th className="px-4 py-2.5 text-left font-bold">Fecha</th>
              <th className="px-4 py-2.5 text-left font-bold">Negocio</th>
              <th className="px-4 py-2.5 text-left font-bold">Repartidor</th>
              <th className="px-4 py-2.5 text-right font-bold">Total</th>
              <th className="px-4 py-2.5 text-left font-bold">Estado</th>
              {onAdjustFare && (
                <th className="px-4 py-2.5 text-right font-bold">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-2.5 font-mono text-xs text-primary">
                  {order.id}
                </td>
                <td className="px-4 py-2.5 text-gray-700">
                  {formatDate(order.placedAt)}
                </td>
                <td className="px-4 py-2.5 text-gray-700 truncate max-w-[180px]">
                  {order.businessName}
                </td>
                <td className="px-4 py-2.5 text-gray-700 truncate max-w-[140px]">
                  {order.courierName ?? '—'}
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                  {formatCurrency(order.total, order.currency)}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={order.status} />
                </td>
                {onAdjustFare && (
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => onAdjustFare(order)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary bg-accent/15 rounded hover:bg-accent/25 transition"
                    >
                      <Pencil className="w-3 h-3" />
                      Ajustar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden divide-y divide-gray-100">
        {orders.map((order) => (
          <li key={order.id} className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">
                {order.id}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(order.placedAt)}
            </div>
            <div className="text-sm text-gray-800">{order.businessName}</div>
            <div className="text-xs text-gray-600">
              {order.courierName
                ? `Repartidor: ${order.courierName}`
                : 'Sin repartidor asignado'}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.total, order.currency)}
              </div>
              {onAdjustFare && (
                <button
                  type="button"
                  onClick={() => onAdjustFare(order)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary bg-accent/15 rounded hover:bg-accent/25 transition"
                >
                  <Pencil className="w-3 h-3" />
                  Ajustar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  DELIVERED: 'bg-green-base/15 text-green-base',
  CANCELLED: 'bg-red-100 text-red-700',
  IN_PROGRESS: 'bg-accent/20 text-primary',
  REFUNDED: 'bg-gray-200 text-gray-700',
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLOR[status]}`}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-HN', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number, currency: 'HNL'): string {
  return `${currency} ${amount.toFixed(2)}`;
}
