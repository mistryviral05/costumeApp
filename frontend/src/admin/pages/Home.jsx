import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// Remove or update this import based on your project structure
// import { Button } from "../components/ui/button"

const CARDS_PER_PAGE = 12; // Number of cards to show initially and on each "Show More" click

const Home = ({ cupBoard, setCupboards }) => {
  const [displayCount, setDisplayCount] = useState(CARDS_PER_PAGE);
  const navigate = useLocation()

  const fetchCupboards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`)
      if (response.ok) {
        const data = await response.json()
        setCupboards(data.cupboards)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchCupboards()
  }, [])


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


  }

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
      <div className="p-4 h-[79.7vh] overflow-y-auto">


        <form className="max-w-md mx-auto">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only light:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 light:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-gray-900  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 light:bg-blue-600 light:hover:bg-blue-700 light:focus:ring-blue-800 transition-transform transform hover:scale-105 ">Search</button>
          </div>

        </form>
        {location.pathname === '/admin/home' ? <NavLink to={'/admin/createCupboard'}>   <button

          className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
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
        </button></NavLink> : <div></div>}

        {cupBoard.length > 0 ? (
          <>
            <div className="mt-4 ">
              <table className="w-full shadow-lg table-auto border border-collapse rounded-lg  text-sm overflow-y-auto">
                <thead className="bg-gradient-to-r bg-gray-50  text-gray-500 ">
                  <tr>
                    <th className="px-4 py-3 text-center">Icon</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-center">Space</th>
                    <th className="px-4 py-3 text-center">Place</th>
                    <th className="px-4 py-3 text-center">Costumes</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                {cupBoard.slice(0, displayCount).map((f, index) => (
                  <Card key={index} cupBoard={f.name} space={f.space} place={f.place} id={f.id} delteCupboard={deleteCupboard} setCupboards={setCupboards} />
                ))}
              </table>
            </div>
            {displayCount < cupBoard.length && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={showMore}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 space-y-4 text-gray-600">
            <HiOutlineEmojiSad className="text-6xl text-blue-500 animate-bounce" />
            <p className="text-xl font-semibold">Cupboards Not created here</p>
            <p className="text-sm text-gray-400">
              Try adding some cupboards to your collection to see them here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

