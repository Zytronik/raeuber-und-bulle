import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://raeuber-und-bulle-j53w52ye6-zytroniks-projects.vercel.app',
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});