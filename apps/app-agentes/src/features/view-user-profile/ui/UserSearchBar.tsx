import { Search, X } from 'lucide-react';
import {
  SUPPORT_USER_TYPE_LABEL,
  type SupportUserType,
} from '../../../entities/support-user';

interface UserSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  typeFilter: SupportUserType | null;
  onTypeFilterChange: (value: SupportUserType | null) => void;
}

const TYPE_ORDER: readonly SupportUserType[] = ['CLIENT', 'COURIER', 'BUSINESS'];

/**
 * Barra de búsqueda + chips de tipo para la página de consulta de usuarios.
 *
 * TODO(ui-kit): migrar a <InputText /> y <ChipGroup /> de @mesoquick/ui-kit.
 */
export function UserSearchBar({
  query,
  onQueryChange,
  typeFilter,
  onTypeFilterChange,
}: UserSearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nombre, correo, teléfono o ID..."
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
        <TypeChip
          label="Todos"
          isActive={typeFilter === null}
          onClick={() => onTypeFilterChange(null)}
        />
        {TYPE_ORDER.map((type) => (
          <TypeChip
            key={type}
            label={SUPPORT_USER_TYPE_LABEL[type]}
            isActive={typeFilter === type}
            onClick={() => onTypeFilterChange(type)}
          />
        ))}
      </div>
    </div>
  );
}

interface TypeChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TypeChip({ label, isActive, onClick }: TypeChipProps) {
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
