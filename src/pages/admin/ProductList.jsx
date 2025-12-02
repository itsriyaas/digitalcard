import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import axios from 'axios';

const ProductList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [products, setProducts] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatalogue, setSelectedCatalogue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const token = user?.token || localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch catalogues
      const catalogueRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/catalogue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCatalogues(catalogueRes.data.data);

      // Fetch all products
      const productRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(productRes.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCatalogue = !selectedCatalogue || product.catalogue?._id === selectedCatalogue;
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;

    return matchesSearch && matchesCatalogue && matchesCategory && matchesStatus;
  });

  if (loading) {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isAdmin ? 'All Products' : 'Products'}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isAdmin ? 'View and manage all products' : 'Manage your catalogue products'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <FiPlus />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Catalogue Filter */}
          <select
            value={selectedCatalogue}
            onChange={(e) => setSelectedCatalogue(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Catalogues</option>
            {catalogues.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.title}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {searchTerm || selectedCatalogue || selectedCategory || selectedStatus
              ? 'No products found matching your filters.'
              : 'No products yet. Add your first product to get started.'}
          </p>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><div class="text-center"><svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="mt-2 text-sm">No Image</p></div></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm">No Image</p>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-500 text-white' :
                    product.status === 'draft' ? 'bg-gray-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {product.status === 'active' ? 'Active' :
                     product.status === 'draft' ? 'Draft' : 'Out of Stock'}
                  </span>
                </div>

                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ⭐ Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{product.title}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">
                  {product.catalogue?.title || 'N/A'} • {product.category?.name || 'Uncategorized'}
                </p>

                {/* Show owner info for admin */}
                {isAdmin && product.catalogue?.user && (
                  <div className="mb-2 pb-2 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Owner:</p>
                    <p className="text-xs font-medium text-gray-700">{product.catalogue.user.name}</p>
                    {product.catalogue.user.role === 'customer' && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        Customer
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="mb-3">
                  {product.discountPrice && product.discountPrice < product.price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">
                        {product.currency === 'USD' ? '$' : '₹'}{product.discountPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.currency === 'USD' ? '$' : '₹'}{product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {product.currency === 'USD' ? '$' : '₹'}{product.price}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="mb-3">
                  <span className={`text-xs ${product.stockAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stockAvailable ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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

      {/* Results Count */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  );
};

export default ProductList;
