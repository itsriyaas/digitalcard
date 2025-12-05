import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchPublicCatalogue } from "../../features/catalogue/catalogueSlice";
import { fetchProducts } from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import { addToCart, fetchCart } from "../../features/cart/cartSlice";

import ProductCard from "../../components/ecommerce/ProductCard";
import Loader from "../../components/common/Loader";

import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { getFullUrl } from "../../utils/urlHelper";

const CatalogueLanding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { publicCatalogue, loading: catalogueLoading } = useSelector(
    (state) => state.catalogue
  );
  const { products, loading: productsLoading } = useSelector(
    (state) => state.product
  );
  const { categories } = useSelector((state) => state.category);
  const { cart } = useSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicCatalogue(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (publicCatalogue?._id) {
      dispatch(fetchCategories(publicCatalogue._id));
      dispatch(
        fetchProducts({
          catalogueId: publicCatalogue._id,
          filters: { status: "active" },
        })
      );
      dispatch(fetchCart(publicCatalogue._id));
    }
  }, [dispatch, publicCatalogue]);

  // Inject theme color dynamically
  useEffect(() => {
    const color = publicCatalogue?.customization?.primaryColor || "#6A0DAD";
    document.documentElement.style.setProperty("--primaryColor", color);
  }, [publicCatalogue]);

  const handleAddToCart = async (product) => {
    await dispatch(
      addToCart({
        catalogueId: publicCatalogue._id,
        productId: product._id,
        quantity: 1,
      })
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category?._id === selectedCategory : true;
    const matchesSearch = searchQuery
      ? product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cart?.items?.length || 0;
  const primaryColor = publicCatalogue?.customization?.primaryColor || "#6A0DAD";

  if (catalogueLoading) return <Loader />;

  if (!publicCatalogue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Catalogue Not Found
          </h1>
          <p className="text-gray-600">
            The catalogue you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white sticky top-0 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {publicCatalogue.logo && (
                <img
                  src={getFullUrl(publicCatalogue.logo)}
                  alt={publicCatalogue.title}
                  className="h-12"
                />
              )}
              <h1 className="text-xl md:text-2xl font-bold">{publicCatalogue.title}</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Search Bar */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primaryColor)]"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiSearch size={20} />
              </button>

              <button
                onClick={() => navigate(`/catalogue/${slug}/cart`)}
                className="relative p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FiShoppingCart size={20} className="md:hidden" />
                <FiShoppingCart size={22} className="hidden md:block" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (toggleable) */}
          {showMobileSearch && (
            <div className="md:hidden mt-3 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primaryColor)]"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          )}
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="relative hero-wave pb-10">
        {publicCatalogue.banner && (
          <img
            src={getFullUrl(publicCatalogue.banner)}
            className="w-full object-cover h-md-96"
            alt="Banner"
          />
        )}
      </div>

      {/* CATEGORY CIRCLES */}
<div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 lg:px-40 py-8 flex justify-center flex-wrap gap-6">
  {categories.map((cat) => (
    <div
      key={cat._id}
      className="cursor-pointer flex flex-col items-center"
      onClick={() => setSelectedCategory(cat._id)}
    >
      <div
        className="flex items-center justify-center rounded-full overflow-hidden 
                   border w-20 h-20 sm:w-24 sm:h-24"
        style={{
          borderColor: "var(--primaryColor)",
        }}
      >
        {cat.image ? (
          <img
            src={getFullUrl(cat.image)}
            alt={cat.name}
            className="w-full h-full object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl">📁</span>
          </div>
        )}
      </div>

      <p className="text-sm font-semibold mt-2 text-center">{cat.name}</p>
    </div>
  ))}
</div>



      {/* PRODUCTS SECTION TITLE */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--primaryColor)" }}
          >
            {selectedCategory
              ? categories.find((c) => c._id === selectedCategory)?.name
              : "Products"}
          </h2>

          {/* Clear Filters Button */}
          {(selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || searchQuery) && (
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {searchQuery && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2">
                Category: {categories.find((c) => c._id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {productsLoading ? (
          <Loader />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-600 py-12 bg-white rounded-md shadow">
            <p className="text-lg font-semibold mb-2">No products found</p>
            {(searchQuery || selectedCategory) && (
              <p className="text-sm">
                Try adjusting your filters or search term
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            {(searchQuery || selectedCategory) && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  catalogueSlug={slug}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; {new Date().getFullYear()} {publicCatalogue.title}. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Powered by E-Catalogue</p>
      </footer>
    </div>
  );
};

export default CatalogueLanding;
