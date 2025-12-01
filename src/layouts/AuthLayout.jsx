import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full bg-white shadow-lg rounded-xl p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
