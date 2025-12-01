// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "./authThunks";

// Try load user from localStorage (persist login across refreshes)
const persistedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
})();

// also try to persist OTP flow info so user can continue after refresh
const persistedOtpEmail = (() => {
  try {
    return localStorage.getItem("otpEmail");
  } catch (e) {
    return null;
  }
})();

const persistedVerifiedEmail = (() => {
  try {
    return localStorage.getItem("verifiedEmail");
  } catch (e) {
    return null;
  }
})();

const initialState = {
  user: persistedUser || null,
  loading: false,
  error: null,
  successMessage: null,

  // store email for OTP → Reset Password flow
  otpEmail: persistedOtpEmail || null,
  verifiedEmail: persistedVerifiedEmail || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.successMessage = null;
      state.otpEmail = null;
      state.verifiedEmail = null;
      // clear persisted data
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("otpEmail");
        localStorage.removeItem("verifiedEmail");
      } catch (e) {}
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    // ---------------- LOGIN ----------------
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
        // persist user so token survives page reloads
        try {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } catch (e) {
          // ignore localStorage errors
        }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------------- REGISTER ----------------
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
        try {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } catch (e) {}
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------------- FORGOT PASSWORD ----------------
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.successMessage;
      state.otpEmail = action.payload.otpEmail;
      try {
        localStorage.setItem("otpEmail", action.payload.otpEmail);
      } catch (e) {}
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------------- VERIFY OTP ----------------
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.successMessage;
      state.verifiedEmail = action.payload.verifiedEmail;
      try {
        localStorage.setItem("verifiedEmail", action.payload.verifiedEmail);
      } catch (e) {}
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------------- RESET PASSWORD ----------------
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.successMessage;

      // clear OTP flow
      state.otpEmail = null;
      state.verifiedEmail = null;
      try {
        localStorage.removeItem("otpEmail");
        localStorage.removeItem("verifiedEmail");
      } catch (e) {}
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
