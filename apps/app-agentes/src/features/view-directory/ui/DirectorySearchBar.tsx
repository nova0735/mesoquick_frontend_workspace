import { Search, X } from 'lucide-react';
import {
  DEPARTMENT_LABEL,
  type Department,
} from '../../../entities/contact-entry';

interface DirectorySearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  department: Department | null;
  onDepartmentChange: (value: Department | null) => void;
}

const DEPARTMENT_ORDER: readonly Department[] = [
  'OPERACIONES',
  'SUPERVISORES',
  'FINANZAS',
  'LEGAL',
  'SOPORTE_TECNICO',
];

/**
 * Barra de búsqueda + chips de departamento para el directorio interno.
 *
 * TODO(ui-kit): migrar a <InputText /> y <ChipGroup /> de @mesoquick/ui-kit.
 */
export function DirectorySearchBar({
  query,
  onQueryChange,
  department,
  onDepartmentChange,
}: DirectorySearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nombre, rol o correo..."
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
        <DepartmentChip
          label="Todos"
          isActive={department === null}
          onClick={() => onDepartmentChange(null)}
        />
        {DEPARTMENT_ORDER.map((dept) => (
          <DepartmentChip
            key={dept}
            label={DEPARTMENT_LABEL[dept]}
            isActive={department === dept}
            onClick={() => onDepartmentChange(dept)}
          />
        ))}
      </div>
    </div>
  );
}

interface DepartmentChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function DepartmentChip({ label, isActive, onClick }: DepartmentChipProps) {
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
