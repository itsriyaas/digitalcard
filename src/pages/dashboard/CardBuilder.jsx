import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleCard,
  createCard,
  updateCard,
} from "../../features/cards/cardThunks";
import TemplateSelector from "../../components/cards/TemplateSelector";
import CustomizationPanel from "../../components/cards/CustomizationPanel";
import { getFullUrl } from "../../utils/urlHelper";
import CoverMediaUpload from "../../components/cards/CoverMediaUpload";
import GalleryManager from "../../components/cards/GalleryManager";
import ButtonsManager from "../../components/cards/ButtonsManager";
import EnquiryFormManager from "../../components/cards/EnquiryFormManager";
import QRCodeManager from "../../components/cards/QRCodeManager";
import LivePreview from "../../components/cards/LivePreview";
import { FaSave, FaEye, FaEyeSlash, FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa";
import { uploadSingleFile } from "../../services/uploadAPI";

const CardBuilder = () => {
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, loading: reduxLoading } = useSelector((s) => s.cards);

  const isEdit = Boolean(cardId);
  const [showPreview, setShowPreview] = useState(window.innerWidth >= 768);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  const [cardData, setCardData] = useState({
    title: "",
    businessType: "",
    about: "",
    logo: "",
    template: {
      templateId: "list-basic",
      filterType: "all"
    },
    customization: {
      colorTheme: {
        id: 'blue',
        name: 'Ocean Blue',
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#60A5FA'
      },
      layout: "centered",
      spacing: "normal",
      borderRadius: 8,
      backgroundPattern: "none",
      backgroundColor: "#FFFFFF",
      backgroundOpacity: 100
    },
    coverMedia: null,
    gallery: [],
    buttons: [],
    enquiryForm: {
      enabled: false,
      fields: ['name', 'email', 'phone', 'message']
    },
    qrCode: {
      enabled: false,
      style: 'default'
    }
  });

  useEffect(() => {
    if (isEdit) dispatch(fetchSingleCard(cardId));
  }, [cardId]);

  useEffect(() => {
    if (currentCard && isEdit) {
      setCardData({
        ...cardData,
        ...currentCard
      });
    }
  }, [currentCard]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const response = await uploadSingleFile(file);
      const logoUrl = response.file?.url || response.url || response;
      setCardData({ ...cardData, logo: logoUrl });
    } catch (error) {
      console.error('Logo upload error:', error);
      alert("Failed to upload logo: " + (error.message || 'Unknown error'));
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!cardData.title || !cardData.about) {
      alert("Please fill in Title and About fields");
      return;
    }

    try {
      setSaving(true);
      const cleanedData = JSON.parse(JSON.stringify(cardData));

      if (cleanedData.buttons) {
        cleanedData.buttons = cleanedData.buttons.map(button => {
          const { id, ...rest } = button;
          if (button._id && typeof button._id === 'string' && button._id.length === 24) {
            return { ...rest, _id: button._id };
          }
          return rest;
        });
      }

      if (cleanedData.gallery) {
        cleanedData.gallery = cleanedData.gallery.map(image => {
          const { id, ...rest } = image;
          if (image._id && typeof image._id === 'string' && image._id.length === 24) {
            return { ...rest, _id: image._id };
          }
          return rest;
        });
      }

      if (isEdit) {
        const result = await dispatch(updateCard({ id: cardId, payload: cleanedData }));
        if (result.type === 'cards/updateCard/fulfilled') {
          alert("Card updated successfully!");
        } else {
          alert("Error updating card: " + (result.error?.message || result.payload || 'Unknown error'));
        }
      } else {
        const result = await dispatch(createCard(cleanedData));
        if (result.type === 'cards/createCard/fulfilled') {
          alert("Card created successfully!");
          navigate('/cards');
        } else {
          alert("Error creating card: " + (result.error?.message || result.payload || 'Unknown error'));
        }
      }
    } catch (error) {
      alert("Error saving card: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      id: "basic",
      label: "Basic Info",
      icon: "📝",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {cardData.logo ? (
                <div className="relative">
                  <img
                    src={getFullUrl(cardData.logo)}
                    alt="Company Logo"
                    className="w-32 h-32 object-contain mx-auto border border-gray-200 rounded-lg p-2 bg-white"
                    onError={(e) => {
                      console.error('Logo preview failed to load:', cardData.logo);
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setCardData({ ...cardData, logo: '' })}
                    className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">
                    {uploadingLogo ? 'Uploading...' : 'Click to upload logo'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={cardData.title}
              onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
              placeholder="My Company Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <input
              type="text"
              value={cardData.businessType}
              onChange={(e) => setCardData({ ...cardData, businessType: e.target.value })}
              placeholder="e.g., Restaurant, Retail, Services"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Your Business *
            </label>
            <textarea
              value={cardData.about}
              onChange={(e) => setCardData({ ...cardData, about: e.target.value })}
              placeholder="Tell visitors about your business..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    },
    {
      id: "banner",
      label: "Cover Media",
      icon: "🖼️",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Cover Media</h3>
          <p className="text-sm text-gray-600">Add a banner image or video to your card</p>
          <CoverMediaUpload
            coverMedia={cardData.coverMedia}
            onUpdate={(media) => setCardData({ ...cardData, coverMedia: media })}
          />
        </div>
      )
    },
    {
      id: "template",
      label: "Template",
      icon: "🎨",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Choose Template</h3>
          <p className="text-sm text-gray-600">Select a template for your digital card</p>
          <TemplateSelector
            template={cardData.template}
            onUpdate={(template) => setCardData({ ...cardData, template })}
          />
        </div>
      )
    },
    {
      id: "customization",
      label: "Customize Theme",
      icon: "🎨",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Customize Theme</h3>
          <p className="text-sm text-gray-600">Customize colors, layout, and styling</p>
          <CustomizationPanel
            customization={cardData.customization}
            onUpdate={(customization) => setCardData({ ...cardData, customization })}
          />
        </div>
      )
    },
    {
      id: "buttons",
      label: "Action Buttons",
      icon: "🔘",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Action Buttons</h3>
          <p className="text-sm text-gray-600">Add call-to-action buttons (Call, WhatsApp, etc.)</p>
          <ButtonsManager
            buttons={cardData.buttons}
            onUpdate={(buttons) => setCardData({ ...cardData, buttons })}
          />
        </div>
      )
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: "🖼️",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Photo Gallery</h3>
          <p className="text-sm text-gray-600">Upload images to showcase your work</p>
          <GalleryManager
            gallery={cardData.gallery}
            onUpdate={(gallery) => setCardData({ ...cardData, gallery })}
          />
        </div>
      )
    },
    {
      id: "enquiry",
      label: "Enquiry Form",
      icon: "📧",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Enquiry Form</h3>
          <p className="text-sm text-gray-600">Let visitors send you enquiries</p>
          <EnquiryFormManager
            enquiryForm={cardData.enquiryForm}
            onUpdate={(enquiryForm) => setCardData({ ...cardData, enquiryForm })}
          />
        </div>
      )
    },
    {
      id: "qrcode",
      label: "QR Code",
      icon: "📱",
      component: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">QR Code</h3>
          <p className="text-sm text-gray-600">Generate a QR code for easy sharing</p>
          <QRCodeManager
            qrCode={cardData.qrCode}
            onUpdate={(qrCode) => setCardData({ ...cardData, qrCode })}
          />
        </div>
      )
    }
  ];

  const canProceedToNextStep = () => {
    if (currentStep === 0) {
      return cardData.title && cardData.about;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {isEdit ? "Edit Card" : "Create New Card"}
              </h2>
              <p className="text-sm text-gray-600 hidden md:block">
                Build your digital business card step by step
              </p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base"
              >
                {showPreview ? <FaEyeSlash /> : <FaEye />}
                <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"} Preview</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm md:text-base"
              >
                <FaSave />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps (Mobile: Horizontal Scroll, Desktop: Full Width) */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex md:grid md:grid-cols-8 gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center gap-1 min-w-[80px] md:min-w-0 px-3 py-2 rounded-lg transition-all ${
                  currentStep === index
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : currentStep > index
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{currentStep > index ? <FaCheck className="text-green-600 text-sm" /> : step.icon}</span>
                <span className={`text-xs font-medium text-center ${
                  currentStep === index ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className={`${showPreview && window.innerWidth >= 1024 ? '' : 'lg:col-span-2'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              {steps[currentStep].component}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceedToNextStep()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FaChevronRight />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaCheck />
                    Finish & Save
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section (Desktop Only or Toggle on Mobile) */}
          {showPreview && (
            <div className="hidden lg:block sticky top-24 h-fit">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
                <div className="border rounded-lg overflow-hidden">
                  <LivePreview cardData={cardData} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Preview Modal */}
        {showPreview && window.innerWidth < 1024 && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setShowPreview(false)}>
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">Preview</h3>
                <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <LivePreview cardData={cardData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardBuilder;
