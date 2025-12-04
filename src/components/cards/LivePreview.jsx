import React from 'react';
import { FaStar, FaQuoteLeft, FaTag, FaPercent } from 'react-icons/fa';

const LivePreview = ({ cardData }) => {
  const {
    title = 'Your Card Title',
    about = 'Your business description goes here...',
    logo,
    template = {},
    customization = {},
    coverMedia,
    gallery = [],
    products = [],
    testimonials = [],
    offers = [],
    buttons = []
  } = cardData || {};

  const colorTheme = customization.colorTheme || {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA'
  };

  const getIconComponent = (iconId) => {
    const icons = {
      phone: '📞',
      email: '✉️',
      whatsapp: '💬',
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
      twitter: '🐦',
      youtube: '🎥',
      website: '🌐',
      link: '🔗'
    };
    return icons[iconId] || '🔗';
  };

  const getButtonStyle = (style) => {
    const styles = {
      primary: { bg: colorTheme.primary, text: '#FFFFFF' },
      secondary: { bg: '#6B7280', text: '#FFFFFF' },
      outline: { bg: 'transparent', text: colorTheme.primary, border: colorTheme.primary },
      success: { bg: '#10B981', text: '#FFFFFF' },
      danger: { bg: '#EF4444', text: '#FFFFFF' },
      dark: { bg: '#111827', text: '#FFFFFF' }
    };
    return styles[style] || styles.primary;
  };

  const borderRadius = customization.borderRadius || 8;
  const spacing = customization.spacing || 'normal';
  const spacingMap = {
    compact: '0.5rem',
    normal: '1rem',
    relaxed: '1.5rem',
    loose: '2rem'
  };

  return (
    <div className="h-full bg-gray-100 overflow-auto">
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-4 py-3 z-10">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Preview
        </h3>
      </div>

      <div className="p-4">
        <div
          className="max-w-2xl mx-auto bg-white shadow-lg overflow-hidden"
          style={{
            borderRadius: `${borderRadius}px`,
            backgroundColor: customization.backgroundColor || '#FFFFFF'
          }}
        >
          {coverMedia && (
            <div className="w-full h-64 bg-gray-200">
              {coverMedia.type === 'image' ? (
                <img
                  src={coverMedia.url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={coverMedia.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
          )}

          <div style={{ padding: spacingMap[spacing] }}>
            {logo && (
              <div className="flex justify-center mb-4">
                <img
                  src={logo.startsWith('http') ? logo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${logo}`}
                  alt="Company Logo"
                  className="h-20 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load:', logo);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="text-center mb-6">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: colorTheme.primary }}
              >
                {title}
              </h1>
              <p className="text-gray-600">{about}</p>
            </div>

            {buttons.length > 0 && (
              <div className="mb-6 space-y-2">
                {buttons.map((button, index) => {
                  const btnStyle = getButtonStyle(button.style);
                  return (
                    <button
                      key={button.id || index}
                      className="w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: btnStyle.bg,
                        color: btnStyle.text,
                        border: btnStyle.border ? `2px solid ${btnStyle.border}` : 'none',
                        borderRadius: `${borderRadius}px`
                      }}
                    >
                      <span>{getIconComponent(button.icon)}</span>
                      {button.label}
                    </button>
                  );
                })}
              </div>
            )}

            {gallery.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((image, index) => (
                    <div
                      key={image.id || index}
                      className="relative overflow-hidden bg-gray-200"
                      style={{ borderRadius: `${borderRadius}px` }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || 'Gallery'}
                        className="w-full h-32 object-cover"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {products.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Products
                </h2>
                <div className="space-y-3">
                  {products.map((product, index) => (
                    <div
                      key={product.id || index}
                      className="border-2 border-gray-200 p-4 flex gap-3"
                      style={{ borderRadius: `${borderRadius}px` }}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover"
                          style={{ borderRadius: `${borderRadius / 2}px` }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                        <p
                          className="text-lg font-bold"
                          style={{ color: colorTheme.primary }}
                        >
                          {product.currency === 'USD' && '$'}
                          {product.currency === 'EUR' && '€'}
                          {product.currency === 'GBP' && '£'}
                          {product.currency === 'INR' && '₹'}
                          {product.currency === 'JPY' && '¥'}
                          {product.price}
                        </p>
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {offers.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Special Offers
                </h2>
                <div className="space-y-3">
                  {offers.filter(o => o.isActive).map((offer, index) => (
                    <div
                      key={offer.id || index}
                      className="border-2 overflow-hidden"
                      style={{
                        borderRadius: `${borderRadius}px`,
                        borderColor: colorTheme.accent
                      }}
                    >
                      {offer.banner && (
                        <img
                          src={offer.banner}
                          alt={offer.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-800">{offer.title}</h3>
                          {offer.discount && (
                            <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full flex items-center gap-1">
                              {offer.discount}{offer.discountType === 'percentage' ? '%' : '$'} OFF
                            </span>
                          )}
                        </div>
                        {offer.description && (
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                        )}
                        {offer.code && (
                          <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                            <FaTag className="text-gray-600" size={12} />
                            <span className="font-mono font-bold text-gray-800 text-sm">{offer.code}</span>
                          </div>
                        )}
                        {offer.validUntil && (
                          <p className="text-xs text-gray-500 mt-2">
                            Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testimonials.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Testimonials
                </h2>
                <div className="space-y-3">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id || index}
                      className="border-2 border-gray-200 p-4"
                      style={{ borderRadius: `${borderRadius}px` }}
                    >
                      <div className="flex gap-3 mb-3">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                          {testimonial.role && (
                            <p className="text-xs text-gray-600">
                              {testimonial.role}
                              {testimonial.company && ` at ${testimonial.company}`}
                            </p>
                          )}
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={12}
                                className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <FaQuoteLeft className="text-gray-300 text-xl mb-2" />
                        <p className="text-gray-700 italic text-sm">{testimonial.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!coverMedia && gallery.length === 0 && products.length === 0 &&
             testimonials.length === 0 && offers.length === 0 && buttons.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">👈 Start building your card</p>
                <p className="text-sm">Add content using the editor on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
