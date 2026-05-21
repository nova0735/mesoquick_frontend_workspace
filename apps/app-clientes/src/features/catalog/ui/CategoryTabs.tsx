// Tabs de categorias para filtrar el catalogo
import {
  UtensilsCrossed,
  Pill,
  ShoppingCart,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { useCatalogStore } from '../model/useCatalogStore';
import type { BusinessCategory } from '@shared/types';

interface TabConfig {
  value: BusinessCategory | undefined;
  label: string;
  icon: LucideIcon;
}

const TABS: TabConfig[] = [
  { value: undefined, label: 'Todos', icon: LayoutGrid },
  { value: 'restaurant', label: 'Restaurantes', icon: UtensilsCrossed },
  { value: 'pharmacy', label: 'Farmacias', icon: Pill },
  { value: 'supermarket', label: 'Supermercados', icon: ShoppingCart },
];

export default function CategoryTabs() {
  const category = useCatalogStore((s) => s.category);
  const setCategory = useCatalogStore((s) => s.setCategory);

  return (
    <div
      role="tablist"
      aria-label="Categorias de comercios"
      className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible"
    >
      {TABS.map((tab) => {
        const isActive = category === tab.value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setCategory(tab.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              isActive
                ? 'bg-accent text-white'
                : 'bg-accent-bg/40 text-text hover:bg-accent-bg hover:text-accent'
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}