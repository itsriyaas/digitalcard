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

// Admin E-Commerce Pages
import CatalogueList from "../pages/admin/CatalogueList";
import CatalogueForm from "../pages/admin/CatalogueForm";
import ProductList from "../pages/admin/ProductList";
import ProductForm from "../pages/admin/ProductForm";
import CategoryList from "../pages/admin/CategoryList";
import CouponList from "../pages/admin/CouponList";
import OrderList from "../pages/admin/OrderList";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import CustomerList from "../pages/admin/CustomerList";
import CustomerForm from "../pages/admin/CustomerForm";

// Public Pages
import PublicCardView from "../pages/public/PublicCardView";
import CatalogueLanding from "../pages/public/CatalogueLanding";
import ProductDetails from "../pages/public/ProductDetails";
import ShoppingCart from "../pages/public/ShoppingCart";
import Checkout from "../pages/public/Checkout";
import OrderConfirmation from "../pages/public/OrderConfirmation";

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

      {/* ADMIN E-COMMERCE ROUTES */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin/catalogues" replace />} />

        {/* Customer Management Routes (Admin Only) */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/new" element={<CustomerForm />} />
        <Route path="customers/:id/edit" element={<CustomerForm />} />

        {/* E-Commerce Routes (Admin & Customer) */}
        <Route path="catalogues" element={<CatalogueList />} />
        <Route path="catalogues/new" element={<CatalogueForm />} />
        <Route path="catalogues/:id/edit" element={<CatalogueForm />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="coupons" element={<CouponList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* PUBLIC DIGITAL CARD - Legacy digital card routes */}
      <Route path="/card/:slugOrId" element={<PublicCardView />} />

      {/* PUBLIC E-CATALOGUE ROUTES - New e-commerce routes */}
      <Route path="/catalogue/:slug" element={<CatalogueLanding />} />
      <Route path="/catalogue/:slug/product/:productId" element={<ProductDetails />} />
      <Route path="/catalogue/:slug/cart" element={<ShoppingCart />} />
      <Route path="/catalogue/:slug/checkout" element={<Checkout />} />
      <Route path="/catalogue/:slug/order/:orderId" element={<OrderConfirmation />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
