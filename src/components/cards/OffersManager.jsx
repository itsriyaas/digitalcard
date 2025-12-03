import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaTag, FaPercent } from 'react-icons/fa';

const OffersManager = ({ offers = [], onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    discountType: 'percentage',
    code: '',
    validUntil: '',
    banner: '',
    link: '',
    isActive: true
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, banner: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.title) {
      if (editIndex !== null) {
        const newOffers = [...offers];
        newOffers[editIndex] = { ...formData, id: offers[editIndex].id };
        onUpdate(newOffers);
      } else {
        onUpdate([...offers, { ...formData, id: Date.now() }]);
      }
      resetForm();
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(offers[index]);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    onUpdate(offers.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      code: '',
      validUntil: '',
      banner: '',
      link: '',
      isActive: true
    });
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Offers & Banners</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Add Offer
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-700">
            {editIndex !== null ? 'Edit Offer' : 'Add New Offer'}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Summer Sale"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Offer details..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed Amount $</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="SAVE50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
            {formData.banner ? (
              <div className="relative">
                <img src={formData.banner} alt="Banner" className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={() => setFormData({ ...formData, banner: '' })}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`offer-banner-${editIndex}`}
                />
                <label htmlFor={`offer-banner-${editIndex}`} className="cursor-pointer">
                  <p className="text-gray-600">Click to upload banner</p>
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Link</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="offerActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="offerActive" className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editIndex !== null ? 'Update Offer' : 'Add Offer'}
            </button>
            <button
              onClick={resetForm}
              className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {offers.length > 0 ? (
        <div className="space-y-3">
          {offers.map((offer, index) => (
            <div
              key={offer.id || index}
              className={`bg-white border-2 rounded-lg overflow-hidden transition-colors ${
                offer.isActive ? 'border-green-300' : 'border-gray-200'
              } hover:border-blue-300`}
            >
              {offer.banner && (
                <img src={offer.banner} alt={offer.title} className="w-full h-32 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{offer.title}</h4>
                      {offer.discount && (
                        <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full flex items-center gap-1">
                          <FaPercent size={10} />
                          {offer.discount}{offer.discountType === 'percentage' ? '%' : '$'} OFF
                        </span>
                      )}
                    </div>
                    {offer.description && (
                      <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                    )}
                    {offer.code && (
                      <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                        <FaTag className="text-gray-600" />
                        <span className="font-mono font-bold text-gray-800">{offer.code}</span>
                      </div>
                    )}
                    {offer.validUntil && (
                      <p className="text-xs text-gray-500 mt-2">
                        Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    )}
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      offer.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-700 p-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaTag className="mx-auto text-5xl mb-3 text-gray-300" />
          <p>No offers added yet</p>
          <p className="text-sm">Click "Add Offer" to create special promotions</p>
        </div>
      )}
    </div>
  );
};

export default OffersManager;
