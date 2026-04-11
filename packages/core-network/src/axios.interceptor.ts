import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// ==========================================
// THE RESILIENT AXIOS INTERCEPTOR
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Instancia global centralizada para el manejo de red. 
// Este interceptor maneja de forma transparente:
// 1. Inyección automática del Token JWT.
// 2. Refresco transparente del Token ante un 401.
// 3. Circuit Breaker: Desconexión y redirección de seguridad si falla el refresco.

// Variables de entorno inyectadas por Vite (o valores por defecto robustos)
const baseURL = import.meta.env?.VITE_API_BASE_URL || '/api';
const timeout = Number(import.meta.env?.VITE_TIMEOUT_MS) || 10000;

// 1. Creación de la instancia
export const apiClient = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables para manejar concurrencia en el refresco de tokens (Mutex)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// REQUEST INTERCEPTOR: Inyección de Token
// ==========================================
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el token del almacenamiento local (o Zustand persist)
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR & CIRCUIT BREAKER
// ==========================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 1. Log Global de Observabilidad antes de procesar el error
    console.error(`[Network Fallback] 🔴 Request fallida a ${originalRequest?.url}`, error.response?.data || error.message);

    // 2. Atrapar Error 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // Si ya hay un refresco en progreso, encolar esta petición
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No hay refresh_token disponible");

        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refresh_token: refreshToken });
        const newToken = data.access_token;
        
        localStorage.setItem('access_token', newToken);
        if (originalRequest.headers) originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        processQueue(null, newToken);
        return apiClient(originalRequest); // Reintentar la petición original con éxito
      } catch (refreshError) {
        // 🚨 CIRCUIT BREAKER 🚨
        // El refresco falló. Limpiamos sesión y forzamos salida.
        processQueue(refreshError as AxiosError, null);
        console.error("CRITICAL: 💥 Circuit Breaker Activado. Sesión invalidada. Redirigiendo al Login...");
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_context'); // Limpieza general
        
        window.location.href = '/login'; // Force Redirect
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Si no es un 401, o ya fue reintentado, rechazar normalmente
    return Promise.reject(error);
  }
);