import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, X, Plus, Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Sample data - replace with your actual data
const initialCostumes = [
  {
    id: 1,
    fileUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=60",
    costumename: "Princess Dress",
    description: "Pink",
    // location: "Storage Room A",
    // cupboard: "A-1",
  },
  {
    id: 2,
    fileUrl: "https://images.unsplash.com/photo-1604889372095-27435c3cf6cc?w=800&auto=format&fit=crop&q=60",
    costumename: "Superhero Costume",
    description: "Red",
    // location: "Main Hall",
    // cupboard: "B-2",
  },
];

const AllCostumes = () => {
  const [costumes, setCostumes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCostume, setEditedCostume] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCostume, setNewCostume] = useState({

    costumename: "",
    description: "",
    cpid: "",
  });
  const [file, setFile] = useState(null);
  const [cupboards, setCupboards] = useState([])

  const id = uuidv4();



  const fetchData = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      if (response.ok) {
        const data = await response.json();
        setCupboards(data.cupboards)

      }


    } catch (err) {
      console.log(err)

    }




    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    const Array = await data.data;

    setCostumes(Array)


  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleEdit = (costume) => {
    setEditingId(costume.id);
    setEditedCostume({ ...costume });
  };

  const handleSave = () => {
    if (editedCostume) {
      setCostumes(costumes.map(c => c.id === editedCostume.id ? editedCostume : c));
      setEditingId(null);
      setEditedCostume(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCostume(null);
  };

  const handleChange = (field, value) => {
    if (editedCostume) {
      setEditedCostume({ ...editedCostume, [field]: value });
    }
  };

  const handleDelete = (costumeId) => {
    if (window.confirm('Are you sure you want to delete this costume?')) {
      setCostumes(costumes.filter(costume => costume.id !== costumeId));
    }
  };

  const handleNewCostumeChange = (field, value) => {
    setNewCostume({ ...newCostume, [field]: value });
  };

  const handleAddNewCostume = async () => {

    let fileUrl = null;
    try {
      const formData = new FormData();
      formData.append('file', file)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/uploadefile`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        fileUrl = data.fileUrl;
      }




    } catch (err) {
      console.log(err);
    }



    if (newCostume.cpid) {



      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addCostume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpid: newCostume.cpid, id: id, costumename: newCostume.costumename, description: newCostume.description, fileUrl: fileUrl })
      });
      if (response.ok) {

        setCostumes([...costumes, {
          ...newCostume,
          id: id,
          fileUrl: fileUrl,
          place: cupboards.find(cupboard => cupboard.id === newCostume.cpid)?.place,  // Assuming `location` is the field
          cpname: cupboards.find(cupboard => cupboard.id === newCostume.cpid)?.name  // Assuming `name` is the field
        }]);
        setNewCostume({
          id: null,
          fileUrl: "",
          costumename: "",
          description: "",
          cpid: "",

        });
        setIsAddingNew(false);

      }


    } else {
      alert('Please fill in at least the image URL and name fields');
    }
  };


  // Filter costumes based on search query
  const filteredCostumes = costumes.filter(costume => {
    const searchLower = searchQuery.toLowerCase();
    return (
      costume.costumename.toLowerCase().includes(searchLower) ||
      costume.description.toLowerCase().includes(searchLower)
      // costume.location.toLowerCase().includes(searchLower) ||
      // costume.cupboard.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search costumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="bg-gray-900 hover:bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Costume
        </button>
      </div>

      {isAddingNew && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Add New Costume</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border focus:border-gray-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newCostume.costumename}
                onChange={(e) => handleNewCostumeChange('costumename', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter costume name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={newCostume.description}
                onChange={(e) => handleNewCostumeChange('description', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter color"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cupboard</label>
              <select
                id="cpid"
                value={newCostume.cpid}
                onChange={(e) => handleNewCostumeChange('cpid', e.target.value)}
                className="w-full rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-800 py-3 px-4"
                required
              >

                <option value="">Select a Cupboard</option>
                {cupboards.map((e, i) => (

                  <option key={i} value={`${e.id}`}>{e.name}</option>
                ))}

              </select>
            </div>
            <div className="flex items-end">
              <div className="flex gap-2">
                <button
                  onClick={handleAddNewCostume}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Costume
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Image</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Color</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Location</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Cupboard</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCostumes.map((costume) => (
              <tr key={costume.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={costume.fileUrl}
                    alt={costume.costumename}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === costume.id ? (
                    <input
                      type="text"
                      value={editedCostume.costumename}
                      onChange={(e) => handleChange('costumename', e.target.value)}
                      className="text-sm border rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{costume.costumename}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === costume.id ? (
                    <input
                      type="text"
                      value={editedCostume.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="text-sm border rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-600">{costume.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === costume.id ? (
                    <input
                      type="text"
                      value={editedCostume.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="text-sm border rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-600">{costume.place}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === costume.id ? (
                    <input
                      type="text"
                      value={editedCostume.cupboard}
                      onChange={(e) => handleChange('cupboard', e.target.value)}
                      className="text-sm border rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-600">{costume.cpname}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    {editingId === costume.id ? (
                      <>
                        <button
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          onClick={handleSave}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={() => handleEdit(costume)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          onClick={() => handleDelete(costume.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCostumes;