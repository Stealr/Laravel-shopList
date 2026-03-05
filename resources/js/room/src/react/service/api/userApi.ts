import apiClient from '../apiClient';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    email_verified_at?: string | null;
    created_at?: string;
}

export const getUser = async (): Promise<User> => {
    const response = await apiClient.get('/api/user');
    return response.data;
};

export const logout = async (): Promise<void> => {
    await apiClient.post('/logout');
};
