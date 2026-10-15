import API from './api';
import type { FaqItem } from '../types';

export const faqService = {
  // Get all FAQs
  getAllFaqs: async (): Promise<{ success: boolean; data: FaqItem[] }> => {
    const response = await API.get('/faqs/all');
    return response.data;
  },

  // Create FAQ
  createFaq: async (faqData: Partial<FaqItem>): Promise<{ success: boolean; data: FaqItem }> => {
    const response = await API.post('/faqs', faqData);
    return response.data;
  },

  // Update FAQ
  updateFaq: async (id: string, faqData: Partial<FaqItem>): Promise<{ success: boolean; data: FaqItem }> => {
    const response = await API.put(`/faqs/${id}`, faqData);
    return response.data;
  },

  // Delete FAQ
  deleteFaq: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/faqs/${id}`);
    return response.data;
  }
};
