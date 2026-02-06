import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import { getCurrentUser } from '../../services/authUtils';
import axios from 'axios';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Async thunk para cargar el usuario actual al montar la app
export const loadUserAsync = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        try {
            const { user } = await getCurrentUser(token);
            return user;
        } catch (error: unknown) {
            // Si es 401 (Unauthorized), eliminar el token y desloguear
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                localStorage.removeItem('token');
                return rejectWithValue('Token inválido o expirado');
            }
            // Para otros errores, no rechazar - solo mantener el token
            // El usuario seguirá logueado aunque no cargamos sus datos
            console.error('Error loading user:', error);
            return null;
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUserAsync.fulfilled, (state, action) => {
                state.loading = false;
                // Si tenemos usuario, actualizar datos
                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                } else {
                    // Si no hay usuario pero hay token, mantener logueado
                    if (state.token) {
                        state.isAuthenticated = true;
                    } else {
                        state.isAuthenticated = false;
                    }
                }
            })
            .addCase(loadUserAsync.rejected, (state) => {
                state.loading = false;
                // Solo desloguear si hay error (token inválido)
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.error = 'Token inválido o expirado';
            });
    },
});

export const { login, logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
