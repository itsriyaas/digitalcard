import React, { useState } from 'react';
import { FaImage, FaVideo, FaTrash, FaUpload, FaLink } from 'react-icons/fa';

const CoverMediaUpload = ({ coverMedia, onUpdate }) => {
  const [mediaType, setMediaType] = useState(coverMedia?.type || 'image');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          type: mediaType,
          source: 'file',
          url: reader.result,
          fileName: file.name,
          fileSize: file.size
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUpdate({
        type: mediaType,
        source: 'url',
        url: urlInput.trim()
      });
      setUrlInput('');
    }
  };

  const handleRemove = () => {
    onUpdate(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Cover Media</h3>
        {coverMedia && (
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <FaTrash /> Remove
          </button>
        )}
      </div>

      {!coverMedia ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMediaType('image')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                mediaType === 'image'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:border-blue-300'
              }`}
            >
              <FaImage /> Image
            </button>
            <button
              onClick={() => setMediaType('video')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                mediaType === 'video'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 text-gray-600 hover:border-blue-300'
              }`}
            >
              <FaVideo /> Video
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                uploadMethod === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaUpload className="inline mr-2" /> Upload File
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                uploadMethod === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaLink className="inline mr-2" /> Use URL
            </button>
          </div>

          {uploadMethod === 'file' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileUpload}
                className="hidden"
                id="cover-media-upload"
              />
              <label
                htmlFor="cover-media-upload"
                className="cursor-pointer"
              >
                <div className="text-5xl mb-3">
                  {mediaType === 'image' ? '🖼️' : '🎬'}
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  Click to upload {mediaType}
                </p>
                <p className="text-sm text-gray-500">
                  {mediaType === 'image'
                    ? 'PNG, JPG, GIF up to 10MB'
                    : 'MP4, WebM up to 50MB'}
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={`Enter ${mediaType} URL...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add {mediaType} from URL
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            {coverMedia.type === 'image' ? (
              <img
                src={coverMedia.url}
                alt="Cover"
                className="w-full h-48 object-cover"
              />
            ) : (
              <video
                src={coverMedia.url}
                controls
                className="w-full h-48 object-cover"
              />
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {coverMedia.type}
            </p>
            {coverMedia.fileName && (
              <p className="text-sm text-gray-600">
                <strong>File:</strong> {coverMedia.fileName}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Source:</strong> {coverMedia.source === 'file' ? 'Uploaded File' : 'URL'}
            </p>
          </div>

          <button
            onClick={() => onUpdate(null)}
            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Change Media
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverMediaUpload;
