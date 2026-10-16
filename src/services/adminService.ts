import API from './api';
import type { DashboardMetrics, InventoryItem, User, SubscriberItem } from '../types';

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

  // Update user role (Super Admin)
  updateUserRole: async (userId: string, role: string): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await API.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Delete user by ID
  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Newsletter Subscribers list
  getSubscribers: async (params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<{
    success: boolean;
    data: SubscriberItem[];
    pagination: { page: number; limit: number; total: number; pages: number };
    counts: { active: number; unsubscribed: number; all: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const response = await API.get(`/admin/subscribers?${query.toString()}`);
    return response.data;
  },

  // Delete subscriber
  deleteSubscriber: async (subscriberId: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/admin/subscribers/${subscriberId}`);
    return response.data;
  }
};
