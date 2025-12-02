import apiClient from './apiClient';

export const categoryAPI = {
  // Create category/subcategory
  create: async (categoryData) => {
    const { data } = await apiClient.post('/categories', categoryData);
    return data;
  },

  // Get categories by catalogue
  getByCatalogue: async (catalogueId) => {
    const { data } = await apiClient.get(`/categories/catalogue/${catalogueId}`);
    return data;
  },

  // Get single category
  get: async (id) => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data;
  },

  // Update category
  update: async (id, categoryData) => {
    const { data } = await apiClient.put(`/categories/${id}`, categoryData);
    return data;
  },

  // Delete category
  delete: async (id) => {
    const { data } = await apiClient.delete(`/categories/${id}`);
    return data;
  }
};
