import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHome, FiShoppingBag, FiCreditCard, FiPlusCircle, FiPackage, FiTag, FiShoppingCart, FiBarChart2, FiPercent, FiUsers, FiX } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const linkClass = (path) =>
    `px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm rounded transition-colors ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLinkClick = () => {
    // Close mobile menu when link is clicked
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-screen overflow-y-auto`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4">
      <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-gray-900">
        {isAdmin ? 'Admin Panel' : isCustomer ? 'Customer Portal' : 'Dashboard'}
      </h3>

      <div className="space-y-1">
        <Link className={linkClass("/")} to="/" onClick={handleLinkClick}>
          <FiHome />
          <span>Dashboard</span>
        </Link>

        {isAdmin ? (
          // Admin Menu Items
          <>
            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">Management</p>
            </div>

            <Link className={linkClass("/admin/customers")} to="/admin/customers" onClick={handleLinkClick}>
              <FiUsers />
              <span>Customers</span>
            </Link>

            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">E-Commerce</p>
            </div>

            <Link className={linkClass("/admin/catalogues")} to="/admin/catalogues" onClick={handleLinkClick}>
              <FiShoppingBag />
              <span>Catalogues</span>
            </Link>

            <Link className={linkClass("/admin/products")} to="/admin/products" onClick={handleLinkClick}>
              <FiPackage />
              <span>Products</span>
            </Link>

            <Link className={linkClass("/admin/categories")} to="/admin/categories" onClick={handleLinkClick}>
              <FiTag />
              <span>Categories</span>
            </Link>

            <Link className={linkClass("/admin/coupons")} to="/admin/coupons" onClick={handleLinkClick}>
              <FiPercent />
              <span>Coupons</span>
            </Link>

            <Link className={linkClass("/admin/orders")} to="/admin/orders" onClick={handleLinkClick}>
              <FiShoppingCart />
              <span>Orders</span>
            </Link>

            <Link className={linkClass("/admin/analytics")} to="/admin/analytics" onClick={handleLinkClick}>
              <FiBarChart2 />
              <span>Analytics</span>
            </Link>
          </>
        ) : isCustomer ? (
          // Customer Menu Items
          <>
            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">My E-Commerce</p>
            </div>

            <Link className={linkClass("/admin/catalogues")} to="/admin/catalogues" onClick={handleLinkClick}>
              <FiShoppingBag />
              <span>My Catalogues</span>
            </Link>

            <Link className={linkClass("/admin/products")} to="/admin/products" onClick={handleLinkClick}>
              <FiPackage />
              <span>My Products</span>
            </Link>

            <Link className={linkClass("/admin/categories")} to="/admin/categories" onClick={handleLinkClick}>
              <FiTag />
              <span>Categories</span>
            </Link>

            <Link className={linkClass("/admin/coupons")} to="/admin/coupons" onClick={handleLinkClick}>
              <FiPercent />
              <span>My Coupons</span>
            </Link>

            <Link className={linkClass("/admin/orders")} to="/admin/orders" onClick={handleLinkClick}>
              <FiShoppingCart />
              <span>Orders</span>
            </Link>

            <Link className={linkClass("/admin/analytics")} to="/admin/analytics" onClick={handleLinkClick}>
              <FiBarChart2 />
              <span>Analytics</span>
            </Link>
          </>
        ) : (
          // Regular User Menu Items
          <>
            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">My Catalogues</p>
            </div>

            <Link className={linkClass("/admin/catalogues")} to="/admin/catalogues" onClick={handleLinkClick}>
              <FiShoppingBag />
              <span>My Catalogues</span>
            </Link>

            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">Digital Cards</p>
            </div>

            <Link className={linkClass("/cards")} to="/cards" onClick={handleLinkClick}>
              <FiCreditCard />
              <span>My Cards</span>
            </Link>

            <Link className={linkClass("/cards/new")} to="/cards/new" onClick={handleLinkClick}>
              <FiPlusCircle />
              <span>Create Card</span>
            </Link>
          </>
        )}
      </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
