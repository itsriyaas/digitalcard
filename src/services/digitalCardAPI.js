import apiClient from './apiClient';

export const digitalCardAPI = {
  // Create digital card
  create: async (cardData) => {
    const { data } = await apiClient.post('/digital-cards', cardData);
    return data;
  },

  // Get user's digital cards
  getUserCards: async () => {
    const { data } = await apiClient.get('/digital-cards');
    return data;
  },

  // Get single digital card
  get: async (id) => {
    const { data } = await apiClient.get(`/digital-cards/${id}`);
    return data;
  },

  // Get public digital card
  getPublic: async (slug) => {
    const { data } = await apiClient.get(`/digital-cards/public/${slug}`);
    return data;
  },

  // Update digital card
  update: async (id, cardData) => {
    const { data} = await apiClient.put(`/digital-cards/${id}`, cardData);
    return data;
  },

  // Delete digital card
  delete: async (id) => {
    const { data } = await apiClient.delete(`/digital-cards/${id}`);
    return data;
  },

  // Toggle publish status
  togglePublish: async (id) => {
    const { data } = await apiClient.patch(`/digital-cards/${id}/publish`);
    return data;
  },

  // Record enquiry
  recordEnquiry: async (slug) => {
    const { data } = await apiClient.post(`/digital-cards/${slug}/enquiry`);
    return data;
  }
};
