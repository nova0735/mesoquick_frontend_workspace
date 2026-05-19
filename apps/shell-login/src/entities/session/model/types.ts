export type UserRole = 'CLIENT' | 'COURIER' | 'BUSINESS' | 'AGENT' | 'ADMIN';

export interface LoginCredentials {
  email: string;
  passwordHash: string;
}

export interface AuthResponse {
  token: string; // JWT
  user: {
    id: string;
    role: UserRole;
    name: string;
  };
}
