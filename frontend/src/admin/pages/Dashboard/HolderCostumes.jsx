import React, { useEffect, useState } from 'react';
import { User, Calendar, Phone, Mail, Star, ArrowLeft, MapPin, Clock, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const HolderCostumeDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [holder, setHolder] = useState({});
  const [costumes, setCostumes] = useState([]);
  const [returnStatus, setReturnStatus] = useState({});

  const handleReturn = (costumeId, condition) => {
    setReturnStatus(prev => ({
      ...prev,
      [costumeId]: condition
    }));
  };

  const getButtonStyle = (costumeId, condition) => {
    const isSelected = returnStatus[costumeId] === condition;
    
    const baseStyles = "px-3 py-1 text-white rounded text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const conditionStyles = {
      good: `${baseStyles} ${
        isSelected 
          ? "bg-green-700 ring-2 ring-green-500 ring-offset-2" 
          : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      }`,
      medium: `${baseStyles} ${
        isSelected 
          ? "bg-yellow-700 ring-2 ring-yellow-500 ring-offset-2" 
          : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
      }`,
      damaged: `${baseStyles} ${
        isSelected 
          ? "bg-red-700 ring-2 ring-red-500 ring-offset-2" 
          : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      }`
    };

    return conditionStyles[condition];
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getAssignedDetailsById/${params.id}`, { method: "GET" });
  
      if (res.ok) {
        const data = await res.json();
        setHolder(data.data.assignedTo);
  
        const costumeDetails = await Promise.all(
          data.data.costumes.map(async (item) => {
            const costumeRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/costumes/${item.id}`);
            if (costumeRes.ok) {
              const costumeData = await costumeRes.json();
              const costume = costumeData.data[Object.keys(costumeData.data)[0]] || costumeData.data;
              return { ...costume, quantity: item.quantity };
            }
            return null;
          })
        );
       
        setCostumes(costumeDetails);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{holder.personname}</h1>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-black" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900 truncate">{holder.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-black" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Contact</p>
                  <p className="text-sm text-gray-900">{holder.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-black" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Address</p>
                  <p className="text-sm text-gray-900 truncate">{holder.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-black" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Deadline</p>
                  <p className="text-sm text-gray-900">{formatDate(holder.deadline)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Costumes Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Rented Costumes</h2>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-black" />
                <span className="text-sm font-medium text-gray-600">
                  {costumes.length} {costumes.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costume Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {costumes.map((costume, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={costume.fileUrl}
                        alt={costume.costumename}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{costume.costumename}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{costume.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        costume.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {costume.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {returnStatus[costume.id] && (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          returnStatus[costume.id] === 'good' ? 'bg-green-100 text-green-800' :
                          returnStatus[costume.id] === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {returnStatus[costume.id].charAt(0).toUpperCase() + returnStatus[costume.id].slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleReturn(costume.id, 'good')}
                          className={getButtonStyle(costume.id, 'good')}
                        >
                          Good
                        </button>
                        <button 
                          onClick={() => handleReturn(costume.id, 'medium')}
                          className={getButtonStyle(costume.id, 'medium')}
                        >
                          Medium
                        </button>
                        <button 
                          onClick={() => handleReturn(costume.id, 'damaged')}
                          className={getButtonStyle(costume.id, 'damaged')}
                        >
                          Damaged
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolderCostumeDetails;