import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-4">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex items-center gap-3">
        <p className="text-sm">{user?.name}</p>
        <button
          onClick={() => dispatch(logout())}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
