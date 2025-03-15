import React, { useState } from "react";
import { Mail, ArrowRight, AlertCircle, Lock, ChevronLeft, CheckCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    let newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be 6 digits";
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
        // Replace with your actual API endpoint
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/forgotPass`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email })
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        toast.success(data.message)
        // On success, switch to OTP tab instead of showing success message
        setActiveTab("otp");
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        setServerError(error.message || "An unexpected error occurred");
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateOtp()) {
      setIsLoading(true);
      
      try {
        // Replace with your actual OTP verification API endpoint
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/verifyOtp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, otp })
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Invalid OTP");
        }
        toast.success(data.message)

        // Show success message
        setIsSubmitted(true);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message)
        setServerError(error.message || "An unexpected error occurred");
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
        
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Back to login */}
          <NavLink to="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500 mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to login
          </NavLink>

          {/* Server Error Message */}
          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-center mt-4 animate-pulse">
              {String(serverError)}
            </div>
          )}

          {/* Success Message */}
          {isSubmitted ? (
            <div className="mt-8 text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-6">
                <p className="font-medium">Password reset link sent!</p>
                <p className="text-sm mt-1">Please check your email inbox for instructions.</p>
              </div>
              <NavLink 
                to="/" 
                className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
              >
                Return to login
                <ArrowRight className="h-5 w-5 ml-2" />
              </NavLink>
            </div>
          ) : (
            /* Tabs for Email and OTP */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" disabled={activeTab === "otp"}>Email</TabsTrigger>
                <TabsTrigger value="otp" disabled={activeTab === "email"}>Verify OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reset your password</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Enter your email and we'll send you an OTP to reset your password
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
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

                  {/* Send OTP button with loader */}
                  <div className="relative">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 ease-in-out disabled:opacity-70 shadow-lg hover:shadow-xl"
                    >
                      <span className="absolute right-3 inset-y-0 flex items-center">
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-base font-medium">{isLoading ? "Sending OTP..." : "Send OTP"}</span>
                    </button>
                    
                    {/* Loading bar at bottom of button */}
                    {isLoading && (
                      <div className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-b-xl animate-loader"></div>
                    )}
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Verify OTP</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                      Verification Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
                          errors.otp 
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                            : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                        }`}
                        placeholder="123456"
                      />
                      {errors.otp && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1 ml-1 flex items-center">
                        {errors.otp}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-center text-gray-600">
                    Didn't receive the code?{" "}
                    <button 
                      type="button" 
                      onClick={() => {setActiveTab("email")}}
                      className="text-purple-600 hover:text-purple-500 font-medium focus:outline-none"
                    >
                      Send again
                    </button>
                  </div>

                  {/* Verify button with loader */}
                  <div className="relative">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 ease-in-out disabled:opacity-70 shadow-lg hover:shadow-xl"
                    >
                      <span className="absolute right-3 inset-y-0 flex items-center">
                        <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </span>
                      <span className="text-base font-medium">{isLoading ? "Verifying..." : "Verify OTP"}</span>
                    </button>
                    
                    {/* Loading bar at bottom of button */}
                    {isLoading && (
                      <div className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-b-xl animate-loader"></div>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;