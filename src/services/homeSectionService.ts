import API from './api';
import type { HomeSectionItem } from '../types';

export const homeSectionService = {
  getAllHomeSections: async (): Promise<HomeSectionItem[]> => {
    try {
      const response = await API.get('/home-sections/admin');
      return response.data.data || [];
    } catch (error) {
      const response = await API.get('/home-sections');
      return response.data.data || [];
    }
  },

  createHomeSection: async (data: Partial<HomeSectionItem>): Promise<HomeSectionItem> => {
    const response = await API.post('/home-sections', data);
    return response.data.data;
  },

  updateHomeSection: async (id: string, data: Partial<HomeSectionItem>): Promise<HomeSectionItem> => {
    const response = await API.put(`/home-sections/${id}`, data);
    return response.data.data;
  },

  deleteHomeSection: async (id: string): Promise<void> => {
    await API.delete(`/home-sections/${id}`);
  }
};
