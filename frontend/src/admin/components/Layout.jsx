import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // Default to open
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);  // Change breakpoint as needed
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();  // Initial check
    if(window.innerWidth<768){
      setIsSidebarOpen(false)
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
        isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
      }`}>
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
