import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Extract the server's error message from an API failure, falling back to a default
export const getErrorMessage = (err: unknown, fallback: string): string =>
  (axios.isAxiosError(err) && err.response?.data?.message) || fallback;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                if (parsed.state && parsed.state.accessToken) {
                    config.headers.Authorization = `Bearer ${parsed.state.accessToken}`;
                }
            } catch {}
        }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling 401s and refreshing tokens
let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void, reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If it's a 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using HttpOnly cookie
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        if (res.status === 200 && res.data?.data?.accessToken) {
          const newAccessToken = res.data.data.accessToken;
          
          // Update zustand store in localStorage
          if (typeof window !== 'undefined') {
             const authData = localStorage.getItem('auth-storage');
             if (authData) {
                 try {
                     const parsed = JSON.parse(authData);
                     parsed.state.accessToken = newAccessToken;
                     localStorage.setItem('auth-storage', JSON.stringify(parsed));
                 } catch {}
             }
          }
          
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
          
          processQueue(null, newAccessToken);
          return api(originalRequest);
        }
        // Refresh responded without a token: treat as a failed refresh
        throw error;
      } catch (err) {
        processQueue(err, null);
        // If refresh fails (e.g. token expired), we could trigger a logout action here
        if (typeof window !== 'undefined') {
            const authData = localStorage.getItem('auth-storage');
            if (authData) {
                 try {
                     const parsed = JSON.parse(authData);
                     parsed.state.accessToken = null;
                     parsed.state.isAuthenticated = false;
                     parsed.state.user = null;
                     localStorage.setItem('auth-storage', JSON.stringify(parsed));
                     window.location.href = '/login';
                 } catch {}
            }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
