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
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Your Cards</h2>
        <Link to="/cards/new" className="bg-gray-900 text-white px-4 py-2 rounded">
          + Create Card
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {list.map((card) => (
          <div key={card._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{card.title}</h3>
            <Link
              to={`/cards/${card._id}/edit`}
              className="text-sm text-blue-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
