import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const CARDS_PER_PAGE = 12;

const Home = ({ cupBoard, setCupboards }) => {
  const [displayCount, setDisplayCount] = useState(CARDS_PER_PAGE);
  const navigate = useLocation();

  const fetchCupboards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      if (response.ok) {
        const data = await response.json();
        setCupboards(data.cupboards);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCupboards();
  }, []);

  const deleteCupboard = (id) => {
    setCupboards((prevCupboards) => prevCupboards.filter((c) => c.id !== id));
    toast('Cupboard deleted', {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const showMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + CARDS_PER_PAGE, cupBoard.length));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="p-2 sm:p-4 h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Search Form */}
        <div className="max-w-md mx-auto mb-4">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
         
            </div>
            <input 
              type="search" 
              id="default-search" 
              className="block w-full p-3 sm:p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Search cupboards..." 
              required 
            />
            <button 
              type="submit" 
              className="text-white absolute end-2.5 bottom-2 sm:bottom-2.5 bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 sm:px-4 sm:py-2 transition-transform transform hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>

        {/* Create Cupboard Button */}
        {location.pathname === '/admin/home' && (
          <div className="mb-4">
            <NavLink to="/admin/createCupboard">
              <button className="w-full sm:w-auto flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Create a Cupboard
              </button>
            </NavLink>
          </div>
        )}

        {/* Cupboards Table/List */}
        {cupBoard.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider  table-cell">Space</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider  table-cell">Place</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider  table-cell">Costumes</th>
                        <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cupBoard.slice(0, displayCount).map((f, index) => (
                        <Card 
                          key={index} 
                          cupBoard={f.name} 
                          space={f.space} 
                          place={f.place} 
                          id={f.id} 
                          delteCupboard={deleteCupboard} 
                          setCupboards={setCupboards} 
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Show More Button */}
            {displayCount < cupBoard.length && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={showMore}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 transition-colors duration-200"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-gray-600">
            <HiOutlineEmojiSad className="text-4xl sm:text-6xl text-blue-500 animate-bounce" />
            <p className="text-lg sm:text-xl font-semibold text-center">Cupboards Not Created Here</p>
            <p className="text-sm text-gray-400 text-center px-4">
              Try adding some cupboards to your collection to see them here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;