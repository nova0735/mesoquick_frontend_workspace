import { useEffect, useState } from 'react';

/**
 * Devuelve un valor "debounced": espera X ms después del último cambio
 * antes de actualizarse. Útil para búsquedas (no hacer una query por cada letra).
 *
 * Uso:
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 300);
 *   // debouncedSearch se actualiza 300ms después de que el usuario deja de escribir
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}