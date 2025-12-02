import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiFolder, FiUpload, FiX } from 'react-icons/fi';
import axios from 'axios';
import { uploadSingleFile } from '../../services/uploadAPI';

const CategoryList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [selectedCatalogue, setSelectedCatalogue] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    catalogue: '',
    name: '',
    description: '',
    image: ''
  });

  const token = user?.token || localStorage.getItem('token');

  useEffect(() => {
    fetchCatalogues();
  }, []);

  useEffect(() => {
    if (selectedCatalogue) {
      fetchCategories();
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories/catalogue/${selectedCatalogue}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The API returns both hierarchical and flat data
      setCategories(response.data.flat || response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        catalogue: category.catalogue?._id || selectedCatalogue,
        name: category.name,
        description: category.description || '',
        image: category.image || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        catalogue: selectedCatalogue,
        name: '',
        description: '',
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      catalogue: selectedCatalogue,
      name: '',
      description: '',
      image: ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await uploadSingleFile(file);
      const imageUrl = `${import.meta.env.VITE_API_URL}${response.file.url}`;

      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/categories/${editingCategory._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/categories`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Organize products into categories
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={!selectedCatalogue}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FiPlus />
          Add Category
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

      {/* Categories Grid */}
      {!selectedCatalogue ? (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Please select a catalogue to view categories
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <FiFolder className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            No categories yet. Add your first category.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Category Image */}
              <div className="relative h-32 bg-gradient-to-br from-blue-400 to-purple-500">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiFolder size={40} className="text-white opacity-50" />
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="T-Shirts"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Category description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>

                  {/* Image Preview or Upload Button */}
                  {formData.image ? (
                    <div className="relative">
                      <div className="relative w-full h-48 rounded-md border-2 border-gray-300 overflow-hidden bg-gray-100">
                        <img
                          src={formData.image}
                          alt="Category preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                        title="Remove image"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
                        uploadingImage
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                          : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}>
                        <FiUpload className={uploadingImage ? 'animate-spin' : ''} />
                        <span className="text-sm text-gray-700">
                          {uploadingImage ? 'Uploading...' : 'Upload Category Image'}
                        </span>
                      </div>
                    </label>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingCategory ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
