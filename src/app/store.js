import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cardReducer from "../features/cards/cardSlice";
import uiReducer from "../features/ui/uiSlice";
import catalogueReducer from "../features/catalogue/catalogueSlice";
import productReducer from "../features/product/productSlice";
import categoryReducer from "../features/category/categorySlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import couponReducer from "../features/coupon/couponSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardReducer,
    ui: uiReducer,
    catalogue: catalogueReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
    coupon: couponReducer,
  },
});

export default store;
