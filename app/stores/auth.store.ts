import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import { LoginRequestDto, LoginResponseDto } from '@/dto/login.dto';

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

interface AuthState {
    token: string | null;
    loading: boolean;
    hydrate: () => Promise<void>;
    login: (data: LoginRequestDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create(
    persist<AuthState>(
        (set, get) => ({
            token: null,
            loading: false,

            hydrate: async () => {
                const token = await AsyncStorage.getItem('token');
                set({ token });
            },

            login: async (data: LoginRequestDto) => {
                set({ loading: true });
                try {
                    const res = await axios.post<LoginResponseDto>(
                        `${API_URL}/auth/login`,
                        data
                    );
                    const token = res.data.accessToken;
                    set({ token });
                    router.replace('/(tabs)');
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        const axiosErr = err as AxiosError<{ message: string }>;
                        throw new Error(
                            axiosErr.response?.data?.message || axiosErr.message
                        );
                    }
                    throw err;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                set({ token: null });
                router.replace('/login');
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);