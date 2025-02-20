import React, { useEffect, useState } from 'react';
import { 
  Star, 
  ArrowLeft,
  Sparkles,
  Loader,
  CheckCircle,
  Timer,
  AlertTriangle,
  Package
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailsCostume = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [costume, setCostume] = useState({});
    const [loading, setLoading] = useState(true);
    const [washStatus, setWashStatus] = useState('clean'); // 'clean', 'needsWash', 'inWash'
    const [washStartTime, setWashStartTime] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostumeById/${id}`, {
                method: "GET",
            });
            if (res.ok) {
                const data = await res.json();
                setCostume(data.data);
                // Initialize wash status based on costume data
                setWashStatus(data.data.washStatus || 'clean');
                setWashStartTime(data.data.washStartTime || null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleWashingStatus = (status) => {
        setWashStatus(status);
        if (status === 'inWash') {
            setWashStartTime(new Date().toISOString());
        } else if (status === 'clean') {
            setWashStartTime(null);
        }
    };

    const getStatusColor = () => {
        const statusColors = {
            clean: 'bg-green-50 border-green-100 text-green-700',
            needsWash: 'bg-yellow-50 border-yellow-100 text-yellow-700',
            inWash: 'bg-blue-50 border-blue-100 text-blue-700'
        };
        return statusColors[washStatus] || 'bg-gray-50 border-gray-100 text-gray-700';
    };

    const getStatusIcon = () => {
        const icons = {
            clean: <CheckCircle className="w-5 h-5 text-green-500" />,
            needsWash: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
            inWash: <Loader className="w-5 h-5 text-blue-500 animate-spin" />
        };
        return icons[washStatus];
    };

    const getStatusText = () => {
        const texts = {
            clean: 'Clean and Ready',
            needsWash: 'Needs Washing',
            inWash: 'Currently Being Washed'
        };
        return texts[washStatus];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Gallery</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Details */}
                    <div className="space-y-6">
                        {/* Costume Details Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{costume.costumename}</h1>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5"
                                                fill={i < (costume.rating || 0) ? "#FDB022" : "none"}
                                                stroke={i < (costume.rating || 0) ? "#FDB022" : "#D1D5DB"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">({costume.reviews || 0} reviews)</span>
                                </div>
                            </div>

                            {/* Washing Status Card */}
                            <div className={`p-6 rounded-xl border ${getStatusColor()} mb-6`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon()}
                                        <h3 className="font-semibold text-lg">{getStatusText()}</h3>
                                    </div>
                                    {washStartTime && (
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Timer className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                Started: {new Date(washStartTime).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleWashingStatus('needsWash')}
                                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 
                                            ${washStatus === 'needsWash' 
                                                ? 'bg-yellow-200 text-yellow-800 ring-2 ring-yellow-300' 
                                                : 'bg-white text-yellow-700 hover:bg-yellow-50 border border-yellow-200'}`}
                                    >
                                        Mark for Washing
                                    </button>
                                    <button
                                        onClick={() => handleWashingStatus('inWash')}
                                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 
                                            ${washStatus === 'inWash' 
                                                ? 'bg-blue-200 text-blue-800 ring-2 ring-blue-300' 
                                                : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'}`}
                                    >
                                        Start Washing
                                    </button>
                                    <button
                                        onClick={() => handleWashingStatus('clean')}
                                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 
                                            ${washStatus === 'clean' 
                                                ? 'bg-green-200 text-green-800 ring-2 ring-green-300' 
                                                : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'}`}
                                    >
                                        Mark as Clean
                                    </button>
                                </div>
                            </div>

                            {/* Costume Details */}
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(costume)
                                    .filter(([key]) => !['_id', 'id', 'cpid', 'fileUrl', '__v', 'date', 'washStatus', 'washStartTime'].includes(key))
                                    .map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </p>
                                            <p className="font-medium">{String(value)}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <div className="aspect-square relative">
                                <img
                                    src={costume.fileUrl}
                                    alt={costume.costumename}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <div className={`px-4 py-2 rounded-full font-medium shadow-lg ${
                                        washStatus === 'clean' 
                                            ? 'bg-green-500 text-white' 
                                            : washStatus === 'inWash'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-yellow-500 text-white'
                                    }`}>
                                        {getStatusText()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Washing Instructions */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                Washing Instructions
                            </h3>
                            <div className="space-y-4 text-gray-600">
                                <p>• Machine wash cold with similar colors</p>
                                <p>• Use mild detergent</p>
                                <p>• Do not bleach</p>
                                <p>• Tumble dry low</p>
                                <p>• Iron on low heat if needed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsCostume;