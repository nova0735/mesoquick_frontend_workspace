import axios, { AxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 1. Request: Inject 'Authorization: Bearer'
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// 2 & 3. Response: 401 Silence Refresh & Circuit Breaker
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 1. Global Error Handling for 5xx and Network Errors
    const isNetworkError = error.message === 'Network Error';
    const isServerError = error.response && [500, 502, 503, 504].includes(error.response.status);
    
    if (isNetworkError || isServerError) {
      window.dispatchEvent(new CustomEvent('mesoquick:network-error', { detail: 'Reconectando con el servidor...' }));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Circuit Breaker: Abort immediately if the 401 is from the refresh endpoint
      if (originalRequest.url?.includes('/api/auth/refresh') || originalRequest.url?.includes('/auth/refresh')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { token: refreshToken });

        localStorage.setItem('accessToken', data.accessToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Circuit Breaker: Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);