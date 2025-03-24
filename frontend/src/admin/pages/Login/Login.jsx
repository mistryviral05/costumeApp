import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, EyeIcon, EyeOffIcon, User, KeyRound, Loader2 } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '', server: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors({
      ...errors,
      ...newErrors
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setErrors({ ...errors, server: '' });
    setIsLoading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      const message = await response.json();
  
      if (response.ok) {
        setTimeout(() => {
          if (message.token) {
            const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds
            localStorage.setItem('token', JSON.stringify({ token: message.token, expiry: expiryTime }));
            navigate('/admin/dashboard');
          }
        }, 2000);
      } else {
        throw new Error(message.error || "Invalid username or password");
      }
    } catch (err) {
      setErrors({
        ...errors,
        server: err.message
      });
      console.error(err.message);
      setIsLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-white text-blue-600 rounded-full p-3 mb-4 shadow-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75v4.5m4.5-4.5v4.5m-6.75-6h9a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0115.75 21h-9A2.25 2.25 0 014.5 18.75v-9A2.25 2.25 0 016.75 7.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Costume Management System</h1>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          {errors.server && (
            <div className="px-6 ">
              <Alert variant="destructive" className="mb-4 w-full border-red-600 bg-red-50 text-red-800 animate-bounce-once flex items-center ">
                <AlertCircle className="h-4 w-4 " />
                <AlertDescription className="text-sm mt-1">{errors.server}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <User size={16} />
                      </div>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`pl-10 pr-4 ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                        aria-invalid={errors.username ? "true" : "false"}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-600 mt-1">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <NavLink
                        to="/#"
                        className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                      >
                        Forgot password?
                      </NavLink>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <KeyRound size={16} />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                        aria-invalid={errors.password ? "true" : "false"}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-all duration-200 transform hover:translate-y-px focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  {isLoading && (
                    <div className="mt-4 flex justify-center items-center">
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>

         
          </CardContent>

          <CardFooter className="flex justify-center pt-2 pb-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <NavLink
                to="/admin/signup"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Register here
              </NavLink>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;