import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cardReducer from "../features/cards/cardSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardReducer,
    ui: uiReducer,
  },
});

export default store;
