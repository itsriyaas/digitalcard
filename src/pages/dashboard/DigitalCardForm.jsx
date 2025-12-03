import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import { digitalCardAPI } from '../../services/digitalCardAPI';
import { uploadSingleFile } from '../../services/uploadAPI';

const DigitalCardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { user } = useSelector((state) => state.auth);
  const token = user?.token || localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      whatsapp: ''
    },
    profileImage: '',
    coverImage: '',
    logo: '',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#FFFFFF',
      textColor: '#000000'
    },
    products: [],
    testimonials: [],
    offers: [],
    isPublished: false,
    enableEnquiryForm: true
  });

  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchCard();
    }
  }, [id]);

  const fetchCard = async () => {
    try {
      setLoading(true);
      const response = await digitalCardAPI.get(id);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch card');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (type === 'profile') setUploadingProfile(true);
      if (type === 'cover') setUploadingCover(true);
      if (type === 'logo') setUploadingLogo(true);

      const imageUrl = await uploadSingleFile(file);

      const fieldMap = {
        'profile': 'profileImage',
        'cover': 'coverImage',
        'logo': 'logo'
      };

      setFormData(prev => ({ ...prev, [fieldMap[type]]: imageUrl }));
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      if (type === 'profile') setUploadingProfile(false);
      if (type === 'cover') setUploadingCover(false);
      if (type === 'logo') setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    if (!formData.phone) {
      setError('Phone number is required');
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await digitalCardAPI.update(id, formData);
      } else {
        await digitalCardAPI.create(formData);
      }

      navigate('/dashboard/digital-cards');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save card');
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Digital Card' : 'Create Digital Card'}
          </h1>
          <button
            onClick={() => navigate('/dashboard/digital-cards')}
            className="text-gray-600 hover:text-gray-900"
          >
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  name="socialLinks.youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="socialLinks.whatsapp"
                  value={formData.socialLinks.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Country code + number (e.g., 919876543210)"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Products</h2>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    products: [...prev.products, { name: '', description: '', price: '', image: '' }]
                  }));
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
            <div className="space-y-4">
              {formData.products.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={product.name}
                      onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={product.price}
                      onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].price = e.target.value;
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <textarea
                      placeholder="Description"
                      value={product.description}
                      onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].description = e.target.value;
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      rows="2"
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={product.image}
                      onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].image = e.target.value;
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newProducts = formData.products.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {formData.products.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No products added yet</p>
              )}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Testimonials</h2>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    testimonials: [...prev.testimonials, { name: '', designation: '', message: '', image: '' }]
                  }));
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Add Testimonial
              </button>
            </div>
            <div className="space-y-4">
              {formData.testimonials.map((testimonial, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={testimonial.name}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials];
                        newTestimonials[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Designation"
                      value={testimonial.designation}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials];
                        newTestimonials[index].designation = e.target.value;
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <textarea
                      placeholder="Message"
                      value={testimonial.message}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials];
                        newTestimonials[index].message = e.target.value;
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      rows="2"
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={testimonial.image}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials];
                        newTestimonials[index].image = e.target.value;
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newTestimonials = formData.testimonials.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {formData.testimonials.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No testimonials added yet</p>
              )}
            </div>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Offers</h2>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    offers: [...prev.offers, { title: '', description: '', validUntil: '' }]
                  }));
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Add Offer
              </button>
            </div>
            <div className="space-y-4">
              {formData.offers.map((offer, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Offer Title"
                      value={offer.title}
                      onChange={(e) => {
                        const newOffers = [...formData.offers];
                        newOffers[index].title = e.target.value;
                        setFormData(prev => ({ ...prev, offers: newOffers }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Valid Until"
                      value={offer.validUntil}
                      onChange={(e) => {
                        const newOffers = [...formData.offers];
                        newOffers[index].validUntil = e.target.value;
                        setFormData(prev => ({ ...prev, offers: newOffers }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <textarea
                      placeholder="Description"
                      value={offer.description}
                      onChange={(e) => {
                        const newOffers = [...formData.offers];
                        newOffers[index].description = e.target.value;
                        setFormData(prev => ({ ...prev, offers: newOffers }));
                      }}
                      rows="2"
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newOffers = formData.offers.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, offers: newOffers }));
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 md:col-span-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {formData.offers.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No offers added yet</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  {formData.profileImage ? (
                    <div className="relative">
                      <img src={formData.profileImage} alt="Profile" className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        {uploadingProfile ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile')}
                        className="hidden"
                        disabled={uploadingProfile}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  {formData.coverImage ? (
                    <div className="relative">
                      <img src={formData.coverImage} alt="Cover" className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        {uploadingCover ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cover')}
                        className="hidden"
                        disabled={uploadingCover}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  {formData.logo ? (
                    <div className="relative">
                      <img src={formData.logo} alt="Logo" className="w-full h-32 object-contain rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Colors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Theme Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  name="theme.primaryColor"
                  value={formData.theme.primaryColor}
                  onChange={handleChange}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <input
                  type="color"
                  name="theme.secondaryColor"
                  value={formData.theme.secondaryColor}
                  onChange={handleChange}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  name="theme.backgroundColor"
                  value={formData.theme.backgroundColor}
                  onChange={handleChange}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  name="theme.textColor"
                  value={formData.theme.textColor}
                  onChange={handleChange}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Publish Card</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enableEnquiryForm"
                  checked={formData.enableEnquiryForm}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Enquiry Form</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/digital-cards')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiSave />
              {loading ? 'Saving...' : (isEditMode ? 'Update Card' : 'Create Card')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DigitalCardForm;
