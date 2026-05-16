import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import {
  BusinessHeader,
  ProductList,
  useBusinessDetail,
} from '@features/catalog';
import { EmptyState } from '@shared/ui';
import { ROUTES } from '@app/router/routes';

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

  if (isLoading) {
    return <BusinessDetailSkeleton />;
  }

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

  return (
    <div className="space-y-8">
      <BusinessHeader business={business} />
      <ProductList products={products} />
    </div>
  );
}