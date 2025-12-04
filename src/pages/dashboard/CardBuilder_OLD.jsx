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
import { FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { uploadSingleFile } from "../../services/uploadAPI";

const CardBuilder = () => {
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, loading: reduxLoading } = useSelector((s) => s.cards);

  const isEdit = Boolean(cardId);
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState("basic");
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
    // Validation
    if (!cardData.title || !cardData.about) {
      alert("Please fill in Title and About fields");
      return;
    }

    try {
      setSaving(true);

      // Clean the data before sending to backend
      const cleanedData = JSON.parse(JSON.stringify(cardData));

      // Remove temporary 'id' fields and keep only MongoDB '_id' fields
      if (cleanedData.buttons) {
        cleanedData.buttons = cleanedData.buttons.map(button => {
          const { id, ...rest } = button;
          // Only include _id if it's a valid MongoDB ObjectId (24 hex chars)
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
          console.error('Update error:', result);
          alert("Error updating card: " + (result.error?.message || result.payload || 'Unknown error'));
        }
      } else {
        const result = await dispatch(createCard(cleanedData));
        console.log('Create card result:', result);
        if (result.type === 'cards/createCard/fulfilled') {
          alert("Card created successfully!");
          // Navigate to cards list to see the new card
          navigate('/cards');
        } else {
          console.error('Create error:', result);
          alert("Error creating card: " + (result.error?.message || result.payload || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert("Error saving card: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "basic", label: "Info", icon: "📝" },
    { id: "banner", label: "Banner", icon: "🖼️" },
    { id: "template", label: "Template", icon: "🎨" },
    { id: "buttons", label: "Buttons", icon: "🔘" },
    { id: "enquiry", label: "Enquiry Form", icon: "📧" },
    { id: "customization", label: "Theme Customize", icon: "🎨" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
    { id: "qrcode", label: "QR Code", icon: "📱" }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Card" : "Create New Card"}
          </h2>
          <p className="text-sm text-gray-600">
            Build your digital business card with live preview
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {showPreview ? <FaEyeSlash /> : <FaEye />}
            {showPreview ? "Hide" : "Show"} Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Card"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showPreview ? 'w-full md:w-1/2' : 'w-full'} overflow-auto bg-white border-r-2 border-gray-200`}>
          <div className="sticky top-0 bg-gray-50 border-b-2 border-gray-200 px-4 py-2 z-10">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeSection === "basic" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

                {/* Company Logo Upload */}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">
                          {uploadingLogo ? 'Uploading...' : 'Upload Company Logo'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (Recommended: Square)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          disabled={uploadingLogo}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This logo will appear at the top of your card</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Title *
                  </label>
                  <input
                    type="text"
                    value={cardData.title}
                    onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                    placeholder="e.g., John's Photography Studio"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <input
                    type="text"
                    value={cardData.businessType}
                    onChange={(e) => setCardData({ ...cardData, businessType: e.target.value })}
                    placeholder="e.g., Photography, Restaurant, Consulting"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Your Business *
                  </label>
                  <textarea
                    value={cardData.about}
                    onChange={(e) => setCardData({ ...cardData, about: e.target.value })}
                    placeholder="Tell people about your business..."
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeSection === "banner" && (
              <CoverMediaUpload
                coverMedia={cardData.coverMedia}
                onUpdate={(coverMedia) => setCardData({ ...cardData, coverMedia })}
              />
            )}

            {activeSection === "template" && (
              <TemplateSelector
                selectedTemplate={cardData.template}
                onTemplateSelect={(template) => setCardData({ ...cardData, template })}
                filterType={cardData.template?.filterType || "all"}
              />
            )}

            {activeSection === "buttons" && (
              <ButtonsManager
                buttons={cardData.buttons}
                onUpdate={(buttons) => setCardData({ ...cardData, buttons })}
              />
            )}

            {activeSection === "enquiry" && (
              <EnquiryFormManager
                enquiryForm={cardData.enquiryForm}
                onUpdate={(enquiryForm) => setCardData({ ...cardData, enquiryForm })}
              />
            )}

            {activeSection === "customization" && (
              <CustomizationPanel
                customization={cardData.customization}
                onUpdate={(customization) => setCardData({ ...cardData, customization })}
              />
            )}

            {activeSection === "gallery" && (
              <GalleryManager
                gallery={cardData.gallery}
                onUpdate={(gallery) => setCardData({ ...cardData, gallery })}
              />
            )}

            {activeSection === "qrcode" && (
              <QRCodeManager
                qrCode={cardData.qrCode}
                cardId={cardId}
                cardSlug={cardData.slug}
                cardTitle={cardData.title}
                onUpdate={(qrCode) => setCardData({ ...cardData, qrCode })}
              />
            )}
          </div>
        </div>

        {showPreview && (
          <div className="hidden md:block w-1/2 bg-gray-100">
            <LivePreview cardData={cardData} />
          </div>
        )}
      </div>

      {!showPreview && (
        <button
          onClick={() => setShowPreview(true)}
          className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FaEye size={24} />
        </button>
      )}
    </div>
  );
};

export default CardBuilder;
