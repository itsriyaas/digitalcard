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
import CoverMediaUpload from "../../components/cards/CoverMediaUpload";
import GalleryManager from "../../components/cards/GalleryManager";
import ProductsManager from "../../components/cards/ProductsManager";
import TestimonialsManager from "../../components/cards/TestimonialsManager";
import OffersManager from "../../components/cards/OffersManager";
import ButtonsManager from "../../components/cards/ButtonsManager";
import LivePreview from "../../components/cards/LivePreview";
import { FaSave, FaEye, FaEyeSlash } from "react-icons/fa";

const CardBuilder = () => {
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, loading } = useSelector((s) => s.cards);

  const isEdit = Boolean(cardId);
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState("basic");

  const [cardData, setCardData] = useState({
    title: "",
    businessType: "",
    about: "",
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
    products: [],
    testimonials: [],
    offers: [],
    buttons: []
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

  const handleSave = async () => {
    try {
      if (isEdit) {
        const result = await dispatch(updateCard({ id: cardId, payload: cardData }));
        if (result.type === 'cards/updateCard/fulfilled') {
          alert("Card updated successfully!");
        } else {
          alert("Error updating card");
        }
      } else {
        const result = await dispatch(createCard(cardData));
        if (result.type === 'cards/createCard/fulfilled') {
          alert("Card created successfully!");
          // Navigate to cards list to see the new card
          navigate('/cards');
        } else {
          alert("Error creating card");
        }
      }
    } catch (error) {
      alert("Error saving card: " + error.message);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: "📝" },
    { id: "template", label: "Template", icon: "🎨" },
    { id: "customization", label: "Customize", icon: "🎨" },
    { id: "cover", label: "Cover Media", icon: "🖼️" },
    { id: "buttons", label: "Buttons", icon: "🔘" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
    { id: "products", label: "Products", icon: "🛍️" },
    { id: "testimonials", label: "Testimonials", icon: "💬" },
    { id: "offers", label: "Offers", icon: "🏷️" }
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
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <FaSave />
            {loading ? "Saving..." : "Save Card"}
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

            {activeSection === "template" && (
              <TemplateSelector
                selectedTemplate={cardData.template}
                onTemplateSelect={(template) => setCardData({ ...cardData, template })}
                filterType={cardData.template?.filterType || "all"}
              />
            )}

            {activeSection === "customization" && (
              <CustomizationPanel
                customization={cardData.customization}
                onUpdate={(customization) => setCardData({ ...cardData, customization })}
              />
            )}

            {activeSection === "cover" && (
              <CoverMediaUpload
                coverMedia={cardData.coverMedia}
                onUpdate={(coverMedia) => setCardData({ ...cardData, coverMedia })}
              />
            )}

            {activeSection === "buttons" && (
              <ButtonsManager
                buttons={cardData.buttons}
                onUpdate={(buttons) => setCardData({ ...cardData, buttons })}
              />
            )}

            {activeSection === "gallery" && (
              <GalleryManager
                gallery={cardData.gallery}
                onUpdate={(gallery) => setCardData({ ...cardData, gallery })}
              />
            )}

            {activeSection === "products" && (
              <ProductsManager
                products={cardData.products}
                onUpdate={(products) => setCardData({ ...cardData, products })}
              />
            )}

            {activeSection === "testimonials" && (
              <TestimonialsManager
                testimonials={cardData.testimonials}
                onUpdate={(testimonials) => setCardData({ ...cardData, testimonials })}
              />
            )}

            {activeSection === "offers" && (
              <OffersManager
                offers={cardData.offers}
                onUpdate={(offers) => setCardData({ ...cardData, offers })}
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
