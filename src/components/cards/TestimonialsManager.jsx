import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsManager = ({ testimonials = [], onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    avatar: '',
    rating: 5,
    text: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.text) {
      if (editIndex !== null) {
        const newTestimonials = [...testimonials];
        newTestimonials[editIndex] = { ...formData, id: testimonials[editIndex].id };
        onUpdate(newTestimonials);
      } else {
        onUpdate([...testimonials, { ...formData, id: Date.now() }]);
      }
      resetForm();
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(testimonials[index]);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    onUpdate(testimonials.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      avatar: '',
      rating: 5,
      text: ''
    });
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Testimonials</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-700">
            {editIndex !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Customer name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Job title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            {formData.avatar ? (
              <div className="relative inline-block">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  onClick={() => setFormData({ ...formData, avatar: '' })}
                  className="absolute -top-1 -right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center w-32">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`testimonial-avatar-${editIndex}`}
                />
                <label htmlFor={`testimonial-avatar-${editIndex}`} className="cursor-pointer">
                  <p className="text-sm text-gray-600">Upload</p>
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-2xl"
                >
                  <FaStar
                    className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text *</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="What did they say about you..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editIndex !== null ? 'Update Testimonial' : 'Add Testimonial'}
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

      {testimonials.length > 0 ? (
        <div className="space-y-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-3">
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
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    )}
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
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
              <div className="relative">
                <FaQuoteLeft className="absolute -top-1 -left-1 text-gray-300 text-2xl" />
                <p className="text-gray-700 italic pl-8">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaQuoteLeft className="mx-auto text-5xl mb-3 text-gray-300" />
          <p>No testimonials added yet</p>
          <p className="text-sm">Click "Add Testimonial" to showcase customer reviews</p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
