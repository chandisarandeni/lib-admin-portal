import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.error("Login functionality is not implemented yet.");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-courier">
      {/* Left Side - Login Form */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Admin Login
          </h2>
          <hr />

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 transition-all text-white font-semibold rounded-lg shadow"
            >
              Login
            </button>
          </form>

          <div className="text-sm text-center text-gray-600 mt-6 space-y-1">
            <p>
              Forgot Password?
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline ml-2"
              >
                click here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center bg-white p-12 border-l border-gray-200">
        <img
          src="/sarasavi-logo-black.png"
          alt="Logo"
          className="w-[280px] mb-0 pt-0"
        />
        <h1 className="text-[35px] font-extrabold text-gray-800 mb-3">
          Sarasavi Library
        </h1>
        <p className="text-gray-600 text-center max-w-xs leading-relaxed">
          To create an accessible library management system that connects
          readers with books effortlessly.
        </p>
        <div
          className="text-gray-500 text-2xl mt-8 cursor-pointer hover:text-gray-700 hover:scale-110 transition-transform duration-300"
          onClick={() => (window.location.href = "http://localhost:5174")}
        >
          <FaArrowLeft />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
