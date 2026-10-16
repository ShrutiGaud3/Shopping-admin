import API from './api';
import type { BlogPostItem } from '../types';

export interface GetBlogsResponse {
  success: boolean;
  data: BlogPostItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const blogService = {
  // Get all blog posts for admin
  getBlogs: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<GetBlogsResponse> => {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.status) query.append('status', params.status);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());

      const response = await API.get(`/blogs/admin/all?${query.toString()}`);
      return response.data;
    } catch (err: any) {
      console.error('Failed to get admin blogs', err);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    }
  },

  // Get single blog post by ID
  getBlogById: async (id: string): Promise<{ success: boolean; data: BlogPostItem }> => {
    const response = await API.get(`/blogs/admin/${id}`);
    return response.data;
  },

  // Create new blog post
  createBlog: async (data: Partial<BlogPostItem>): Promise<{ success: boolean; message: string; data: BlogPostItem }> => {
    const response = await API.post('/blogs/admin', data);
    return response.data;
  },

  // Update existing blog post
  updateBlog: async (id: string, data: Partial<BlogPostItem>): Promise<{ success: boolean; message: string; data: BlogPostItem }> => {
    const response = await API.put(`/blogs/admin/${id}`, data);
    return response.data;
  },

  // Delete blog post
  deleteBlog: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await API.delete(`/blogs/admin/${id}`);
    return response.data;
  }
};
