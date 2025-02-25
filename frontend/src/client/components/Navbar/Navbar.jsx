import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shirt, Image, QrCode, ShoppingCart, LogOut, User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    let logout = false;
    if(localStorage.getItem('clientToken')){
      localStorage.removeItem('clientToken');
      logout = true;
    }
    if(logout == true){
      navigate('/');
    }
  };

  const menuItems = [
    { title: "Cupboards", icon: <Shirt className="w-5 h-5" />, path: "/client/homepage" },
    { title: "Gallery", icon: <Image className="w-5 h-5" />, path: "/client/Gallary" },
    { title: "QR Code Scanner", icon: <QrCode className="w-5 h-5" />, path: "/client/qr-scanner" },
    { title: "Add to Cart", icon: <ShoppingCart className="w-5 h-5" />, path: "/client/cartpage" },
  ];

  return (
    <nav className="bg-purple-900 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl">Costume Management</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentPath === item.path ? "bg-purple-700" : "hover:text-purple-200"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-purple-700 hover:bg-purple-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            {/* Avatar moved to end */}
            <div 
              className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors duration-200"
              onClick={() => navigate('/client/profile')} // Add your profile route here
            >
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentPath === item.path ? "bg-purple-700" : "hover:bg-purple-800"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-md bg-purple-700 hover:bg-purple-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
            
            {/* Avatar in mobile menu */}
            <div 
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-purple-800 transition-colors duration-200 cursor-pointer"
              onClick={() => navigate('/client/profile')} // Add your profile route here
            >
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span>Profile</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;