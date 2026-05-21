import { useMemo, useState } from 'react';
import type { FaqCategory, FaqItem } from '../../../entities/faq';

/**
 * Hook de búsqueda y filtrado para la lista de FAQs.
 *
 * Es estado puramente local del feature: no usa Zustand porque no hay otros
 * componentes interesados en este filtro. Si en el futuro otra parte del
 * panel necesita conocer el término de búsqueda actual, se promueve a store.
 *
 * Filtra por:
 *  - Texto libre (case-insensitive) sobre `question` y `answer`.
 *  - Categoría única (o `null` para mostrar todas).
 */
export interface UseFaqSearchOptions {
  source: readonly FaqItem[];
}

export interface UseFaqSearchResult {
  query: string;
  setQuery: (value: string) => void;
  category: FaqCategory | null;
  setCategory: (value: FaqCategory | null) => void;
  results: readonly FaqItem[];
  totalCount: number;
}

export function useFaqSearch({ source }: UseFaqSearchOptions): UseFaqSearchResult {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategory | null>(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return source.filter((faq) => {
      if (category && faq.category !== category) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return (
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [source, query, category]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    totalCount: source.length,
  };
}
