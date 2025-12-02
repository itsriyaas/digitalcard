import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/cartAPI';

// Get or create session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (catalogueId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      const response = await cartAPI.get(catalogueId, sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ catalogueId, productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      const response = await cartAPI.add(catalogueId, productId, quantity, sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ catalogueId, productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      const response = await cartAPI.update(catalogueId, productId, quantity, sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ catalogueId, productId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      const response = await cartAPI.remove(catalogueId, productId, sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async ({ catalogueId, couponCode }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      const response = await cartAPI.applyCoupon(catalogueId, couponCode, sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid coupon');
    }
  }
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (catalogueId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      const response = await cartAPI.removeCoupon(catalogueId, sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (catalogueId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const sessionId = auth.user ? null : getSessionId();
      await cartAPI.clear(catalogueId, sessionId);
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
    couponMessage: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCouponMessage: (state) => {
      state.couponMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponMessage = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.couponMessage = 'Coupon applied successfully!';
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove coupon
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.couponMessage = null;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });
  }
});

export const { clearError, clearCouponMessage } = cartSlice.actions;
export default cartSlice.reducer;
