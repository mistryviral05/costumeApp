import React, { useState } from 'react';
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
  Key,
  WashingMachine
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
    { title: 'Cupboards', icon: <DoorClosed size={20} />, path: '/admin/home' },
    { title: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { title: 'Add New User', icon: <UserPlus size={20} />, path: '/admin/users/new' },
    { title: 'Add New Costume', icon: <Plus size={20} />, path: '/admin/addNewCostume' },
    { title: 'Washing', icon: <WashingMachine size={20} />, path: '/admin/wash' },
    { title: 'Gallary', icon: <GalleryVertical size={20} />, path: '/admin/gallary' },
  ];

  const handleLogout = async() => {
    try {
      localStorage.removeItem('token')
      navigate('/admin/');
    } catch(err) {
      console.log(err);
    }
  };

  const profileOptions = [
    { 
      title: 'Your Profile', 
      icon: <User size={16} />,
      onClick: () => navigate('/admin/profile')
    },
    { 
      title: 'Change Password', 
      icon: <Key size={16} />,
      onClick: () => navigate('/admin/change-password')
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50
          ${isOpen ? 'w-64' : 'w-16'} 
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

        <nav className="mt-6 px-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg mb-2 transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-gray-800 text-purple-400'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <div className={`${!isOpen ? 'mx-auto' : ''}`}>
                {item.icon}
              </div>
              {isOpen && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={`flex flex-col gap-4 ${!isOpen ? 'items-center' : ''}`}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={20} className={`${!isOpen ? 'mx-auto' : ''}`} />
              {isOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors
                  ${!isOpen ? 'justify-center' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <Users size={16} />
                </div>
                {isOpen && (
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-400">admin@example.com</p>
                  </div>
                )}
              </button>

              {/* Profile Popup Menu */}
              {showProfileMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                  {profileOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        option.onClick();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                    >
                      {option.icon}
                      <span>{option.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;