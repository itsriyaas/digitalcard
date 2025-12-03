// src/features/cards/cardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserCards,
  createCard,
  updateCard,
  fetchSingleCard,
  deleteCard,
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
      .addCase(createCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.currentCard = action.payload;
        state.loading = false;
      })
      .addCase(createCard.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch Single Card
      .addCase(fetchSingleCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleCard.fulfilled, (state, action) => {
        state.currentCard = action.payload;
        state.loading = false;
      })
      .addCase(fetchSingleCard.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update card
      .addCase(updateCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        state.currentCard = action.payload;
        // Update the card in the list as well
        const index = state.list.findIndex(card => card._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Delete card
      .addCase(deleteCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.list = state.list.filter(card => card._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearCurrentCard } = cardSlice.actions;
export default cardSlice.reducer;
