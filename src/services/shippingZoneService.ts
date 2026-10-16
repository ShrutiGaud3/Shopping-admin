import API from './api';
import type { ShippingZone } from '../types';

export const shippingZoneService = {
  // Get all shipping zones
  getShippingZones: async (): Promise<{ success: boolean; data: ShippingZone[] }> => {
    try {
      const response = await API.get('/shipping-zones/admin');
      if (response.data && Array.isArray(response.data.data)) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.error('Failed to get shipping zones', err);
      return { success: false, data: [] };
    }
  },

  // Create new shipping zone
  createShippingZone: async (data: Partial<ShippingZone>) => {
    const response = await API.post('/shipping-zones', data);
    return response.data;
  },

  // Update existing shipping zone
  updateShippingZone: async (id: string, data: Partial<ShippingZone>) => {
    const response = await API.put(`/shipping-zones/${id}`, data);
    return response.data;
  },

  // Delete shipping zone
  deleteShippingZone: async (id: string) => {
    const response = await API.delete(`/shipping-zones/${id}`);
    return response.data;
  }
};
