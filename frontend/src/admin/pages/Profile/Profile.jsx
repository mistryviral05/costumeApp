import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, EyeOff, Lock, User, Mail, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import useAuthAdmin from "@/hooks/useAuthAdmin";

const Profile = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState("");
  const {admin}= useAuthAdmin();
  

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    // Password update simulation
    alert("Password updated successfully!");
    
    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordForm(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Mock user data
  const user = {
    name: "Viral Mistry",
    email: "viral.mistry@example.com",
    role: "Software Developer",
    phonenumber: "+1 (555) 123-4567",
    date: "2023-05-15T00:00:00Z"
  };

  function formatDate(isoString) {
    if (!isoString) return "N/A";
    
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center min-h-screen bg-gray-100 p-6 gap-6">
      {/* Profile Card */}
      <Card className="w-full max-w-lg shadow-lg p-6 rounded-lg bg-white border border-gray-200">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="/profile-pic.jpg" alt={admin?.name} />
            <AvatarFallback>{admin?.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-800">{admin?.name}</h2>
          <p className="text-gray-600">Admin</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 mt-4">
            {/* Contact Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-600" />
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{admin?.email}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{admin?.phonenumber}</span>
                </div>
              </div>
            </div>
            
            {/* Account Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Joined {formatDate(admin?.date)}</span>
                </div>
                
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                  {showPasswordForm ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      {showPasswordForm && (
        <Card className="w-full max-w-lg mt-6 lg:mt-0 shadow-lg p-6 rounded-lg bg-white border border-gray-200">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-gray-600" />
              Change Password
            </h2>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                  <p className="font-medium">
                    {error}
                  </p>
                </div>
              )}
              
              {/* Current Password */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex space-x-3">
            <Button 
              type="submit"
              onClick={handleSubmitPassword}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => {
                setShowPasswordForm(false);
                setError("");
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                });
              }}
              className="flex-1">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Profile;