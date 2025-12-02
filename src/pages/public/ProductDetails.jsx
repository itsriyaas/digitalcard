import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../features/product/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Loader from '../../components/common/Loader';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetails = () => {
  const { slug, productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct, loading } = useSelector((state) => state.product);
  const { publicCatalogue } = useSelector((state) => state.catalogue);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    await dispatch(addToCart({
      catalogueId: publicCatalogue._id,
      productId: currentProduct._id,
      quantity
    }));
    navigate(`/catalogue/${slug}/cart`);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate(`/catalogue/${slug}/checkout`);
  };

  if (loading) return <Loader />;

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate(`/catalogue/${slug}`)}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  const isEnquiryOnly = !currentProduct.price && currentProduct.price !== 0;
  const displayPrice = currentProduct.discountPrice || currentProduct.price;
  const hasDiscount = currentProduct.discountPrice && currentProduct.discountPrice < currentProduct.price;
  const discountPercentage = hasDiscount
    ? Math.round(((currentProduct.price - currentProduct.discountPrice) / currentProduct.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/catalogue/${slug}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft />
            Back to Catalogue
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images & Videos */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              {currentProduct.images && currentProduct.images.length > 0 ? (
                <img
                  src={currentProduct.images[selectedImage]}
                  alt={currentProduct.title}
                  className="w-full h-96 object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${currentProduct.title} ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Videos */}
            {currentProduct.videos && currentProduct.videos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Videos</h3>
                <div className="space-y-4">
                  {currentProduct.videos.map((video, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <video
                        src={video}
                        controls
                        className="w-full h-64 object-contain"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              {currentProduct.category && (
                <p className="text-sm text-gray-500 mb-2">{currentProduct.category.name}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentProduct.title}</h1>

              {currentProduct.tags && currentProduct.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentProduct.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              {isEnquiryOnly ? (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    Contact for Price
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded">
                    Enquiry Only
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {currentProduct.currency === 'USD' ? '$' : '₹'}{displayPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        {currentProduct.currency === 'USD' ? '$' : '₹'}{currentProduct.price}
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {currentProduct.description && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{currentProduct.description}</p>
              </div>
            )}

            {currentProduct.sku && (
              <div className="mb-6">
                <p className="text-sm text-gray-500">SKU: {currentProduct.sku}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {currentProduct.stockAvailable ? (
                <>
                  {currentProduct.stock <= 10 && currentProduct.stock > 0 && (
                    <p className="text-orange-600 font-medium mb-2">
                      Only {currentProduct.stock} left in stock!
                    </p>
                  )}
                  <p className="text-green-600 font-medium">In Stock</p>
                </>
              ) : (
                <p className="text-red-600 font-bold text-lg">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            {currentProduct.stockAvailable && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                    disabled={quantity >= currentProduct.stock}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {currentProduct.stockAvailable && (
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    isEnquiryOnly
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  } py-3 rounded-md font-medium transition-colors`}
                >
                  <FiShoppingCart />
                  {isEnquiryOnly ? 'Add to Enquiry' : 'Add to Cart'}
                </button>
                {!isEnquiryOnly && (
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
