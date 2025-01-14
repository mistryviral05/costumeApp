import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function Modal({ setIsOpenModal, cupboardid, costumeid, setCostumes, setFilterData }) {
  const [cupboard, setCupboard] = useState([]);
  const [selectedCupboardId, setSelectedCupboardId] = useState(null);

  const fetchCupboards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      if (response.ok) {
        const data = await response.json();
        setCupboard(data.cupboards);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCupboards();
  }, []);

  const handleTransferData = async (e) => {
    e.preventDefault();
    const cpid = cupboardid;
    const newCpid = selectedCupboardId;
    const id = costumeid;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/trasferCostume`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpid: cpid, newCpid: newCpid, id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        setCostumes((preCostume) => preCostume.filter((e) => e.id !== id));
        setFilterData((preCostume) => preCostume.filter((e) => e.id !== id));
        setIsOpenModal(false);
        toast(`${data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCupboard = cupboard.filter((item) => item.id !== cupboardid);

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
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <form onSubmit={handleTransferData}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold leading-6 text-gray-900">
                        Select Destination Cupboard
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setIsOpenModal(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {filteredCupboard.map((detail) => (
                        <label
                          key={detail.id}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedCupboardId === detail.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="cupboard"
                            value={detail.id}
                            checked={selectedCupboardId === detail.id}
                            onChange={(e) => setSelectedCupboardId(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{detail.name}</p>
                              <ArrowRight className={`h-4 w-4 text-gray-400 transition-opacity ${
                                selectedCupboardId === detail.id ? 'opacity-100' : 'opacity-0'
                              }`} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={!selectedCupboardId}
                  className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                    selectedCupboardId
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : 'bg-blue-300 cursor-not-allowed'
                  }`}
                >
                  Transfer
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setIsOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}