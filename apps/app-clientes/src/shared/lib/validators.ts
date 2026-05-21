/**
 * Validadores reutilizables para formularios.
 * Cada función devuelve un mensaje de error si hay problema, o null si todo bien.
 */

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'El email es obligatorio';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'El email no es válido';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'El teléfono es obligatorio';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 8) return 'El teléfono debe tener 8 dígitos';
  return null;
}

export function validateRequired(
  value: string,
  fieldName = 'Este campo'
): string | null {
  if (!value.trim()) return `${fieldName} es obligatorio`;
  return null;
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName = 'Este campo'
): string | null {
  if (value.length < min) {
    return `${fieldName} debe tener al menos ${min} caracteres`;
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'Debe incluir al menos una mayúscula';
  if (!/[0-9]/.test(password)) return 'Debe incluir al menos un número';
  return null;
}

export function validatePasswordMatch(
  password: string,
  confirmation: string
): string | null {
  if (password !== confirmation) return 'Las contraseñas no coinciden';
  return null;
}