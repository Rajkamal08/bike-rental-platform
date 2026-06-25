import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://bike-rental-api-f85i.onrender.com/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token to Headers
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Expired Token
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Token expired or unauthorized. Logging out...');
            await AsyncStorage.removeItem('authToken');
            // Note: We can't use navigation here directly easily, 
            // but by removing the token, the App's AuthContext state 
            // (verified via token-verify on next reload or state change) 
            // will eventually handle the redirection.
            // For immediate redirection, we'd need a more complex event system 
            // or to pass a logout callback.
        }
        return Promise.reject(error);
    }
);

// Helper to get full image URL
export const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('https')) return path;
    // Remove '/api/' from the end of API_BASE_URL to get the root domain
    const baseUrl = API_BASE_URL.replace('/api/', '/');
    // Ensure path doesn't start with / if we append
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}${cleanPath}`;
};

export default api;
