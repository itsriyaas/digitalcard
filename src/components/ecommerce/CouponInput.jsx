import React, { useState } from 'react';
import { FiTag, FiX } from 'react-icons/fi';

const CouponInput = ({ onApply, onRemove, appliedCoupon, loading, error, successMessage }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (couponCode.trim()) {
      onApply(couponCode.trim().toUpperCase());
    }
  };

  const handleRemove = () => {
    setCouponCode('');
    onRemove();
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <FiTag className="text-blue-600" />
        <h3 className="font-semibold text-gray-900">Apply Coupon</h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <FiTag className="text-green-600" />
            <div>
              <p className="font-medium text-green-800">{appliedCoupon.code}</p>
              <p className="text-sm text-green-600">Coupon applied successfully!</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleApply}
              disabled={!couponCode.trim() || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}

          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponInput;
