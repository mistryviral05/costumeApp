import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {ScanLine} from 'lucide-react';


const Navbar = ({setIsSidebarOpen}) => {
    // State to control the mobile menu visibility
    
    // Toggle the mobile menu
   

    return (
        <nav className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center h-16">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <div className="bg-gray-900 cursor-pointer text-white rounded-full p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75v4.5m4.5-4.5v4.5m-6.75-6h9a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0115.75 21h-9A2.25 2.25 0 014.5 18.75v-9A2.25 2.25 0 016.75 7.5z"
                            />
                        </svg>
                    </div>
                    <NavLink to={'/admin/home'}><span className="cursor-pointer text-lg md:text-xl font-semibold text-gray-800">
                        Costume Management
                    </span></NavLink>
                </div>
              
                {/* Button Section (For Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
               <NavLink to={'/admin/scanner'}> <ScanLine className='cursor-pointer' /></NavLink>
           
                </div>

                {/* Mobile Menu Button (Hamburger Icon) */}
                <div className="md:hidden flex gap-2 items-center">
                <NavLink to={'/admin/scanner'}><ScanLine className='cursor-pointer' /></NavLink>
                    <button onClick={()=>setIsSidebarOpen(true)}  className="text-gray-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

        
        </nav>
    );
};

export default Navbar;
