import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product;
  const subtotal = item.price * item.quantity;

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
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
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

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{product.title}</h3>
            {product.category && (
              <p className="text-sm text-gray-500">{product.category.name}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(product._id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Remove item"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-600">
              {product.currency === 'USD' ? '$' : '₹'}{item.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMinus size={14} />
            </button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={product.stock <= item.quantity}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-lg font-bold text-gray-900">
              {product.currency === 'USD' ? '$' : '₹'}{subtotal.toFixed(2)}
            </p>
          </div>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-orange-600 text-xs mt-2">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
};

export default CartItem;
