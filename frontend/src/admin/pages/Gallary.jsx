import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

const Gallery = () => {
    const navigate = useNavigate();

    // State to manage gallery images
    const [images, setImages] = useState([]);

    const fetchData = async () => {

        try {


            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if(res.ok){
                const data = await res.json();
                console.log(data.data)
                setImages(data.data)
            }

        } catch (err) {
            console.log(err);
      
        } 
    };

    useEffect(() => {
        fetchData();
    }, []);




    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition duration-200 flex items-center gap-2"
                    >
                        ⬅ Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <ImagePlus className="w-8 h-8" />
                        Photo Gallery
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer">
                    {images.map((image,index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                        >
                            <div className="relative pb-[66.67%]">
                                <img
                                    src={`${image.fileUrl}?auto=format&fit=crop&w=800&q=80`}
                                    alt={image.costumename}
                                    className="absolute inset-0 w-full h-full object-fill"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{image.costumename}</h3>
                                <p className="text-gray-600 text-sm">{image.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
