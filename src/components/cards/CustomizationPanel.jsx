import React from 'react';
import { FaPalette, FaImage, FaLayerGroup } from 'react-icons/fa';

const colorThemes = [
  { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
  { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA' },
  { id: 'green', name: 'Forest Green', primary: '#10B981', secondary: '#047857', accent: '#34D399' },
  { id: 'red', name: 'Cherry Red', primary: '#EF4444', secondary: '#B91C1C', accent: '#F87171' },
  { id: 'orange', name: 'Sunset Orange', primary: '#F97316', secondary: '#C2410C', accent: '#FB923C' },
  { id: 'pink', name: 'Rose Pink', primary: '#EC4899', secondary: '#BE185D', accent: '#F472B6' },
  { id: 'dark', name: 'Dark Mode', primary: '#1F2937', secondary: '#111827', accent: '#374151' },
  { id: 'gold', name: 'Luxury Gold', primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' }
];

const backgroundPatterns = [
  { id: 'none', name: 'Solid Color', preview: 'bg-white' },
  { id: 'dots', name: 'Dots', preview: 'bg-dots' },
  { id: 'grid', name: 'Grid', preview: 'bg-grid' },
  { id: 'stripes', name: 'Stripes', preview: 'bg-stripes' },
  { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-blue-50 to-purple-50' },
  { id: 'waves', name: 'Waves', preview: 'bg-waves' },
  { id: 'geometric', name: 'Geometric', preview: 'bg-geometric' }
];

const layoutOptions = [
  { id: 'centered', name: 'Centered', icon: '⬜' },
  { id: 'left-aligned', name: 'Left Aligned', icon: '◧' },
  { id: 'wide', name: 'Wide', icon: '▬' },
  { id: 'compact', name: 'Compact', icon: '▢' }
];

const CustomizationPanel = ({ customization, onUpdate }) => {
  const [activeTab, setActiveTab] = React.useState('colors');

  const updateCustomization = (key, value) => {
    onUpdate({ ...customization, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Customize Design</h3>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'colors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          <FaPalette /> Colors
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'layout' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          <FaLayerGroup /> Layout
        </button>
        <button
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'background' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
          }`}
        >
          <FaImage /> Background
        </button>
      </div>

      <div className="py-4">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {colorThemes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => updateCustomization('colorTheme', theme)}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                      customization?.colorTheme?.id === theme.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.secondary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{theme.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Colors</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Primary</label>
                  <input
                    type="color"
                    value={customization?.colorTheme?.primary || '#3B82F6'}
                    onChange={(e) => updateCustomization('colorTheme', {
                      ...customization?.colorTheme,
                      primary: e.target.value
                    })}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Secondary</label>
                  <input
                    type="color"
                    value={customization?.colorTheme?.secondary || '#1E40AF'}
                    onChange={(e) => updateCustomization('colorTheme', {
                      ...customization?.colorTheme,
                      secondary: e.target.value
                    })}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Accent</label>
                  <input
                    type="color"
                    value={customization?.colorTheme?.accent || '#60A5FA'}
                    onChange={(e) => updateCustomization('colorTheme', {
                      ...customization?.colorTheme,
                      accent: e.target.value
                    })}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
              <div className="grid grid-cols-2 gap-3">
                {layoutOptions.map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => updateCustomization('layout', layout.id)}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                      customization?.layout === layout.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{layout.icon}</div>
                    <p className="text-sm font-medium text-gray-700">{layout.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spacing</label>
              <select
                value={customization?.spacing || 'normal'}
                onChange={(e) => updateCustomization('spacing', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
                <option value="loose">Loose</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Corner Radius</label>
              <input
                type="range"
                min="0"
                max="24"
                value={customization?.borderRadius || 8}
                onChange={(e) => updateCustomization('borderRadius', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Sharp</span>
                <span>{customization?.borderRadius || 8}px</span>
                <span>Rounded</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'background' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Pattern</label>
              <div className="grid grid-cols-2 gap-3">
                {backgroundPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    onClick={() => updateCustomization('backgroundPattern', pattern.id)}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                      customization?.backgroundPattern === pattern.id
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`h-16 rounded ${pattern.preview} mb-2`}></div>
                    <p className="text-sm font-medium text-gray-700 text-center">{pattern.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <input
                type="color"
                value={customization?.backgroundColor || '#FFFFFF'}
                onChange={(e) => updateCustomization('backgroundColor', e.target.value)}
                className="w-full h-12 rounded border border-gray-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Opacity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={customization?.backgroundOpacity || 100}
                onChange={(e) => updateCustomization('backgroundOpacity', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Transparent</span>
                <span>{customization?.backgroundOpacity || 100}%</span>
                <span>Solid</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationPanel;
