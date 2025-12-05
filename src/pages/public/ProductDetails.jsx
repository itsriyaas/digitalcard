import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../features/product/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Loader from '../../components/common/Loader';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { getFullUrl } from '../../utils/urlHelper';

const ProductDetails = () => {
  const { slug, productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct, loading } = useSelector((state) => state.product);
  const { publicCatalogue } = useSelector((state) => state.catalogue);

  const [quantity, setQuantity] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState({ type: 'image', index: 0 });
  const themeColor = publicCatalogue?.customization?.primaryColor || "#6A0DAD";
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    const primary = publicCatalogue?.customization?.primaryColor || "#6A0DAD";
    const fontStyle = publicCatalogue?.customization?.fontStyle || "sans";
    document.documentElement.style.setProperty("--primaryColor", primary);

    // Map font styles to Tailwind font families
    const fontMap = {
      'sans': 'ui-sans-serif, system-ui, sans-serif',
      'serif': 'ui-serif, Georgia, serif',
      'mono': 'ui-monospace, monospace',
      'inter': 'Inter, sans-serif',
      'roboto': 'Roboto, sans-serif',
      'poppins': 'Poppins, sans-serif',
      'opensans': 'Open Sans, sans-serif',
      'lato': 'Lato, sans-serif',
      'montserrat': 'Montserrat, sans-serif',
      'playfair': 'Playfair Display, serif',
      'merriweather': 'Merriweather, serif',
      'raleway': 'Raleway, sans-serif',
      'ubuntu': 'Ubuntu, sans-serif',
    };

    document.documentElement.style.fontFamily = fontMap[fontStyle] || fontMap['sans'];
  }, [publicCatalogue]);



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
    <div className="min-h-screen bg-white">

      {/* Top Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/catalogue/${slug}`)}
            className="flex items-center gap-2 text-[var(--primaryColor)] hover:underline"
          >
            <FiArrowLeft />
            Back to Catalogue
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT — IMAGE DISPLAY */}
          <div>
            {/* Large Main Image Box with Purple Background */}
            {/* Main Media Viewer (Image or Video) */}
            <div
              className="zoom-container overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: themeColor }}
            >
              {/* Image */}
              {selectedMedia.type === "image" && currentProduct.images?.length > 0 && (
                <img
                  src={currentProduct.images[selectedMedia.index]}
                  alt="product"
                  className="zoom-image w-full h-96 object-contain bg-white"
                />
              )}

              {/* Video */}
              {selectedMedia.type === "video" && currentProduct.videos?.length > 0 && (
                <video
                  src={getFullUrl(currentProduct.videos[selectedMedia.index])}
                  controls
                  className="w-full h-96 object-contain bg-white"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>


            {/* Thumbnail Strip */}
            {/* Image Thumbnails */}
            {currentProduct.images?.map((image, i) => (
              <button
                key={`img-${i}`}
                onClick={() => setSelectedMedia({ type: "image", index: i })}
                className={`w-20 h-20 mt-5 me-2 rounded-md border-2 overflow-hidden transition 
        ${selectedMedia.type === "image" && selectedMedia.index === i
                    ? "border-[var(--primaryColor)]"
                    : "border-gray-300"
                  }`}
              >
                <img
                  src={image}
                  className="w-full h-full object-cover"
                  alt="thumb"
                />
              </button>
            ))}

            {/* Video Thumbnails */}
            {currentProduct.videos?.map((video, i) => (
              <button
                key={`vid-${i}`}
                onClick={() => setSelectedMedia({ type: "video", index: i })}
                className={`w-20 h-20 rounded-md border-2 relative overflow-hidden transition
        ${selectedMedia.type === "video" && selectedMedia.index === i
                    ? "border-[var(--primaryColor)]"
                    : "border-gray-300"
                  }`}
              >
                {/* Video Thumbnail Preview */}
                <video
                  src={getFullUrl(video)}
                  className="w-full h-full object-cover opacity-60"
                  muted
                />

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                    <svg
                      width="20"
                      height="20"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-6">

            {/* Category */}
            {currentProduct?.category && (
              <p className="text-sm text-gray-500">
                {currentProduct.category.name}
              </p>
            )}

            {/* Title */}
            <h1
              className="text-3xl font-bold"
              style={{
                color: "var(--primaryColor)",
              }}
            >
              {currentProduct.title}
            </h1>

            {/* Tags */}
            {currentProduct.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentProduct.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price Section */}
            <div className="mt-3">
              {!isEnquiryOnly ? (
                <div className="flex items-center gap-3">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: themeColor }}
                  >
                    ₹ {displayPrice}
                  </p>

                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{currentProduct.price}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-xl font-semibold text-green-600">
                  Contact for Price
                </p>
              )}
            </div>

            {/* SKU */}
            {currentProduct.sku && (
              <p className="text-sm text-gray-600">
                <strong>SKU:</strong> {currentProduct.sku}
              </p>
            )}

            {/* Stock Status */}
            <div className="mt-4">
              {currentProduct?.stockAvailable === true ? (
                <>
                  {currentProduct.stock <= 10 && currentProduct.stock > 0 && (
                    <p className="text-orange-600 font-medium">
                      Only {currentProduct.stock} left in stock!
                    </p>
                  )}
                  <p className="text-green-600 font-bold">In Stock</p>
                </>
              ) : (
                <p className="text-red-600 font-bold text-lg">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            {currentProduct.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-600 mb-2">
                  Description
                </h2>
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentProduct.description }}
                />
              </div>
            )}

            {/* Product Attributes (NWT, GWT, Diamond Wt, etc) */}
            <div className="space-y-1 text-gray-700 mt-2">
              {currentProduct.weight && (
                <p>
                  <strong>Weight:</strong> {currentProduct.weight}
                </p>
              )}

              {currentProduct.attributes?.map((attr, idx) => (
                <p key={idx}>
                  <strong>{attr.label}:</strong> {attr.value}
                </p>
              ))}

              {/* SAMPLE FOR JEWELLERY ATTRIBUTES */}
              {currentProduct.nwt && <p><strong>N.W.T:</strong> {currentProduct.nwt}</p>}
              {currentProduct.gwt && <p><strong>G.W.T:</strong> {currentProduct.gwt}</p>}
              {currentProduct.diamondWt && (
                <p><strong>Diamond Weight:</strong> {currentProduct.diamondWt}</p>
              )}
              {currentProduct.dpc && <p><strong>D.pc:</strong> {currentProduct.dpc}</p>}
            </div>

            {/* Quantity Selector */}
            {currentProduct.stockAvailable && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Quantity
                </h3>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-md flex items-center justify-center"
                  >
                    <FiMinus />
                  </button>

                  <span className="text-xl font-semibold">{quantity}</span>

                  <button
                    onClick={() =>
                      setQuantity(Math.min(currentProduct.stock, quantity + 1))
                    }
                    className="w-10 h-10 border rounded-md flex items-center justify-center"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            )}

            {/* ADD TO CART BUTTON */}
            {currentProduct.stockAvailable && (
              <button
                onClick={handleAddToCart}
                className="w-full py-4 mt-6 rounded-full text-white text-lg font-semibold shadow-lg flex items-center justify-center gap-3"
                style={{ backgroundColor: themeColor }}
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};

export default ProductDetails;
