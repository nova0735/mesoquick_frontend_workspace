/**
 * Funciones puras para formatear datos para presentación.
 */

/**
 * Formatea un precio en quetzales.
 * Uso: formatPrice(45.5) → "Q 45.50"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea una fecha ISO a formato legible.
 * Uso: formatDate("2026-03-15T14:30:00Z") → "15 mar 2026, 8:30 AM"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formatea una fecha ISO a formato corto.
 * Uso: formatDateShort("2026-03-15T14:30:00Z") → "15 mar"
 */
export function formatDateShort(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

/**
 * Calcula el tiempo relativo desde una fecha.
 * Uso: formatRelativeTime("2026-03-15T14:00:00Z") → "Hace 30 min"
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  return formatDateShort(isoDate);
}

/**
 * Trunca texto largo agregando "..."
 * Uso: truncate("Texto muy largo aquí", 10) → "Texto muy..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Formatea un teléfono.
 * Uso: formatPhone("12345678") → "1234-5678"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
}