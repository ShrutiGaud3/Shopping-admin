import API from './api';
import type { Product } from '../types';

export const adaptProduct = (item: any): Product => {
  const primaryImage =
    item.images && item.images.length > 0
      ? item.images[0]
      : item.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';

  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name || '',
    brand: item.brand || 'VELORA Studio',
    category: item.category || 'Clothing',
    gender: item.gender || 'Women',
    price: Number(item.price || 0),
    originalPrice: Number(item.originalPrice || item.price || 0),
    discountPercent:
      item.discountPercent !== undefined
        ? Number(item.discountPercent)
        : (item.originalPrice && item.price ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0),
    rating: Number(item.rating || 4.5),
    reviewsCount: Number(item.reviewsCount || 0),
    image: primaryImage,
    images: item.images && item.images.length > 0 ? item.images : [primaryImage],
    colors: item.colors || [{ name: 'Black', hex: '#000000' }],
    sizes: item.sizes || ['S', 'M', 'L'],
    stock: item.stock !== undefined ? Number(item.stock) : 25,
    isTrending: Boolean(item.isTrending),
    isDeal: Boolean(item.isDeal),
    isNew: Boolean(item.isNew || item.isNewArrival),
    isFeatured: Boolean(item.isFeatured),
    description: item.description || '',
    specifications: item.specifications || { fabric: 'Premium Fabric', care: 'Dry Clean Only' },
    sku: item.sku || `VEL-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: item.createdAt
  };
};

export const productService = {
  // Get all products
  getProducts: async (params?: any): Promise<{ success: boolean; data: Product[]; total?: number }> => {
    const response = await API.get('/products', { params });
    const rawData = response.data?.data || [];
    return {
      success: true,
      data: rawData.map(adaptProduct),
      total: response.data?.pagination?.total || rawData.length
    };
  },

  // Get product by ID
  getProductById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await API.get(`/products/${id}`);
    return {
      success: true,
      data: adaptProduct(response.data.data)
    };
  },

  // Create new product
  createProduct: async (productData: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
    const payload = {
      name: productData.name,
      brand: productData.brand || 'VELORA Studio',
      category: productData.category || 'Dresses',
      gender: productData.gender || 'Women',
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      discountPercent: Number(productData.discountPercent || 0),
      description: productData.description || 'VELORA Designer Collection',
      images: productData.images && productData.images.length > 0 ? productData.images : [productData.image],
      sizes: productData.sizes || ['S', 'M', 'L'],
      colors: productData.colors || [{ name: 'Black', hex: '#000000' }],
      stock: Number(productData.stock || 20),
      isFeatured: Boolean(productData.isFeatured),
      isTrending: Boolean(productData.isTrending),
      isDeal: Boolean(productData.isDeal),
      specifications: productData.specifications || {}
    };

    const response = await API.post('/products', payload);
    return {
      success: true,
      data: adaptProduct(response.data.data)
    };
  },

  // Update existing product
  updateProduct: async (id: string, updatedData: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
    const response = await API.put(`/products/${id}`, updatedData);
    return {
      success: true,
      data: adaptProduct(response.data.data)
    };
  },

  // Delete product
  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  }
};
