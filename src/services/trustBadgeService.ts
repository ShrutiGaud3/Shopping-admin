import API from './api';
import type { TrustBadgeItem } from '../types';

export const trustBadgeService = {
  getAllTrustBadges: async (): Promise<TrustBadgeItem[]> => {
    try {
      const response = await API.get('/trust-badges/admin');
      return response.data.data || [];
    } catch (error) {
      const response = await API.get('/trust-badges');
      return response.data.data || [];
    }
  },

  createTrustBadge: async (data: Partial<TrustBadgeItem>): Promise<TrustBadgeItem> => {
    const response = await API.post('/trust-badges', data);
    return response.data.data;
  },

  updateTrustBadge: async (id: string, data: Partial<TrustBadgeItem>): Promise<TrustBadgeItem> => {
    const response = await API.put(`/trust-badges/${id}`, data);
    return response.data.data;
  },

  deleteTrustBadge: async (id: string): Promise<void> => {
    await API.delete(`/trust-badges/${id}`);
  }
};
