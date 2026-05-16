// Aqui se establecen los datos del catalogo
// de momento trabaja con los mocks
import { businessesMock, getProductsByBusinessId } from '@shared/mocks';
import type {
  Business,
  Product,
  BusinessCategory,
  BusinessStatus,
} from '@shared/types';

export interface GetBusinessesParams {
  category?: BusinessCategory;
  status?: BusinessStatus;
  search?: string;
}

// Delay artificial para simular latencia de red y poder probar estados
// de carga en la UI
const MOCK_DELAY_MS = 250;
const delay = (ms = MOCK_DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// Lista de comercios
export async function getBusinesses(
  params: GetBusinessesParams = {}
): Promise<Business[]> {
  await delay();

  const { category, status, search } = params;
  let result = businessesMock;

  if (category) {
    result = result.filter((b) => b.category === category);
  }

  if (status) {
    result = result.filter((b) => b.status === status);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return result;
}

// Comercio por ID
export async function getBusinessById(id: string): Promise<Business> {
  await delay();

  const business = businessesMock.find((b) => b.id === id);
  if (!business) {
    throw new Error(`Comercio no encontrado: ${id}`);
  }
  return business;
}

// Productos del comercio
export async function getProductsByBusiness(
  businessId: string
): Promise<Product[]> {
  await delay();
  return getProductsByBusinessId(businessId);
}