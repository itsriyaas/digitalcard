import apiClient from './apiClient';

export const productAPI = {
  // Create product
  create: async (productData) => {
    const { data } = await apiClient.post('/products', productData);
    return data;
  },

  // Get products by catalogue
  getByCatalogue: async (catalogueId, filters = {}) => {
    const { data } = await apiClient.get(`/products/catalogue/${catalogueId}`, {
      params: filters
    });
    return data;
  },

  // Get single product
  get: async (id) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  // Update product
  update: async (id, productData) => {
    const { data } = await apiClient.put(`/products/${id}`, productData);
    return data;
  },

  // Delete product
  delete: async (id) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  // Bulk import
  bulkImport: async (catalogueId, products) => {
    const { data } = await apiClient.post('/products/bulk-import', {
      catalogueId,
      products
    });
    return data;
  }
};
