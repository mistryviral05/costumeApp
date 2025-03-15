import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("clientToken")) {
      navigate("/client/homepage");
    }
  }, []);

  const validateForm = () => {
    let newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        if (data.clientToken) {
          localStorage.setItem("clientToken", data.clientToken);
          
          // Add 5 second timeout before navigating
          setTimeout(() => {
            navigate("/client/homepage");
            setEmail("");
            setPassword("");
          }, 5000);
        }
      } catch (error) {
        setServerError(error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10 relative overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full opacity-20"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-300 rounded-full opacity-20"></div>
        
        {/* Logo/Brand - Add your logo here */}
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-center mt-4 animate-pulse">
              {serverError}
            </div>
          )}

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
                      errors.email 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-1 flex items-center">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
                      errors.password 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-1 flex items-center">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <NavLink to={'/forgotPass'} className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Forgot your password?
                </NavLink>
              </div>
            </div>

            {/* Sign in button with loader */}
            <div className="relative">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 ease-in-out disabled:opacity-70 shadow-lg hover:shadow-xl"
              >
                <span className="absolute right-3 inset-y-0 flex items-center">
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-base font-medium">{isLoading ? "Signing in..." : "Sign in"}</span>
              </button>
              
              {/* Loading bar at bottom of button */}
              {isLoading && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-b-xl animate-loader"></div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;