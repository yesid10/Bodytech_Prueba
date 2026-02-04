import api from './api';

export const getCurrentUser = async (token: string) => {
    const response = await api.post('/me', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};