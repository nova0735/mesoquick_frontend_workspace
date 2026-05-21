import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import {
  BusinessHeader,
  ProductList,
  useBusinessDetail,
} from '@features/catalog';
import { useCartActions, DifferentBusinessModal } from '@features/cart';
import { EmptyState, toast } from '@shared/ui';
import { ROUTES } from '@app/router/routes';
import type { Product } from '@shared/types';

function BusinessDetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-4 w-32 bg-border/30 rounded" />
      <div className="aspect-[21/9] bg-border/30 rounded-xl" />
      <div className="space-y-2">
        <div className="h-5 w-24 bg-border/30 rounded" />
        <div className="h-8 w-2/3 bg-border/30 rounded" />
      </div>
      <div className="h-4 w-40 bg-border/30 rounded" />
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-border/30 rounded" />
        <div className="h-3 w-4/5 bg-border/30 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-16 bg-border/30 rounded-xl" />
        <div className="h-16 bg-border/30 rounded-xl" />
        <div className="h-16 bg-border/30 rounded-xl" />
      </div>
    </div>
  );
}

export default function BusinessDetailPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { business, products, isLoading, error } =
    useBusinessDetail(businessId);

  // Hook que encapsula la regla del comercio único.
  // Si hay conflicto, isConflictOpen se vuelve true y mostramos el modal.
  const {
    tryAddToCart,
    confirmReplace,
    cancelReplace,
    isConflictOpen,
    conflictCurrentBusiness,
    conflictIncomingBusiness,
  } = useCartActions();

  /**
   * Callback que se pasa a ProductList → ProductCard.
   * Inyecta businessId y businessName desde el detalle del comercio actual,
   * porque ProductCard solo conoce el producto, no el comercio dueño.
   */
  const handleAddToCart = (product: Product) => {
    if (!business) return;
    const result = tryAddToCart({
      product,
      businessId: business.id,
      businessName: business.name,
    });

    // Solo mostramos el toast si se agregó exitosamente.
    // Si hubo conflicto de comercio, se abre el modal — no queremos
    // mostrar también el toast porque sería ruido.
    if (result.success) {
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  // Estado de carga
  if (isLoading) {
    return <BusinessDetailSkeleton />;
  }

  // Estado de error o sin datos: empty state con botón de volver
  if (error || !business) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-12 h-12" />}
        title="Comercio no encontrado"
        description="No pudimos cargar este comercio. Pudo haber sido eliminado o el link es invalido."
        action={
          <Link
            to={ROUTES.CATALOG}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catalogo
          </Link>
        }
      />
    );
  }

  // En este punto TypeScript sabe que business no es null
  // gracias al narrowing del if anterior.
  return (
    <div className="space-y-8">
      <BusinessHeader business={business} />
      <ProductList products={products} onAddToCart={handleAddToCart} />

      {/* Modal de la regla del comercio único.
          Solo aparece si tryAddToCart detectó un conflicto. */}
      <DifferentBusinessModal
        isOpen={isConflictOpen}
        currentBusinessName={conflictCurrentBusiness}
        incomingBusinessName={conflictIncomingBusiness}
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
    </div>
  );
}