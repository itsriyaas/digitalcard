import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHome, FiShoppingBag, FiCreditCard, FiPlusCircle, FiPackage, FiTag, FiShoppingCart, FiBarChart2, FiPercent, FiUsers } from "react-icons/fi";

const Sidebar = () => {
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

  return (
    <div className="w-full sm:w-64 bg-white shadow h-screen p-4 overflow-y-auto">
      <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-gray-900">
        {isAdmin ? 'Admin Panel' : isCustomer ? 'Customer Portal' : 'Dashboard'}
      </h3>

      <div className="space-y-1">
        <Link className={linkClass("/")} to="/">
          <FiHome />
          <span>Dashboard</span>
        </Link>

        {isAdmin ? (
          // Admin Menu Items
          <>
            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">Management</p>
            </div>

            <Link className={linkClass("/admin/customers")} to="/admin/customers">
              <FiUsers />
              <span>Customers</span>
            </Link>

            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">E-Commerce</p>
            </div>

            <Link className={linkClass("/admin/catalogues")} to="/admin/catalogues">
              <FiShoppingBag />
              <span>Catalogues</span>
            </Link>

            <Link className={linkClass("/admin/products")} to="/admin/products">
              <FiPackage />
              <span>Products</span>
            </Link>

            <Link className={linkClass("/admin/categories")} to="/admin/categories">
              <FiTag />
              <span>Categories</span>
            </Link>

            <Link className={linkClass("/admin/coupons")} to="/admin/coupons">
              <FiPercent />
              <span>Coupons</span>
            </Link>

            <Link className={linkClass("/admin/orders")} to="/admin/orders">
              <FiShoppingCart />
              <span>Orders</span>
            </Link>

            <Link className={linkClass("/admin/analytics")} to="/admin/analytics">
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

            <Link className={linkClass("/admin/catalogues")} to="/admin/catalogues">
              <FiShoppingBag />
              <span>My Catalogues</span>
            </Link>

            <Link className={linkClass("/admin/products")} to="/admin/products">
              <FiPackage />
              <span>My Products</span>
            </Link>

            <Link className={linkClass("/admin/categories")} to="/admin/categories">
              <FiTag />
              <span>Categories</span>
            </Link>

            <Link className={linkClass("/admin/coupons")} to="/admin/coupons">
              <FiPercent />
              <span>My Coupons</span>
            </Link>

            <Link className={linkClass("/admin/orders")} to="/admin/orders">
              <FiShoppingCart />
              <span>Orders</span>
            </Link>

            <Link className={linkClass("/admin/analytics")} to="/admin/analytics">
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

            <Link className={linkClass("/admin/catalogues")} to="/admin/catalogues">
              <FiShoppingBag />
              <span>My Catalogues</span>
            </Link>

            <div className="pt-3 sm:pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 sm:px-4">Digital Cards</p>
            </div>

            <Link className={linkClass("/cards")} to="/cards">
              <FiCreditCard />
              <span>My Cards</span>
            </Link>

            <Link className={linkClass("/cards/new")} to="/cards/new">
              <FiPlusCircle />
              <span>Create Card</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
