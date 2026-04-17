import { useMemo, useState } from 'react';
import type {
  SupportUser,
  SupportUserType,
} from '../../../entities/support-user';

export interface UseUserSearchOptions {
  source: readonly SupportUser[];
}

export interface UseUserSearchResult {
  query: string;
  setQuery: (value: string) => void;
  typeFilter: SupportUserType | null;
  setTypeFilter: (value: SupportUserType | null) => void;
  results: readonly SupportUser[];
  totalCount: number;
}

/**
 * Hook de búsqueda de usuarios para el panel de consulta del agente.
 * Filtra por texto libre (nombre, email, teléfono, ID, negocio) y por tipo.
 */
export function useUserSearch({
  source,
}: UseUserSearchOptions): UseUserSearchResult {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<SupportUserType | null>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return source.filter((user) => {
      if (typeFilter && user.type !== typeFilter) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        user.phone.toLowerCase().includes(normalized) ||
        user.id.toLowerCase().includes(normalized) ||
        (user.businessName?.toLowerCase().includes(normalized) ?? false)
      );
    });
  }, [source, query, typeFilter]);

  return {
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    results,
    totalCount: source.length,
  };
}
