// Grilla responsiva de comercios

import { SearchX, AlertCircle } from 'lucide-react';
import { Card, EmptyState, Button } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import { useBusinesses } from '../model/useBusinesses';
import { useCatalogStore } from '../model/useCatalogStore';
import BusinessCard from './BusinessCard';

const SKELETON_COUNT = 6;

function BusinessCardSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden h-full flex flex-col">
      <div className="aspect-[16/10] bg-border/30 animate-pulse" />
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="h-5 w-2/3 bg-border/30 rounded animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-border/30 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-border/30 rounded animate-pulse" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 w-14 bg-border/30 rounded animate-pulse" />
          <div className="h-5 w-12 bg-border/30 rounded animate-pulse" />
        </div>
        <div className="flex gap-3 mt-auto pt-2 border-t border-border">
          <div className="h-3 w-16 bg-border/30 rounded animate-pulse" />
          <div className="h-3 w-12 bg-border/30 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

export default function BusinessGrid() {
  const { businesses, isLoading, error } = useBusinesses();
  const resetFilters = useCatalogStore((s) => s.resetFilters);

  // 1. Error de carga
  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-12 h-12" />}
        title="No pudimos cargar los comercios"
        description="Algo salió mal con la conexión. Intentá cambiar los filtros o recargá la página."
      />
    );
  }

  // 2. Carga inicial: aún no tenemos datos para mostrar
  if (isLoading && businesses.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 3. La query no devolvió resultados (filtros muy restrictivos)
  if (businesses.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="w-12 h-12" />}
        title="No encontramos comercios"
        description="Intentá ajustar los filtros o buscar otra cosa."
        action={
          <Button variant="outline" onClick={resetFilters}>
            Limpiar filtros
          </Button>
        }
      />
    );
  }

  // 4. Con resultados. El opacity-70 durante refetch da feedback sutil
  // de que el filtro nuevo está cargando, sin esconder los datos previos.
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-200',
        isLoading && 'opacity-70'
      )}
    >
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}