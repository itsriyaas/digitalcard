import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import QRCode from 'qrcode';

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

const QRCodeManager = ({ qrCode, cardId, cardSlug, cardTitle, onUpdate }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [cardUrl, setCardUrl] = useState('');

  useEffect(() => {
    // Generate card URL using slug (title-based) instead of ID
    const baseUrl = window.location.origin;

    // Use existing slug if available, otherwise generate from title, fallback to ID
    let urlPath = '';
    if (cardSlug) {
      urlPath = cardSlug;
    } else if (cardTitle) {
      urlPath = slugify(cardTitle);
    } else if (cardId) {
      urlPath = cardId;
    }

    const url = urlPath ? `${baseUrl}/card/${urlPath}` : '';
    setCardUrl(url);

    // Generate QR code if enabled
    if (qrCode.enabled && url) {
      generateQRCode(url);
    }
  }, [qrCode.enabled, cardId, cardSlug, cardTitle, qrCode.style]);

  const generateQRCode = async (url) => {
    try {
      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      };

      // Apply style variations
      if (qrCode.style === 'rounded') {
        options.margin = 3;
      } else if (qrCode.style === 'dotted') {
        options.type = 'svg';
      }

      const dataUrl = await QRCode.toDataURL(url, options);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleToggleEnabled = () => {
    onUpdate({ ...qrCode, enabled: !qrCode.enabled });
  };

  const handleStyleChange = (style) => {
    onUpdate({ ...qrCode, style });
  };

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${cardId || 'card'}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const styles = [
    { id: 'default', label: 'Default', description: 'Classic square QR code' },
    { id: 'rounded', label: 'Rounded', description: 'QR code with extra margin' },
    { id: 'minimal', label: 'Minimal', description: 'Compact QR code' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">QR Code Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Generate a QR code that links directly to your digital card. Display it on your card or download it for printing.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-semibold text-gray-800">Show QR Code on Card</p>
              <p className="text-sm text-gray-600">Display QR code in the public view</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={qrCode.enabled}
              onChange={handleToggleEnabled}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>

      {cardUrl && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Card URL:</p>
          <p className="text-sm text-gray-600 break-all font-mono bg-white p-2 rounded border border-gray-300">
            {cardUrl}
          </p>
        </div>
      )}

      {!cardTitle && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Enter a card title to preview the QR code. The URL will be based on your card title (e.g., "/card/my-business").
          </p>
        </div>
      )}

      {qrCode.enabled && (cardSlug || cardTitle || cardId) && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">QR Code Style</h4>
            <div className="grid grid-cols-1 gap-3">
              {styles.map((style) => (
                <label
                  key={style.id}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    qrCode.style === style.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="qr-style"
                    checked={qrCode.style === style.id}
                    onChange={() => handleStyleChange(style.id)}
                    className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{style.label}</p>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-center">QR Code Preview</h4>
            {qrCodeDataUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="border-2 border-gray-200 rounded-lg"
                    style={{ maxWidth: '300px' }}
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiDownload size={20} />
                  Download QR Code
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Generating QR code...
              </div>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Tip:</strong> Download this QR code and print it on business cards, flyers, or posters. When scanned, it will direct people to your digital card.
            </p>
          </div>
        </div>
      )}

      {!qrCode.enabled && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <span className="text-6xl mb-3 block">📱</span>
          <p className="text-gray-600">Enable QR code to see preview and download options</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeManager;
