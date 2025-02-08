import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, ArrowLeft, Package, Clock, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const DetailsCostume = () => {
    const navigate = useNavigate();
    const [isRented, setIsRented] = useState(true);
    const [returnStatus, setReturnStatus] = useState('pending'); // 'pending', 'returned', 'damaged'
    const [newRenter, setNewRenter] = useState({ name: '', contact: '' });
    
    const costume = {
        name: "Superhero Deluxe Costume",
        description: "High-quality superhero costume perfect for parties and events. Includes cape, mask, and full body suit. Made with premium materials for comfort and durability.",
        imageUrl: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=1200&q=80",
        rating: 4,
        reviews: 128,
        rentalStatus: {
            currentRenter: "John Doe",
            rentedDate: "2024-01-15",
            dueDate: "2024-01-16",
        },
        condition: "Excellent",
        timesRented: 15,
        lastCleaned: "2024-01-14"
    };

    const handleGiveToOther = (e) => {
        e.preventDefault();
        if (newRenter.name && newRenter.contact) {
            setIsRented(true);
            setReturnStatus('pending');
            costume.rentalStatus.currentRenter = newRenter.name;
            setNewRenter({ name: '', contact: '' });
            alert("Costume transferred successfully!");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <div className="bg-white text-black p-4">
                <div className="max-w-7xl mx-auto flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Gallery
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                            <img
                                src={costume.imageUrl}
                                alt={costume.name}
                                className="w-full h-full object-cover"
                            />
                            {isRented && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full">
                                    Currently Rented
                                </div>
                            )}
                        </div>

                        {/* Rental History */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Rental History</h3>
                            <div className="text-sm text-gray-600">
                                <p>Times Rented: {costume.timesRented}</p>
                                <p>Last Cleaned: {costume.lastCleaned}</p>
                                <p>Current Condition: {costume.condition}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{costume.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5"
                                            fill={i < costume.rating ? "#FDB022" : "none"}
                                            stroke={i < costume.rating ? "#FDB022" : "#D1D5DB"}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({costume.reviews} reviews)</span>
                            </div>
                        </div>

                        {/* Rental Status */}
                        {isRented ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-800 mb-2">Current Rental Status</h3>
                                <div className="space-y-2 text-sm">
                                    <p>Rented to: {costume.rentalStatus.currentRenter}</p>
                                    <p>Rented Date: {costume.rentalStatus.rentedDate}</p>
                                    <p>Due Date: {costume.rentalStatus.dueDate}</p>
                                </div>

                                {/* Return Processing */}
                                <div className="mt-4">
                                    <h4 className="font-medium mb-2">Process Return:</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setReturnStatus('returned')}
                                            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Good Condition
                                        </button>
                                        <button
                                            onClick={() => setReturnStatus('damaged')}
                                            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Damaged
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-b py-4">
                                <p className="text-sm text-green-600 mt-1">Available for Transfer</p>
                            </div>
                        )}

                        {/* Transfer Form */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Give to Another Person</h3>
                            <form onSubmit={handleGiveToOther} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                                    <input
                                        type="text"
                                        value={newRenter.name}
                                        onChange={(e) => setNewRenter({ ...newRenter, name: e.target.value })}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                                    <input
                                        type="text"
                                        value={newRenter.contact}
                                        onChange={(e) => setNewRenter({ ...newRenter, contact: e.target.value })}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-950 transition">
                                    Transfer Costume
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Damage Alert */}
                {returnStatus === 'damaged' && (
                    <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-red-800">Damage Reported</h3>
                                <p className="text-sm text-red-600 mt-1">
                                    The costume has been marked as damaged. Please document the damage and contact customer service.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsCostume;
