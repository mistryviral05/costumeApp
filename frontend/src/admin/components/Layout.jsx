import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  // Initialize state from localStorage, default to true if not found
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState !== null ? JSON.parse(savedState) : true;
  });
  const [isMobile, setIsMobile] = useState(false);

  // Update localStorage whenever isSidebarOpen changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Close sidebar on mobile by default only on first load
    if (window.innerWidth < 768 && localStorage.getItem('sidebarOpen') === null) {
      setIsSidebarOpen(false);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile backdrop */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-screen transition-transform duration-300 transform
        ${isSidebarOpen && !isMobile ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-56' : 'md:ml-16'
      }`}>
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="">
          <main className="flex-1 p-2 md:p-4 mt-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;