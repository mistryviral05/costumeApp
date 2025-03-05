import React from 'react';
import {
  ImagePlus,
  Menu,
  ShoppingCart,
  ArrowLeft
} from "lucide-react";
import { NavLink, useNavigate } from 'react-router-dom';

const GallaryNavbar = ({ toggalMobileFilter }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-900 text-white py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Mobile menu button - only visible on mobile */}
        <button
          onClick={toggalMobileFilter}
          className="mr-3 text-sm hover:text-gray-300 transition sm:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Title - centered on mobile, left-aligned on desktop */}
        <div className="flex items-center flex-1 justify-center sm:justify-start">
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <ImagePlus className="w-5 h-5 sm:w-6 sm:h-6" />
            Costume Gallery
          </h1>
        </div>
        
        {/* Navigation controls - grouped together for easier access */}
        <div className="flex items-center gap-4">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm hover:text-gray-300 transition bg-gray-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          {/* Cart button */}
          <NavLink 
            to='/admin/Gallary/cart'
            className="flex items-center hover:text-gray-300 bg-gray-800 p-1.5 rounded-lg"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default GallaryNavbar;