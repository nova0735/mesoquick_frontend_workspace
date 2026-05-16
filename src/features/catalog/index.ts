// UI components
export { default as BusinessCard } from './ui/BusinessCard';
export { default as BusinessGrid } from './ui/BusinessGrid';
export { default as CategoryTabs } from './ui/CategoryTabs';
export { default as SearchBar } from './ui/SearchBar';
export { default as BusinessFilters } from './ui/BusinessFilters';
export { default as BusinessHeader } from './ui/BusinessHeader';
export { default as ProductCard } from './ui/ProductCard';
export { default as ProductList } from './ui/ProductList';

// Hooks
export { useCatalogStore } from './model/useCatalogStore';
export { useBusinesses } from './model/useBusinesses';
export { useBusinessDetail } from './model/useBusinessDetail';

// API publica para que otras features
export {
  getBusinessById,
  getProductsByBusiness,
} from './api/catalog.api';
export type { GetBusinessesParams } from './api/catalog.api';