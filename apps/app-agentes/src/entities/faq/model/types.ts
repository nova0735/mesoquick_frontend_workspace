/**
 * Categorías soportadas para una FAQ del panel de agentes.
 *
 * Estas categorías están alineadas con la sección §3.5 del PDF de Interacciones
 * UI Agentes Servicio al Cliente. Si en el futuro el backend define un catálogo
 * dinámico, este union se reemplaza por `string` y se valida contra una API.
 */
export type FaqCategory =
  | 'PEDIDOS'
  | 'PAGOS'
  | 'CUENTA'
  | 'REPARTIDORES'
  | 'RESTAURANTES'
  | 'SOPORTE';

/**
 * Etiqueta visible para cada categoría. Se mantiene aquí (no en el feature)
 * porque pertenece al modelo de dominio, no a la lógica de búsqueda.
 */
export const FAQ_CATEGORY_LABEL: Record<FaqCategory, string> = {
  PEDIDOS: 'Pedidos',
  PAGOS: 'Pagos',
  CUENTA: 'Cuenta',
  REPARTIDORES: 'Repartidores',
  RESTAURANTES: 'Restaurantes',
  SOPORTE: 'Soporte',
};

/**
 * Una pregunta frecuente individual.
 *
 * - `id`: estable, sirve como key de React y como ancla potencial de URL.
 * - `question` / `answer`: texto plano, sin HTML. Si más adelante el backend
 *   devuelve markdown o rich-text, este tipo evoluciona.
 * - `category`: una sola categoría por FAQ (mantengamos el modelo simple).
 */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}
