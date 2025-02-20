import React, { useState } from 'react';
import { Edit, Trash, ArrowRight, QrCode } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { ToastContainer, toast, Bounce } from 'react-toastify';

const Card = ({ cupBoard, space, place, id, delteCupboard, setCupboards }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newCupBoardName, setNewCupBoardName] = useState(cupBoard.name);

    const handleDelete = async () => {
        const a = confirm("Are you want to delete this cupboard")
        if (a) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/deleteCupboard/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {

                    delteCupboard(id);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };
    const handleRename = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/updateCupboard`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCupBoardName, id }),
            });
            const data = await response.json();
            if (response.ok) {
                setCupboards((prevCupboards) =>
                    prevCupboards.map((cupboard) =>
                        cupboard.id === data.updatedData.id ? { ...cupboard, name: data.updatedData.name } : cupboard
                    )

                );
                toast('Cupboard edited', {
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

                setIsRenaming(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (


            
            <tr className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-4 py-4 text-start">
                    <img src="/cupboardIcon.svg" className="h-8 w-8 mx-auto" alt="cupboard icon" />
                </td>
                <td className="px-4 py-4">
                    {isRenaming ? (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newCupBoardName}
                                onChange={(e) => setNewCupBoardName(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg w-[100px] focus:ring focus:ring-blue-300"
                            />
                            <button
                                onClick={handleRename}
                                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                Save
                            </button>
                            <button
                                onClick={() => setIsRenaming(false)}
                                className="ml-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <span className="text-gray-800 font-medium">{cupBoard}</span>
                    )}
                </td>
                <td className="px-4 py-4 text-center">{space || 'N/A'}</td>
                <td className="px-4 py-4 text-center">{place || 'N/A'}</td>
                <td className="px-4 py-4 text-center">{cupBoard.costumeCount || 0}</td>
                <td className="px-4 py-4">
                    <div className="flex justify-center space-x-2">
                        <NavLink to={`/admin/costumes/${id}`}>
                            <button className="p-2 rounded-full hover:bg-blue-100 transition-all">
                                <ArrowRight className="text-blue-600" size={20} />
                            </button>
                        </NavLink>
                        <button
                            onClick={() => setIsRenaming(true)}
                            className="p-2 rounded-full hover:bg-yellow-100 transition-all">
                            <Edit className="text-yellow-600" size={20} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-full hover:bg-red-100 transition-all">
                            <Trash className="text-red-600" size={20} />
                        </button>
                        <NavLink to={`/admin/qrcode/${id}`}>
                            <button className="p-2 rounded-full hover:bg-green-100 transition-all">
                                <QrCode className="text-green-600" size={20} />
                            </button>
                        </NavLink>
                    </div>
                </td>
            </tr>
      


    );
};

export default Card;
