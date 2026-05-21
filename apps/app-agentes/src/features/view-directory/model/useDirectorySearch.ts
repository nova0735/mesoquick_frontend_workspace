import { useMemo, useState } from 'react';
import type { ContactEntry, Department } from '../../../entities/contact-entry';

export interface UseDirectorySearchOptions {
  source: readonly ContactEntry[];
}

export interface UseDirectorySearchResult {
  query: string;
  setQuery: (value: string) => void;
  department: Department | null;
  setDepartment: (value: Department | null) => void;
  results: readonly ContactEntry[];
  totalCount: number;
}

/**
 * Hook de búsqueda y filtrado para el directorio interno.
 * Filtra por texto libre (nombre, rol, email) y por departamento.
 */
export function useDirectorySearch({
  source,
}: UseDirectorySearchOptions): UseDirectorySearchResult {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState<Department | null>(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return source.filter((contact) => {
      if (department && contact.department !== department) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return (
        contact.name.toLowerCase().includes(normalizedQuery) ||
        contact.role.toLowerCase().includes(normalizedQuery) ||
        contact.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [source, query, department]);

  return {
    query,
    setQuery,
    department,
    setDepartment,
    results,
    totalCount: source.length,
  };
}
