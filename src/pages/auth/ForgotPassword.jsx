import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../features/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage, otpEmail } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email: (email || "").trim() }));
  };

  // 🚀 Redirect after OTP sent
  useEffect(() => {
    if (successMessage && otpEmail) {
      navigate("/verify-otp", { state: { email: otpEmail } });
    }
  }, [successMessage, otpEmail, navigate]);

  return (
    <div className="flex min-h-screen bg-white">

      {/* LEFT GRADIENT PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-[40px]">

        <div>
          <p className="opacity-80 text-sm">Reset your password</p>
          <h1 className="text-4xl font-bold leading-tight mt-4">
            Forget your password?
            <br /> No worries.
          </h1>
        </div>

           {/* Footer Branding */}
        <div className="mt-auto">
          <p className="text-sm mb-2 opacity-80">Developed By</p>
          <div className="flex gap-6 opacity-90">
            <img src="/assets/logo/logo_white.png" className="w-32" alt="logo" />
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 w-full lg:w-[55%]">

        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we will send you an OTP.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-center bg-red-100 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {successMessage && (
            <p className="text-green-600 text-center bg-green-100 py-2 rounded-md">
              {successMessage}
            </p>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              placeholder="youremail@gmail.com"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition-all shadow-md"
          >
            {loading ? "Sending..." : "Send OTP"}
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

export default ForgotPassword;
