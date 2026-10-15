import API from './api';
import type { DashboardMetrics, InventoryItem, User } from '../types';

export const adminService = {
  // Get executive dashboard metrics
  getDashboardMetrics: async (): Promise<{ success: boolean; data: DashboardMetrics }> => {
    const response = await API.get('/admin/dashboard');
    return response.data;
  },

  // Get real-time inventory
  getInventory: async (): Promise<{ success: boolean; data: InventoryItem[] }> => {
    const response = await API.get('/admin/inventory');
    return response.data;
  },

  // Update inventory stock count
  updateInventoryStock: async (productId: string, stock: number, name?: string): Promise<{ success: boolean; data: any }> => {
    const response = await API.put(`/admin/inventory/${productId}`, { stock, name });
    return response.data;
  },

  // Fetch all registered users
  getAllUsers: async (): Promise<{ success: boolean; data: User[] }> => {
    const response = await API.get('/admin/users');
    return response.data;
  },

  // Delete user by ID
  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  }
};
