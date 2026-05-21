//Input de busqueda del catalogo

import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@shared/ui';
import { useCatalogStore } from '../model/useCatalogStore';

export default function SearchBar() {
  const search = useCatalogStore((s) => s.search);
  const setSearch = useCatalogStore((s) => s.setSearch);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Buscar comercios, comida, productos..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      aria-label="Buscar comercios"
      leftIcon={<Search className="w-4 h-4" />}
      rightIcon={
        search ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar busqueda"
            className="hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : undefined
      }
    />
  );
}