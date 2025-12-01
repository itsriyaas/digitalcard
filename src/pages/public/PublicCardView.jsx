import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";

const PublicCardView = () => {
  const { slugOrId } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    apiClient.get(`/cards/public/${slugOrId}`).then((res) => {
      setCard(res.data.card);
    });
  }, []);

  if (!card) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold">{card.title}</h1>
      <p className="text-sm text-gray-600">{card.about}</p>
    </div>
  );
};

export default PublicCardView;
