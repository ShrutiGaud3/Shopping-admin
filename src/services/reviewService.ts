import API from './api';
import type { Review } from '../types';

export const reviewService = {
  // Get all reviews
  getAllReviews: async (): Promise<{ success: boolean; data: Review[] }> => {
    const response = await API.get('/reviews');
    return {
      success: true,
      data: (response.data?.data || []).map((r: any) => ({
        id: r._id || r.id,
        _id: r._id || r.id,
        userName: r.userName || r.user?.name || 'Customer',
        product: r.product,
        productName: typeof r.product === 'object' && r.product?.name ? r.product.name : 'Fashion Item',
        rating: Number(r.rating || 5),
        comment: r.comment || '',
        isVerifiedPurchase: Boolean(r.isVerifiedPurchase),
        createdAt: r.createdAt
      }))
    };
  },

  // Delete review
  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/reviews/${id}`);
    return response.data;
  }
};
