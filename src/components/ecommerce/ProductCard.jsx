import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, catalogueSlug, onAddToCart }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/catalogue/${catalogueSlug}/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Strip HTML tags from description for preview
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isEnquiryOnly = !product.price && product.price !== 0;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleProductClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        {isEnquiryOnly && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            Enquiry Only
          </span>
        )}
        {!product.stockAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{stripHtml(product.description)}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEnquiryOnly ? (
              <span className="text-lg font-semibold text-green-600">
                Contact for Price
              </span>
            ) : (
              <>
                <span className="text-xl font-bold text-blue-600">
                  {product.currency === 'USD' ? '$' : '₹'}{displayPrice}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.currency === 'USD' ? '$' : '₹'}{product.price}
                  </span>
                )}
              </>
            )}
          </div>

          {product.stockAvailable && onAddToCart && (
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {isEnquiryOnly ? 'Enquire' : 'Add to Cart'}
            </button>
          )}
        </div>

        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <p className="text-orange-600 text-xs mt-2">Only {product.stock} left in stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
