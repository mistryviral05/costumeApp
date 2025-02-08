import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  DollarSign, 
  Info, 
  Tag, 
  CheckCircle,
  FileText,
  ImageIcon,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';

const AddNewCostume = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [costumeData, setCostumeData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    category: '',
    condition: '',
    brand: '',
    material: '',
    images: [],
    previewUrls: []
  });

  const steps = [
    { icon: FileText, label: 'Basic Info' },
    { icon: Tag, label: 'Details' },
    { icon: ImageIcon, label: 'Photos' },
    { icon: ClipboardCheck, label: 'Review' }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(file => URL.createObjectURL(file));
    
    setCostumeData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
      previewUrls: [...prev.previewUrls, ...urls]
    }));
  };

  const handleSubmit = async () => {
    console.log('Submitting costume data:', costumeData);
    navigate('/admin/gallary');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gray-100 border  rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  placeholder="e.g., Spider-Man Classic Suit"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a clear, descriptive name for your costume</p>
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-semibold text-gray-900 mb-1">
                  Brand/Manufacturer
                </label>
                <input
                  type="text"
                  id="brand"
                  value={costumeData.brand}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  placeholder="e.g., Marvel Official, Custom Made"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={costumeData.description}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  placeholder="Describe your costume's features, materials, and condition..."
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 20 characters recommended</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Specifications</h3>
                  <p className="text-sm text-blue-700">Add detailed specifications to help customers find your costume.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-1">
                  Daily Rental Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    value={costumeData.price}
                    onChange={(e) => setCostumeData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Set a competitive daily rental rate</p>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-semibold text-gray-900 mb-1">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  id="size"
                  value={costumeData.size}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                >
                  <option value="">Select size</option>
                  <option value="XS">XS (Extra Small)</option>
                  <option value="S">S (Small)</option>
                  <option value="M">M (Medium)</option>
                  <option value="L">L (Large)</option>
                  <option value="XL">XL (Extra Large)</option>
                  <option value="XXL">XXL (2X Large)</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={costumeData.category}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="superhero">Superhero</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="period">Period/Historical</option>
                  <option value="anime">Anime/Cosplay</option>
                  <option value="halloween">Halloween</option>
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-1">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  value={costumeData.condition}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label htmlFor="material" className="block text-sm font-semibold text-gray-900 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  id="material"
                  value={costumeData.material}
                  onChange={(e) => setCostumeData(prev => ({ ...prev, material: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  placeholder="e.g., Cotton, Polyester, Spandex"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Photo Guidelines</h3>
                  <p className="text-sm text-blue-700">Add clear, well-lit photos from multiple angles. Include close-ups of details and any imperfections.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900">Click to upload images</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                    Select Files
                  </button>
                </label>
              </div>
              
              {costumeData.previewUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Uploaded Photos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {costumeData.previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => {
                                const newImages = [...costumeData.images];
                                const newUrls = [...costumeData.previewUrls];
                                newImages.splice(index, 1);
                                newUrls.splice(index, 1);
                                setCostumeData(prev => ({
                                  ...prev,
                                  images: newImages,
                                  previewUrls: newUrls
                                }));
                              }}
                              className="bg-white text-red-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          Photo {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
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
                    <span className="text-sm text-gray-500 block mb-1">Daily Rental Price</span>
                    <p className="text-2xl font-bold text-gray-900">${costumeData.price || '0.00'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Size</span>
                    <p className="text-lg font-medium text-gray-900">{costumeData.size || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Category</span>
                    <p className="text-lg font-medium text-gray-900">{costumeData.category || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Condition</span>
                    <p className="text-lg font-medium text-gray-900">{costumeData.condition || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Brand</span>
                    <p className="text-lg font-medium text-gray-900">{costumeData.brand || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Material</span>
                    <p className="text-lg font-medium text-gray-900">{costumeData.material || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {costumeData.previewUrls.length > 0 && (
                <div className="p-4 sm:p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Photos ({costumeData.previewUrls.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {costumeData.previewUrls.map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
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
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            <button
              onClick={() => {
                if (step === 4) {
                  handleSubmit();
                } else {
                  setStep(prev => prev + 1);
                }
              }}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              {step === 4 ? (
                <>
                  Submit Listing
                  <CheckCircle className="w-4 h-4 ml-2" />
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