import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCopy, FiEyeOff } from 'react-icons/fi';
import { digitalCardAPI } from '../../services/digitalCardAPI';

const DigitalCardList = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await digitalCardAPI.getUserCards();
      setCards(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch cards');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      await digitalCardAPI.delete(id);
      fetchCards();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete card');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await digitalCardAPI.togglePublish(id);
      fetchCards();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update card');
    }
  };

  const copyLink = (slug) => {
    const link = `${window.location.origin}/card/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Digital Cards</h1>
            <p className="text-gray-600 mt-1">Create and manage your digital business cards</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/digital-cards/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus />
            Create New Card
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {cards.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Digital Cards Yet</h3>
            <p className="text-gray-600 mb-6">Create your first digital business card to get started</p>
            <button
              onClick={() => navigate('/dashboard/digital-cards/new')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <FiPlus />
              Create Your First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Card Preview */}
                <div
                  className="h-40 relative"
                  style={{
                    backgroundColor: card.theme?.primaryColor || '#3B82F6',
                    backgroundImage: card.coverImage ? `url(${card.coverImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {card.profileImage && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <img
                        src={card.profileImage}
                        alt={card.name}
                        className="w-20 h-20 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-6 pt-12">
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-1">{card.name}</h3>
                  {card.title && (
                    <p className="text-sm text-gray-600 text-center mb-2">{card.title}</p>
                  )}
                  {card.company && (
                    <p className="text-sm text-gray-500 text-center mb-4">{card.company}</p>
                  )}

                  {/* Stats */}
                  <div className="flex justify-around mb-4 py-3 bg-gray-50 rounded-md">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{card.views || 0}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{card.enquiries || 0}</p>
                      <p className="text-xs text-gray-500">Enquiries</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4 text-center">
                    {card.isPublished ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                        <FiEye size={12} />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                        <FiEyeOff size={12} />
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/digital-cards/edit/${card._id}`)}
                      className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(card._id)}
                      className={`${
                        card.isPublished ? 'bg-gray-50 text-gray-600' : 'bg-green-50 text-green-600'
                      } px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-colors flex items-center justify-center gap-1`}
                    >
                      {card.isPublished ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      {card.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    {card.isPublished && (
                      <button
                        onClick={() => copyLink(card.slug)}
                        className="bg-purple-50 text-purple-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiCopy size={14} />
                        Copy Link
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(card._id)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>

                  {card.isPublished && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <a
                        href={`/card/${card.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <FiEye size={14} />
                        View Public Card
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalCardList;
