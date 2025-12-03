import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCards } from "../../features/cards/cardThunks";
import { Link } from "react-router-dom";

const CardList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.cards);

  useEffect(() => {
    dispatch(fetchUserCards());
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Cards</h2>
          <p className="text-sm text-gray-600 mt-1">
            {list.length} {list.length === 1 ? 'card' : 'cards'} created
          </p>
        </div>
        <Link
          to="/cards/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span> Create New Card
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading your cards...</p>
        </div>
      )}

      {!loading && list.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🎴</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No cards yet</h3>
          <p className="text-gray-600 mb-6">Create your first digital business card</p>
          <Link
            to="/cards/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Card
          </Link>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((card) => (
            <div
              key={card._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
            >
              {card.coverMedia?.url && (
                <div className="h-32 bg-gray-200">
                  {card.coverMedia.type === 'image' ? (
                    <img
                      src={card.coverMedia.url}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={card.coverMedia.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{card.title}</h3>
                {card.businessType && (
                  <p className="text-sm text-gray-500 mb-3">{card.businessType}</p>
                )}
                {card.about && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{card.about}</p>
                )}
                <div className="flex gap-2 items-center text-xs text-gray-500 mb-4">
                  <span>👁️ {card.analytics?.views || 0} views</span>
                  <span>•</span>
                  <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/cards/${card._id}/edit`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/card/${card.slug || card._id}`}
                    target="_blank"
                    className="flex-1 text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardList;
