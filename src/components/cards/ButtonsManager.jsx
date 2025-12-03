import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaLink, FaPhone, FaEnvelope, FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaGlobe } from 'react-icons/fa';

const iconOptions = [
  { id: 'link', icon: FaLink, label: 'Link' },
  { id: 'phone', icon: FaPhone, label: 'Phone' },
  { id: 'email', icon: FaEnvelope, label: 'Email' },
  { id: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp' },
  { id: 'facebook', icon: FaFacebook, label: 'Facebook' },
  { id: 'instagram', icon: FaInstagram, label: 'Instagram' },
  { id: 'linkedin', icon: FaLinkedin, label: 'LinkedIn' },
  { id: 'twitter', icon: FaTwitter, label: 'Twitter' },
  { id: 'youtube', icon: FaYoutube, label: 'YouTube' },
  { id: 'website', icon: FaGlobe, label: 'Website' }
];

const ButtonsManager = ({ buttons = [], onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    icon: 'link',
    style: 'primary',
    openInNew: true
  });

  const handleSubmit = () => {
    if (formData.label && formData.url) {
      if (editIndex !== null) {
        const newButtons = [...buttons];
        newButtons[editIndex] = { ...formData, id: buttons[editIndex].id };
        onUpdate(newButtons);
      } else {
        onUpdate([...buttons, { ...formData, id: Date.now() }]);
      }
      resetForm();
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(buttons[index]);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    onUpdate(buttons.filter((_, i) => i !== index));
  };

  const moveButton = (fromIndex, toIndex) => {
    const newButtons = [...buttons];
    const [movedItem] = newButtons.splice(fromIndex, 1);
    newButtons.splice(toIndex, 0, movedItem);
    onUpdate(newButtons);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      url: '',
      icon: 'link',
      style: 'primary',
      openInNew: true
    });
    setShowForm(false);
    setEditIndex(null);
  };

  const getButtonStyle = (style) => {
    const styles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      success: 'bg-green-600 text-white hover:bg-green-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      dark: 'bg-gray-900 text-white hover:bg-gray-800'
    };
    return styles[style] || styles.primary;
  };

  const getIconComponent = (iconId) => {
    const iconObj = iconOptions.find(opt => opt.id === iconId);
    return iconObj ? iconObj.icon : FaLink;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Buttons & Links</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Add Button
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-700">
            {editIndex !== null ? 'Edit Button' : 'Add New Button'}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Contact Us, Visit Website"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://... or tel:+1234567890 or mailto:email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports URLs, phone numbers (tel:), emails (mailto:), WhatsApp (https://wa.me/)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: option.id })}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                      formData.icon === option.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="text-xs">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
            <div className="grid grid-cols-3 gap-2">
              {['primary', 'secondary', 'outline', 'success', 'danger', 'dark'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setFormData({ ...formData, style })}
                  className={`py-2 px-3 rounded-lg capitalize text-sm ${
                    formData.style === style
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : ''
                  } ${getButtonStyle(style)}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="openInNew"
              checked={formData.openInNew}
              onChange={(e) => setFormData({ ...formData, openInNew: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="openInNew" className="text-sm text-gray-700">Open in new tab</label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editIndex !== null ? 'Update Button' : 'Add Button'}
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

      {buttons.length > 0 ? (
        <div className="space-y-2">
          {buttons.map((button, index) => {
            const IconComponent = getIconComponent(button.icon);
            return (
              <div
                key={button.id || index}
                className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-3 rounded-lg ${getButtonStyle(button.style)} flex items-center gap-2`}>
                      <IconComponent />
                      <span className="font-medium">{button.label}</span>
                    </div>
                    <div className="text-sm text-gray-600 truncate flex-1">
                      {button.url}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={() => moveButton(index, index - 1)}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                        >
                          ▲
                        </button>
                      )}
                      {index < buttons.length - 1 && (
                        <button
                          onClick={() => moveButton(index, index + 1)}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                        >
                          ▼
                        </button>
                      )}
                    </div>
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
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaLink className="mx-auto text-5xl mb-3 text-gray-300" />
          <p>No buttons added yet</p>
          <p className="text-sm">Click "Add Button" to create action buttons and links</p>
        </div>
      )}
    </div>
  );
};

export default ButtonsManager;
