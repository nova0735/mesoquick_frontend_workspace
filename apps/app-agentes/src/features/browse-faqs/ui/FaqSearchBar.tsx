import { Search, X } from 'lucide-react';
import {
  FAQ_CATEGORY_LABEL,
  type FaqCategory,
} from '../../../entities/faq';

interface FaqSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  category: FaqCategory | null;
  onCategoryChange: (value: FaqCategory | null) => void;
}

const CATEGORY_ORDER: readonly FaqCategory[] = [
  'PEDIDOS',
  'PAGOS',
  'CUENTA',
  'REPARTIDORES',
  'RESTAURANTES',
  'SOPORTE',
];

/**
 * Barra de búsqueda + chips de categoría para la sección de FAQs.
 *
 * TODO(ui-kit): cuando @mesoquick/ui-kit exporte un <InputText /> con icono y
 * un <ChipGroup />, migrar este componente a esos primitives.
 */
export function FaqSearchBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: FaqSearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar en preguntas y respuestas..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <CategoryChip
          label="Todas"
          isActive={category === null}
          onClick={() => onCategoryChange(null)}
        />
        {CATEGORY_ORDER.map((cat) => (
          <CategoryChip
            key={cat}
            label={FAQ_CATEGORY_LABEL[cat]}
            isActive={category === cat}
            onClick={() => onCategoryChange(cat)}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CategoryChip({ label, isActive, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        isActive
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-primary border-gray-300 hover:border-primary hover:bg-primary/5'
      }`}
    >
      {label}
    </button>
  );
}
