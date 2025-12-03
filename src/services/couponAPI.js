import apiClient from './apiClient';

export const couponAPI = {
  // Create coupon
  create: async (couponData) => {
    const { data } = await apiClient.post('/coupons', couponData);
    return data;
  },

  // Get coupons by catalogue
  getByCatalogue: async (catalogueId) => {
    const { data } = await apiClient.get(`/coupons/catalogue/${catalogueId}`);
    return data;
  },

  // Validate coupon
  validate: async (code, catalogueId, cartTotal) => {
    const { data } = await apiClient.post('/coupons/validate', {
      code,
      catalogueId,
      cartTotal
    });
    return data;
  },

  // Update coupon
  update: async (id, couponData) => {
    const { data } = await apiClient.put(`/coupons/${id}`, couponData);
    return data;
  },

  // Delete coupon
  delete: async (id) => {
    const { data } = await apiClient.delete(`/coupons/${id}`);
    return data;
  }
};
