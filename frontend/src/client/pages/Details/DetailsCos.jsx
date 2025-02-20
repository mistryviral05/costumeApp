import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveRightIcon, Package } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Modal from '../../../admin/components/Modal';
import Notfound from '../../../admin/pages/NotFound/Notfound';

const DetailsCos = () => {
    const navigate = useNavigate();
    const params = useParams();
    const cpid = params.id;
    const [isValidCupboard, setIsValidCupboard] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [costumes, setCostumes] = useState([]);
    const [searchDetails, setSearchDetails] = useState('');
    const [filterData, setFilterData] = useState(costumes);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [seletectedid, setSeletectedid] = useState(null);

    const handleSearch = (e) => {
        let query = e.target.value.toLowerCase();
        setSearchDetails(query);
        if (query.trim() === '') {
            setFilterData(costumes);
        } else {
            const filtered = costumes.filter((item) =>
                item.costumename.toLowerCase().includes(query)
            );
            setFilterData(filtered);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
            if (response.ok) {
                const data = await response.json();
                const cupboardExists = data.cupboards.some(cupboard => cupboard.id === cpid);
                setIsValidCupboard(cupboardExists);

                if (cupboardExists) {
                    const costumeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume/${cpid}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const costumeData = await costumeResponse.json();
                    setCostumes(costumeData.data);
                    setFilterData(costumeData.data);
                }
            }
        } catch (err) {
            console.log(err);
            setIsValidCupboard(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-purple-600"></div>
            </div>
        );
    }

    if (!isValidCupboard) {
        return <Notfound />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnHover
                draggable
                theme="dark"
                transition={Bounce}
            />

            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-purple-900 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between mb-6">
                            <button
                                onClick={(e) => navigate(-1)}
                                className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-200 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                            >
                                ← Back
                            </button>
                            <div className="relative w-full sm:w-72">
                                <input
                                    type="text"
                                    placeholder="Search Costumes..."
                                    value={searchDetails}
                                    onChange={handleSearch}
                                    className="w-full px-4 py-2 rounded-lg text-gray-800 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-purple-400 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">Costume Collection</h1>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-6">
                        {isOpenModal && (
                            <Modal setIsOpenModal={setIsOpenModal} cupboardid={cpid} costumeid={seletectedid} setCostumes={setCostumes} setFilterData={setFilterData} />
                        )}

                        {(filterData?.length === 0 && !isLoading) ? (
                            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2 text-center">No Costumes Available</h3>
                                <p className="text-gray-500 text-center">There are currently no costumes in this collection.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:gap-6 min-h-[calc(100vh-280px)] ">
                                {(filterData?.length > 0 ? filterData : costumes)?.map((costume) => (
                                    <div
                                        key={costume.id}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="w-full sm:w-32 h-48 sm:h-32 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                            <img
                                                src={costume.fileUrl}
                                                alt={costume.costumename}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
                                                <div className="flex-1 w-full text-center sm:text-left">
                                                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {costume.costumename}
                                                        </h3>
                                                        <span className="px-3 py-1 bg-purple-200 text-deep-purple-600 rounded-full text-sm font-medium">
                                                            {costume.quantity || 0} available
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mb-3">{costume.description}</p>
                                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                                        <span className="text-sm text-gray-500">
                                                            Category: <span className="font-medium">{costume.catagory}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="bg-purple-900 hover:bg-purple-800 text-white p-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
                                                    onClick={() => {
                                                        setSeletectedid(costume.id);
                                                        setIsOpenModal(true);
                                                    }}
                                                    disabled={!costume.quantity || costume.quantity === 0}
                                                >
                                                   Transfer <MoveRightIcon size={20} className="mx-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsCos;