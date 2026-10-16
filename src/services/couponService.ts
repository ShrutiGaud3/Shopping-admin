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
        type: c.type || (c.discountType === 'fixed' ? 'flat' : 'percent'),
        discountType: c.discountType || (c.type === 'flat' ? 'fixed' : 'percentage'),
        value: c.value !== undefined ? c.value : (c.discountValue !== undefined ? c.discountValue : c.discountPercentage),
        discountValue: c.discountValue !== undefined ? c.discountValue : c.value,
        discountPercentage: c.discountPercentage || c.value || c.discountValue || 0,
        maxDiscount: c.maxDiscount || c.maxDiscountAmount || c.maximumDiscount || 0,
        maxDiscountAmount: c.maxDiscountAmount || c.maxDiscount || c.maximumDiscount || 0,
        minOrder: c.minOrder || c.minOrderAmount || c.minimumOrderValue || 0,
        minOrderAmount: c.minOrderAmount || c.minOrder || c.minimumOrderValue || 0,
        expiry: c.expiry || c.expiryDate,
        expiryDate: c.expiryDate || c.expiry,
        usageLimit: c.usageLimit || 1000,
        usedCount: c.usedCount || c.usageCount || 0,
        usageCount: c.usedCount || c.usageCount || 0,
        paymentMethod: c.paymentMethod || 'any',
        isActive: c.isActive !== undefined ? c.isActive : true,
        createdAt: c.createdAt
      }))
    };
  },

  // Create coupon
  createCoupon: async (couponData: Partial<Coupon>): Promise<{ success: boolean; data: Coupon }> => {
    const response = await API.post('/admin/coupons', couponData);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (id: string, couponData: Partial<Coupon>): Promise<{ success: boolean; data: Coupon }> => {
    const response = await API.put(`/admin/coupons/${id}`, couponData);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/admin/coupons/${id}`);
    return response.data;
  }
};
