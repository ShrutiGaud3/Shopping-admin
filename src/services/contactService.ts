import API from './api';
import type { ContactMessage } from '../types';

export const contactService = {
  // Get all contact messages
  getAllContactMessages: async (): Promise<{ success: boolean; data: ContactMessage[] }> => {
    const response = await API.get('/contact');
    return {
      success: true,
      data: (response.data?.data || []).map((m: any) => ({
        id: m._id || m.id,
        _id: m._id || m.id,
        name: m.name,
        email: m.email,
        phone: m.phone || '',
        subject: m.subject || 'General Inquiry',
        message: m.message,
        status: m.status || 'unread',
        createdAt: m.createdAt
      }))
    };
  },

  // Delete message
  deleteMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/contact/${id}`);
    return response.data;
  }
};
