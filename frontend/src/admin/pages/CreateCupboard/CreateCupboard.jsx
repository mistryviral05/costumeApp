import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DoorClosed, Info, MapPin, Box, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

function CreateCupboard() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        space: '',
        place: '',
    });

    const handleCreateCupboard = async (e) => {
        e.preventDefault();  // Prevent default form submission
        const id = uuidv4(); // Generate new unique ID

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/addCupboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, id })  // Send updated data
            });

            if (response.ok) {
              
                navigate("/admin/home");  // Redirect after success
                toast.success('Cupboard created successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                throw new Error('Failed to create cupboard');
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error('Error creating cupboard. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Cupboard</h1>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">Cupboard Information</h3>
                            <p className="text-sm text-blue-700">Please provide the details for the new cupboard location.</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateCupboard} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">
                                Cupboard Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DoorClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter cupboard name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="space" className="block text-sm font-semibold text-gray-900 mb-1">
                                Storage Space <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="number"
                                    id="space"
                                    placeholder="Enter available space"
                                    value={formData.space}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="place" className="block text-sm font-semibold text-gray-900 mb-1">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    id="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                    required
                                >
                                    <option value="">Select a Location</option>
                                    <option value="basement of hostel">Basement of Hostel</option>
                                    <option value="basement of sabha hall">Basement of Sabha Hall</option>
                                    <option value="sabha hall">Sabha Hall</option>
                                    <option value="hostel">Hostel</option>
                                </select>
                            </div>
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
