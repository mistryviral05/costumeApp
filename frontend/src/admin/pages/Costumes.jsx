import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, FolderPlus, MoveRightIcon, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Notfound from './Notfound';
import Modal from '../components/Modal';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Costumes = ({ cupboard }) => {
  const navigate = useNavigate();
  const params = useParams();
  const cpid = params.id;
  const id = uuidv4();
  const [isValidCupboard, setIsValidCupboard] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [costumes, setCostumes] = useState([]);
  const [newCostume, setNewCostume] = useState({ costumename: '', description: '' });
  const [searchDetails, setSearchDetails] = useState('');
  const [filterData, setFilterData] = useState(costumes);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [seletectedid, setSeletectedid] = useState(null);
  const [isRenaming, setIsRenaming] = useState(null);
  const [renaming, setRenaming] = useState({ costumename: '', description: '', id: '' });
  const [file, setFile] = useState(null);

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

  const handleAddCostume = async () => {
    const formData = new FormData();
    formData.append('file', file);
    let fileUrl = null;

    try {
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

    if (newCostume.costumename && newCostume.description) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addCostume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpid: cpid, id: id, costumename: newCostume.costumename, description: newCostume.description, fileUrl: fileUrl })
      });
      if (response.ok) {
        const res = await response.json();
        setCostumes([...costumes, { id: id, ...newCostume, fileUrl }]);
        setFilterData([...filterData, { id: id, ...newCostume, fileUrl }]);
        toast('Data added', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        setNewCostume({ costumename: '', description: '' });
        setFile(null);
      }
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      if (response.ok) {
        const data = await response.json();
        const cupboardExists = data.cupboards.some(cupboard => cupboard.id === cpid);
        setIsValidCupboard(cupboardExists);
        
        if (cupboardExists) {
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
  }, [cpid]);

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
        // Refresh the costumes list after update
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenRenaming = (id) => {
    setIsRenaming(id);
    // Find the current costume data
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isValidCupboard) {
    return <Notfound />;
  }

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
      <div className="font-sans max-w-5xl max-md:max-w-xl mx-auto bg-white py-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded mb-4 transition duration-200"
        >
          ⬅ Back
        </button>

        {isOpenModal && <Modal setIsOpenModal={setIsOpenModal} cupboardid={cpid} costumeid={seletectedid} setCostumes={setCostumes} setFilterData={setFilterData} />}

        <h1 className="text-3xl font-bold text-gray-800 text-center">Costume List</h1>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="md:col-span-2 space-y-4 max-h-[75vh] overflow-y-auto">
            {(filterData.length > 0 ? filterData : costumes).map((costume) => (
              <div key={costume.id} className="grid grid-cols-3 items-start gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="col-span-2 flex items-start gap-4">
                  <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0 bg-gray-100 p-2 rounded-md">
                    <img src={`${costume.fileUrl}`} alt="Costume" className="w-full h-full object-contain hover:scale-110 transition-transform duration-300 cursor-pointer hover:absolute z-10 hover:top-0 hover:right-52" />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-gray-800">
                      {isRenaming === costume.id ? (
                        <input
                          type="text"
                          value={renaming.costumename}
                          onChange={(e) => setRenaming({ ...renaming, costumename: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                      ) : costume.costumename}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">
                      {isRenaming === costume.id ? (
                        <input
                          type="text"
                          value={renaming.description}
                          onChange={(e) => setRenaming({ ...renaming, description: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                        />
                      ) : costume.description}
                    </p>

                    <div className="flex gap-2 mt-6">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                        onClick={() => handleOpenModal(costume.id)}
                      >
                        <MoveRightIcon size={16} />
                      </button>
                      {isRenaming === costume.id ? (
                        <>
                          <button
                            onClick={handleRenaming}
                            className="bg-gray-800 text-white py-1 px-3 rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCloseRenaming}
                            className="bg-red-500 text-white py-1 px-3 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenRenaming(costume.id)}
                            className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded text-xs"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCostume(costume.id)}
                            className="text-red-500 py-1 px-3 rounded text-xs flex items-center gap-1"
                          >
                            <Trash size={16} />
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 rounded-md p-4 h-max">
            <h3 className="text-lg max-sm:text-base font-bold text-gray-800 border-b border-gray-300 pb-2">Add New Costume</h3>

            <div className="mt-6">
              <div className="relative flex items-center mb-4">
                <input
                  type="text"
                  placeholder="Search Costumes..."
                  value={searchDetails}
                  onChange={handleSearch}
                  className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                />
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Costume Name"
                  value={newCostume.costumename}
                  onChange={(e) => setNewCostume({ ...newCostume, costumename: e.target.value })}
                  className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newCostume.description}
                  onChange={(e) => setNewCostume({ ...newCostume, description: e.target.value })}
                  className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                />
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddCostume}
                  className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-gray-800 hover:bg-gray-900 text-white rounded-md flex items-center justify-center gap-2"
                >
                  <FolderPlus size={16} />
                  Add Costume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Costumes;