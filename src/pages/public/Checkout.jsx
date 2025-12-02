import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../../features/cart/cartSlice';
import { createOrder } from '../../features/order/orderSlice';
import { paymentAPI } from '../../services/paymentAPI';
import Loader from '../../components/common/Loader';
import { FiLock } from 'react-icons/fi';

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { publicCatalogue } = useSelector((state) => state.catalogue);
  const { loading: orderLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (publicCatalogue?._id) {
      dispatch(fetchCart(publicCatalogue._id));
    }
  }, [dispatch, publicCatalogue]);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate(`/catalogue/${slug}/cart`);
    }
  }, [cart, navigate, slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomerData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomerData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customerData.name.trim()) newErrors.name = 'Name is required';
    if (!customerData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(customerData.email)) newErrors.email = 'Invalid email format';
    if (!customerData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!/^\d{10}$/.test(customerData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!customerData.address.street.trim()) newErrors['address.street'] = 'Address is required';
    if (!customerData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!customerData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!customerData.address.zipCode.trim()) newErrors['address.zipCode'] = 'Zip code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create order
      const orderResult = await dispatch(createOrder({
        catalogueId: publicCatalogue._id,
        customer: customerData,
        paymentMethod
      })).unwrap();

      const order = orderResult.data || orderResult;

      if (paymentMethod === 'cod') {
        // COD - Redirect to confirmation
        navigate(`/catalogue/${slug}/order/${order._id}`);
      } else if (paymentMethod === 'razorpay') {
        // Load Razorpay script
        const res = await loadRazorpayScript();
        if (!res) {
          alert('Razorpay SDK failed to load');
          return;
        }

        // Create Razorpay order
        const paymentData = await paymentAPI.createRazorpayOrder(order._id);

        const options = {
          key: paymentData.data.keyId,
          amount: paymentData.data.amount,
          currency: paymentData.data.currency,
          name: publicCatalogue.title,
          description: `Order #${order.orderNumber}`,
          order_id: paymentData.data.razorpayOrderId,
          handler: async function (response) {
            // Verify payment
            try {
              await paymentAPI.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              });

              navigate(`/catalogue/${slug}/order/${order._id}`);
            } catch (error) {
              alert('Payment verification failed');
            }
          },
          prefill: {
            name: customerData.name,
            email: customerData.email,
            contact: customerData.phone
          },
          theme: {
            color: publicCatalogue.customization?.primaryColor || '#3B82F6'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert('Payment failed: ' + response.error.description);
        });
        rzp.open();
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order: ' + (error.message || error || 'Unknown error'));
    }
  };

  if (cartLoading) return <Loader />;

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={customerData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors['address.street'] && <p className="text-red-600 text-sm mt-1">{errors['address.street']}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={customerData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['address.city'] && <p className="text-red-600 text-sm mt-1">{errors['address.city']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={customerData.address.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['address.state'] && <p className="text-red-600 text-sm mt-1">{errors['address.state']}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={customerData.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors['address.zipCode'] && <p className="text-red-600 text-sm mt-1">{errors['address.zipCode']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={customerData.address.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Razorpay (UPI, Cards, Netbanking)</p>
                    <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex gap-3 pb-3 border-b">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover rounded" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cart.subtotal.toFixed(2)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiLock />
                {orderLoading ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
