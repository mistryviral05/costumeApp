import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FolderPlus } from 'lucide-react';

const Costumes = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [costumes, setCostumes] = useState([
    { id: 1, name: 'Vampire', description: 'Scary vampire costume' },
    { id: 2, name: 'Witch', description: 'Classic witch costume' },
    { id: 3, name: 'Ghost', description: 'Spooky ghost costume' },
    { id: 4, name: 'Zombie', description: 'Creepy zombie costume' },
    { id: 5, name: 'Fairy', description: 'Enchanting fairy costume' },
    { id: 6, name: 'Pirate', description: 'Adventurous pirate costume' },
  ]);

  const [newCostume, setNewCostume] = useState({ name: '', description: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const rowsPerPage = 5;

  const handleAddCostume = () => {
    if (newCostume.name && newCostume.description) {
      setCostumes([...costumes, { id: costumes.length + 1, ...newCostume }]);
      setNewCostume({ name: '', description: '' });
    }
  };

  const handleDeleteCostume = (id) => {
    setCostumes(costumes.filter((costume) => costume.id !== id));
  };

  const totalPages = Math.ceil(costumes.length / rowsPerPage);
  const paginatedCostumes = costumes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-4 transition duration-200"
      >
        ⬅ Back
      </button>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold">🎭 Costume Cupboard</h1>
        <p className="mt-2 text-lg">Manage your costume inventory with ease!</p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 ${!viewAll ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-l`}
          onClick={() => setViewAll(false)}
        >
          Summary View
        </button>
        <button
          className={`px-6 py-2 ${viewAll ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-r`}
          onClick={() => setViewAll(true)}
        >
          All Details
        </button>
      </div>

      {/* Costume Table */}
      <div className="overflow-x-auto space-y-4 bg-white shadow-lg border rounded-lg p-6">
        <div className='flex items-center justify-evenly gap-4'>
          <h2 className="text-2xl font-bold text-gray-800 ">Costume List</h2>
          <input
            type="text"
            placeholder="Name"
            value={newCostume.name}
            onChange={(e) =>
              setNewCostume({ ...newCostume, name: e.target.value })
            }
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newCostume.description}
            onChange={(e) =>
              setNewCostume({ ...newCostume, description: e.target.value })
            }
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={handleAddCostume}
          >
            <FolderPlus />
          </button>
        </div>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {(viewAll ? costumes : paginatedCostumes).map((costume) => (
              <tr
                key={costume.id}
                className="border-b hover:bg-gray-100 transition duration-200"
              >
                <td className="py-3 px-6">{costume.id}</td>
                <td className="py-3 px-6">{costume.name}</td>
                <td className="py-3 px-6">{costume.description}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200"
                    onClick={() => handleDeleteCostume(costume.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        {!viewAll && (
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              Previous
            </button>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

     
    
    </div>
  );
};

export default Costumes;
