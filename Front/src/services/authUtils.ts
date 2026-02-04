import type { User } from '../types';
import api from './api';

export const getCurrentUser = async (token: string): Promise<{ user: User }> => {
    const response = await api.post('/me', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};