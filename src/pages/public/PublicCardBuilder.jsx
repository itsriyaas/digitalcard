import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaQuoteLeft, FaWhatsapp } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
import QRCode from 'qrcode';
import apiClient from '../../services/apiClient';

const PublicCardBuilder = () => {
  const { slugOrId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    fetchCard();
  }, [slugOrId]);

  const fetchCard = async () => {
    try {
      const { data } = await apiClient.get(`/cards/public/${slugOrId}`);
      console.log('Fetched card data:', data.card);
      console.log('Card logo:', data.card.logo);
      console.log('Enquiry form:', data.card.enquiryForm);
      console.log('QR code:', data.card.qrCode);
      setCard(data.card);

      // Track view
      try {
        await apiClient.post(`/cards/${data.card._id}/view`);
        console.log('View tracked');
      } catch (err) {
        console.error('Failed to track view:', err);
      }

      // Generate QR code if enabled
      if (data.card.qrCode?.enabled) {
        const cardUrl = `${window.location.origin}/card/${data.card.slug || data.card._id}`;
        const qr = await QRCode.toDataURL(cardUrl, { width: 300 });
        setQrCodeUrl(qr);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching card:', error);
      setLoading(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    if (!enquiryData.name || !enquiryData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Generate WhatsApp message
      let message = `*New Enquiry from Digital Card*\n\n`;
      message += `*From:*\n`;
      message += `Name: ${enquiryData.name}\n`;
      message += `Email: ${enquiryData.email || 'Not provided'}\n`;
      message += `Phone: ${enquiryData.phone}\n\n`;
      if (enquiryData.message) {
        message += `*Message:*\n${enquiryData.message}\n\n`;
      }
      message += `_Sent from ${card.title}'s Digital Card_`;

      const encodedMessage = encodeURIComponent(message);
      // Find WhatsApp button or use first phone button
      const whatsappButton = card.buttons?.find(b => b.icon === 'whatsapp');
      const phoneButton = card.buttons?.find(b => b.icon === 'phone');
      const phoneNumber = whatsappButton?.url?.replace(/\D/g, '') || phoneButton?.url?.replace(/\D/g, '') || '';

      if (phoneNumber) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
      } else {
        alert('No WhatsApp or phone number configured for this card');
      }

      // Reset form
      setEnquiryData({ name: '', email: '', phone: '', message: '' });
      setShowEnquiryForm(false);
    } catch (error) {
      alert('Failed to submit enquiry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Card Not Found</h1>
          <p className="text-gray-600">This card does not exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  const colorTheme = card.customization?.colorTheme || {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA'
  };

  const borderRadius = card.customization?.borderRadius || 8;
  const spacing = card.customization?.spacing || 'normal';
  const spacingMap = {
    compact: '0.5rem',
    normal: '1rem',
    relaxed: '1.5rem',
    loose: '2rem'
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: card.customization?.backgroundColor || '#F3F4F6' }}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="bg-white shadow-lg overflow-hidden"
          style={{
            borderRadius: `${borderRadius}px`,
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Banner/Cover Media */}
          {card.coverMedia && (
            <div className="w-full h-64 bg-gray-200">
              {card.coverMedia.type === 'image' ? (
                <img
                  src={card.coverMedia.url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={card.coverMedia.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
          )}

          <div style={{ padding: spacingMap[spacing] }}>
            {/* Company Logo */}
            {card.logo && (
              <div className="flex justify-center mb-4">
                <img
                  src={card.logo.startsWith('http') ? card.logo : `http://localhost:5000${card.logo}`}
                  alt="Company Logo"
                  className="h-20 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load:', card.logo);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Title and About */}
            <div className="text-center mb-6">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: colorTheme.primary }}
              >
                {card.title}
              </h1>
              {card.businessType && (
                <p className="text-sm text-gray-500 mb-2">{card.businessType}</p>
              )}
              {card.about && (
                <p className="text-gray-600">{card.about}</p>
              )}
            </div>

            {/* Buttons */}
            {card.buttons && card.buttons.length > 0 && (
              <div className="mb-6 space-y-2">
                {card.buttons.map((button, index) => {
                  const btnStyle = getButtonStyle(button.style);
                  return (
                    <a
                      key={button._id || index}
                      href={button.url}
                      target={button.openInNew ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 rounded-lg font-medium transition-all text-center"
                      style={{
                        backgroundColor: btnStyle.bg,
                        color: btnStyle.text,
                        border: btnStyle.border ? `2px solid ${btnStyle.border}` : 'none',
                        borderRadius: `${borderRadius}px`,
                        textDecoration: 'none'
                      }}
                    >
                      <span className="mr-2">{getIconComponent(button.icon)}</span>
                      {button.label}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Enquiry Form Button */}
            {card.enquiryForm?.enabled && (
              <div className="mb-6">
                <button
                  onClick={() => setShowEnquiryForm(true)}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colorTheme.primary,
                    color: '#FFFFFF',
                    borderRadius: `${borderRadius}px`
                  }}
                >
                  <FiMessageCircle size={20} />
                  Send Enquiry
                </button>
              </div>
            )}

            {/* Gallery */}
            {card.gallery && card.gallery.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {card.gallery.map((image, index) => (
                    <div
                      key={image._id || index}
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

            {/* Products */}
            {card.products && card.products.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Products
                </h2>
                <div className="space-y-3">
                  {card.products.map((product, index) => (
                    <div
                      key={product._id || index}
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
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                        )}
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
                        {product.inStock !== undefined && (
                          <span className={`inline-block text-xs px-2 py-1 rounded ${
                            product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offers */}
            {card.offers && card.offers.filter(o => o.isActive).length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Special Offers
                </h2>
                <div className="space-y-3">
                  {card.offers.filter(o => o.isActive).map((offer, index) => (
                    <div
                      key={offer._id || index}
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
                            <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                              {offer.discount}{offer.discountType === 'percentage' ? '%' : '$'} OFF
                            </span>
                          )}
                        </div>
                        {offer.description && (
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                        )}
                        {offer.code && (
                          <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
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

            {/* Testimonials */}
            {card.testimonials && card.testimonials.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: colorTheme.secondary }}
                >
                  Testimonials
                </h2>
                <div className="space-y-3">
                  {card.testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial._id || index}
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
                                className={i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}
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

            {/* QR Code */}
            {card.qrCode?.enabled && qrCodeUrl && (
              <div className="mb-6">
                <h2
                  className="text-xl font-bold mb-3 text-center"
                  style={{ color: colorTheme.secondary }}
                >
                  Scan to Share
                </h2>
                <div className="flex justify-center">
                  <div
                    className="bg-white p-4 rounded-lg shadow-md inline-block"
                    style={{ borderRadius: `${borderRadius}px` }}
                  >
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: colorTheme.primary }}>
              Send Enquiry
            </h2>
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              {card.enquiryForm?.fields?.includes('name') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={enquiryData.name}
                    onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {card.enquiryForm?.fields?.includes('email') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={enquiryData.email}
                    onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {card.enquiryForm?.fields?.includes('phone') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={enquiryData.phone}
                    onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {card.enquiryForm?.fields?.includes('message') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={enquiryData.message}
                    onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnquiryForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-white py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ backgroundColor: colorTheme.primary }}
                >
                  <FaWhatsapp />
                  Send via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCardBuilder;
