import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shirt, Image, QrCode, ShoppingCart, LogOut, User, WashingMachine } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    let logout = false;
    const clientToken = localStorage.getItem('clientToken');

    if (clientToken) {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientToken}`
        }
      });
      
      if (res.ok) {
        const message = await res.json();
        console.log(message.message);
        localStorage.removeItem('clientToken');
        logout = true;
      }
    }
    
    if (logout) {
      navigate('/');
    }
  };

  const menuItems = [
    { title: "Cupboards", icon: <Shirt className="w-5 h-5" />, path: "/client/homepage" },
    { title: "Gallery", icon: <Image className="w-5 h-5" />, path: "/client/Gallary" },
    { title: "Scanner", icon: <QrCode className="w-5 h-5" />, path: "/client/qr-scanner" },
    { title: "Cart", icon: <ShoppingCart className="w-5 h-5" />, path: "/client/cartpage" },
    { title: "Washing", icon: <WashingMachine className="w-5 h-5" />, path: "/client/clientWashing" },
  ];

  return (
    <nav className="bg-purple-900 sticky top-0 z-50 text-white" ref={navbarRef}>
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

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors duration-200"
              onClick={() => navigate('/client/profile')}
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900 flex flex-col items-center">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-center transition-colors duration-200 ${
                  currentPath === item.path ? "bg-purple-700" : "hover:bg-purple-800"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full px-3 py-2 rounded-md bg-purple-700 hover:bg-purple-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            {/* Avatar with Profile Link */}
            <div
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-purple-800 transition-colors duration-200 cursor-pointer justify-center"
              onClick={() => navigate('/client/profile')}
            >
              <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center">
                <User className="w-6 h-6" />
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