
// Cualquier componente que necesite leer o cambiar filtros lo hace a
// través de este store (CategoryTabs, SearchBar, BusinessFilters).
import { create } from 'zustand';
import type { BusinessCategory, BusinessStatus } from '@shared/types';

interface CatalogFiltersState {
  category: BusinessCategory | undefined;
  status: BusinessStatus | undefined;
  search: string;
}

interface CatalogStore extends CatalogFiltersState {
  setCategory: (category: BusinessCategory | undefined) => void;
  setStatus: (status: BusinessStatus | undefined) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const INITIAL_FILTERS: CatalogFiltersState = {
  category: undefined,
  status: undefined,
  search: '',
};

export const useCatalogStore = create<CatalogStore>()((set) => ({
  ...INITIAL_FILTERS,

  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set(INITIAL_FILTERS),
}));