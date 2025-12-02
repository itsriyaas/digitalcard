import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaGripVertical, FaImage } from 'react-icons/fa';

const GalleryManager = ({ gallery = [], onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    alt: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (formData.url) {
      const newGallery = [...gallery, { ...formData, id: Date.now() }];
      onUpdate(newGallery);
      setFormData({ url: '', caption: '', alt: '' });
      setShowAddForm(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(gallery[index]);
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    const newGallery = [...gallery];
    newGallery[editIndex] = formData;
    onUpdate(newGallery);
    setFormData({ url: '', caption: '', alt: '' });
    setShowAddForm(false);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    onUpdate(newGallery);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newGallery = [...gallery];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);
    onUpdate(newGallery);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Gallery Images</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Add Image
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-700">
            {editIndex !== null ? 'Edit Image' : 'Add New Image'}
          </h4>

          {!formData.url ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="gallery-image-upload"
                />
                <label htmlFor="gallery-image-upload" className="cursor-pointer">
                  <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload image</p>
                </label>
              </div>

              <div className="my-3 text-center text-gray-500">OR</div>

              <input
                type="url"
                placeholder="Enter image URL..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={formData.url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => setFormData({ ...formData, url: '' })}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input
                  type="text"
                  placeholder="Image caption..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  placeholder="Alt text for accessibility..."
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={editIndex !== null ? handleUpdate : handleAdd}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editIndex !== null ? 'Update' : 'Add to Gallery'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditIndex(null);
                    setFormData({ url: '', caption: '', alt: '' });
                  }}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <div
              key={image.id || index}
              className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors"
            >
              <img
                src={image.url}
                alt={image.alt || 'Gallery image'}
                className="w-full h-32 object-cover"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                  {image.caption}
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => moveImage(index, index - 1)}
                      className="bg-gray-800 text-white p-1 rounded hover:bg-gray-900"
                    >
                      ▲
                    </button>
                  )}
                  {index < gallery.length - 1 && (
                    <button
                      onClick={() => moveImage(index, index + 1)}
                      className="bg-gray-800 text-white p-1 rounded hover:bg-gray-900"
                    >
                      ▼
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaImage className="mx-auto text-5xl mb-3 text-gray-300" />
          <p>No images in gallery yet</p>
          <p className="text-sm">Click "Add Image" to get started</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
