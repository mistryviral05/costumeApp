import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DoorClosed, 
  Shirt, 
  Users, 
  UserPlus, 
  ChevronLeft, 
  Menu,
  Home,
  GalleryVertical,
  Plus,
  LogOut,
  User,
  WashingMachine,
  ChevronDown,
  AlertCircle,
  PackageX,
  Logs,
  ShoppingCart
} from 'lucide-react';
import useAuthAdmin from '@/hooks/useAuthAdmin';

const Sidebar = ({ isOpen, setIsOpen, width }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const profileRef = useRef(null); // Added ref for click outside
  const {admin}= useAuthAdmin()
  const menuCategories = [
    {
      id: 'main',
      title: 'Main',
      items: [
        { title: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
        { title: 'Cupboards', icon: <DoorClosed size={20} />, path: '/admin/home' },
      ]
    },
    {
      id: 'management',
      title: 'Management',
      items: [
        { title: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { title: 'Add New User', icon: <UserPlus size={20} />, path: '/admin/users/new' },
        { title: 'Add New Costume', icon: <Shirt size={20} />, path: '/admin/addNewCostume' },
        { title: 'Carts', icon: <ShoppingCart size={20} />, path: '/admin/CartsDe' },
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      items: [
        { title: 'Washing', icon: <WashingMachine size={20} />, path: '/admin/wash' },
        { title: 'Gallery', icon: <GalleryVertical size={20} />, path: '/admin/gallary' },
      ]
    },
    {
      id: 'returnPolicy',
      title: 'Return Policy',
      items: [
        { title: 'Lost', icon: <AlertCircle size={20} />, path: '/admin/return-policy/Lost' },
        { title: 'Damaged', icon: <PackageX size={20} />, path: '/admin/return-policy/Damaged' },
      ]
    },
    {
      id: 'logs',
      title: 'Logs & History',
      items: [
        { title: 'All logs', icon: <Logs size={20} />, path: '/admin/allLogs' },
      ]
    }
  ];

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    for (const category of menuCategories) {
      if (category.items.some(item => item.path === location.pathname)) {
        setActiveCategory(category.id);
        break;
      }
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/admin/');
    } catch (err) {
      console.log(err);
    }
  };

  const profileOptions = [
    { 
      title: 'Your Profile', 
      icon: <User size={16} />,
      onClick: () => navigate('/admin/profile')
    }
    // Removed 'Change Password' and 'Settings' options
  ];

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50
        shadow-xl overflow-hidden flex flex-col
        ${isOpen ? 'w-56' : 'w-16'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {menuCategories.map((category) => (
          <div key={category.id} className="mb-4">
            {isOpen && (
              <button 
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider px-2 py-2 hover:text-gray-300"
              >
                <span>{category.title}</span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform ${activeCategory === category.id ? 'transform rotate-180' : ''}`}
                />
              </button>
            )}
            
            <div className={`space-y-1 mt-1 ${isOpen && activeCategory !== category.id ? 'hidden' : ''}`}>
              {category.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className={`${!isOpen ? 'mx-auto' : ''} text-lg`}>
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="text-sm font-medium truncate">{item.title}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mb-3"
        >
          <LogOut size={20} className={`${!isOpen ? 'mx-auto' : ''}`} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
        
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors
              ${!isOpen ? 'justify-center' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
              <User size={16} />
            </div>
            {isOpen && (
              <div className="truncate">
                <p className="text-sm font-medium text-left truncate">{admin?.name}</p>
                <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700 z-10">
              {profileOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.onClick();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors"
                >
                  {option.icon}
                  <span className="truncate">{option.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;