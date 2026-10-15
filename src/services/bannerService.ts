import API from './api';
import type { BannerItem } from '../types';

export const bannerService = {
  getAllBanners: async (): Promise<BannerItem[]> => {
    try {
      const response = await API.get('/banners/admin');
      return response.data.data || [];
    } catch (error) {
      // Fallback to public endpoint
      const response = await API.get('/banners');
      return response.data.data || [];
    }
  },

  createBanner: async (data: Partial<BannerItem>): Promise<BannerItem> => {
    const response = await API.post('/banners', data);
    return response.data.data;
  },

  updateBanner: async (id: string, data: Partial<BannerItem>): Promise<BannerItem> => {
    const response = await API.put(`/banners/${id}`, data);
    return response.data.data;
  },

  deleteBanner: async (id: string): Promise<void> => {
    await API.delete(`/banners/${id}`);
  }
};
