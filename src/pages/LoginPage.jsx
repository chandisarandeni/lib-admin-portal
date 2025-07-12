import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Check if login function exists
    console.log("Login function:", login);
    console.log("Email:", email);
    console.log("Password:", password);
    
    // Validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting login...");
      const result = await login(email, password);
      console.log("Login result:", result);
      
      if (result.success) {
        toast.success("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error caught:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-courier">
      {/* Left Side */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center bg-white p-12 border-r border-gray-200">
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
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h2>
          <hr />

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                  value={password}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 transition-all text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
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
    </div>
  );
}

export default LoginPage;
