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

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token expired, try to refresh once automatically
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await apiClient.post('/auth/refresh');
                return apiClient(originalRequest);
            } catch {
                // Refresh failed — clear user data and redirect to login
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;