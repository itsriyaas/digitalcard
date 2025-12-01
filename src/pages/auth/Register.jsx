import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  // Redirect after successful register
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-white">

      {/* LEFT SIDE - Gradient Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-r-[40px]">

        {/* Top Section */}
        <div>
          <p className="opacity-80 text-sm">You can easily</p>

          <h1 className="text-4xl font-bold leading-tight mt-4">
            Create your account <br />
            and get started instantly
          </h1>
        </div>

        {/* Illustration Section */}
        <div className="flex justify-center py-16">
          <img
            src="/assets/illustrations/illustration1.png"
            alt="register-illustration"
            className="w-[80%] drop-shadow-xl"
          />
        </div>

        {/* Branding Footer */}
        <div className="mt-auto">
          <p className="text-sm mb-2 opacity-80">Developed By</p>
          <div className="flex gap-6 opacity-90">
            <img
              src="/assets/logo/logo_white.png"
              className="w-32"
              alt="logo"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 w-full lg:w-[55%]">

        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Please fill in the details to register.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center bg-red-100 py-2 rounded-md">
              {error}
            </p>
          )}

          {/* Name Field */}
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="************"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1
              focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4 accent-blue-600" />
            <span>
              I agree to the{" "}
              <button className="text-blue-600 underline">
                Terms & Privacy
              </button>
            </span>
          </div>

          {/* Register Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-semibold
            hover:bg-blue-800 transition-all shadow-md"
          >
            {loading ? "Loading..." : "Register"}
          </button>

          {/* Login Redirect */}
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

          {/* Google Login */}
          <div className="flex items-center justify-center mt-4 gap-4">
            <button
              type="button"
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm
              flex items-center gap-2 hover:bg-gray-100 transition-all"
            >
              <FcGoogle size={22} />
              <span>Register with Google</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
