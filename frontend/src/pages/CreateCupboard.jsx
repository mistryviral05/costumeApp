import React from 'react';

function CreateCupboard() {
  return (
    <>
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="text-2xl py-4 px-6 bg-blue-600 text-white text-center font-bold uppercase">
        Book an Appointment
    </div>
    <form className="py-4 px-6" >
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" for="name">
                Cupboard Name
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name" type="text" placeholder="Enter your name"/>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" for="name">
                Cupboard space
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name" type="number" placeholder="space"/>
        </div>
        
      
        
        
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" for="service">
               Places
            </label>
            <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="service" name="service">
                <option value="">Select a Places</option>
                <option value="haircut">Basement of Hostel</option>
                <option value="coloring">Basement of sabha hall</option>
                <option value="styling">sabha hall</option>
                <option value="facial">Hostel</option>
            </select>
        </div>
     
        <div className="flex items-center justify-center mb-4">
            <button
                className="bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit">
               Create Cupboard
            </button>
        </div>

    </form>
</div>
    </>
  );
}

export default CreateCupboard;
