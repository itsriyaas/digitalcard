import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicCatalogue } from '../../features/catalogue/catalogueSlice';
import { fetchProducts } from '../../features/product/productSlice';
import { fetchCategories } from '../../features/category/categorySlice';
import { addToCart, fetchCart } from '../../features/cart/cartSlice';
import ProductCard from '../../components/ecommerce/ProductCard';
import CategoryFilter from '../../components/ecommerce/CategoryFilter';
import Loader from '../../components/common/Loader';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';

const CatalogueLanding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { publicCatalogue, loading: catalogueLoading } = useSelector((state) => state.catalogue);
  const { products, loading: productsLoading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { cart } = useSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    dispatch(fetchPublicCatalogue(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (publicCatalogue?._id) {
      dispatch(fetchCategories(publicCatalogue._id));
      dispatch(fetchProducts({
        catalogueId: publicCatalogue._id,
        filters: { status: 'active' }
      }));
      dispatch(fetchCart(publicCatalogue._id));
    }
  }, [dispatch, publicCatalogue]);

  const handleAddToCart = async (product) => {
    await dispatch(addToCart({
      catalogueId: publicCatalogue._id,
      productId: product._id,
      quantity: 1
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || product.subcategory?._id === selectedSubcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const featuredProducts = products.filter(p => p.isFeatured && p.status === 'active');
  const cartItemCount = cart?.items?.length || 0;

  if (catalogueLoading) return <Loader />;

  if (!publicCatalogue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catalogue Not Found</h1>
          <p className="text-gray-600">The catalogue you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const primaryColor = publicCatalogue.customization?.primaryColor || '#3B82F6';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {publicCatalogue.logo && (
                <img src={publicCatalogue.logo} alt={publicCatalogue.title} className="h-12" />
              )}
              <h1 className="text-2xl font-bold text-gray-900">{publicCatalogue.title}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <button
                onClick={() => navigate(`/catalogue/${slug}/cart`)}
                className="relative p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FiShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner */}
      {publicCatalogue.banner && (
        <div className="h-64 overflow-hidden">
          <img src={publicCatalogue.banner} alt="Banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* About Section */}
      {publicCatalogue.about && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-3">About Us</h2>
            <p className="text-gray-600">{publicCatalogue.about}</p>
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                catalogueSlug={slug}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSelectCategory={setSelectedCategory}
              onSelectSubcategory={setSelectedSubcategory}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedCategory ? 'Filtered Products' : 'All Products'} ({filteredProducts.length})
              </h2>
            </div>

            {productsLoading ? (
              <Loader />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    catalogueSlug={slug}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 {publicCatalogue.title}. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Powered by E-Catalogue</p>
        </div>
      </footer>
    </div>
  );
};

export default CatalogueLanding;
