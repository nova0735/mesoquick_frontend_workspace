// ==========================================
// PUBLIC API (@mesoquick/core-network)
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Este archivo define la interfaz pública del paquete de red.
// Las aplicaciones y features que consuman este paquete SOLO deben importar desde aquí.

export { apiClient } from './axios.interceptor';
export { simulateRequest } from './api-mock';