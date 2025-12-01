// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

// ------------------ LOGIN ------------------
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ------------------ REGISTER ------------------
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ------------------ FORGOT PASSWORD (SEND OTP) ------------------
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });

      return {
        successMessage: data.message,
        otpEmail: email,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

// ------------------ VERIFY OTP ------------------
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/verify-reset-otp", {
        email,
        otp,
      });

      return {
        successMessage: data.message,
        verifiedEmail: email,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// ------------------ RESET PASSWORD ------------------
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      return {
        successMessage: data.message,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Password reset failed"
      );
    }
  }
);
