// src/routes/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/OtpVerify";
import ResetPassword from "../pages/auth/ResetPassword";

// Dashboard pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import CardList from "../pages/dashboard/CardList";
import CardBuilder from "../pages/dashboard/CardBuilder";

// Public Page
import PublicCardView from "../pages/public/PublicCardView";

const AppRouter = () => {
  const user = useSelector((state) => state.auth.user);

  const PrivateRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Forgot Password Flow */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* DASHBOARD PRIVATE ROUTES */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="cards" element={<CardList />} />
        <Route path="cards/new" element={<CardBuilder />} />
        <Route path="cards/:cardId/edit" element={<CardBuilder />} />
      </Route>

      {/* PUBLIC DIGITAL CARD */}
      <Route path="/card/:slugOrId" element={<PublicCardView />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
