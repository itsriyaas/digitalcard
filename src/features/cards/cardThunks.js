// src/features/cards/cardThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

export const fetchUserCards = createAsyncThunk(
  "cards/fetchUserCards",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/cards/user");
      return data.cards;
    } catch (err) {
      return rejectWithValue("Unable to load cards");
    }
  }
);

export const fetchSingleCard = createAsyncThunk(
  "cards/fetchSingleCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/cards/${cardId}`);
      return data.card;
    } catch (err) {
      return rejectWithValue("Unable to load card");
    }
  }
);

export const createCard = createAsyncThunk(
  "cards/createCard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/cards", payload);
      return data.card;
    } catch (err) {
      return rejectWithValue("Card creation failed");
    }
  }
);

export const updateCard = createAsyncThunk(
  "cards/updateCard",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/cards/${id}`, payload);
      return data.card;
    } catch (err) {
      return rejectWithValue("Update failed");
    }
  }
);
