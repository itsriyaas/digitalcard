import apiClient from './apiClient';

export const paymentAPI = {
  // Razorpay
  createRazorpayOrder: async (orderId) => {
    const { data } = await apiClient.post('/payment/razorpay/create', { orderId });
    return data;
  },

  verifyRazorpayPayment: async (paymentData) => {
    const { data } = await apiClient.post('/payment/razorpay/verify', paymentData);
    return data;
  },

  // Stripe
  createStripeIntent: async (orderId) => {
    const { data } = await apiClient.post('/payment/stripe/create', { orderId });
    return data;
  },

  verifyStripePayment: async (paymentData) => {
    const { data } = await apiClient.post('/payment/stripe/verify', paymentData);
    return data;
  },

  // PayPal
  createPayPalOrder: async (orderId) => {
    const { data } = await apiClient.post('/payment/paypal/create', { orderId });
    return data;
  },

  capturePayPalPayment: async (paymentData) => {
    const { data } = await apiClient.post('/payment/paypal/capture', paymentData);
    return data;
  },

  // Get payment
  getByOrder: async (orderId) => {
    const { data } = await apiClient.get(`/payment/order/${orderId}`);
    return data;
  }
};
