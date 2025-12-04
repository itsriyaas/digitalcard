import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiMessageCircle
} from 'react-icons/fi';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa';
import { digitalCardAPI } from '../../services/digitalCardAPI';

const PublicDigitalCard = () => {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchCard();
  }, [slug]);

  const fetchCard = async () => {
    try {
      const response = await digitalCardAPI.getPublic(slug);
      setCard(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    if (!enquiryData.name || !enquiryData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Record enquiry
      await digitalCardAPI.recordEnquiry(slug);

      // Generate WhatsApp message
      let message = `*New Enquiry from Digital Card*\n\n`;
      message += `*From:*\n`;
      message += `Name: ${enquiryData.name}\n`;
      message += `Email: ${enquiryData.email || 'Not provided'}\n`;
      message += `Phone: ${enquiryData.phone}\n\n`;
      if (enquiryData.message) {
        message += `*Message:*\n${enquiryData.message}\n\n`;
      }
      message += `_Sent from ${card.name}'s Digital Card_`;

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = card.phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Reset form
      setEnquiryData({ name: '', email: '', phone: '', message: '' });
      setShowEnquiryForm(false);
    } catch (error) {
      alert('Failed to submit enquiry');
    }
  };

  const handleDirectWhatsApp = () => {
    const whatsappNumber = card.socialLinks?.whatsapp || card.phone;
    if (whatsappNumber) {
      const phoneNumber = whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${card.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${card.email}`;
  };

  const getSocialIcon = (platform) => {
    const icons = {
      facebook: <FaFacebook size={24} />,
      instagram: <FaInstagram size={24} />,
      twitter: <FaTwitter size={24} />,
      linkedin: <FaLinkedin size={24} />,
      youtube: <FaYoutube size={24} />,
      whatsapp: <FaWhatsapp size={24} />
    };
    return icons[platform];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Card Not Found</h1>
          <p className="text-gray-600">This digital card does not exist or is not published.</p>
        </div>
      </div>
    );
  }

  const theme = card.theme || {};

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.backgroundColor || '#FFFFFF',
        color: theme.textColor || '#000000'
      }}
    >
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        {card.coverImage ? (
          <img
            src={card.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: theme.primaryColor || '#3B82F6' }}
          />
        )}

        {/* Profile Image */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {card.profileImage ? (
            <img
              src={card.profileImage}
              alt={card.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 shadow-lg flex items-center justify-center text-4xl font-bold text-white">
              {card.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        {/* Personal Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{card.name}</h1>
          {card.title && (
            <p
              className="text-xl mb-1"
              style={{ color: theme.secondaryColor || '#1E40AF' }}
            >
              {card.title}
            </p>
          )}
          {card.company && (
            <p className="text-lg opacity-80">{card.company}</p>
          )}
          {card.logo && (
            <div className="mt-4">
              <img
                src={card.logo}
                alt="Logo"
                className="h-16 mx-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Bio */}
        {card.bio && (
          <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 mb-6">
            <p className="text-center whitespace-pre-wrap">{card.bio}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {card.phone && (
            <button
              onClick={handleCall}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
              style={{ color: theme.primaryColor || '#3B82F6' }}
            >
              <FiPhone size={24} />
              <span className="text-sm font-medium">Call</span>
            </button>
          )}
          {card.email && (
            <button
              onClick={handleEmail}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
              style={{ color: theme.primaryColor || '#3B82F6' }}
            >
              <FiMail size={24} />
              <span className="text-sm font-medium">Email</span>
            </button>
          )}
          {(card.socialLinks?.whatsapp || card.phone) && (
            <button
              onClick={handleDirectWhatsApp}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
              style={{ color: theme.primaryColor || '#3B82F6' }}
            >
              <FaWhatsapp size={24} />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>
          )}
          {card.enableEnquiryForm && (
            <button
              onClick={() => setShowEnquiryForm(true)}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col items-center gap-2"
              style={{ color: theme.primaryColor || '#3B82F6' }}
            >
              <FiMessageCircle size={24} />
              <span className="text-sm font-medium">Enquiry</span>
            </button>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor || '#3B82F6' }}>
            Contact Information
          </h2>
          <div className="space-y-3">
            {card.phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="flex-shrink-0" />
                <a href={`tel:${card.phone}`} className="hover:underline">
                  {card.phone}
                </a>
              </div>
            )}
            {card.alternatePhone && (
              <div className="flex items-center gap-3">
                <FiPhone className="flex-shrink-0" />
                <a href={`tel:${card.alternatePhone}`} className="hover:underline">
                  {card.alternatePhone}
                </a>
              </div>
            )}
            {card.email && (
              <div className="flex items-center gap-3">
                <FiMail className="flex-shrink-0" />
                <a href={`mailto:${card.email}`} className="hover:underline">
                  {card.email}
                </a>
              </div>
            )}
            {card.website && (
              <div className="flex items-center gap-3">
                <FiGlobe className="flex-shrink-0" />
                <a
                  href={card.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {card.website}
                </a>
              </div>
            )}
            {(card.address?.street || card.address?.city) && (
              <div className="flex items-start gap-3">
                <FiMapPin className="flex-shrink-0 mt-1" />
                <div>
                  {card.address.street && <p>{card.address.street}</p>}
                  <p>
                    {[card.address.city, card.address.state, card.address.zipCode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {card.address.country && <p>{card.address.country}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        {Object.values(card.socialLinks || {}).some(link => link) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor || '#3B82F6' }}>
              Connect With Me
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(card.socialLinks || {}).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={platform === 'whatsapp' ? `https://wa.me/${url.replace(/\D/g, '')}` : url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.primaryColor || '#3B82F6', color: 'white' }}
                  >
                    {getSocialIcon(platform)}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Products */}
        {card.products && card.products.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor || '#3B82F6' }}>
              Our Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {card.products.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    {product.price && (
                      <p className="font-semibold mb-2" style={{ color: theme.primaryColor || '#3B82F6' }}>
                        {product.price}
                      </p>
                    )}
                    {product.description && (
                      <p className="text-sm text-gray-600">{product.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {card.testimonials && card.testimonials.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor || '#3B82F6' }}>
              Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {card.testimonials.map((testimonial, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      {testimonial.designation && (
                        <p className="text-sm text-gray-600">{testimonial.designation}</p>
                      )}
                    </div>
                  </div>
                  {testimonial.message && (
                    <p className="text-sm text-gray-700 italic">"{testimonial.message}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers */}
        {card.offers && card.offers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor || '#3B82F6' }}>
              Special Offers
            </h2>
            <div className="space-y-4">
              {card.offers.map((offer, index) => (
                <div
                  key={index}
                  className="border-l-4 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-white"
                  style={{ borderColor: theme.primaryColor || '#3B82F6' }}
                >
                  <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-gray-700 mb-2">{offer.description}</p>
                  )}
                  {offer.validUntil && (
                    <p className="text-sm text-gray-600">
                      Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor || '#3B82F6' }}>
              Send Enquiry
            </h2>
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={enquiryData.name}
                  onChange={handleEnquiryChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={enquiryData.email}
                  onChange={handleEnquiryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={enquiryData.phone}
                  onChange={handleEnquiryChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={enquiryData.message}
                  onChange={handleEnquiryChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

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
                  className="flex-1 text-white py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: theme.primaryColor || '#3B82F6' }}
                >
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

export default PublicDigitalCard;
