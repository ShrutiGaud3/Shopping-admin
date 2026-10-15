import API from './api';
import type { PageItem } from '../types';

export const pageService = {
  // Get all CMS pages
  getAllPages: async (): Promise<{ success: boolean; data: PageItem[] }> => {
    const response = await API.get('/pages/all');
    return response.data;
  },

  // Get page by slug
  getPageBySlug: async (slug: string): Promise<{ success: boolean; data: PageItem }> => {
    const response = await API.get(`/pages/${slug}`);
    return response.data;
  },

  // Create page
  createPage: async (pageData: Partial<PageItem>): Promise<{ success: boolean; data: PageItem }> => {
    const response = await API.post('/pages', pageData);
    return response.data;
  },

  // Update page
  updatePage: async (id: string, pageData: Partial<PageItem>): Promise<{ success: boolean; data: PageItem }> => {
    const response = await API.put(`/pages/${id}`, pageData);
    return response.data;
  },

  // Delete page
  deletePage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/pages/${id}`);
    return response.data;
  }
};
