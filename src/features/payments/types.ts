/**
 * NOTA DE SEGURIDAD:
 * Este módulo es una simulación de UI con fines académicos.
 *
 * En producción REAL, los datos sensibles de tarjetas (PAN completo, CVV)
 * NUNCA deben tocar el frontend ni almacenarse en localStorage. Deben
 * enviarse directamente a un procesador certificado PCI DSS (Stripe,
 * MercadoPago, Adyen, etc.) mediante sus SDKs/iframes seguros.
 *
 * Aquí guardamos ÚNICAMENTE los últimos 4 dígitos y la marca de la tarjeta
 * con propósito demostrativo. El número completo y el CVV se descartan
 * inmediatamente después de validarse.
 */

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'unknown';

/**
 * Representa una tarjeta guardada (versión segura, sin datos sensibles).
 * Vinculada a un userId para que cada usuario vea solo sus tarjetas.
 */
export interface SavedCard {
  id: string;
  userId: string;
  brand: CardBrand;
  last4: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Datos que el usuario ingresa en el formulario (NUNCA se persisten así).
 */
export interface CardFormInput {
  number: string;
  holderName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

/**
 * Resultado de validación del formulario de tarjeta.
 */
export interface CardValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CardFormInput, string>>;
}