import React, { useState, useEffect } from "react";
import { Package, Loader } from "lucide-react"; // Import Lucide icons
import { useNavigate } from "react-router-dom";

const CupboardsTable = ({ cupboards, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="w-3/4 mx-auto mt-10">
      {/* Show Spinner when loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin text-purple-600 w-10 h-10" />
        </div>
      ) : (!cupboards || cupboards.length === 0) ? (
        <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 border border-purple-200">
          <Package className="text-purple-600 w-16 h-16 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">No Cupboards Available</h2>
          <p className="text-gray-500 text-sm text-center">
            It looks like there are no cupboards added yet. Please check back later or contact admin.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile view - card layout */}
          <div className="block sm:hidden space-y-4">
            {cupboards.map((cupboard, index) => (
              <div
                onClick={() => navigate(`/client/Costumes/${cupboard.id}`)}
                key={index}
                className="bg-white rounded-lg shadow-md p-4 space-y-2 hover:bg-purple-50 transition-colors duration-200"
              >
                <div>
                  <span className="text-xs font-medium text-purple-900 uppercase">Cupboard Name</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{cupboard.name}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-purple-900 uppercase">Cupboard Place</span>
                  <p className="text-sm text-gray-500 mt-1">{cupboard.place}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-purple-900 uppercase">Cupboard Space</span>
                  <p className="text-sm text-gray-500 mt-1">{cupboard.space}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - table layout */}
          <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cupboard Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cupboard Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cupboard Space
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {cupboards.map((cupboard, index) => (
                  <tr key={index} onClick={() => navigate(`/client/Costumes/${cupboard.id}`)} className="hover:bg-purple-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cupboard.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cupboard.place}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cupboard.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CupboardsTable;
