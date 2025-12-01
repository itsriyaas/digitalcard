import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleCard,
  createCard,
  updateCard,
} from "../../features/cards/cardThunks";

const CardBuilder = () => {
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const { currentCard } = useSelector((s) => s.cards);

  const isEdit = Boolean(cardId);

  const [form, setForm] = React.useState({
    title: "",
    businessType: "",
    about: "",
  });

  useEffect(() => {
    if (isEdit) dispatch(fetchSingleCard(cardId));
  }, [cardId]);

  useEffect(() => {
    if (currentCard && isEdit) setForm(currentCard);
  }, [currentCard]);

  const submit = () => {
    if (isEdit) dispatch(updateCard({ id: cardId, payload: form }));
    else dispatch(createCard(form));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Card" : "Create New Card"}
      </h2>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-2"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Business Type"
        className="border p-2 w-full mb-2"
        value={form.businessType}
        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
      />

      <textarea
        placeholder="About"
        className="border p-2 w-full mb-4"
        value={form.about}
        onChange={(e) => setForm({ ...form, about: e.target.value })}
      />

      <button onClick={submit} className="bg-gray-900 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
};

export default CardBuilder;
