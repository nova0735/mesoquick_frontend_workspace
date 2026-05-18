// Filtros secundarios del catalogo

import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { useCatalogStore } from '../model/useCatalogStore';
import type { BusinessStatus } from '@shared/types';

interface StatusOption {
  value: BusinessStatus | undefined;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: undefined, label: 'Todos' },
  { value: 'open', label: 'Abiertos' },
  { value: 'busy', label: 'Ocupados' },
  { value: 'closed', label: 'Cerrados' },
];

export default function BusinessFilters() {
  const category = useCatalogStore((s) => s.category);
  const status = useCatalogStore((s) => s.status);
  const search = useCatalogStore((s) => s.search);
  const setStatus = useCatalogStore((s) => s.setStatus);
  const resetFilters = useCatalogStore((s) => s.resetFilters);

  const hasActiveFilters =
    category !== undefined || status !== undefined || search.trim() !== '';

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex items-center gap-2 text-sm text-text">
        <SlidersHorizontal className="w-4 h-4" />
        <span>Estado:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((option) => {
          const isActive = status === option.value;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setStatus(option.value)}
              aria-pressed={isActive}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                isActive
                  ? 'bg-accent text-white border-accent'
                  : 'border-border text-text hover:border-accent-border hover:text-accent'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="ml-auto text-sm text-accent hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}