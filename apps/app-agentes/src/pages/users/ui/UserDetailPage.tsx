import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserX } from 'lucide-react';
import { URL_SLUG_TO_TYPE } from '../../../entities/support-user';
import { useAdminStore } from '../../../entities/admin-action';
import {
  findUserByTypeAndId,
  UserProfileCard,
} from '../../../features/view-user-profile';
import {
  getOrdersForUser,
  OrderHistoryTable,
} from '../../../features/view-user-orders';
import {
  getCourierBalance,
  CourierBalanceCard,
} from '../../../features/view-courier-balance';
import { AdjustFareModal } from '../../../features/adjust-fare';
import { AdminActionLogList } from '../../../features/view-admin-action-log';
import { UserDetailHeader } from '../../../widgets/user-detail';
import { UserAdminActionsBar } from '../../../widgets/user-admin-actions';
import type { OrderHistoryItem } from '../../../entities/order-history';

/**
 * Detalle del usuario consultado por el agente.
 * Ruta: /users/:tipo/:id  (ej: /users/cliente/client-101)
 *
 * Composición vertical:
 *   1. Header (volver + nombre + tipo + estado)
 *   2. UserAdminActionsBar (Fase 5 — bloquear, incidente, compensación)
 *   3. UserProfileCard (datos de contacto, estado, fecha de registro)
 *   4. CourierBalanceCard → SOLO si tipo === 'COURIER'
 *   5. OrderHistoryTable con acción "Ajustar tarifa" por fila
 *   6. AdminActionLogList (log de todas las acciones admin sobre el usuario)
 *
 * La página se suscribe al admin store vía selectores de conteo para
 * re-renderizarse cada vez que una acción muta algo: así findUserByTypeAndId
 * y getOrdersForUser —que leen overrides con getState()— reflejan los cambios.
 */
export function UserDetailPage() {
  const { tipo, id } = useParams<{ tipo: string; id: string }>();

  // Suscripciones para forzar re-render cuando cambian overrides/log.
  // Leemos los overrides (no solo el tamaño) para re-renderizar ante
  // cualquier mutación de status/total, incluso dentro del mismo usuario.
  useAdminStore((s) => s.userStatusOverrides);
  useAdminStore((s) => s.orderTotalOverrides);
  useAdminStore((s) => s.log.length);

  const [fareOrder, setFareOrder] = useState<OrderHistoryItem | null>(null);

  const userType = tipo ? URL_SLUG_TO_TYPE[tipo] : undefined;
  const user = userType && id ? findUserByTypeAndId(userType, id) : null;

  if (!user || !userType) {
    return <NotFoundState />;
  }

  const orders = getOrdersForUser(userType, user.id);
  const balance =
    userType === 'COURIER' ? getCourierBalance(user.id) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <UserDetailHeader user={user} />
      <UserAdminActionsBar user={user} />
      <UserProfileCard user={user} />
      {userType === 'COURIER' && <CourierBalanceCard balance={balance} />}

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
          Historial de órdenes
        </h2>
        <OrderHistoryTable
          orders={orders}
          onAdjustFare={(order) => setFareOrder(order)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
          Registro de acciones administrativas
        </h2>
        <AdminActionLogList userId={user.id} />
      </section>

      {fareOrder && (
        <AdjustFareModal
          isOpen
          order={fareOrder}
          userType={userType}
          userId={user.id}
          onClose={() => setFareOrder(null)}
        />
      )}
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-center text-gray-500">
      <UserX className="w-12 h-12 mb-3 text-gray-300" />
      <h1 className="text-lg font-bold text-primary">Usuario no encontrado</h1>
      <p className="text-sm mt-1">
        El usuario que intentas consultar no existe o el enlace es inválido.
      </p>
      <Link
        to="/users"
        className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition"
      >
        Volver a la búsqueda
      </Link>
    </div>
  );
}
