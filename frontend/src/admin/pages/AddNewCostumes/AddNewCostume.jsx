import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';

const AddNewCostume = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cupboards, setCupboards] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false)

  const [costumeData, setCostumeData] = useState({
    name: '',
    cpid: '',
    category: '',
    description: '',
    fileUrl: '',
    quantity: 1, // Added quantity field with default value of 1
  });

  const id = uuidv4();

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/getCatagory`, { method: "GET" });

      if (res.ok) {
        const data = await res.json();
        setCategories(data.data);
      }
      if (response.ok) {
        const data = await response.json();
        setCupboards(data.cupboards);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const steps = [
    { icon: FileText, label: 'Basic Info' },
    { icon: ClipboardCheck, label: 'Review' }
  ];

  const validateFields = () => {
    const newErrors = {};

    if (!costumeData.name.trim()) newErrors.name = "Costume Name is required.";
    if (!costumeData.category) newErrors.category = "Category is required.";
    if (!costumeData.cpid) newErrors.cpid = "Cupboard selection is required.";
    if (!file) newErrors.file = "An image file is required.";
    if (costumeData.quantity < 1) newErrors.quantity = "Quantity must be at least 1.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    let fileUrl = null;
    setIsSubmiting(true)
    try {
      const formData = new FormData();
      formData.append('file', file);
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

    if (costumeData.cpid) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addCostume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpid: costumeData.cpid,
          id: id,
          catagory: costumeData.category,
          costumename: costumeData.name,
          description: costumeData.description,
          fileUrl: fileUrl,
          quantity: costumeData.quantity, // Added quantity to the submission
        })
      });

      if (response.ok) {
        const message = await response.json();
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

        setCostumeData({
          name: '',
          cpid: '',
          category: '',
          description: '',
          fileUrl: '',
          quantity: '',
        });
        setFile(null);
        setPreviewUrl(null);
        setIsSubmiting(false)
        setStep(1);
      }
    } else {
      alert('Please fill in at least the image URL and name fields');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gray-100 border rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Basic Information</h3>
                  <p className="text-sm text-blue-700">Start by providing the essential details about your costume.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">
                  Costume Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={costumeData.name}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all`}
                  placeholder="Costume Name"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-1">
                  Costume Color
                </label>
                <input
                  type="text"
                  id="description"
                  value={costumeData.description}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  placeholder="Costume Color"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold text-gray-900 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={costumeData.quantity}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, quantity: parseInt(e.target.value)  }))}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label htmlFor="cpid" className="block text-sm font-semibold text-gray-900 mb-1">
                  Select Cupboard <span className="text-red-500">*</span>
                </label>
                <select
                  id="cpid"
                  value={costumeData.cpid}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, cpid: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.cpid ? 'border-red-500' : 'border-gray-300'} focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all`}
                  required
                >
                  <option value="">Select a Cupboard</option>
                  {cupboards.map((cupboard, i) => (
                    <option key={i} value={cupboard.id}>{cupboard.name}</option>
                  ))}
                </select>
                {errors.cpid && <p className="text-sm text-red-500 mt-1">{errors.cpid}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={costumeData.category}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all`}
                >
                  <option value="">Select a Category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category._id}>{category.catagory}</option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Choose Image <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    if (selectedFile) {
                      setPreviewUrl(URL.createObjectURL(selectedFile));
                    }
                  }}
                  className={`px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border ${errors.file ? 'border-red-500' : 'border-gray-300'} focus:border-gray-800 outline-none`}
                />
                {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900 mb-1">Review Your Listing</h3>
                  <p className="text-sm text-yellow-700">Please review all information carefully before submitting.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{costumeData.name || 'Untitled Costume'}</h3>
                <p className="text-gray-600">{costumeData.description || 'No description provided'}</p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Category</span>
                    <p className="text-lg font-medium text-gray-900">
                      {categories.find(cat => cat._id === costumeData.category)?.catagory || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Cupboard Name</span>
                    <p className="text-lg font-medium text-gray-900">
                      {cupboards.find(cupboard => cupboard.id === costumeData.cpid)?.name || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Quantity</span>
                    <p className="text-lg font-medium text-gray-900">
                      {costumeData.quantity}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Cupboard Place</span>
                    <p className="text-lg font-medium text-gray-900">
                      {cupboards.find(cupboard => cupboard.id === costumeData.cpid)?.place || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-2">Image Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Selected Costume"
                    className="w-full max-w-xs rounded-lg border border-gray-300 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Costume Listing</h1>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isCompleted = step > index + 1;
                const isCurrent = step === index + 1;

                return (
                  <div key={index} className="flex items-center">
                    <div
                      className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 
                        ${isCompleted ? 'border-yellow-600 bg-yellow-600' :
                          isCurrent ? 'border-yellow-600 bg-white' :
                            'border-gray-300 bg-white'}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-yellow-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="ml-2">
                      <p className={`text-xs font-medium ${isCurrent ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {renderStep()}

          {/* Navigation */}
          <div className="mt-8 flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(prev => prev - 1)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${step === 1 ? 'invisible' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            <button
              onClick={() => {
                if (step === 2) {
                  handleSubmit();
                } else {
                  if (validateFields()) {
                    setStep(prev => prev + 1);
                  }
                }
              }}
              disabled={isSubmiting}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              {step === 2 ? (
                <>
                  {isSubmiting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Submit Listing
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCostume;