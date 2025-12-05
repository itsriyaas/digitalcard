import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCatalogue, updateCatalogue, fetchCatalogue, clearCurrentCatalogue } from '../../features/catalogue/catalogueSlice';
import { FiSave, FiX, FiImage, FiEye, FiEyeOff, FiUpload, FiTrash2 } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import { uploadSingleFile } from '../../services/uploadAPI';

const CatalogueForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { currentCatalogue, loading, error } = useSelector((state) => state.catalogue);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: '',
    logo: '',
    about: '',
    isPublished: true,
    customization: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      fontStyle: 'sans',
      buttonStyle: 'rounded'
    },
    template: {
      templateId: 'grid'
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      whatsapp: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  const [submitError, setSubmitError] = useState('');
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Load catalogue data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCatalogue(id));
    }
    return () => {
      dispatch(clearCurrentCatalogue());
    };
  }, [isEditMode, id, dispatch]);

  // Populate form when catalogue data is loaded
  useEffect(() => {
    if (currentCatalogue && isEditMode) {
      setFormData({
        title: currentCatalogue.title || '',
        description: currentCatalogue.description || '',
        banner: currentCatalogue.banner || '',
        logo: currentCatalogue.logo || '',
        about: currentCatalogue.about || '',
        isPublished: currentCatalogue.isPublished !== undefined ? currentCatalogue.isPublished : true,
        customization: {
          primaryColor: currentCatalogue.customization?.primaryColor || '#3B82F6',
          secondaryColor: currentCatalogue.customization?.secondaryColor || '#1E40AF',
          fontStyle: currentCatalogue.customization?.fontStyle || 'sans',
          buttonStyle: currentCatalogue.customization?.buttonStyle || 'rounded'
        },
        template: {
          templateId: currentCatalogue.template?.templateId || 'grid'
        },
        socialLinks: {
          facebook: currentCatalogue.socialLinks?.facebook || '',
          instagram: currentCatalogue.socialLinks?.instagram || '',
          twitter: currentCatalogue.socialLinks?.twitter || '',
          linkedin: currentCatalogue.socialLinks?.linkedin || '',
          whatsapp: currentCatalogue.socialLinks?.whatsapp || ''
        },
        contactInfo: {
          email: currentCatalogue.contactInfo?.email || '',
          phone: currentCatalogue.contactInfo?.phone || '',
          address: currentCatalogue.contactInfo?.address || '',
          city: currentCatalogue.contactInfo?.city || '',
          state: currentCatalogue.contactInfo?.state || '',
          country: currentCatalogue.contactInfo?.country || '',
          zipCode: currentCatalogue.contactInfo?.zipCode || ''
        }
      });
    }
  }, [currentCatalogue, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setSubmitError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Image size should be less than 5MB');
      return;
    }

    try {
      if (type === 'banner') {
        setUploadingBanner(true);
      } else {
        setUploadingLogo(true);
      }

      const response = await uploadSingleFile(file);
      // Cloudinary returns full URLs, no need to prepend API URL
      const imageUrl = response.file.url;

      setFormData(prev => ({
        ...prev,
        [type]: imageUrl
      }));

      setSubmitError('');
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      if (type === 'banner') {
        setUploadingBanner(false);
      } else {
        setUploadingLogo(false);
      }
    }
  };

  const handleDeleteImage = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      if (isEditMode) {
        await dispatch(updateCatalogue({ id, catalogueData: formData })).unwrap();
      } else {
        await dispatch(createCatalogue(formData)).unwrap();
      }
      navigate('/admin/catalogues');
    } catch (err) {
      setSubmitError(err || 'Failed to save catalogue');
    }
  };

  if (loading && isEditMode) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Catalogue' : 'Create New Catalogue'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {isEditMode ? 'Update your catalogue details' : 'Fill in the details to create your e-catalogue'}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/catalogues')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
            >
              <FiX />
              Cancel
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(submitError || error) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{submitError || error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Fashion Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your catalogue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed information about your store"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {formData.isPublished ? <FiEye className="text-green-600" /> : <FiEyeOff className="text-gray-400" />}
                  Published (visible to public)
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiImage />
              Images
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>

                {/* Upload and Delete Buttons */}
                <div className="flex gap-2 mb-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'banner')}
                      className="hidden"
                      disabled={uploadingBanner}
                    />
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                      <FiUpload className={uploadingBanner ? 'animate-spin' : ''} />
                      <span className="text-sm text-gray-700">
                        {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                      </span>
                    </div>
                  </label>
                  {formData.banner && (
                    <button
                      type="button"
                      onClick={() => handleDeleteImage('banner')}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex items-center gap-2"
                      title="Delete banner"
                    >
                      <FiTrash2 />
                      <span className="hidden sm:inline text-sm">Delete</span>
                    </button>
                  )}
                </div>

                {/* URL Input (Alternative) */}
                <div className="text-sm text-gray-500 mb-2">Or enter URL:</div>
                <input
                  type="url"
                  name="banner"
                  value={formData.banner}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/banner.jpg"
                  disabled={uploadingBanner}
                />

                {/* Preview */}
                {formData.banner && (
                  <div className="mt-3 relative">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img src={formData.banner} alt="Banner preview" className="w-full h-32 sm:h-48 object-cover rounded-md border border-gray-200" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>

                {/* Upload and Delete Buttons */}
                <div className="flex gap-2 mb-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                      <FiUpload className={uploadingLogo ? 'animate-spin' : ''} />
                      <span className="text-sm text-gray-700">
                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </span>
                    </div>
                  </label>
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={() => handleDeleteImage('logo')}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex items-center gap-2"
                      title="Delete logo"
                    >
                      <FiTrash2 />
                      <span className="hidden sm:inline text-sm">Delete</span>
                    </button>
                  )}
                </div>

                {/* URL Input (Alternative) */}
                <div className="text-sm text-gray-500 mb-2">Or enter URL:</div>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                  disabled={uploadingLogo}
                />

                {/* Preview */}
                {formData.logo && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img src={formData.logo} alt="Logo preview" className="w-24 h-24 object-contain rounded-md border border-gray-200 p-2 bg-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customization */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Customization</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customization.primaryColor"
                    value={formData.customization.primaryColor}
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.primaryColor}
                    onChange={(e) => handleChange({ target: { name: 'customization.primaryColor', value: e.target.value } })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customization.secondaryColor"
                    value={formData.customization.secondaryColor}
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.customization.secondaryColor}
                    onChange={(e) => handleChange({ target: { name: 'customization.secondaryColor', value: e.target.value } })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Style
                </label>
                <select
                  name="customization.fontStyle"
                  value={formData.customization.fontStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sans">Sans Serif (Default)</option>
                  <option value="serif">Serif</option>
                  <option value="mono">Monospace</option>
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="poppins">Poppins</option>
                  <option value="opensans">Open Sans</option>
                  <option value="lato">Lato</option>
                  <option value="montserrat">Montserrat</option>
                  <option value="playfair">Playfair Display</option>
                  <option value="merriweather">Merriweather</option>
                  <option value="raleway">Raleway</option>
                  <option value="ubuntu">Ubuntu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Style
                </label>
                <select
                  name="customization.buttonStyle"
                  value={formData.customization.buttonStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="pill">Pill</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  name="template.templateId"
                  value={formData.template.templateId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="grid">Grid Layout</option>
                  <option value="showcase">Showcase Layout</option>
                  <option value="minimal">Minimal Layout</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="contactInfo.address"
                  value={formData.contactInfo.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="contactInfo.city"
                  value={formData.contactInfo.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="contactInfo.state"
                  value={formData.contactInfo.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="contactInfo.country"
                  value={formData.contactInfo.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="United States"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="contactInfo.zipCode"
                  value={formData.contactInfo.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="https://facebook.com/yourpage"
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
                  placeholder="https://instagram.com/yourpage"
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
                  placeholder="https://twitter.com/yourpage"
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
                  placeholder="https://linkedin.com/company/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="socialLinks.whatsapp"
                  value={formData.socialLinks.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <FiSave />
              {loading ? 'Saving...' : isEditMode ? 'Update Catalogue' : 'Create Catalogue'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/catalogues')}
              className="flex-1 sm:flex-initial px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogueForm;
