// Hook que combina el store de filtros con la capa de API para devolver
// la lista de comercios según el estado actual del catálogo.
import { useEffect, useState } from 'react';
import { useDebounce } from '@shared/hooks/useDebounce';
import type { Business } from '@shared/types';
import { getBusinesses } from '../api/catalog.api';
import { useCatalogStore } from './useCatalogStore';

interface UseBusinessesResult {
  businesses: Business[];
  isLoading: boolean;
  error: Error | null;
}

const SEARCH_DEBOUNCE_MS = 300;

export function useBusinesses(): UseBusinessesResult {
  const category = useCatalogStore((s) => s.category);
  const status = useCatalogStore((s) => s.status);
  const search = useCatalogStore((s) => s.search);

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Bandera para descartar respuestas obsoletas
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getBusinesses({
          category,
          status,
          search: debouncedSearch,
        });
        if (cancelled) return;
        setBusinesses(data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setBusinesses([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [category, status, debouncedSearch]);

  return { businesses, isLoading, error };
}