import { PackageX } from 'lucide-react';
import { EmptyState } from '@shared/ui';
import ProductCard from './ProductCard';
import type { Product } from '@shared/types';

interface ProductListProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ProductList({
  products,
  onAddToCart,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageX className="w-12 h-12" />}
        title="Sin productos disponibles"
        description="Este comercio todavia no tiene productos cargados."
      />
    );
  }

  const grouped = products.reduce<Record<string, Product[]>>(
    (acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-lg font-semibold text-text-heading mb-3">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}