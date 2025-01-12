import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { ToastContainer, toast,Bounce } from 'react-toastify';

export default function Modal({ setIsOpenModal, cupboardid,costumeid ,setCostumes,setFilterData}) {
  const [cupboard, setCupboard] = useState([]);
  const [selectedCupboardId, setSelectedCupboardId] = useState(null); // State for selected cupboard ID

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

  const handleTransferData = async(e) => {
    e.preventDefault();
    const cpid = cupboardid;
    const newCpid = selectedCupboardId;
    const id = costumeid;
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/trasferCostume`,{
        method:'PUT',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({cpid:cpid,newCpid:newCpid,id:id}),
      })

      if(response.ok){
        const data = await response.json()
     
        setCostumes((preCostume)=>preCostume.filter((e)=>e.id!==id))
        setFilterData((preCostume)=>preCostume.filter((e)=>e.id!==id))
     
        setIsOpenModal(false)
        toast(`${data.message}`, {
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

    }catch(err){
      console.log(err)
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
    <form onSubmit={handleTransferData} className="flex items-center justify-center absolute min-h-screen bg-gray-100">
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex items-center justify-center">
        <div className="relative bg-white w-full max-w-md m-4 rounded-lg shadow-lg">
          <div className="p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
              onClick={() => setIsOpenModal(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Created cupboards</h2>

            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-300">
                  <th className="text-left px-4 py-2 border-r border-gray-300">Choose</th>
                  <th className="text-left px-4 py-2 border-r border-gray-300">Cupboard Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredCupboard.map((detail) => (
                  <tr key={detail.id} className="bg-white border-b border-gray-300">
                    <td className="px-4 py-2 border-r border-gray-300">
                      <input
                        type="radio"
                        name="cupboard"
                        value={detail.id}
                        className="form-radio h-4 w-4 text-blue-500"
                        onChange={(e) => setSelectedCupboardId(e.target.value)} // Update state on selection
                      />
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">{detail.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}
