import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, MoveRightIcon, Trash, ArrowLeft, Search, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Notfound from '../NotFound/Notfound';
import Modal from '../../components/Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Costumes = ({ cupboard }) => {
  const navigate = useNavigate();
  const params = useParams();
  const cpid = params.id;
  const [isValidCupboard, setIsValidCupboard] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [cupboardName, setCupboardName] = useState("");

  const [costumes, setCostumes] = useState([]);
  const [searchDetails, setSearchDetails] = useState('');
  const [filterData, setFilterData] = useState(costumes);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [seletectedid, setSeletectedid] = useState(null);
  const [isRenaming, setIsRenaming] = useState(null);
  const [renaming, setRenaming] = useState({ costumename: '', description: '', id: '' });

  const handleSearch = (e) => {
    let query = e.target.value.toLowerCase();
    setSearchDetails(query);
    if (query.trim() === '') {
      setFilterData(costumes);
    } else {
      const filtered = costumes.filter((item) =>
        item.costumename.toLowerCase().includes(query)
      );
      setFilterData(filtered);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      if (response.ok) {
        const data = await response.json();
        const currentCupboard = data.cupboards.find(cupboard => cupboard.id === cpid);
        setIsValidCupboard(!!currentCupboard);
        
        if (currentCupboard) {
          // Set the cupboard name
          setCupboardName(currentCupboard.name || "Unnamed Cupboard");
          
          const costumeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume/${cpid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          const costumeData = await costumeResponse.json();
          setCostumes(costumeData.data);
          setFilterData(costumeData.data);
        }
      }
    } catch (err) {
      console.log(err);
      setIsValidCupboard(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCostume = async (id) => {
    let c = confirm("Are you sure you want to delete costume?");
    if (c) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/deleteCostume/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const message = await response.json();
      toast(`${message.message}`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      setCostumes(costumes.filter((costume) => costume.id !== id));
      setFilterData(filterData.filter((costume) => costume.id !== id));
    }
  };

  const handleOpenModal = (id) => {
    setSeletectedid(id);
    setIsOpenModal(true);
  };

  const handleRenaming = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/updateCostume`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ costumename: renaming.costumename, description: renaming.description, id: renaming.id })
      });

      if (response.ok) {
        const res = await response.json();
        setRenaming({ costumename: '', description: '', id: '' });
        toast('Data Updated', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        setIsRenaming(false);
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenRenaming = (id) => {
    setIsRenaming(id);
    const costume = costumes.find(c => c.id === id);
    if (costume) {
      setRenaming({
        costumename: costume.costumename,
        description: costume.description,
        id: costume.id
      });
    }
  };

  const handleCloseRenaming = () => {
    setIsRenaming(null);
    setRenaming({ costumename: '', description: '', id: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!isValidCupboard) {
    return <Notfound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
        theme="light"
        transition={Bounce}
      />
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-gray-200 transition duration-200"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          <button
            onClick={()=>navigate('/admin/addNewCostume')}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-950 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200"
          >
            <Plus size={18} />
            <span>Add Costume</span>
          </button>
        </div>

        {isOpenModal && <Modal setIsOpenModal={setIsOpenModal} cupboardid={cpid} costumeid={seletectedid} setCostumes={setCostumes} setFilterData={setFilterData} />}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {cupboardName}
                </h1>
                <h2 className="text-xl font-semibold text-gray-700 mt-1">
                  Costume Collection
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {filterData?.length || 0} items
                  </span>
                </h2>
              </div>
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search costumes..."
                  value={searchDetails}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 max-h-[calc(100vh-220px)] overflow-y-auto">
            {(filterData?.length > 0 ? filterData : costumes)?.length > 0 ? (
              (filterData?.length > 0 ? filterData : costumes)?.map((costume,index) => (
                <div 
                  key={index} 
                  className="p-5 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                      <img 
                        src={`${costume.fileUrl}`} 
                        alt={costume.costumename} 
                        className="w-full h-full object-contain p-2" 
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {isRenaming === costume.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={renaming.costumename}
                                onChange={(e) => setRenaming({ ...renaming, costumename: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Costume name"
                              />
                              <textarea
                                value={renaming.description}
                                onChange={(e) => setRenaming({ ...renaming, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Description"
                                rows={3}
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {costume.costumename}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {costume.description}
                              </p>
                              <div className="flex items-center mt-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  quantity: {costume.quantity}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          {isRenaming === costume.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={handleRenaming}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition duration-200"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCloseRenaming}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                className="bg-gray-200 hover:bg-gray-400 text-gray-600 p-2 rounded-lg transition duration-200"
                                onClick={() => handleOpenModal(costume.id)}
                                title="Move costume"
                              >
                                <MoveRightIcon size={18} />
                              </button>
                              <button
                                onClick={() => handleOpenRenaming(costume.id)}
                                className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 rounded-lg transition duration-200"
                                title="Edit costume"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteCostume(costume.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition duration-200"
                                title="Delete costume"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No costumes found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchDetails ? "Try adjusting your search terms" : "Add your first costume to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costumes;