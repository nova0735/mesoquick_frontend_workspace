// src/features/auth/model/useRegisterForm.ts

import { useState } from 'react';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validatePassword,
  validatePasswordMatch,
} from '@shared/lib/validators';
import type { RegisterFormData, RegisterFormErrors } from './auth.types';

const INITIAL_FORM: RegisterFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  defaultAddress: '',
};

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormData, boolean>>>({});

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const getFieldError = (field: keyof RegisterFormData): string | undefined => {
    switch (field) {
      case 'name':
        return validateRequired(formData.name, 'El nombre') ?? undefined;
      case 'email':
        return (
          validateRequired(formData.email, 'El correo') ??
          validateEmail(formData.email) ??
          undefined
        );
      case 'phone':
        return (
          validateRequired(formData.phone, 'El teléfono') ??
          validatePhone(formData.phone) ??
          undefined
        );
      case 'password':
        return (
          validateRequired(formData.password, 'La contraseña') ??
          validatePassword(formData.password) ??
          undefined
        );
      case 'confirmPassword':
        return validatePasswordMatch(formData.password, formData.confirmPassword) ?? undefined;
      case 'defaultAddress':
        return validateRequired(formData.defaultAddress, 'La dirección') ?? undefined;
      default:
        return undefined;
    }
  };

  const validateField = (field: keyof RegisterFormData) => {
    const error = getFieldError(field);
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const validateAll = (): boolean => {
    const fields = Object.keys(INITIAL_FORM) as (keyof RegisterFormData)[];
    const newErrors: RegisterFormErrors = {};

    fields.forEach((field) => {
      const error = getFieldError(field);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm: () => {
      setFormData(INITIAL_FORM);
      setErrors({});
      setTouched({});
    },
  };
}