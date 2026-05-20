import type { CardBrand, CardFormInput, CardValidationResult } from '../types';

/**
 * Detecta la marca de la tarjeta a partir del número.
 * Basado en los primeros dígitos (BIN ranges públicos).
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(011|5)/.test(digits)) return 'discover';

  return 'unknown';
}

/**
 * Nombre legible de la marca para mostrar en UI.
 */
export function getBrandLabel(brand: CardBrand): string {
  const labels: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    unknown: 'Tarjeta',
  };
  return labels[brand];
}

/**
 * Algoritmo de Luhn (mod-10) para validar números de tarjeta.
 * Es el algoritmo estándar usado en toda la industria.
 */
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Formatea el número mientras el usuario escribe: 1234 5678 9012 3456
 * (American Express usa formato 4-6-5: 1234 567890 12345)
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  const brand = detectCardBrand(digits);

  if (brand === 'amex') {
    return digits
      .replace(/^(\d{4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => {
        return [a, b, c].filter(Boolean).join(' ');
      })
      .trim();
  }

  // Visa, MC, Discover y default: grupos de 4
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Formato MM/YY para fecha de expiración.
 */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/**
 * Devuelve los últimos N dígitos del número (por defecto 4).
 */
export function getLast4(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '').slice(-4);
}

/**
 * Genera la versión enmascarada para mostrar en UI: •••• •••• •••• 0203
 */
export function getMaskedNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

/**
 * Versión corta para mostrar en checkout: Visa •••• 0203
 */
export function getShortMask(brand: CardBrand, last4: string): string {
  return `${getBrandLabel(brand)} •••• ${last4}`;
}

/**
 * Verifica si una fecha de expiración ya pasó.
 */
export function isExpired(expMonth: number, expYear: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (expYear < currentYear) return true;
  if (expYear === currentYear && expMonth < currentMonth) return true;
  return false;
}

/**
 * Valida el formulario completo. Devuelve errores por campo.
 */
export function validateCardForm(input: CardFormInput): CardValidationResult {
  const errors: CardValidationResult['errors'] = {};

  // Número
  const digits = input.number.replace(/\D/g, '');
  if (!digits) {
    errors.number = 'Ingresá el número de tarjeta';
  } else if (digits.length < 13) {
    errors.number = 'Número incompleto';
  } else if (!isValidLuhn(digits)) {
    errors.number = 'Número inválido';
  }

  // Nombre del titular
  if (!input.holderName.trim()) {
    errors.holderName = 'Ingresá el nombre del titular';
  } else if (input.holderName.trim().length < 3) {
    errors.holderName = 'Nombre demasiado corto';
  }

  // Mes de expiración
  const month = parseInt(input.expMonth, 10);
  if (!input.expMonth) {
    errors.expMonth = 'Mes requerido';
  } else if (isNaN(month) || month < 1 || month > 12) {
    errors.expMonth = 'Mes inválido';
  }

  // Año de expiración
  const year = parseInt(input.expYear, 10);
  const currentYear = new Date().getFullYear();
  if (!input.expYear) {
    errors.expYear = 'Año requerido';
  } else if (isNaN(year) || year < currentYear || year > currentYear + 20) {
    errors.expYear = 'Año inválido';
  } else if (
    !isNaN(month) &&
    month >= 1 &&
    month <= 12 &&
    isExpired(month, year)
  ) {
    errors.expMonth = 'Tarjeta vencida';
  }

  // CVV (3 dígitos para la mayoría, 4 para Amex)
  const brand = detectCardBrand(digits);
  const expectedCvvLength = brand === 'amex' ? 4 : 3;
  const cvvDigits = input.cvv.replace(/\D/g, '');
  if (!cvvDigits) {
    errors.cvv = 'CVV requerido';
  } else if (cvvDigits.length !== expectedCvvLength) {
    errors.cvv = `Debe tener ${expectedCvvLength} dígitos`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}