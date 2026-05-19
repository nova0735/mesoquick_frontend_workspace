// ==========================================
// THE UNBLOCKER MOCK (Simulador de Red)
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Este archivo es vital para equipos trabajando en paralelo. 
// Permite a los desarrolladores de Features/Widgets simular respuestas 
// asíncronas de la API antes de que el backend esté construido, 
// evitando bloqueos en el desarrollo del Frontend.

export const simulateRequest = <T>(mockData: T, delayMs: number = 800): Promise<T> => {
  // Retorna una promesa que simula la latencia real de la red
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, delayMs);
  });
};