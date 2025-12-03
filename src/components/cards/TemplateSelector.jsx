import React from 'react';
import { FaThList, FaTh, FaCrown } from 'react-icons/fa';

const templates = [
  {
    id: 'list-basic',
    name: 'List Basic',
    type: 'list',
    isPremium: false,
    description: 'Clean list layout with vertical sections',
    thumbnail: '📋'
  },
  {
    id: 'list-elegant',
    name: 'List Elegant',
    type: 'list',
    isPremium: false,
    description: 'Elegant list with dividers',
    thumbnail: '📝'
  },
  {
    id: 'grid-modern',
    name: 'Grid Modern',
    type: 'grid',
    isPremium: false,
    description: 'Modern grid layout with cards',
    thumbnail: '🎨'
  },
  {
    id: 'grid-masonry',
    name: 'Grid Masonry',
    type: 'grid',
    isPremium: false,
    description: 'Pinterest-style masonry grid',
    thumbnail: '🧱'
  },
  {
    id: 'premium-luxury',
    name: 'Luxury Premium',
    type: 'premium',
    isPremium: true,
    description: 'Luxury design with animations',
    thumbnail: '✨'
  },
  {
    id: 'premium-business',
    name: 'Business Pro',
    type: 'premium',
    isPremium: true,
    description: 'Professional business template',
    thumbnail: '💼'
  }
];

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, filterType = 'all' }) => {
  const filteredTemplates = filterType === 'all'
    ? templates
    : templates.filter(t => t.type === filterType);

  const [viewMode, setViewMode] = React.useState('grid');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Select Template</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <FaThList />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onTemplateSelect({ ...selectedTemplate, filterType: 'all' })}
          className={`px-4 py-2 rounded ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All Templates
        </button>
        <button
          onClick={() => onTemplateSelect({ ...selectedTemplate, filterType: 'list' })}
          className={`px-4 py-2 rounded flex items-center gap-2 ${filterType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          <FaThList /> List View
        </button>
        <button
          onClick={() => onTemplateSelect({ ...selectedTemplate, filterType: 'grid' })}
          className={`px-4 py-2 rounded flex items-center gap-2 ${filterType === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          <FaTh /> Grid View
        </button>
        <button
          onClick={() => onTemplateSelect({ ...selectedTemplate, filterType: 'premium' })}
          className={`px-4 py-2 rounded flex items-center gap-2 ${filterType === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' : 'bg-gray-200'}`}
        >
          <FaCrown /> Premium
        </button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-3'}>
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect({ ...selectedTemplate, templateId: template.id })}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              selectedTemplate?.templateId === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            } ${template.isPremium ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-white'}`}
          >
            {template.isPremium && (
              <div className="flex justify-end mb-2">
                <FaCrown className="text-yellow-500" />
              </div>
            )}
            <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4'}>
              <div className={`text-4xl ${viewMode === 'list' ? '' : 'mb-2'}`}>
                {template.thumbnail}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
