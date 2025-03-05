import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  Loader2,
  FileText,
  ClipboardCheck,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Upload
} from 'lucide-react';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const AddNewCostume = () => {
  const [step, setStep] = useState(1);
  const [cupboards, setCupboards] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const [costumeData, setCostumeData] = useState({
    name: '',
    cpid: '',
    category: '',
    description: '',
    fileUrl: '',
    quantity: 1,
  });

  const id = uuidv4();

  const fetchData = async () => {
    try {
      const [cupboardResponse, categoryResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/getCatagory`, { method: "GET" })
      ]);

      if (categoryResponse.ok) {
        const data = await categoryResponse.json();
        setCategories(data.data);
      }
      
      if (cupboardResponse.ok) {
        const data = await cupboardResponse.json();
        setCupboards(data.cupboards);
      }
    } catch (err) {
      toast.error('Failed to load form data. Please try again.', {
        position: "top-center"
      });
      console.error(err);
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

    if (!costumeData.name.trim()) newErrors.name = "Costume name is required";
    if (!costumeData.category) newErrors.category = "Category is required";
    if (!costumeData.cpid) newErrors.cpid = "Cupboard selection is required";
    if (!file) newErrors.file = "Image is required";
    if (costumeData.quantity < 1) newErrors.quantity = "Quantity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (!formTouched) setFormTouched(true);
    setCostumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    if (!formTouched) setFormTouched(true);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload image first
      let fileUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/uploadefile`, {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          fileUrl = data.fileUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Submit costume data
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
          quantity: costumeData.quantity,
        })
      });

      if (response.ok) {
        const message = await response.json();
        toast.success(message.message || 'Costume added successfully', {
          position: "top-center",
          autoClose: 2000,
        });

        // Reset form
        setCostumeData({
          name: '',
          cpid: '',
          category: '',
          description: '',
          fileUrl: '',
          quantity: 1,
        });
        setFile(null);
        setPreviewUrl(null);
        setFormTouched(false);
        setStep(1);
      } else {
        throw new Error('Failed to save costume data');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred. Please try again.', {
        position: "top-center"
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <Alert variant="info" className="bg-blue-50 border-blue-500">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-900">Costume Information</AlertTitle>
              <AlertDescription className="text-blue-700">
                Please fill in all required fields marked with an asterisk (*)
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Costume Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={costumeData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`mt-1 ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Enter costume name"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={costumeData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.category ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category, i) => (
                      <SelectItem key={i} value={category._id}>{category.catagory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="cpid" className="text-sm font-medium">
                  Cupboard <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={costumeData.cpid} 
                  onValueChange={(value) => handleInputChange('cpid', value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.cpid ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
                    <SelectValue placeholder="Select a Cupboard" />
                  </SelectTrigger>
                  <SelectContent>
                    {cupboards.map((cupboard, i) => (
                      <SelectItem key={i} value={cupboard.id}>{cupboard.name} - {cupboard.place}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cpid && <p className="text-sm text-red-500 mt-1">{errors.cpid}</p>}
              </div>

              <div>
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="quantity"
                  min="1"
                  value={costumeData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || '')}
                  className={`mt-1 ${errors.quantity ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Costume Color/Description
                </Label>
                <Textarea
                  id="description"
                  value={costumeData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1"
                  placeholder="Enter color or additional description"
                  rows="3"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium block mb-2">
                  Costume Image <span className="text-red-500">*</span>
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.file ? 'border-red-500' : 'border-gray-300'
                  } hover:border-blue-500 transition-all`}
                >
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-40 object-contain"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Remove image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                          Click to upload
                        </label>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                        <p className="mt-1">or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Alert variant="warning" className="bg-yellow-50 border-yellow-500">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Review Your Costume Details</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Please review all information before submission.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{costumeData.name || 'Untitled Costume'}</CardTitle>
                {costumeData.description && (
                  <CardDescription>{costumeData.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent className="bg-gray-50 py-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {categories.find(cat => cat._id === costumeData.category)?.catagory || 'Not specified'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cupboard</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {cupboards.find(cupboard => cupboard.id === costumeData.cpid)?.name || 'Not specified'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {cupboards.find(cupboard => cupboard.id === costumeData.cpid)?.place || 'Not specified'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {costumeData.quantity}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-500">
                      {id.substring(0, 8)}...
                    </dd>
                  </div>
                </div>
              </CardContent>

              {previewUrl && (
                <CardFooter className="flex justify-center bg-gray-50 py-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Costume Preview"
                      className="max-h-64 object-contain rounded-md border border-gray-200"
                    />
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      
      <div className=" mx-auto px-4 ">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Costume</h1>

          {/* Progress indicator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full h-0.5 bg-gray-200"></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isCompleted = step > index + 1;
                const isCurrent = step === index + 1;

                return (
                  <div key={index} className="flex items-center">
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full 
                        ${isCompleted ? 'bg-blue-600' : isCurrent ? 'bg-white border-2 border-blue-600' : 'bg-white border-2 border-gray-300'}
                        transition-colors duration-200 ease-in-out`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="hidden sm:block ml-3">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
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
        <Card>
          <CardContent className="p-6 sm:p-8">
            {renderStep()}
          </CardContent>

          {/* Form actions */}
          <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(step === 1 ? 1 : step - 1)}
              className={`${step === 1 ? 'invisible' : ''}`}
            >
              Back to Details
            </Button>
            
            <Button
              onClick={() => {
                if (step === 2) {
                  handleSubmit();
                } else if (validateFields()) {
                  setStep(step + 1);
                }
              }}
              disabled={isSubmitting || (!formTouched && step === 1)}
              className={`
                ${isSubmitting || (!formTouched && step === 1) ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-gray-900 hover:bg-gray-800'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {step === 2 ? 'Submitting...' : 'Processing...'}
                </span>
              ) : step === 2 ? (
                'Submit Costume'
              ) : (
                <span className="flex items-center">
                  Continue to Review
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddNewCostume;