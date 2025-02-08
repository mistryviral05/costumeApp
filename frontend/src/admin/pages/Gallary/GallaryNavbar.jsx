import React from 'react'
import {
    ImagePlus,

    Menu,

    ShoppingCart,

} from "lucide-react";
import { NavLink, useNavigate } from 'react-router-dom';

const GallaryNavbar = ({ toggalMobileFilter }) => {
   const navigate = useNavigate();
    return (
        <>
            <div className="bg-gray-900 text-white py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex gap-2 text-sm hover:text-gray-300 transition"
                    >
                        ⬅ <p className="hidden sm:block">Back</p>
                    </button>
                    <button
                        onClick={toggalMobileFilter}
                        className="text-sm hover:text-gray-300 transition sm:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <ImagePlus className="w-5 h-5 sm:w-6 sm:h-6" />
                        Costume Gallery
                    </h1>
                    <div className="w-16 cursor-pointer" ><NavLink to={'/admin/Gallary/cart'}><ShoppingCart size={30} /></NavLink></div>
                </div>
            </div>



        </>
    )
}

export default GallaryNavbar
