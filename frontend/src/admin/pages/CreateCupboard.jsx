import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DoorClosed, 
  Info, 
  MapPin, 
  Box, 
  CheckCircle 
} from 'lucide-react';

function CreateCupboard({ createCupboard }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        space: '',
        place: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createCupboard(formData);
        navigate("/admin/home");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-500 hover:text-gray-700 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Cupboard</h1>
                    </div>
                </div>

                {/* Form content */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">Cupboard Information</h3>
                                <p className="text-sm text-blue-700">Please provide the details for the new cupboard location.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">
                                Cupboard Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <DoorClosed className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter cupboard name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Choose a unique, identifiable name for the cupboard</p>
                        </div>

                        <div>
                            <label htmlFor="space" className="block text-sm font-semibold text-gray-900 mb-1">
                                Storage Space <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Box className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    id="space"
                                    placeholder="Enter available space"
                                    value={formData.space}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Specify the total storage capacity in quantity</p>
                        </div>

                        <div>
                            <label htmlFor="place" className="block text-sm font-semibold text-gray-900 mb-1">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all appearance-none"
                                    required
                                >
                                    <option value="">Select a Location</option>
                                    <option value="basement of hostel">Basement of Hostel</option>
                                    <option value="basement of sabha hall">Basement of Sabha Hall</option>
                                    <option value="sabha hall">Sabha Hall</option>
                                    <option value="hostel">Hostel</option>
                                </select>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Choose the physical location of the cupboard</p>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                            >
                                Create Cupboard
                                <CheckCircle className="ml-2 -mr-1 h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCupboard;