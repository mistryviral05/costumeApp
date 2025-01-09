import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Edit, FolderPlus, MoveRightIcon, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Notfound from './Notfound';



const Costumes = () => {
  const navigate = useNavigate(); 
  const params = useParams();
  const cpid = params.id;
  const id = uuidv4();
  // const rowsPerPage = 5;
 
  const [costumes, setCostumes] = useState([]);
  const [newCostume, setNewCostume] = useState({ costumename: '', description: '' });
  const [searchDetails, setSearchDetails] = useState('')
  const [filterData, setFilterData] = useState(costumes)
  const [checkCupboard, setCheckCupboard] = useState([])
  // const [currentPage, setCurrentPage] = useState(1);
  // const [viewAll, setViewAll] = useState(false);

  const handleSearch = (e)=>{
    let query = e.target.value.toLowerCase();
    setSearchDetails(query)
    if(query.trim()===''){
      setFilterData(costumes);
    }else{
      const filtered = costumes.filter((item) =>
        item.costumename.toLowerCase().includes(query) // Adjust based on your data structure
    );
    setFilterData(filtered);
    }

  }

  const handleAddCostume = async() => {
    if (newCostume.costumename && newCostume.description) {
     
      const response = await fetch('http://localhost:3000/cpdetails/addCostume',{
        method:'POST',
        headers:{
         'Content-Type': 'application/json'
        },
        body:JSON.stringify({cpid:cpid,id:id,costumename:newCostume.costumename,description:newCostume.description})
      })
      if(response.ok){
        const res = await response.json();
        setCostumes([...costumes, { id: id, ...newCostume }]);
        setFilterData([...filterData,{id:id,...newCostume}])
        console.log(res.success);
        setNewCostume({ costumename: '', description: '' });
      }
    }
  };

  const fetchData = async()=>{
      const response = await fetch(`http://localhost:3000/cpdetails/getCostume/${cpid}`,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json'
         },
      
      })
      const data = await response.json();
      const Array = await data.data;
      
      setCostumes(Array)


  }

  useEffect(() => {
    fetchData()
  }, [])
  

  const handleDeleteCostume = async(id) => {
    let c = confirm("Are you sure you want to delete costume");
    if(c){
    const response = await fetch(`http://localhost:3000/cpdetails/deleteCostume/${id}`,{
      method:'DELETE',
      headers:{
        'Content-Type': 'application/json'
       },
    })
    const message = await response.json();
    alert(message.message)
    setCostumes(costumes.filter((costume) => costume.id !== id));
  }
  };
  

  // const totalPages = Math.ceil(costumes.length / rowsPerPage);
  // console.log(totalPages)
  // const paginatedCostumes = costumes.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );
  

 

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-4 transition duration-200"
      >
        ⬅ Back
      </button>
    
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold">🎭 Costume Cupboard</h1>
        <p className="mt-2 text-lg">Manage your costume inventory with ease!</p>

      </header>
      <div className="max-w-md mx-auto mb-8">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only light:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 light:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input onChange={handleSearch} type="search" id="default-search" value={searchDetails} name='search-details' className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
         
        </div>
      </div>
     
    
      {/* Costume Table */}
      <div className="overflow-x-auto space-y-4 bg-white shadow-lg border rounded-lg p-6">
        
        <div className='flex items-center justify-evenly flex-wrap gap-4'>
          <h2 className="text-2xl font-bold text-gray-800 ">Costume List</h2>
          <input
            type="text"
            placeholder="Name"
            value={newCostume.costumename}
            onChange={(e) =>
              setNewCostume({ ...newCostume, costumename: e.target.value })
            }
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={newCostume.description}
            onChange={(e) =>
              setNewCostume({ ...newCostume, description: e.target.value })
            }
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={handleAddCostume}
          >
            <FolderPlus />
          </button>
        </div>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
           
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center">Move Cupboard</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {
              filterData.length>0?
              filterData.map((costume,index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                
                  <td className="py-3 px-6">{costume.costumename}</td>
                  <td className="py-3 px-6">{costume.description}</td>
                  <td className="py-3 px-6 text-center"><button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200"
            
                  >
                   <MoveRightIcon  size={20}/>
                  </button></td>
                  <td className="py-3 px-6 flex items-center justify-center gap-4">
                  <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200"
              
                    >
                     <Edit  size={20}/>
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200"
                      onClick={() => handleDeleteCostume(costume.id)}
                    >
                     <Trash size={20}/>
                    </button>
                   
                  </td>
                </tr>)):costumes.map((costume) => (
              <tr
                key={costume.id}
                className="border-b hover:bg-gray-100 transition duration-200"
              >
              
                <td className="py-3 px-6">{costume.costumename}</td>
                <td className="py-3 px-6">{costume.description}</td>
                <td className="py-3 px-6 text-center">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200"
            
                  >
                   <MoveRightIcon  size={20}/>
                  </button>
                </td>
                <td className="py-3 px-6 flex items-center justify-center gap-4">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200"
            
                  >
                   <Edit  size={20}/>
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200"
                    onClick={() => handleDeleteCostume(costume.id)}
                  >
                   <Trash size={20}/>
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>

     
    
    </div>
  );
};

export default Costumes;
