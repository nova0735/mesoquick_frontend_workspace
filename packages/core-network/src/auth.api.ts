// packages/core-network/src/auth.api.ts

const BROKER_BASE_URL = `${import.meta.env?.VITE_API_BASE_URL || 'https://broker-services-production.up.railway.app'}/api`;

export interface RegisterPayload {
  email: string;
  passwordRaw: string;
  rol: string | number; // El broker acepta el número (1, 2, 3, 4) o el nombre
  [key: string]: any;   // Para campos extra que pueda requerir el registro
}

export const AuthAPI = {
  /**
   * Autentica al usuario en el Broker (Cualquier rol)
   */
  login: async (credentials: { email: string; passwordRaw: string }) => {
    try {
      const response = await fetch(`${BROKER_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mapeamos 'passwordRaw' al 'password' que espera el broker
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.passwordRaw, 
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas o error en el servidor');
      }

      const result = await response.json();
      return result.data; // Retorna { token, usuario }
    } catch (error) {
      console.error('Error en AuthAPI.login:', error);
      throw error;
    }
  },

  /**
   * Registro centralizado (El broker redirige según el rol internamente)
   */
  register: async (userData: RegisterPayload) => {
    try {
      // Separamos passwordRaw del resto de los datos
      const { passwordRaw, ...restOfData } = userData;
      
      const response = await fetch(`${BROKER_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...restOfData,
          password: passwordRaw, // Mapeamos para el backend
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario en el servidor');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en AuthAPI.register:', error);
      throw error;
    }
  },

  /**
   * Refresca el Token JWT
   */
  refreshToken: async (token: string) => {
    try {
      const response = await fetch(`${BROKER_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // El refresh de tu broker requiere el token anterior aquí
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudo refrescar el token');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en AuthAPI.refreshToken:', error);
      throw error;
    }
  }
};