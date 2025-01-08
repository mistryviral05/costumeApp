import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { HiOutlineEmojiSad } from 'react-icons/hi';
// Remove or update this import based on your project structure
// import { Button } from "../components/ui/button"

const CARDS_PER_PAGE = 12; // Number of cards to show initially and on each "Show More" click

const Home = ({ cupBoard, setCupboards }) => {
  const [displayCount, setDisplayCount] = useState(CARDS_PER_PAGE);

  const fetchCupboards = async () => {
    try {
      const response = await fetch('http://localhost:3000/cupboards/getCupboard')
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

    setCupboards((prevCupboards) => prevCupboards.filter((c) => c.id !== id));  // This properly updates the state with the filtered array.



  }

  const showMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + CARDS_PER_PAGE, cupBoard.length));
  };

  return (
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
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 light:bg-blue-600 light:hover:bg-blue-700 light:focus:ring-blue-800 transition-transform transform hover:scale-105 ">Search</button>
        </div>
      </form>

      {cupBoard.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {cupBoard.slice(0, displayCount).map((f, index) => (
              <Card key={index} cupBoard={f.name} id={f.id} delteCupboard={deleteCupboard} />
            ))}
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
  );
};

export default Home;

