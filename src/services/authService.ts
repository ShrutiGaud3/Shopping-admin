import API from './api';
import type { User } from '../types';

export const authService = {
  // Login specifically for Admin
  login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: User; message?: string }> => {
    const response = await API.post('/auth/login', { email, password, portal: 'admin' });
    return response.data;
  },

  // Verify currently logged in admin session
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await API.get('/auth/me');
    return response.data;
  }
};
