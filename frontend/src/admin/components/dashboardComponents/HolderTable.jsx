import React, { useEffect, useState } from "react";
import { Check, X, Edit, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HolderTable = () => {
  const [holders, setHolders] = useState([]);
  const [loder, setLoder] = useState(false);
  const [editHolderId, setEditHolderId] = useState(null);
  const [newHolderData, setNewHolderData] = useState({});
  const navigate = useNavigate(); // 👈 Import useNavigate

  const fetchData = async () => {
    try {
      setLoder(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getHolders`, { method: "GET" });

      if (res.ok) {
        const data = await res.json();
        console.log(data.data);
        setHolders(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoder(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // Converts to "DD-MM-YYYY"
  };

  const handleEdit = (holder) => {
    setEditHolderId(holder.id);
    setNewHolderData(holder);
  };

  const handleSave = (id) => {
    setHolders((prev) => prev.map((holder) => (holder.id === id ? newHolderData : holder)));
    setEditHolderId(null);
  };

  const handleCancel = () => {
    setEditHolderId(null);
  };

  const handleDelete = async (id) => {
    let c = confirm("Are you sure want to delete this holder");
    if(c){
      try {
      
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/deleteHolderDetails`,{method:"DELETE",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({holderId:id})
        });
        if(res.ok){
          const message = await res.json();
          alert(message.message);//here write react tostify
          setHolders((prev) => prev.filter((holder) => holder.id !== id));
        }
  
  
      } catch (error) {
        console.log(error);
      }

    }
  
  };

  const handleRowClick = (holderId) => {
    navigate(`/admin/holderCostumeDetails/${holderId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-auto">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-lg font-semibold">Holder Management</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Email</th>
            <th className="text-left py-2">Phone</th>
            <th className="text-left py-2">Deadline</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        {loder ? (
          <tbody>
            <tr>
              <td colSpan="5" className="text-center py-4">
                <Loader2 className="animate-spin mx-auto" />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {holders?.map((holder, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 cursor-pointer"
                 // 👈 Click to navigate
              >
                {editHolderId === holder.id ? (
                  <>
                    <td className="py-2">
                      <td className="py-2">{holder.assignedTo.personname}</td>
                    </td>
                    <td className="py-2">

                      <td className="py-2">{holder.assignedTo.email}</td>
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={newHolderData.contact}
                        placeholder="Enter ten digit number"
                        onChange={(e) => {
                          e.stopPropagation();
                          setNewHolderData({ ...newHolderData, contact: e.target.value })
                        }
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="date"
                        value={newHolderData.deadline}
                        onChange={(e) => {
                          e.stopPropagation();
                          setNewHolderData({ ...newHolderData, deadline: e.target.value })
                        }
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleSave(holder.id);
                        }}
                        className="p-2 rounded hover:bg-green-500"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleCancel();
                        }}
                        className="p-2 rounded hover:bg-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{holder.assignedTo.personname}</td>
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{holder.assignedTo.email}</td>
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{holder.assignedTo.contact}</td>
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{formatDate(holder.assignedTo.deadline)}</td>

                    <td className="text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleEdit(holder);
                        }}
                        className="p-2 rounded hover:bg-blue-500"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleDelete(holder.id);
                        }}
                        className="p-2 rounded hover:bg-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default HolderTable;
