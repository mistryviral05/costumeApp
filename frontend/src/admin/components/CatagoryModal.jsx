import React, { useState } from 'react';

const CategoryModal = ({ onClose,setCategories,categories }) => {
    const [catagory, setCatagory] = useState("")

        const handleChangeSubmit = async(e)=>{
            e.preventDefault();
            try{

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/addCatagory`,{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({catagory:catagory})
                })

                if(res.ok){
                    setCategories([...categories,catagory]);
                    onClose(false)
                    const message = await res.json();
                    alert(message.message)
                }

            }catch(err){
                    console.log("err is : ",err)


            }
           
        }



    return (
        <>
            {/* Modal Overlay - Clicking outside will close modal */}
            <div 
                className="fixed inset-0 z-50 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose} // Close modal on outside click
            >
                {/* Modal Content */}
                <form onSubmit={handleChangeSubmit}
                    className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <div className="relative flex flex-col bg-white">
                        <div className="relative m-2.5 flex items-center justify-center text-white h-24 rounded-md bg-slate-800">
                            <h3 className="text-2xl">Add Category</h3>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            {/* Category Name Field */}
                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Category Name</label>
                                <input 
                                    type="text" 
                                    onChange={(e)=>setCatagory(e.target.value)}
                                    value={catagory}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                    placeholder="Enter Category Name" 
                                />
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button 
                                type='submit' 
                                className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
                                
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CategoryModal;
