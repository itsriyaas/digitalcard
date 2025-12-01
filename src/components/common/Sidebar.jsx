import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 block text-sm rounded ${
      pathname === path ? "bg-gray-900 text-white" : "text-gray-700"
    }`;

  return (
    <div className="w-60 bg-white shadow h-screen p-4">
      <h3 className="font-bold text-lg mb-6">Menu</h3>

      <Link className={linkClass("/")} to="/">
        Dashboard
      </Link>

      <Link className={linkClass("/cards")} to="/cards">
        Digital Cards
      </Link>

      <Link className={linkClass("/cards/new")} to="/cards/new">
        Create Card
      </Link>
    </div>
  );
};

export default Sidebar;
