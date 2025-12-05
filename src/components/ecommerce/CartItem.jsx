import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product;
  const isEnquiry = item.isEnquiry || (!item.price && item.price !== 0);
  const subtotal = isEnquiry ? 0 : item.price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(product._id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (product.stock > item.quantity) {
      onUpdateQuantity(product._id, item.quantity + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative">
      {/* Product Image and Info */}
      <div className="flex gap-3 sm:gap-4 flex-1">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex-1 min-w-0 sm:pr-8">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.title}</h3>
              {product.category && (
                <p className="text-xs sm:text-sm text-gray-500">{product.category.name}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(product._id)}
              className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 p-1 sm:absolute sm:top-3 sm:right-3"
              title="Remove item"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          {/* Price - Mobile Only */}
          <div className="sm:hidden mb-3">
            {isEnquiry ? (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                Enquiry Only
              </span>
            ) : (
              <span className="text-base font-bold text-blue-600">
                {product.currency === 'USD' ? '$' : '₹'}{item.price}
              </span>
            )}
          </div>

          {/* Stock Warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-orange-600 text-xs mb-2">Only {product.stock} left!</p>
          )}
        </div>
      </div>

      {/* Price, Quantity, and Subtotal Section - Desktop */}
      <div className="hidden sm:flex items-center gap-4 sm:gap-6">
        {/* Price */}
        <div className="flex items-center">
          {isEnquiry ? (
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded whitespace-nowrap">
              Enquiry Only
            </span>
          ) : (
            <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
              {product.currency === 'USD' ? '$' : '₹'}{item.price}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiMinus size={14} />
          </button>
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={!isEnquiry && product.stock <= item.quantity}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiPlus size={14} />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[100px]">
          {isEnquiry ? (
            <p className="text-sm text-gray-500 whitespace-nowrap">Contact for price</p>
          ) : (
            <>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
                {product.currency === 'USD' ? '$' : '₹'}{subtotal.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Quantity and Subtotal Section - Mobile Only */}
      <div className="sm:hidden flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">Qty:</span>
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiMinus size={14} />
          </button>
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            disabled={!isEnquiry && product.stock <= item.quantity}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiPlus size={14} />
          </button>
        </div>

        {/* Subtotal - Mobile */}
        <div className="text-right">
          {isEnquiry ? (
            <p className="text-xs text-gray-500">Contact for price</p>
          ) : (
            <>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="text-base font-bold text-gray-900">
                {product.currency === 'USD' ? '$' : '₹'}{subtotal.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
