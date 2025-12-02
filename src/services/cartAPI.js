import apiClient from './apiClient';

export const cartAPI = {
  // Get cart
  get: async (catalogueId, sessionId) => {
    const { data } = await apiClient.get(`/cart/${catalogueId}`, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Add to cart
  add: async (catalogueId, productId, quantity, sessionId) => {
    const { data } = await apiClient.post('/cart/add', {
      catalogueId,
      productId,
      quantity
    }, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Update cart item
  update: async (catalogueId, productId, quantity, sessionId) => {
    const { data } = await apiClient.put('/cart/update', {
      catalogueId,
      productId,
      quantity
    }, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Remove from cart
  remove: async (catalogueId, productId, sessionId) => {
    const { data } = await apiClient.delete(`/cart/remove/${productId}`, {
      data: { catalogueId },
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Apply coupon
  applyCoupon: async (catalogueId, couponCode, sessionId) => {
    const { data } = await apiClient.post('/cart/apply-coupon', {
      catalogueId,
      couponCode
    }, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Remove coupon
  removeCoupon: async (catalogueId, sessionId) => {
    const { data } = await apiClient.post('/cart/remove-coupon', {
      catalogueId
    }, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  },

  // Clear cart
  clear: async (catalogueId, sessionId) => {
    const { data } = await apiClient.delete(`/cart/${catalogueId}`, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    });
    return data;
  }
};
