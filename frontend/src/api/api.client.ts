import axios from 'axios';
import { API_BASE_URL } from '../shared/constants/api.constants';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Required for httpOnly cookies to be sent with requests
    withCredentials: true,
});

// Shared refresh promise, prevents concurrent 401s from firing multiple refresh calls
let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If a refresh is already in flight, wait for it instead of firing a new one
                if (!refreshPromise) {
                    refreshPromise = apiClient.post('/auth/refresh').then(() => {
                        refreshPromise = null;
                    });
                }
                await refreshPromise;
                return apiClient(originalRequest);
            } catch {
                // Refresh failed, so we will have a clear user data and redirect to login
                refreshPromise = null;
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;