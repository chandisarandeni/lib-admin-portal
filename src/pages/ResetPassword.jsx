import React, { useState } from "react";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Replace with your actual reset password logic
    alert("Your password has been successfully reset.");
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
            Reset Password
          </h2>
          <hr />

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 transition-all text-white font-semibold rounded-lg shadow"
            >
              Reset Password
            </button>
          </form>

          <div className="text-sm text-center text-gray-600 mt-6">
            <p>
              Remember your password?
              <Link to="/" className="text-blue-600 hover:underline ml-2">
                Go back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
