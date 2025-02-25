import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react'; // Adding Check and X icons for save

import { toast } from "sonner";
import { ToastContainer, Bounce } from 'react-toastify';

const CatagoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);  // To track which category is being edited
  const [newCategoryName, setNewCategoryName] = useState('');  // To store the new category name during edit

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/getCatagory`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle delete category
  const handleDelete = async (id) => {
    let c = confirm("Are you sure you want to delete this data")
    if(c){
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/deleteCatagory/${id}`, { method: "DELETE" });
      if (res.ok) {
        const message = await res.json();
        // setCategories((prvc)=>prvc.filter((c)=>c._id!==id))
        fetchData();//for new data fetch
        toast.success(message.message);
      }
    } catch (err) {
      console.log(err)
    }
  }
  };

  // Handle edit button click
  const handleEdit = (category) => {
    setEditCategoryId(category._id);
    setNewCategoryName(category.catagory);  // Pre-fill the input with current category name
  };

  // Handle save edited category
  const handleSave = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/updateCatagory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catagory: newCategoryName, _id: id }),
      });

      if (res.ok) {
        const message = await res.json();
        toast(message.message, {
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
        fetchData();  // Refresh the category list after updating
        setEditCategoryId(null);  // Exit edit mode
      } else {
        console.log("Failed to update category");
      }
    } catch (err) {
      console.log(err);
    }
    setEditCategoryId(null);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditCategoryId(null);
    setNewCategoryName('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer
        position="top-center"
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
      <div className="border-b pb-4 mb-4">
        <h2 className="text-lg font-semibold">Category Management</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Category Name</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2">
                {/* Show input field if this category is being edited */}
                {editCategoryId === category._id ? (
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  category.catagory
                )}
              </td>
              <td className="text-right space-x-2">
                {editCategoryId === category._id ? (
                  <>
                    <button onClick={() => handleSave(category._id)} className="p-2 rounded hover:bg-green-500">
                      <Check size={16} /> {/* Save Icon */}
                    </button>
                    <button onClick={handleCancel} className="p-2 rounded hover:bg-gray-400">
                      <X size={16} /> {/* Cancel Icon */}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(category)} className="p-2 rounded hover:bg-blue-500">
                      <Edit size={16} /> {/* Edit Icon */}
                    </button>
                    <button onClick={() => handleDelete(category._id)} className="p-2 rounded hover:bg-red-500">
                      <Trash2 size={16} /> {/* Delete Icon */}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatagoryTable;
