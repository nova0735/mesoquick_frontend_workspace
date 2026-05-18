// Pagina de exploración del catalogo
import {
  CategoryTabs,
  SearchBar,
  BusinessFilters,
  BusinessGrid,
} from '@features/catalog';

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-heading">
          Explorar comercios
        </h1>
        <p className="text-text">
          Restaurantes, farmacias y supermercados cerca tuyo.
        </p>
      </header>

      <CategoryTabs />

      <div className="space-y-3">
        <SearchBar />
        <BusinessFilters />
      </div>

      <BusinessGrid />
    </div>
  );
}