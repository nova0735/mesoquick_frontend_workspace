// Hook de carga de los datos del detalle de un comercio
import { useEffect, useState } from 'react';
import {
  getBusinessById,
  getProductsByBusiness,
} from '../api/catalog.api';
import type { Business, Product } from '@shared/types';

interface UseBusinessDetailResult {
  business: Business | null;
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

export function useBusinessDetail(
  businessId: string | undefined
): UseBusinessDetailResult {
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si no hay businessId no corremos el effect
    if (!businessId) return;

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [businessData, productsData] = await Promise.all([
          getBusinessById(businessId),
          getProductsByBusiness(businessId),
        ]);

        if (cancelled) return;
        setBusiness(businessData);
        setProducts(productsData);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setBusiness(null);
        setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [businessId]);

  // Caso sin businessId: derivamos el "error sin id"
  if (!businessId) {
    return {
      business: null,
      products: [],
      isLoading: false,
      error: new Error('No se especifico un comercio'),
    };
  }

  return { business, products, isLoading, error };
}