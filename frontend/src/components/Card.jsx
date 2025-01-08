import React, { useState } from 'react';
import { Folder, Edit, Trash, ArrowRight, QrCode } from 'lucide-react'; 
import { NavLink } from 'react-router-dom';

const Card = ({ cupBoard, id, delteCupboard }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newCupBoardName, setNewCupBoardName] = useState(cupBoard);
  
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cupboards/deleteCupboard/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                delteCupboard(id);
                console.log('Deleted');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRename = ()=>{
        setIsRenaming(false)
      

    }

    

    return (
        <div className='p-4'>
            <div className="cursor-pointer rounded-xl w-full h-full border overflow-hidden shadow-xl bg-white p-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                <div className="flex flex-col items-center ">
                    <img src="/cupboardIcon.svg" className='h-16 w-16' alt="cupboardicon" />
                    {isRenaming ? (
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                value={newCupBoardName}
                                onChange={(e) => setNewCupBoardName(e.target.value)}
                                className="border p-2 rounded-md"
                            />
                            <div className='flex items-center w-full gap-2 justify-evenly'>
                            <button 
                                
                                className="mt-2 p-2 rounded-lg w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Save
                            </button>
                            <button 
                                onClick={handleRename}
                                className="mt-2 p-2 rounded-lg w-full bg-gray-300 hover:bg-gray-400">
                                Cancel
                            </button>
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-xl font-semibold text-gray-800">{cupBoard}</h2>
                    )}
                    <div className="flex space-x-4 mt-4">
                        {/* Open icon */}
                        <NavLink to={`/costumes`}>
                            <button className="p-2 rounded-full hover:bg-gray-200">
                                <ArrowRight className="text-blue-600" size={20} />
                            </button>
                        </NavLink>
                        {/* Rename icon */}
                        <button onClick={() => setIsRenaming(true)} className="p-2 rounded-full hover:bg-gray-200">
                            <Edit className="text-gray-700" size={20} />
                        </button>
                        {/* Delete icon */}
                        <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-200">
                            <Trash className="text-red-600" size={20} />
                        </button>
                        {/* QR Code icon */}
                        <NavLink to={`/qrcode/${id}`}>
                            <button className="p-2 rounded-full hover:bg-gray-200">
                                <QrCode className="text-green-600" size={20} />
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
