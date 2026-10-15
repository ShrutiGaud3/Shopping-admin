import API from './api';
import type { MarqueeItem } from '../types';

export const marqueeService = {
  // Get all marquee items for admin
  getAllMarquees: async (): Promise<{ success: boolean; data: MarqueeItem[] }> => {
    const response = await API.get('/marquee/all');
    return response.data;
  },

  // Create marquee item
  createMarquee: async (marqueeData: Partial<MarqueeItem>): Promise<{ success: boolean; data: MarqueeItem }> => {
    const response = await API.post('/marquee', marqueeData);
    return response.data;
  },

  // Update marquee item
  updateMarquee: async (id: string, marqueeData: Partial<MarqueeItem>): Promise<{ success: boolean; data: MarqueeItem }> => {
    const response = await API.put(`/marquee/${id}`, marqueeData);
    return response.data;
  },

  // Delete marquee item
  deleteMarquee: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/marquee/${id}`);
    return response.data;
  }
};
