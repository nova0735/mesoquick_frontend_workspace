import { BookOpen } from 'lucide-react';
import {
  DirectorySearchBar,
  MOCK_CONTACTS,
  useDirectorySearch,
} from '../../../features/view-directory';
import { DirectoryList } from '../../../widgets/directory-table';

/**
 * Página del directorio interno de contactos para agentes.
 * Permite buscar y filtrar por departamento.
 *
 * TODO(backend): reemplazar MOCK_CONTACTS por la llamada real cuando exista
 * el endpoint. La página no debería cambiar — solo el origen del array.
 */
export function DirectoryPage() {
  const { query, setQuery, department, setDepartment, results, totalCount } =
    useDirectorySearch({ source: MOCK_CONTACTS });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Directorio interno</h1>
        </div>
        <p className="text-sm text-gray-600">
          Contactos del equipo interno: operaciones, supervisores, finanzas,
          legal y soporte técnico. Ubica rápidamente a quién escalar un caso.
        </p>
      </header>

      <DirectorySearchBar
        query={query}
        onQueryChange={setQuery}
        department={department}
        onDepartmentChange={setDepartment}
      />

      <div className="text-xs text-gray-500">
        Mostrando{' '}
        <span className="font-semibold text-primary">{results.length}</span> de{' '}
        <span className="font-semibold text-primary">{totalCount}</span>{' '}
        contactos.
      </div>

      <DirectoryList contacts={results} />
    </div>
  );
}
