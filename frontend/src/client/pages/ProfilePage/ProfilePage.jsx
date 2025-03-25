import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user } = useAuth();
    console.log(user)
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmitPassword = async(e) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    // Add your password update logic here

    try {

      const token = JSON.parse(localStorage.getItem("clientToken"));
  
      const clientToken= token.token;

      if (clientToken) {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/changePassword`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientToken}`,
            "Content-Type":"application/json",
          },
          body:JSON.stringify(passwordData)
        });
        
        if (res.ok) {
          const message = await res.json();
          toast.success(message.message)
          setShowPasswordForm(false);
        }
        else{
          const message = await res.json();
          toast.warning(message.message)
        }
      }else{
        toast.error("Un Authorize")
      }



      
    } catch (error) {
       toast.error(error);
    }

    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
   
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card with subtle animation and improved shadows */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Profile Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-6 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-0">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user?.name || "User"} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-white" />
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
                  <p className="text-purple-200 mt-1">{user?.role || "Member"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information with improved spacing and organization */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information Card */}
              <div className="bg-purple-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-purple-900 border-b border-purple-200 pb-3 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm md:text-base break-all">{user?.email || "email@example.com"}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm md:text-base">{user?.phonenumber || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="bg-indigo-50 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="text-xl font-semibold text-indigo-900 border-b border-indigo-200 pb-3 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-sm md:text-base">Joined {formatDate(user?.date)}</span>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800  bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                    {showPasswordForm ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password Form with improved styling and animations */}
            {showPasswordForm && (
              <div className="mt-8 border-t border-purple-100 pt-6 transition-all duration-500 animate-fadeIn">
                <h2 className="text-xl font-semibold text-purple-900 mb-6 flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </h2>
                <form onSubmit={handleSubmitPassword} className="max-w-md mx-auto space-y-4">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
                      <p className="flex items-center font-medium">
                        <span className="mr-2">●</span>
                        {error}
                      </p>
                    </div>
                  )}
                  
                  {/* Current Password */}
                  <div className="group">
                    <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="group">
                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex-1 flex justify-center items-center"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setError('');
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow flex-1 flex justify-center items-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Add a footer note */}
       
      </div>
    </div>
  );
};

export default ProfilePage;