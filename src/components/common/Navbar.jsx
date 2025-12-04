import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);

  return (
    <div className="h-14 bg-white flex items-center justify-between relative">
      {/* Left Side */}
      <h2 className="font-bold text-lg text-purple-700"></h2>

      {/* Right Side */}
      <div className="flex items-center gap-2 relative">
        {/* User Info */}
        <div className="text-right leading-tight">
          <p className="font-semibold text-blue-700">{user?.name || "Admin"}</p>
          <p className="text-xs text-gray-500">{user?.role || "Customer"}</p>
        </div>

        {/* Avatar Button */}
        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-1 rounded-full flex items-center justify-center cursor-pointer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
        </div>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 top-14 bg-white shadow-lg rounded-xl w-40 py-3 z-50">
            <ul className="text-black-700">
              <li
                onClick={() => dispatch(logout())}
                className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 text-red-500"
              >
                <span><FiLogOut/></span> Signout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
