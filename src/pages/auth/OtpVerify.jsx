import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../features/auth/authThunks";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from Forgot Password page — fallback to otpEmail from redux
  const otpEmail = useSelector((s) => s.auth.otpEmail);
  const email = location.state?.email || otpEmail;

  const { loading, error, successMessage } = useSelector((s) => s.auth);
  const [otp, setOtp] = useState("");

  const submit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp: (otp || "").trim() }));
  };

  // 🚀 Redirect to Reset Password after OTP success
 useEffect(() => {
  console.log("SUCCESS MESSAGE:", successMessage);

  // redirect if OTP verified
  if (successMessage && successMessage.toLowerCase().includes("otp")) {
    navigate("/reset-password", { state: { email } });
  }
}, [successMessage, navigate, email]);


  return (
    <div className="flex min-h-screen bg-white">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-[40px]">
        <div>
          <p className="opacity-80 text-sm">Email Verification</p>
          <h1 className="text-4xl font-bold leading-tight mt-4">
            Enter the verification <br /> code sent to your email.
          </h1>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 w-full lg:w-[55%]">

        <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter the 6-digit OTP sent to:  
          <span className="font-semibold"> {email}</span>
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

          {/* OTP INPUT */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Verification Code
            </label>
            <input
              maxLength={6}
              type="text"
              placeholder="123456"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 text-center text-lg tracking-[6px] 
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* VERIFY BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition-all shadow-md"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Didn’t receive it?{" "}
            <button className="text-blue-600 font-semibold">Resend Code</button>
          </p>

          <p className="text-center text-gray-500 text-sm">
            Back to{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

        </form>
      </div>

    </div>
  );
};

export default EmailVerification;
