import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../features/auth/authThunks";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loading, error, verifiedEmail, successMessage } = useSelector(
    (s) => s.auth
  );

  const email = state?.email || verifiedEmail;

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
  });

  const [redirectTimer, setRedirectTimer] = useState(3); // countdown

  const submit = (e) => {
    e.preventDefault();

    if (!email)
      return alert("Email missing. Go back to Forgot Password.");

    dispatch(
      resetPassword({
        email,
        otp: (form.otp || "").trim(),
        newPassword: form.newPassword,
      })
    );
  };

  // -------- 3-SECOND REDIRECT AFTER SUCCESS PASSWORD RESET --------
  useEffect(() => {
    if (successMessage === "Password reset successfully") {
      const interval = setInterval(() => {
        setRedirectTimer((sec) => sec - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [successMessage, navigate]);

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* LEFT GRADIENT PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-[40px]">
        <div>
          <p className="opacity-80 text-sm">Password recovery</p>
          <h1 className="text-4xl font-bold leading-tight mt-4">
            Reset your password <br /> securely
          </h1>
        </div>

        <div className="flex justify-center py-16">
          <img
            src="/assets/illustrations/illustration1.png"
            alt="reset-password"
            className="w-[75%] drop-shadow-xl"
          />
        </div>

        <div className="mt-auto">
          <p className="text-sm mb-2 opacity-80">Developed By</p>
          <img src="/assets/logo/logo_white.png" className="w-32" />
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 w-full lg:w-[55%]">

        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter OTP and your new password to continue.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-center bg-red-100 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* SUCCESS + Timer UI */}
          {successMessage === "Password reset successfully" && (
            <p className="text-green-600 text-center bg-green-100 py-2 rounded-md">
              {successMessage} — Redirecting in {redirectTimer}s...
            </p>
          )}

          {/* OTP */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              placeholder="************"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold 
            hover:bg-blue-800 transition-all shadow-md"
          >
            {loading ? "Loading..." : "Reset Password"}
          </button>

          <p className="text-center text-gray-500 text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
