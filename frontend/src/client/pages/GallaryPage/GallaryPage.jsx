import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Plus, Filter, Package, Loader } from 'lucide-react';
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useNavigate } from 'react-router-dom';
const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [costumes, setCostumes] = useState([]);
  const [allCostumes, setAllCostumes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();




  const handleSearch = async()=>{
    try{

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/searchCostume?query=${searchQuery}`)

      if(res.ok){
        const data = await res.json();
        setCostumes(data.data)
      }



    }catch(err){
      console.log(err)
    }
  }

  

  const handleToAddCart = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (res.ok) {
        const message = await res.json();
        toast(`${message.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    setLoading(true); // Show loader
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCostumes(data.data);
        setAllCostumes(data.data);
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/getCatagory`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        const fetchedCategories = data.data.map((cat) => cat.catagory);
        const uniqueCategories = Array.from(new Set(["All", ...fetchedCategories]));
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false); // Hide loader
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setCostumes(allCostumes);
    } else {
      const filteredCostumes = allCostumes.filter((costume) => costume.catagory === category);
      setCostumes(filteredCostumes);
    }
  };

  const CategoryButton = ({ category }) => (
    <button
      onClick={() => handleCategoryChange(category)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-full sm:w-auto ${selectedCategory === category
        ? "bg-purple-900 text-white"
        : "bg-white text-black hover:bg-gray-100 border border-gray-200"
        }`}
    >
      {category}
    </button>
  );

  return (
    <div className="container mx-auto px-4 md:px-10 py-8">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search costumes..."
            className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value); handleSearch();}}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Trigger search on Enter key
              }
            }}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
        </div>
        <div className="flex overflow-x-auto max-w-full items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          {categories.map((category) => (
            <CategoryButton key={category} category={category} className={'min-w-[100px]'} />
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader className="w-12 h-12 text-purple-700 animate-spin" />
        </div>
      ) : (
        /* If No Costumes Available */
        costumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white shadow-md rounded-lg p-6 border border-purple-200">
            <Package className="text-purple-600 w-16 h-16 mb-3" />
            <h2 className="text-lg font-semibold text-gray-700">No Costumes Available</h2>
            <p className="text-gray-500 text-sm text-center">
              It looks like no costumes are available at the moment. Please check back later or contact admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {costumes.map((costume, index) => (
              <div key={index} onClick={()=>navigate(`/client/CostumesDetail/${costume.id}`)} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="relative h-64">
                  <img
                    src={costume.fileUrl}
                    alt={costume.costumename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 opacity-0 hover:opacity-100" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{costume.costumename}</h3>
                      <span className="text-sm text-purple-600">{costume.description}</span>
                    </div>
                    <span className="text-xl text-black font-bold">{costume.cpname}</span>
                  </div>

                  {/* Show Quantity */}
                  <p className="text-sm text-gray-600 mt-1">
                    Available Quantity: <span className="font-semibold">{costume.quantity}</span>
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToAddCart(costume.id);
                    }}
                    className="mt-2 w-full bg-purple-900 text-white py-2 px-4 rounded-lg hover:bg-purple-800 hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
                    disabled={costume.quantity === 0} // Disable button if quantity is 0
                  >
                    <Plus className="h-4 w-4" />
                    {costume.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Gallery;
