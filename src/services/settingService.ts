import API from './api';
import type { Setting } from '../types';

export const settingService = {
  // Get current store settings
  getSettings: async (): Promise<{ success: boolean; data: Setting }> => {
    const response = await API.get('/settings');
    return response.data;
  },

  // Update store settings (Admin)
  updateSettings: async (settingsData: Partial<Setting>): Promise<{ success: boolean; data: Setting; message: string }> => {
    const response = await API.put('/settings', settingsData);
    return response.data;
  }
};
