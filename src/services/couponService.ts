import API from './api';
import type { Coupon } from '../types';

export const couponService = {
  // Get all coupons
  getCoupons: async (): Promise<{ success: boolean; data: Coupon[] }> => {
    const response = await API.get('/admin/coupons');
    return {
      success: true,
      data: (response.data?.data || []).map((c: any) => ({
        id: c._id || c.id,
        _id: c._id || c.id,
        code: c.code,
        discountPercentage: c.discountPercentage,
        maxDiscountAmount: c.maxDiscountAmount || 0,
        minOrderAmount: c.minOrderAmount || 0,
        expiryDate: c.expiryDate,
        isActive: c.isActive !== undefined ? c.isActive : true,
        usageCount: c.usageCount || 0,
        createdAt: c.createdAt
      }))
    };
  },

  // Create coupon
  createCoupon: async (couponData: Partial<Coupon>): Promise<{ success: boolean; data: Coupon }> => {
    const response = await API.post('/admin/coupons', couponData);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/admin/coupons/${id}`);
    return response.data;
  }
};
