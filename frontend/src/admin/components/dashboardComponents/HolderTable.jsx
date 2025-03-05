import React, { useEffect, useState } from "react";
import { Check, X, Edit, Trash2, Loader2, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HolderTable = () => {
  const [holders, setHolders] = useState([]);
  const [loder, setLoder] = useState(false);
  const [editHolderId, setEditHolderId] = useState(null);
  const [newHolderData, setNewHolderData] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoder(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getHolders`, { method: "GET" });

      if (res.ok) {
        const data = await res.json();
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

  const handleSave = async(id) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/updateHolderDetails`,{
          method:"PUT",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({holderId:id,phonenumber:newHolderData.contact,deadline:newHolderData.deadline})
        })

        if(res.ok){
          const message = await res.json();
           toast.success(message.message)
          fetchData()
          setEditHolderId(null);
        }
    } catch (error) {
      console.log(error)
    }
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
         toast.success(message.message)
          setHolders((prev) => prev.filter((holder) => holder.id !== id));
        }else{
          const message = await res.json();
         toast.success(message.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRowClick = (holderId) => {
    navigate(`/admin/holderCostumeDetails/${holderId}`);
  };

  const handleSendWhatsApp = async (holder) => {
    try {
        // Define a default country code (e.g., "91" for India)
        const countryCode = "91"; // Change this to your preferred country code

        // Get phone number without any formatting
        let phoneNumber = holder.assignedTo.contact.replace(/\D/g, '');

        // Ensure the phone number has a country code
        if (!phoneNumber.startsWith(countryCode)) {
            phoneNumber = `${countryCode}${phoneNumber}`;
        }

        // Create a message with holder details
        const message = `Hello ${holder.assignedTo.personname}, this is a reminder about your costume order with reference ${holder.assignedTo.Refrence}. Your deadline is ${formatDate(holder.assignedTo.deadline)}. Thank you!`;

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);

        // Create WhatsApp API URL with country code
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        // Log the action to the backend
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/logWhatsAppMessage`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                holderId: holder.id,
                message: message,
                sentAt: new Date().toISOString()
            })
        });

        toast.success("WhatsApp message initiated!");
    } catch (error) {
        console.log(error);
        toast.error("Failed to send WhatsApp message");
    }
  };

  const handleMakeCall = async (holder) => {
    try {
        // Define a default country code (e.g., "91" for India)
        const countryCode = "91"; // Change this to your preferred country code

        // Get phone number without any formatting
        let phoneNumber = holder.assignedTo.contact.replace(/\D/g, '');

        // Ensure the phone number has a country code
        if (!phoneNumber.startsWith(countryCode)) {
            phoneNumber = `${countryCode}${phoneNumber}`;
        }

        // Create phone call URL using tel: protocol
        const phoneUrl = `tel:${phoneNumber}`;

        // Attempt to initiate the call
        window.location.href = phoneUrl;

        // Log the call action to the backend
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/logPhoneCall`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                holderId: holder.id,
                phoneNumber: phoneNumber,
                calledAt: new Date().toISOString()
            })
        });

        toast.success("Phone call initiated!");
    } catch (error) {
        console.log(error);
        toast.error("Failed to initiate phone call");
    }
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
            <th className="text-left py-2">Refrence</th>
            <th className="text-left py-2">Phone</th>
            <th className="text-left py-2">Deadline</th>
            <th className="text-center py-2">Contact</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        {loder ? (
          <tbody>
            <tr>
              <td colSpan="6" className="text-center py-4">
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
              >
                {editHolderId === holder.id ? (
                  <>
                    <td className="py-2">
                      <td className="py-2">{holder.assignedTo.personname}</td>
                    </td>
                    <td className="py-2">
                      <td className="py-2">{holder.assignedTo.Refrence}</td>
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={newHolderData.contact}
                        placeholder="Enter ten digit number"
                        onChange={(e) => {
                          e.stopPropagation();
                          setNewHolderData({ ...newHolderData, contact: e.target.value })
                        }}
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
                        }}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="text-center py-2">
                      {/* Contact options disabled during edit */}
                      <div className="flex justify-center space-x-2">
                        <button
                          disabled
                          className="p-2 rounded bg-gray-100 opacity-50"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          disabled
                          className="p-2 rounded bg-gray-100 opacity-50"
                        >
                          <Phone size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(holder.id);
                        }}
                        className="p-2 rounded hover:bg-green-500"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{holder.assignedTo.Refrence}</td>
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{holder.assignedTo.contact}</td>
                    <td className="py-2" onClick={() => handleRowClick(holder.id)}>{formatDate(holder.assignedTo.deadline)}</td>
                    <td className="text-center py-2">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendWhatsApp(holder);
                          }}
                          className="p-2 rounded-full hover:bg-green-100 transition-colors duration-200 text-green-600"
                          title="Send WhatsApp Message"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMakeCall(holder);
                          }}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 text-blue-600"
                          title="Make Phone Call"
                        >
                          <Phone size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(holder);
                        }}
                        className="p-2 rounded hover:bg-blue-500"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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