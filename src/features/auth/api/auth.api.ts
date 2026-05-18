import { userMock } from '@shared/mocks';
import type { RegisterFormData, AuthUser } from '../model/auth.types';

const fakeDelay = (ms = 700): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function registerUser(data: RegisterFormData): Promise<AuthUser> {
  await fakeDelay();

  if (data.email === userMock.email) {
    throw new Error('Este correo ya está registrado');
  }

  const newUser: AuthUser = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    defaultAddress: data.defaultAddress,
    createdAt: new Date().toISOString(),
  };

  return newUser;
}

export async function logoutUser(): Promise<void> {
  await fakeDelay(300);
}