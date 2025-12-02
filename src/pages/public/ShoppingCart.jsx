import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart, applyCoupon, removeCoupon } from '../../features/cart/cartSlice';
import CartItem from '../../components/ecommerce/CartItem';
import CouponInput from '../../components/ecommerce/CouponInput';
import Loader from '../../components/common/Loader';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const ShoppingCart = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error, couponMessage } = useSelector((state) => state.cart);
  const { publicCatalogue } = useSelector((state) => state.catalogue);

  useEffect(() => {
    if (publicCatalogue?._id) {
      dispatch(fetchCart(publicCatalogue._id));
    }
  }, [dispatch, publicCatalogue]);

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateCartItem({
      catalogueId: publicCatalogue._id,
      productId,
      quantity
    }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({
      catalogueId: publicCatalogue._id,
      productId
    }));
  };

  const handleApplyCoupon = (couponCode) => {
    dispatch(applyCoupon({
      catalogueId: publicCatalogue._id,
      couponCode
    }));
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon(publicCatalogue._id));
  };

  const handleCheckout = () => {
    navigate(`/catalogue/${slug}/checkout`);
  };

  if (loading && !cart) return <Loader />;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/catalogue/${slug}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft />
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate(`/catalogue/${slug}`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span className="font-medium">₹{cart.subtotal.toFixed(2)}</span>
                  </div>

                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{cart.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₹{cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <CouponInput
                  onApply={handleApplyCoupon}
                  onRemove={handleRemoveCoupon}
                  appliedCoupon={cart.appliedCoupon}
                  loading={loading}
                  error={error}
                  successMessage={couponMessage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
