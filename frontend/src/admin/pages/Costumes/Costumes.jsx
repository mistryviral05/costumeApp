import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, MoveRightIcon, Trash } from 'lucide-react';
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
      <div className="font-sans max-w-5xl mx-auto bg-white py-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded mb-4 transition duration-200"
        >
          ⬅ Back
        </button>

        {isOpenModal && <Modal setIsOpenModal={setIsOpenModal} cupboardid={cpid} costumeid={seletectedid} setCostumes={setCostumes} setFilterData={setFilterData} />}

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Costume List</h1>
            <div className="w-72">
              <input
                type="text"
                placeholder="Search Costumes..."
                value={searchDetails}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              />
            </div>
          </div>

          <div className="grid gap-6 max-h-[75vh] overflow-y-auto">
            {(filterData?.length > 0 ? filterData : costumes)?.map((costume) => (
              <div key={costume.id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0 bg-gray-100 p-2 rounded-md">
                  <img src={`${costume.fileUrl}`} alt="Costume" className="w-full h-full object-contain" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
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
                      <p className="text-sm text-gray-500 mt-1">
                        {isRenaming === costume.id ? (
                          <input
                            type="text"
                            value={renaming.description}
                            onChange={(e) => setRenaming({ ...renaming, description: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
                          />
                        ) : costume.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                        onClick={() => handleOpenModal(costume.id)}
                      >
                        <MoveRightIcon size={16} />
                      </button>
                      {isRenaming === costume.id ? (
                        <>
                          <button
                            onClick={handleRenaming}
                            className="bg-gray-800 text-white px-3 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCloseRenaming}
                            className="bg-red-500 text-white px-3 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenRenaming(costume.id)}
                            className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCostume(costume.id)}
                            className="text-red-500 p-2 rounded hover:bg-red-50"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Costumes;