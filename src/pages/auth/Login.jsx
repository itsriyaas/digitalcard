import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const submit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: (form.email || "").trim(), password: form.password }));
  };

  // Redirect after successful login
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-white">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-[40px]">

        {/* Top Content */}
        <div>
          <p className="opacity-80 text-sm">You can easily</p>
          <h1 className="text-4xl font-bold leading-tight mt-4">
            Create your business digital card <br />
            with lots of information.
          </h1>
        </div>

        {/* Illustration */}
        <div className="flex justify-center py-16">
          <img
            src="/assets/illustrations/hero-illustration.png"
            alt="hero-image"
            className="w-[80%] drop-shadow-xl"
          />
        </div>

        {/* Footer Branding */}
        <div className="mt-auto">
          <p className="text-sm mb-2 opacity-80">Developed By</p>
          <div className="flex gap-6 opacity-90">
            <img src="/assets/logo/logo_white.png" className="w-32" alt="logo" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (Form Section) */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 w-full lg:w-[55%]">

        <h2 className="text-3xl font-bold text-gray-900">Get Started Now</h2>
        <p className="text-gray-500 text-sm mt-1">
          Please login to your account to continue.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center bg-red-100 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email address
            </label>
            <input
              type="email"
              placeholder="youremail@gmail.com"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="************"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold 
            hover:bg-blue-800 transition-all shadow-md"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Signup
            </Link>
          </p>

          {/* Google Login */}
          <div className="flex items-center justify-center mt-4">
            <button
              type="button"
              className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-all"
            >
              <FcGoogle size={22} />
              <span>Login with Google</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
