import axios from 'axios';
// import { toast } from 'react-toastify';
// import { getToken, setToken, removeToken } from './tokenStore';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_MAIN ?? window.location.origin,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
});

// Callback для обработки неудачного refresh (logout)
// let onRefreshFailedCallback: (() => void) | null = null;

// export const setOnRefreshFailed = (callback: () => void) => {
//     onRefreshFailedCallback = callback;
// };

// // Callback для очистки кеша TanStack Query
// let onClearCacheCallback: (() => void) | null = null;

// export const setOnClearCache = (callback: () => void) => {
//     onClearCacheCallback = callback;
// };

// apiClient.interceptors.request.use(
//     (config) => {
//         const token = getToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// let isRefreshing = false;
// let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];
// let hasInvalidatedCache = false; // Флаг для предотвращения множественной инвалидации

// const processQueue = (error: unknown, token: string | null = null) => {
//     failedQueue.forEach((prom) => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });

//     failedQueue = [];
// };

// apiClient.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         // Не пытаемся обновить токен для самого refresh endpoint
//         if (error?.config?.url?.includes('/auth/refresh')) {
//             removeToken();
//             return Promise.reject(error);
//         }

//         if (error?.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise(function (resolve, reject) {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then((token) => {
//                         originalRequest.headers.Authorization = 'Bearer ' + token;
//                         return axios(originalRequest);
//                     })
//                     .catch((err) => {
//                         return Promise.reject(err);
//                     });
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 // Вызываем refresh напрямую без использования apiClient
//                 const response = await axios.post(
//                     `${import.meta.env.VITE_API_MAIN}/api/auth/refresh`,
//                     {},
//                     { withCredentials: true }
//                 );
                
//                 const accessToken = response.data.accessToken;
//                 setToken(accessToken);
//                 apiClient.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
//                 originalRequest.headers.Authorization = 'Bearer ' + accessToken;
//                 processQueue(null, accessToken);
//                 return apiClient(originalRequest);
//             } catch (refreshError) {
//                 processQueue(refreshError, null);
//                 removeToken();
                
//                 // Вызываем коллбэки только один раз
//                 if (!hasInvalidatedCache) {
//                     hasInvalidatedCache = true;
                    
//                     // Показываем уведомление об истечении сессии
//                     toast.error('Для выполнения действия войдите в систему.');
                    
//                     // Вызываем callback для разлогина пользователя
//                     if (onRefreshFailedCallback) {
//                         onRefreshFailedCallback();
//                     }
                    
//                     // Инвалидируем кеш TanStack Query
//                     if (onClearCacheCallback) {
//                         onClearCacheCallback();
//                     }
                    
//                     // Сбрасываем флаг через некоторое время
//                     setTimeout(() => {
//                         hasInvalidatedCache = false;
//                     }, 2000);
//                 }
                
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default apiClient;
