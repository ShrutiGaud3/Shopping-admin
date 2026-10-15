import API from './api';
import type { Category } from '../types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await API.get('/categories?all=true');
    return {
      success: true,
      data: (response.data?.data || []).map((cat: any) => ({
        id: cat._id || cat.id,
        _id: cat._id || cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        image: cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        itemCount: cat.itemCount || 0,
        featured: cat.featured || false,
        gender: cat.gender || 'All',
        parent: cat.parent,
        order: cat.order || 0,
        showInMenu: cat.showInMenu !== undefined ? cat.showInMenu : true,
        type: cat.type || 'category',
        description: cat.description || ''
      }))
    };
  },

  // Get nested category tree for Mega Menu preview
  getCategoryTree: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await API.get('/categories/tree');
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData: Partial<Category>): Promise<{ success: boolean; data: Category }> => {
    const response = await API.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<{ success: boolean; data: Category }> => {
    const response = await API.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  }
};
