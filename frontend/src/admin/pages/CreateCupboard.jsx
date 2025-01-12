import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateCupboard({ createCupboard }) {
    const navigate = useNavigate()
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
        createCupboard(formData)
        navigate("/home")

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
            <button
                onClick={() => navigate(-1)} // Go back to the previous page
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded absolute top-4 left-4 transition duration-200"
            >
                ⬅ Back
            </button>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-3xl p-8">
                <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
                    🚪 Create Your Cupboard
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cupboard Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-600 mb-2"
                        >
                            Cupboard Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter cupboard name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-800 py-3 px-4"
                            required
                        />
                    </div>

                    {/* Cupboard Space */}
                    <div>
                        <label
                            htmlFor="space"
                            className="block text-sm font-semibold text-gray-600 mb-2"
                        >
                            Cupboard Space &#40; quntity &#x29;
                        </label>
                        <input
                            type="number"
                            id="space"
                            placeholder="Enter space"
                            value={formData.space}
                            onChange={handleChange}
                            className="w-full rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-800 py-3 px-4"
                            required
                        />
                    </div>

                    {/* Place */}
                    <div>
                        <label
                            htmlFor="place"
                            className="block text-sm font-semibold text-gray-600 mb-2"
                        >
                            Place
                        </label>
                        <select
                            id="place"
                            value={formData.place}
                            onChange={handleChange}
                            className="w-full rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-800 py-3 px-4"
                            required
                        >
                            <option value="">Select a Place</option>
                            <option value="basement of hostel">Basement of Hostel</option>
                            <option value="basement of sabha hall">
                                Basement of Sabha Hall
                            </option>
                            <option value="sabha hall">Sabha Hall</option>
                            <option value="hostel">Hostel</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                        >
                            Create Cupboard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCupboard;
