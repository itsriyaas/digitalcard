import apiClient from './apiClient';

export const catalogueAPI = {
  // Create catalogue
  create: async (catalogueData) => {
    const { data } = await apiClient.post('/catalogue', catalogueData);
    return data;
  },

  // Get user's catalogues
  getUserCatalogues: async () => {
    const { data } = await apiClient.get('/catalogue');
    return data;
  },

  // Get single catalogue
  get: async (id) => {
    const { data } = await apiClient.get(`/catalogue/${id}`);
    return data;
  },

  // Update catalogue
  update: async (id, catalogueData) => {
    const { data } = await apiClient.put(`/catalogue/${id}`, catalogueData);
    return data;
  },

  // Delete catalogue
  delete: async (id) => {
    const { data } = await apiClient.delete(`/catalogue/${id}`);
    return data;
  },

  // Get public catalogue
  getPublic: async (slug) => {
    const { data } = await apiClient.get(`/catalogue/public/${slug}`);
    return data;
  }
};
