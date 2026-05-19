import axios from 'axios';
import { API_BASE_URL } from '../shared/constants/api.constants';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // The refresh endpoint must never be retried by the interceptor,
        // otherwise a failed refresh deadlocks itself.
        if (originalRequest?.url?.includes('/auth/refresh')) {
            refreshPromise = null;
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = apiClient.post('/auth/refresh').then(() => {
                        refreshPromise = null;
                    });
                }
                await refreshPromise;
                return apiClient(originalRequest);
            } catch {
                refreshPromise = null;
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;