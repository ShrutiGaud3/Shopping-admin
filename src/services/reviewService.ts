import API from './api';
import type { ReviewItem } from '../types';

export interface GetReviewsResponse {
  success: boolean;
  data: ReviewItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  counts: {
    pending: number;
    approved: number;
    rejected: number;
    all: number;
  };
}

export const reviewService = {
  // Get all reviews with status and search filters
  getReviews: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetReviewsResponse> => {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());

      const response = await API.get(`/admin/reviews?${query.toString()}`);
      return response.data;
    } catch (err: any) {
      console.error('Failed to get admin reviews', err);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        counts: { pending: 0, approved: 0, rejected: 0, all: 0 }
      };
    }
  },

  // Update review moderation status
  updateStatus: async (
    id: string,
    status: 'approved' | 'rejected' | 'pending',
    rejectionReason?: string
  ): Promise<{ success: boolean; message: string; data?: ReviewItem }> => {
    const response = await API.put(`/admin/reviews/${id}/status`, {
      status,
      rejectionReason
    });
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/admin/reviews/${id}`);
    return response.data;
  }
};
