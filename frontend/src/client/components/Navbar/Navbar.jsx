import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Shirt, Image, QrCode, ShoppingCart, LogOut, User, WashingMachine, Settings } from "lucide-react";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const profileMenuRef = useRef(null);
  const prevScrollPosRef = useRef(0);

  // Close profile menu when route changes
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location]);

  // Handle scroll behavior for bottom bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPosRef.current;
      
      // Only change state when direction changes and after scrolling a minimum amount
      const scrollThreshold = 10;
      
      if (isScrollingDown && isBottomBarVisible && currentScrollPos > 100) {
        if (currentScrollPos - prevScrollPosRef.current > scrollThreshold) {
          setIsBottomBarVisible(false);
        }
      } else if (!isScrollingDown && !isBottomBarVisible) {
        if (prevScrollPosRef.current - currentScrollPos > scrollThreshold) {
          setIsBottomBarVisible(true);
        }
      }
      
      prevScrollPosRef.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBottomBarVisible]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    let logout = false;
    const token = JSON.parse(localStorage.getItem('clientToken'));
    const clientToken = token.token;
  console.log(clientToken)
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
    <>
      {/* Desktop Navbar - Only visible on xl screens */}
      <nav className="bg-purple-900 sticky top-0 z-50 text-white hidden xl:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 font-bold text-xl">Costume Management</div>

            {/* Desktop Menu */}
            <div className="flex items-center space-x-8">
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
          </div>
        </div>
      </nav>

      {/* Mobile and Medium Screen Top Bar - Just Logo and Title */}
      <div className="xl:hidden bg-purple-900 text-white fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4">
        <div className="flex-shrink-0 font-bold text-xl">Costume Management</div>
      </div>
      
      {/* Content padding for non-xl screens */}
      <div className="xl:hidden bg-gradient-to-br from-purple-50 to-indigo-50  pt-14 pb-4"></div>

      {/* Mobile and Medium Screen Bottom App Bar with scroll behavior */}
      <div 
        className={`xl:hidden fixed bottom-0 left-0 right-0 bg-purple-900 text-white z-40 shadow-lg transition-transform duration-300 ${
          isBottomBarVisible ? 'transform translate-y-0' : 'transform translate-y-full'
        }`}
      >
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-1 transition-colors duration-200 ${
                currentPath === item.path ? "text-white" : "text-gray-300"
              }`}
            >
              <div className={`p-1 rounded-full ${currentPath === item.path ? "bg-purple-700" : ""}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.title}</span>
            </NavLink>
          ))}
          
          {/* Profile Button in Bottom Bar */}
          <div 
            className="flex flex-col items-center justify-center px-2 py-1"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            ref={profileMenuRef}
          >
            <div className={`p-1 rounded-full ${isProfileMenuOpen ? "bg-purple-700" : ""}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">More</span>
            
            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute bottom-20 right-2 bg-purple-800 rounded-lg shadow-xl w-36 overflow-hidden">
                <div 
                  className="px-4 py-3 hover:bg-purple-700 flex items-center space-x-2 cursor-pointer"
                  onClick={() => navigate('/client/profile')}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </div>
                <div 
                  className="px-4 py-3 hover:bg-purple-700 flex items-center space-x-2 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;