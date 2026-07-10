"use client";

import { useState } from "react";

import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    email: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
        
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

 
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Registration Successful 🎉");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen w-10/12 mx-auto grid grid-cols-1 md:grid-cols-2">

        {/* Left */}
        <div className="hidden md:flex items-center justify-center">
          <img src="/register.png" alt="Register Banner" className="w-full h-auto" />
        </div>

        {/* Right */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

            <h2 className="text-3xl font-bold text-center text-gray-800">
              Create Account
            </h2>
            <p className="mt-2 text-center text-gray-500">
              Sign up to get started
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                {error}
              </p>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-4">

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* Phone */}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              {/* Email */}
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
               
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* Confirm */}
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
