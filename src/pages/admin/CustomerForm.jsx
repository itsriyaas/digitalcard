import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { user } = useSelector((state) => state.auth);
  const token = user?.token || localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    subscription: {
      plan: 'none',
      status: 'pending',
      startDate: '',
      endDate: '',
      amount: 0,
      autoRenew: false
    },
    catalogueLimit: -1,
    cardLimit: -1,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [id]);

  // Debug: log formData changes
  useEffect(() => {
    console.log('FormData catalogueLimit:', formData.catalogueLimit);
  }, [formData.catalogueLimit]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const customer = response.data.data;
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        password: '', // Never populate password
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        subscription: customer.subscription || {
          plan: 'none',
          status: 'pending',
          startDate: '',
          endDate: '',
          amount: 0,
          autoRenew: false
        },
        catalogueLimit: customer.catalogueLimit !== undefined ? customer.catalogueLimit : -1,
        cardLimit: customer.cardLimit !== undefined ? customer.cardLimit : -1,
        isActive: customer.isActive
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log('handleChange called:', { name, value, type });

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (name.startsWith('subscription.')) {
      const subField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          [subField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      let finalValue = type === 'checkbox' ? checked : value;

      // Convert catalogueLimit and cardLimit to integer
      if (name === 'catalogueLimit') {
        finalValue = parseInt(value, 10);
        console.log('CatalogueLimit parsed:', { original: value, parsed: finalValue, type: typeof finalValue });
      }
      if (name === 'cardLimit') {
        finalValue = parseInt(value, 10);
        console.log('CardLimit parsed:', { original: value, parsed: finalValue, type: typeof finalValue });
      }

      setFormData(prev => {
        const newState = {
          ...prev,
          [name]: finalValue
        };
        console.log('New formData state:', newState);
        return newState;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name) {
      setError('Please enter customer name');
      return;
    }
    if (!formData.email) {
      setError('Please enter customer email');
      return;
    }
    if (!isEditMode && !formData.password) {
      setError('Please enter customer password');
      return;
    }

    try {
      setLoading(true);

      const payload = { ...formData };

      // Ensure catalogueLimit is a number
      payload.catalogueLimit = parseInt(payload.catalogueLimit, 10);
      if (isNaN(payload.catalogueLimit)) {
        payload.catalogueLimit = -1;
      }

      // Ensure cardLimit is a number
      payload.cardLimit = parseInt(payload.cardLimit, 10);
      if (isNaN(payload.cardLimit)) {
        payload.cardLimit = -1;
      }

      console.log('Submitting payload with catalogueLimit:', payload.catalogueLimit, typeof payload.catalogueLimit);
      console.log('Submitting payload with cardLimit:', payload.cardLimit, typeof payload.cardLimit);

      // Calculate end date if plan is set and start date exists
      if (formData.subscription.plan !== 'none' && formData.subscription.startDate && !formData.subscription.endDate) {
        const startDate = new Date(formData.subscription.startDate);
        let endDate;

        if (formData.subscription.plan === 'monthly') {
          endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        } else if (formData.subscription.plan === 'yearly') {
          endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        }

        payload.subscription.endDate = endDate?.toISOString().split('T')[0];
      }

      if (isEditMode) {
        // Don't send password if it's empty in edit mode
        if (!payload.password) {
          delete payload.password;
        }
        delete payload.email; // Don't allow email change

        await axios.put(`${import.meta.env.VITE_API_URL}/api/customers/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/customers`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      navigate('/admin/customers');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save customer');
      setLoading(false);
    }
  };

  // Auto-calculate end date when plan or start date changes
  useEffect(() => {
    if (formData.subscription.plan !== 'none' && formData.subscription.startDate) {
      const startDate = new Date(formData.subscription.startDate);
      let endDate;

      if (formData.subscription.plan === 'monthly') {
        endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
      } else if (formData.subscription.plan === 'yearly') {
        endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
      }

      if (endDate) {
        setFormData(prev => ({
          ...prev,
          subscription: {
            ...prev.subscription,
            endDate: endDate.toISOString().split('T')[0]
          }
        }));
      }
    }
  }, [formData.subscription.plan, formData.subscription.startDate]);

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode ? 'Update customer details and subscription' : 'Create a new customer account'}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/customers')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FiX />
              Cancel
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="john@example.com"
                />
              </div>

              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catalogue Limit
                </label>
                <select
                  name="catalogueLimit"
                  value={String(formData.catalogueLimit ?? -1)}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="-1">Unlimited</option>
                  <option value="0">No Catalogues</option>
                  <option value="1">1 Catalogue</option>
                  <option value="2">2 Catalogues</option>
                  <option value="3">3 Catalogues</option>
                  <option value="5">5 Catalogues</option>
                  <option value="10">10 Catalogues</option>
                  <option value="20">20 Catalogues</option>
                  <option value="50">50 Catalogues</option>
                  <option value="100">100 Catalogues</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Set the maximum number of catalogues this customer can create
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Limit
                </label>
                <select
                  name="cardLimit"
                  value={String(formData.cardLimit ?? -1)}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="-1">Unlimited</option>
                  <option value="0">No Cards</option>
                  <option value="1">1 Card</option>
                  <option value="2">2 Cards</option>
                  <option value="3">3 Cards</option>
                  <option value="5">5 Cards</option>
                  <option value="10">10 Cards</option>
                  <option value="20">20 Cards</option>
                  <option value="50">50 Cards</option>
                  <option value="100">100 Cards</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Set the maximum number of cards this customer can create
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Account Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  name="subscription.plan"
                  value={formData.subscription.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">No Plan</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="subscription.status"
                  value={formData.subscription.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="subscription.startDate"
                  value={formData.subscription.startDate?.split('T')[0] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="subscription.endDate"
                  value={formData.subscription.endDate?.split('T')[0] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-calculated based on plan and start date</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="subscription.amount"
                  value={formData.subscription.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="subscription.autoRenew"
                    checked={formData.subscription.autoRenew}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto Renew</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <FiSave />
              {loading ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/customers')}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
