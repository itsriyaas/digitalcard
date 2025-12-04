import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { FiMenu } from "react-icons/fi";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">

        {/* MOBILE HEADER (Hamburger + Title + Navbar user menu) */}
        <div className="lg:hidden sticky top-0 z-30 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <FiMenu size={24} />
            </button>

            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>

          {/* Navbar user menu on mobile */}
          <div>
            <Navbar isMobile={true} />
          </div>
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden lg:block">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
