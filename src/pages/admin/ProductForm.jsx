import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSave, FiX, FiUpload, FiTrash2, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { uploadMultipleFiles } from '../../services/uploadAPI';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { user } = useSelector((state) => state.auth);
  const token = user?.token || localStorage.getItem('token');

  const [formData, setFormData] = useState({
    catalogue: '',
    category: '',
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    stockAvailable: true,
    images: [],
    videos: [],
    sku: '',
    tags: '',
    status: 'active',
    isFeatured: false,
    currency: 'INR'
  });

  const [catalogues, setCatalogues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCatalogues();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (formData.catalogue) {
      fetchCategories(formData.catalogue);
    }
  }, [formData.catalogue]);

  const fetchCatalogues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalogue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCatalogues(response.data.data);
    } catch (error) {
      console.error('Error fetching catalogues:', error);
    }
  };

  const fetchCategories = async (catalogueId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories/catalogue/${catalogueId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The API returns both hierarchical and flat data
      setCategories(response.data.flat || response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const product = response.data.data;
      setFormData({
        catalogue: product.catalogue?._id || '',
        category: product.category?._id || '',
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        stockAvailable: product.stockAvailable !== undefined ? product.stockAvailable : true,
        images: product.images || [],
        videos: product.videos || [],
        sku: product.sku || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        status: product.status || 'active',
        isFeatured: product.isFeatured || false,
        currency: product.currency || 'INR'
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    try {
      setUploadingImages(true);
      setError('');

      const response = await uploadMultipleFiles(files);
      const imageUrls = response.files.map(file => `${import.meta.env.VITE_API_URL}${file.url}`);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls].slice(0, 5)
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 3) {
      setError('Maximum 3 videos allowed');
      return;
    }

    try {
      setUploadingVideos(true);
      setError('');

      const response = await uploadMultipleFiles(files);
      const videoUrls = response.files.map(file => `${import.meta.env.VITE_API_URL}${file.url}`);

      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, ...videoUrls].slice(0, 3)
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload videos');
    } finally {
      setUploadingVideos(false);
    }
  };

  const handleRemoveVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.catalogue) {
      setError('Please select a catalogue');
      return;
    }
    if (!formData.title) {
      setError('Please enter product title');
      return;
    }
    // Price is now optional - no validation needed

    try {
      setLoading(true);

      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        price: formData.price ? parseFloat(formData.price) : null,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock) || 0
      };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      navigate('/admin/products');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save product');
      setLoading(false);
    }
  };

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
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {isEditMode ? 'Update product details' : 'Fill in the details to add a product'}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
            >
              <FiX />
              Cancel
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catalogue <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="catalogue"
                    value={formData.catalogue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Catalogue</option>
                    {catalogues.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={!formData.catalogue}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Classic White T-Shirt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PROD-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="cotton, casual, summer"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Product Images</h2>

            {/* Upload Button */}
            <div className="mb-4">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages || formData.images.length >= 5}
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                  uploadingImages || formData.images.length >= 5
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                }`}>
                  <FiUpload className={uploadingImages ? 'animate-spin' : ''} />
                  <span className="text-sm text-gray-700">
                    {uploadingImages ? 'Uploading images...' : formData.images.length >= 5 ? 'Maximum 5 images reached' : `Upload Images (${formData.images.length}/5)`}
                  </span>
                </div>
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP (Max 50MB each)
              </p>
            </div>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Images ({formData.images.length}/5)
                  </p>
                  <p className="text-xs text-gray-500">
                    Hover over image to delete
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 rounded-md border-2 border-gray-300 overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Remove image"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium shadow">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Product Videos</h2>

            {/* Upload Button */}
            <div className="mb-4">
              <label className="block">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={uploadingVideos || formData.videos.length >= 3}
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                  uploadingVideos || formData.videos.length >= 3
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-green-300 hover:border-green-500 hover:bg-green-50'
                }`}>
                  <FiUpload className={uploadingVideos ? 'animate-spin' : ''} />
                  <span className="text-sm text-gray-700">
                    {uploadingVideos ? 'Uploading videos...' : formData.videos.length >= 3 ? 'Maximum 3 videos reached' : `Upload Videos (${formData.videos.length}/3)`}
                  </span>
                </div>
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Supported formats: MP4, WebM, MOV (Max 100MB each)
              </p>
            </div>

            {/* Video Previews */}
            {formData.videos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Videos ({formData.videos.length}/3)
                  </p>
                  <p className="text-xs text-gray-500">
                    Hover over video to delete
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-48 rounded-md border-2 border-gray-300 overflow-hidden bg-gray-100">
                        <video
                          src={video}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Remove video"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty for enquiry-only products"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if this product is for enquiry only (no direct purchase)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="399"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="stockAvailable"
                    checked={formData.stockAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Stock Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiStar className="text-yellow-500" />
                    Featured
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <FiSave />
              {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 sm:flex-initial px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
