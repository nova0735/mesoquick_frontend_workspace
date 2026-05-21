// src/features/catalog/api/catalog.api.ts
//
// Capa de catálogo. Patrón broker-first + fallback a mocks (idéntico a auth):
//   1) Intenta el broker real.
//   2) Si el broker tira 5xx, timeout o error de red -> cae a mocks.
//   3) Si el broker tira 4xx -> propaga el error real (datos inválidos del cliente).
//
// El mock se mantiene como respaldo SIEMPRE para que la presentación
// funcione aun si el broker está caído.

import { businessesMock, getProductsByBusinessId } from '@shared/mocks';
import type {
  Business,
  Product,
  BusinessCategory,
  BusinessStatus,
} from '@shared/types';

// ============================================================================
//  Tipos públicos de la capa (firma idéntica a antes para no romper consumidores)
// ============================================================================

export interface GetBusinessesParams {
  category?: BusinessCategory;
  status?: BusinessStatus;
  search?: string;
}

// ============================================================================
//  Broker config + error tipado
// ============================================================================

const BROKER_BASE_URL = 'https://broker-services-production.up.railway.app/api';
const BROKER_TIMEOUT_MS = 6000;

/** Error con código HTTP para que la capa pueda decidir broker vs fallback mock. */
export class BrokerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'BrokerError';
    this.status = status;
  }
}

/**
 * fetch con timeout. Si el broker no responde dentro de BROKER_TIMEOUT_MS
 * lanza un BrokerError(0, ...) que se trata como "broker caído" -> mock.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = BROKER_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    // Red caída / abort -> tratamos como 0 (sin status HTTP)
    throw new BrokerError(
      err instanceof Error ? err.message : 'Sin conexión al broker',
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

async function buildBrokerError(response: Response, fallback: string): Promise<BrokerError> {
  let detail = fallback;
  try {
    const errData = await response.json();
    detail = errData.message ?? errData.error ?? `${fallback} (${response.status})`;
  } catch {
    detail = `${fallback} (${response.status})`;
  }
  return new BrokerError(detail, response.status);
}

/**
 * Decide si una falla del broker debe caer al mock o propagarse.
 * - status >= 500 o status === 0 (timeout / red) -> fallback a mock.
 * - status 4xx (datos malos) -> propagar.
 */
function shouldFallbackToMock(err: unknown): boolean {
  if (err instanceof BrokerError) {
    return err.status === 0 || err.status >= 500 || err.status === 404;
  }
  // Cualquier otro error inesperado -> fallback (seguro para la demo)
  return true;
}

// ============================================================================
//  Adaptadores broker -> shape interno de la UI
// ============================================================================

interface BrokerHorario {
  id: number;
  restaurante_id: number;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  activo: boolean;
}

interface BrokerRestaurant {
  id: number | string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  logo_url?: string;
  disponible?: boolean;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string | null;
  horarios?: BrokerHorario[];
  // Campos opcionales que el broker puede o no exponer
  rating?: number;
  review_count?: number;
  delivery_time?: string;
  delivery_fee?: number;
  min_order?: number;
  tags?: string[];
  [k: string]: unknown;
}

interface BrokerProduct {
  id: number | string;
  restaurante_id?: number | string;
  nombre: string;
  descripcion?: string;
  precio: number | string;
  imagen?: string;
  imagen_url?: string;
  categoria?: string;
  disponible?: boolean;
  activo?: boolean;
  [k: string]: unknown;
}

/**
 * Pool de fotos de comida real (Unsplash, sin licencia, URLs estables) para
 * usar como "foto" cuando el broker no devuelve una imagen real o devuelve
 * URLs placeholder (ej. example.com/...).
 *
 * Asignación determinística por id: el mismo restaurante siempre obtiene la
 * misma foto para que no parpadee entre cargas. Esto convierte el "fallback
 * sin foto" en algo presentable para la demo del jueves.
 */
const RESTAURANT_PHOTOS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // restaurante general
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',    // hamburguesas
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // pizza
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', // sushi
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',    // mexicana
  'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800', // pasta italiana
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',    // bowl saludable
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // gourmet
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', // pancakes/desayuno
];

const PRODUCT_PHOTOS = [
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600',  // plato
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',  // tacos
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',  // hamburguesa
  'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600',  // wrap
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600',  // pasta
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600',     // postre
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',     // bowl
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600',     // mexicana
];

/** Hash determinístico simple (djb2) sobre un string. */
function hashString(s: string): number {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(hash);
}

function pickRestaurantPhoto(id: string): string {
  return RESTAURANT_PHOTOS[hashString(id) % RESTAURANT_PHOTOS.length];
}

function pickProductPhoto(id: string): string {
  return PRODUCT_PHOTOS[hashString(id) % PRODUCT_PHOTOS.length];
}

/**
 * Devuelve la URL si parece legítima, o una foto del pool si no.
 * El broker viene devolviendo URLs ejemplo (example.com/...) que no cargan,
 * así que cualquier cosa que huela a placeholder la reemplazamos por una
 * foto real de Unsplash, asignada de forma determinística por id.
 */
function sanitizeImageUrl(url: string | undefined, fallback: string): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  // URLs ejemplo / placeholder que sabemos que no funcionan
  if (/^https?:\/\/(example\.com|test\.com|placeholder\.com|tu-dominio)/i.test(trimmed)) {
    return fallback;
  }
  // URLs que no empiezan con http(s) — protocolo raro
  if (!/^https?:\/\//i.test(trimmed)) return fallback;
  return trimmed;
}

function mapBrokerRestaurantToBusiness(raw: BrokerRestaurant): Business {
  const isOpen = raw.disponible !== false && raw.activo !== false;
  const id = String(raw.id);
  return {
    id,
    name: raw.nombre ?? 'Comercio sin nombre',
    // El broker actual solo expone restaurantes; cuando agreguen farmacias/super,
    // se podrá ramificar acá según categoria_id u otro campo.
    category: 'restaurant' as BusinessCategory,
    description: raw.descripcion ?? '',
    image: sanitizeImageUrl(raw.logo_url, pickRestaurantPhoto(id)),
    rating: typeof raw.rating === 'number' ? raw.rating : 4.5,
    reviewCount: typeof raw.review_count === 'number' ? raw.review_count : 0,
    status: isOpen ? 'open' : 'closed' as BusinessStatus,
    deliveryTime: raw.delivery_time ?? '25-35 min',
    deliveryFee: typeof raw.delivery_fee === 'number' ? raw.delivery_fee : 15,
    minOrder: typeof raw.min_order === 'number' ? raw.min_order : 0,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

function mapBrokerProductToProduct(
  raw: BrokerProduct,
  businessId: string,
): Product {
  const priceNum =
    typeof raw.precio === 'string' ? parseFloat(raw.precio) : raw.precio;
  const id = String(raw.id);
  return {
    id,
    businessId,
    name: raw.nombre ?? 'Producto',
    description: raw.descripcion ?? '',
    price: Number.isFinite(priceNum as number) ? Number(priceNum) : 0,
    image: sanitizeImageUrl(raw.imagen_url || raw.imagen, pickProductPhoto(id)),
    category: raw.categoria ?? 'General',
    available: raw.disponible !== false && raw.activo !== false,
  };
}

// ============================================================================
//  Llamadas al broker (público, sin auth)
// ============================================================================

/** Helper: el broker devuelve { success, data, count } o el objeto directo. */
function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function brokerGetRestaurants(): Promise<Business[]> {
  const response = await fetchWithTimeout(`${BROKER_BASE_URL}/restaurantes`);
  if (!response.ok) {
    throw await buildBrokerError(response, 'No se pudo obtener restaurantes');
  }
  const json = await response.json();
  const list = unwrap<BrokerRestaurant[]>(json);
  if (!Array.isArray(list)) {
    throw new BrokerError('Respuesta inesperada del broker en /restaurantes', 0);
  }
  return list
    .filter((r) => r.disponible !== false && r.activo !== false)
    .map(mapBrokerRestaurantToBusiness);
}

async function brokerGetRestaurantById(id: string): Promise<Business> {
  const response = await fetchWithTimeout(`${BROKER_BASE_URL}/restaurantes/${id}`);
  if (!response.ok) {
    throw await buildBrokerError(response, `Restaurante ${id} no disponible`);
  }
  const json = await response.json();
  const raw = unwrap<BrokerRestaurant>(json);
  if (!raw || !raw.id) {
    throw new BrokerError(`Restaurante ${id} no encontrado`, 404);
  }
  return mapBrokerRestaurantToBusiness(raw);
}

async function brokerGetProductsByRestaurant(id: string): Promise<Product[]> {
  const response = await fetchWithTimeout(
    `${BROKER_BASE_URL}/restaurantes/${id}/productos`,
  );
  if (!response.ok) {
    throw await buildBrokerError(response, `Productos del restaurante ${id} no disponibles`);
  }
  const json = await response.json();
  const list = unwrap<BrokerProduct[]>(json);
  if (!Array.isArray(list)) {
    throw new BrokerError(
      `Respuesta inesperada del broker en /restaurantes/${id}/productos`,
      0,
    );
  }
  return list.map((p) => mapBrokerProductToProduct(p, id));
}

// ============================================================================
//  MOCK (fallback)
// ============================================================================

const MOCK_DELAY_MS = 250;
const delay = (ms = MOCK_DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function mockGetBusinesses(
  params: GetBusinessesParams = {},
): Promise<Business[]> {
  await delay();
  const { category, status, search } = params;
  let result: Business[] = businessesMock;

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
        b.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  return result;
}

async function mockGetBusinessById(id: string): Promise<Business> {
  await delay();
  const business = businessesMock.find((b) => b.id === id);
  if (!business) {
    throw new Error(`Comercio no encontrado: ${id}`);
  }
  return business;
}

async function mockGetProductsByBusiness(businessId: string): Promise<Product[]> {
  await delay();
  return getProductsByBusinessId(businessId);
}

// ============================================================================
//  API PÚBLICA — misma firma de siempre, broker-first + fallback mock
// ============================================================================

/**
 * Aplica los filtros locales (categoria/estado/search) al resultado del broker.
 * Los mismos filtros que aplicaba el mock; así la UI no se entera del cambio.
 */
function applyLocalFilters(
  list: Business[],
  params: GetBusinessesParams,
): Business[] {
  const { category, status, search } = params;
  let result = list;

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
        b.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  return result;
}

export async function getBusinesses(
  params: GetBusinessesParams = {},
): Promise<Business[]> {
  try {
    const fromBroker = await brokerGetRestaurants();
    // Si el broker devuelve [] vacío, mezclamos con mock para que la demo
    // nunca se vea vacía. Si tiene datos reales, los usamos tal cual.
    if (fromBroker.length === 0) {
      console.info('[catalog.api] broker devolvió 0 restaurantes -> fallback mock');
      return await mockGetBusinesses(params);
    }
    return applyLocalFilters(fromBroker, params);
  } catch (err) {
    if (shouldFallbackToMock(err)) {
      console.warn('[catalog.api] broker falló en getBusinesses, fallback mock:', err);
      return await mockGetBusinesses(params);
    }
    throw err;
  }
}

export async function getBusinessById(id: string): Promise<Business> {
  // IDs del mock son strings tipo "b1", "b2"... Si el id no es numérico,
  // ni intentamos el broker (que espera ints). Vamos directo al mock.
  const isNumericId = /^\d+$/.test(id);
  if (!isNumericId) {
    return await mockGetBusinessById(id);
  }

  try {
    return await brokerGetRestaurantById(id);
  } catch (err) {
    if (shouldFallbackToMock(err)) {
      console.warn(`[catalog.api] broker falló en getBusinessById(${id}), fallback mock:`, err);
      return await mockGetBusinessById(id);
    }
    throw err;
  }
}

export async function getProductsByBusiness(
  businessId: string,
): Promise<Product[]> {
  const isNumericId = /^\d+$/.test(businessId);
  if (!isNumericId) {
    return await mockGetProductsByBusiness(businessId);
  }

  try {
    const list = await brokerGetProductsByRestaurant(businessId);
    if (list.length === 0) {
      console.info(`[catalog.api] broker devolvió 0 productos para ${businessId} -> fallback mock`);
      return await mockGetProductsByBusiness(businessId);
    }
    return list;
  } catch (err) {
    if (shouldFallbackToMock(err)) {
      console.warn(`[catalog.api] broker falló en getProductsByBusiness(${businessId}), fallback mock:`, err);
      return await mockGetProductsByBusiness(businessId);
    }
    throw err;
  }
}