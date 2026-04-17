import { HelpCircle } from 'lucide-react';
import { FaqSearchBar, MOCK_FAQS, useFaqSearch } from '../../../features/browse-faqs';
import { FaqAccordion } from '../../../widgets/faq-list';

/**
 * Página de Preguntas Frecuentes para agentes de servicio al cliente.
 * Compone el feature `browse-faqs` con el widget `faq-list`.
 *
 * TODO(backend): reemplazar MOCK_FAQS por la llamada real cuando exista
 * el endpoint. La página no debería cambiar — solo el origen del array.
 */
export function FaqsPage() {
  const { query, setQuery, category, setCategory, results, totalCount } =
    useFaqSearch({ source: MOCK_FAQS });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <HelpCircle className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Preguntas frecuentes</h1>
        </div>
        <p className="text-sm text-gray-600">
          Consulta rápida de respuestas estándar para los casos más comunes
          que reportan clientes, repartidores y restaurantes.
        </p>
      </header>

      <FaqSearchBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />

      <div className="text-xs text-gray-500">
        Mostrando <span className="font-semibold text-primary">{results.length}</span>{' '}
        de <span className="font-semibold text-primary">{totalCount}</span> preguntas.
      </div>

      <FaqAccordion faqs={results} />
    </div>
  );
}
