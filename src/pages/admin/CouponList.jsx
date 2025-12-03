import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiTag, FiPercent, FiDollarSign, FiCalendar, FiX, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const CouponList = () => {
  const { user } = useSelector((state) => state.auth);

  const [coupons, setCoupons] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [selectedCatalogue, setSelectedCatalogue] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    catalogue: '',
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minCartValue: '',
    maxDiscount: '',
    validUntil: '',
    neverExpire: true,
    maxUsage: '',
    isActive: true
  });

  const token = user?.token || localStorage.getItem('token');

  useEffect(() => {
    fetchCatalogues();
  }, []);

  useEffect(() => {
    if (selectedCatalogue) {
      fetchCoupons();
    }
  }, [selectedCatalogue]);

  const fetchCatalogues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalogue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCatalogues(response.data.data);
      if (response.data.data.length > 0 && !selectedCatalogue) {
        setSelectedCatalogue(response.data.data[0]._id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching catalogues:', error);
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coupons/catalogue/${selectedCatalogue}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoupons(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setCoupons([]);
      setLoading(false);
    }
  };

  const handleOpenSidebar = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        catalogue: coupon.catalogue || selectedCatalogue,
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minCartValue: coupon.minCartValue || '',
        maxDiscount: coupon.maxDiscount || '',
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        neverExpire: !coupon.validUntil,
        maxUsage: coupon.maxUsage || '',
        isActive: coupon.isActive
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        catalogue: selectedCatalogue,
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minCartValue: '',
        maxDiscount: '',
        validUntil: '',
        neverExpire: true,
        maxUsage: '',
        isActive: true
      });
    }
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        validUntil: formData.neverExpire ? null : formData.validUntil,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
        discountValue: parseFloat(formData.discountValue),
        minCartValue: formData.minCartValue ? parseFloat(formData.minCartValue) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null
      };

      if (editingCoupon) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/coupons/${editingCoupon._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/coupons`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      handleCloseSidebar();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never Expires';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCouponExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date() > new Date(validUntil);
  };

  if (loading && catalogues.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Create and manage discount coupons
          </p>
        </div>
        <button
          onClick={() => handleOpenSidebar()}
          disabled={!selectedCatalogue}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FiPlus />
          Add Coupon
        </button>
      </div>

      {/* Catalogue Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Catalogue
        </label>
        <select
          value={selectedCatalogue}
          onChange={(e) => setSelectedCatalogue(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a catalogue</option>
          {catalogues.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </select>
      </div>

      {/* Coupons Grid */}
      {!selectedCatalogue ? (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Please select a catalogue to view coupons
          </p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <FiTag className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            No coupons yet. Create your first coupon.
          </p>
          <button
            onClick={() => handleOpenSidebar()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Coupon Header */}
              <div className={`p-4 ${coupon.isActive && !isCouponExpired(coupon.validUntil) ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-400'}`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <FiTag size={24} />
                    <span className="font-bold text-xl">{coupon.code}</span>
                  </div>
                  {coupon.isActive && !isCouponExpired(coupon.validUntil) ? (
                    <span className="bg-white text-green-600 px-2 py-1 rounded text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="bg-white text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Coupon Info */}
              <div className="p-4">
                {coupon.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{coupon.description}</p>
                )}

                {/* Discount Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {coupon.discountType === 'percentage' ? (
                      <>
                        <FiPercent className="text-blue-600" />
                        <span className="font-bold text-2xl text-blue-600">
                          {coupon.discountValue}% OFF
                        </span>
                      </>
                    ) : (
                      <>
                        <FiDollarSign className="text-blue-600" />
                        <span className="font-bold text-2xl text-blue-600">
                          ${coupon.discountValue} OFF
                        </span>
                      </>
                    )}
                  </div>
                  {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                    <p className="text-xs text-gray-500">Max discount: ${coupon.maxDiscount}</p>
                  )}
                  {coupon.minCartValue > 0 && (
                    <p className="text-xs text-gray-500">Min cart value: ${coupon.minCartValue}</p>
                  )}
                </div>

                {/* Expiry Info */}
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <FiCalendar className="text-gray-400" />
                  <span className={isCouponExpired(coupon.validUntil) ? 'text-red-600' : 'text-gray-700'}>
                    {formatDate(coupon.validUntil)}
                  </span>
                </div>

                {/* Usage Info */}
                <div className="mb-3 text-sm text-gray-600">
                  <span>Used: {coupon.usageCount || 0}</span>
                  {coupon.maxUsage && (
                    <span> / {coupon.maxUsage}</span>
                  )}
                  {!coupon.maxUsage && (
                    <span> (Unlimited)</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenSidebar(coupon)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sidebar Form */}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseSidebar}
          ></div>

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                </h2>
                <button
                  onClick={handleCloseSidebar}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="SAVE20"
                  />
                  <p className="mt-1 text-xs text-gray-500">Letters and numbers only</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20% off on all products"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Fixed Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.discountType === 'percentage' ? '20' : '10'}
                  />
                </div>

                {/* Max Discount (for percentage) */}
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Discount Amount ($)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50"
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional: Cap the maximum discount</p>
                  </div>
                )}

                {/* Min Cart Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Cart Value ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minCartValue}
                    onChange={(e) => setFormData({ ...formData, minCartValue: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                {/* Never Expire Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="neverExpire"
                    checked={formData.neverExpire}
                    onChange={(e) => setFormData({ ...formData, neverExpire: e.target.checked, validUntil: '' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="neverExpire" className="ml-2 text-sm font-medium text-gray-700">
                    Never Expire
                  </label>
                </div>

                {/* Expiry Date */}
                {!formData.neverExpire && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date {!formData.neverExpire && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      required={!formData.neverExpire}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Max Usage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unlimited"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave empty for unlimited usage</p>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseSidebar}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CouponList;
