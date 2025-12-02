import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder } from '../../features/order/orderSlice';
import OrderStatusBadge from '../../components/ecommerce/OrderStatusBadge';
import Loader from '../../components/common/Loader';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';

const OrderConfirmation = () => {
  const { slug, orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentOrder, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);

  if (loading) return <Loader />;

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <button
            onClick={() => navigate(`/catalogue/${slug}`)}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <FiCheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We've sent a confirmation email to{' '}
            <span className="font-medium">{currentOrder.customer.email}</span>
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md">
            <span className="text-gray-700">Order Number:</span>
            <span className="font-bold text-blue-600 text-lg">{currentOrder.orderNumber}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Order Details</h2>
            <div className="flex gap-2">
              <OrderStatusBadge status={currentOrder.orderStatus} type="order" />
              <OrderStatusBadge status={currentOrder.paymentStatus} type="payment" />
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-md">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-blue-600">₹{item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{currentOrder.subtotal.toFixed(2)}</span>
            </div>

            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{currentOrder.discount.toFixed(2)}</span>
              </div>
            )}

            {currentOrder.appliedCoupon && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Coupon Code: {currentOrder.appliedCoupon.code}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between text-xl font-bold">
              <span>Total Paid</span>
              <span className="text-blue-600">₹{currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Name:</span> <span className="font-medium">{currentOrder.customer.name}</span></p>
              <p><span className="text-gray-600">Email:</span> <span className="font-medium">{currentOrder.customer.email}</span></p>
              <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{currentOrder.customer.phone}</span></p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold mb-3">Shipping Address</h3>
            <div className="text-sm">
              <p>{currentOrder.customer.address.street}</p>
              <p>{currentOrder.customer.address.city}, {currentOrder.customer.address.state}</p>
              <p>{currentOrder.customer.address.zipCode}</p>
              <p>{currentOrder.customer.address.country}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-bold mb-3">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">{currentOrder.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Status</p>
              <OrderStatusBadge status={currentOrder.paymentStatus} type="payment" />
            </div>
            {currentOrder.paymentId && (
              <div className="col-span-2">
                <p className="text-gray-600">Transaction ID</p>
                <p className="font-medium font-mono text-xs">{currentOrder.paymentId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/catalogue/${slug}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <FiHome />
            Continue Shopping
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            <FiPackage />
            Print Order
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>What's next?</strong> You'll receive an email confirmation shortly.
            We'll notify you when your order ships. You can track your order status by keeping this order number handy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
