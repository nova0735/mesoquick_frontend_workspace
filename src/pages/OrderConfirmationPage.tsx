import { useParams, Navigate } from 'react-router-dom';
import ConfirmationCard from '@features/checkout/ui/ConfirmationCard';
import { ROUTES } from '@app/router/routes';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  // Guardia: si no hay orderId en la URL, redirigir al catálogo
  if (!orderId) {
    return <Navigate to={ROUTES.CATALOG} replace />;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <ConfirmationCard orderId={orderId} />
    </div>
  );
}
