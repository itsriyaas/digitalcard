import apiClient from './apiClient';

export const orderAPI = {
  // Create order
  create: async (orderData, sessionId) => {
    const { data } = await apiClient.post('/orders', orderData, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Get orders by catalogue (Admin)
  getByCatalogue: async (catalogueId, filters = {}) => {
    const { data } = await apiClient.get(`/orders/catalogue/${catalogueId}`, {
      params: filters
    });
    return data;
  },

  // Get single order
  get: async (id) => {
    const { data } = await apiClient.get(`/orders/single/${id}`);
    return data;
  },

  // Get user orders
  getUserOrders: async () => {
    const { data } = await apiClient.get('/orders/user');
    return data;
  },

  // Update order status
  updateStatus: async (id, orderStatus) => {
    const { data } = await apiClient.put(`/orders/${id}/status`, { orderStatus });
    return data;
  },

  // Update payment status
  updatePayment: async (id, paymentStatus, paymentId) => {
    const { data } = await apiClient.put(`/orders/${id}/payment`, {
      paymentStatus,
      paymentId
    });
    return data;
  }
};
