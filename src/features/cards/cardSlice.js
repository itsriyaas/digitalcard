// src/features/cards/cardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserCards,
  createCard,
  updateCard,
  fetchSingleCard,
} from "./cardThunks";

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    list: [],
    currentCard: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCard: (state) => {
      state.currentCard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All User Cards
      .addCase(fetchUserCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCards.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserCards.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Create Card
      .addCase(createCard.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Fetch Single Card
      .addCase(fetchSingleCard.fulfilled, (state, action) => {
        state.currentCard = action.payload;
      })

      // Update card
      .addCase(updateCard.fulfilled, (state, action) => {
        state.currentCard = action.payload;
      });
  },
});

export const { clearCurrentCard } = cardSlice.actions;
export default cardSlice.reducer;
