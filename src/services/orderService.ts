import API from './api';
import type { Order } from '../types';

export const adaptOrder = (item: any): Order => {
  const primaryId = item._id || item.id || item.orderId;
  const displayOrderId = item.orderId || (item._id ? `ORD-${item._id.slice(-6).toUpperCase()}` : 'ORD-1001');

  return {
    id: primaryId,
    _id: item._id || primaryId,
    orderId: displayOrderId,
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    createdAt: item.createdAt,
    customerName: item.customerName || item.shippingAddress?.fullName || 'Customer',
    customerEmail: item.customerEmail || 'customer@example.com',
    customerPhone: item.customerPhone || item.shippingAddress?.phone || '',
    items: (item.items || []).map((i: any) => {
      const prod = typeof i.product === 'object' && i.product !== null ? i.product : null;
      return {
        product: {
          id: prod?._id || i.product || 'prod-1',
          name: i.name || prod?.name || 'Velora Item',
          brand: prod?.brand || 'VELORA',
          price: i.price !== undefined ? i.price : (prod?.price || 999),
          image: i.image || prod?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
        },
        selectedSize: i.size || 'M',
        selectedColor: i.color || 'Default',
        quantity: i.quantity || 1
      };
    }),
    totalAmount: Number(item.totalAmount || 0),
    subtotal: Number(item.subtotal || item.totalAmount || 0),
    discountAmount: Number(item.discount || item.discountAmount || 0),
    discount: Number(item.discount || item.discountAmount || 0),
    shippingFee: Number(item.shippingCharge || item.shippingFee || 0),
    shippingCharge: Number(item.shippingCharge || item.shippingFee || 0),
    codCharge: Number(item.codCharge || 0),
    couponCode: item.couponCode || '',
    status: item.orderStatus || item.status || 'Confirmed',
    orderStatus: item.orderStatus || item.status || 'Confirmed',
    paymentMethod: item.paymentMethod || 'COD',
    paymentStatus: item.paymentStatus || 'pending',
    paymentId: item.paymentId || '',
    shippingAddress: {
      fullName: item.shippingAddress?.fullName || item.customerName || 'Customer',
      street: item.shippingAddress?.street || item.shippingAddress?.address || 'Street address',
      address: item.shippingAddress?.address || item.shippingAddress?.street || 'Street address',
      city: item.shippingAddress?.city || 'City',
      state: item.shippingAddress?.state || 'State',
      pincode: item.shippingAddress?.pincode || '',
      phone: item.shippingAddress?.phone || item.customerPhone || '',
      country: item.shippingAddress?.country || 'India'
    },
    trackingNumber: item.trackingNumber || '',
    carrierName: item.carrierName || '',
    trackingUrl: item.trackingUrl || '',
    deliveredAt: item.deliveredAt ? new Date(item.deliveredAt).toISOString() : undefined,
    exchangeStatus: item.exchangeStatus || 'none',
    exchangeReason: item.exchangeReason || '',
    exchangeNotes: item.exchangeNotes || '',
    exchangeRequestedAt: item.exchangeRequestedAt ? new Date(item.exchangeRequestedAt).toISOString() : undefined,
    exchangeResolvedAt: item.exchangeResolvedAt ? new Date(item.exchangeResolvedAt).toISOString() : undefined,
    exchangeAdminNotes: item.exchangeAdminNotes || ''
  };
};

export const orderService = {
  // Get all orders across the system
  getAllOrders: async (): Promise<{ success: boolean; data: Order[] }> => {
    const response = await API.get('/admin/orders');
    const rawData = response.data?.data || [];
    return {
      success: true,
      data: rawData.map(adaptOrder)
    };
  },

  // Update order status, tracking, and carrier
  updateOrderStatus: async (
    orderId: string,
    payload: { status?: string; trackingNumber?: string; carrierName?: string; trackingUrl?: string } | string
  ): Promise<{ success: boolean; data: Order }> => {
    const body = typeof payload === 'string' ? { status: payload } : payload;
    const response = await API.put(`/admin/orders/${orderId}/status`, body);
    return {
      success: true,
      data: adaptOrder(response.data.data)
    };
  },

  // Approve or reject customer exchange request
  updateExchangeStatus: async (
    orderId: string,
    exchangeStatus: 'approved' | 'rejected' | 'none',
    adminNotes?: string
  ): Promise<{ success: boolean; data: Order; message?: string }> => {
    const response = await API.put(`/admin/orders/${orderId}/exchange`, { exchangeStatus, adminNotes });
    return {
      success: true,
      message: response.data?.message,
      data: adaptOrder(response.data.data)
    };
  }
};
