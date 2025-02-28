import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {

  Filter,
  Search,
  Star,
  Grid,
  List,
  Plus,
  Delete,
  DeleteIcon,
  Edit, Trash2, ShoppingCart
} from "lucide-react";
import CatagoryModal from "../../components/CatagoryModal";
import GallaryNavbar from "./GallaryNavbar";
import { toast, ToastContainer,Bounce } from "react-toastify";
import { SocketContext } from "@/Context/SocketContext";

const Gallery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false)

  const {socket}= useContext(SocketContext)

  useEffect(() => {

    const handleDel = async(data)=>{
      setImages((prevImages) => prevImages.filter(image => image.id !== data.message));
    }

    const handleUpdateQuantity  =  (data)=>{
      setImages((prevCostumes)=>prevCostumes.map((e)=>e.id===data.id?{...e,quantity:data.newQuantity}:e))
  }

  const fetchRealTimeData = (data)=>{
    setImages((prevImages)=>[...prevImages,data.newDetails])

  }

    socket.on("deleteGallary",handleDel)
    socket.on("updateCostumeQuantity",handleUpdateQuantity)
    socket.on("addNewCostumes",fetchRealTimeData)
    return () => {
      socket.off("deleteGallary",handleDel)
      socket.off("updateCostumeQuantity",handleUpdateQuantity)
      socket.off("addNewCostumes",fetchRealTimeData)
      
    }
  }, [socket])
  

  const [viewType, setViewType] = useState(() => {
    return localStorage.getItem('galleryViewType') || "grid";
  });

  // Update localStorage when view type changes
  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
    localStorage.setItem('galleryViewType', newViewType);
  };

  const handleToAddCart = async(id)=>{
    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`,{
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({id:id}),
      })

      if(res.ok){
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
      }


    }catch(err){
      console.log(err);
    }


 }


  const handleSearch = async()=>{
    try{

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/searchCostume?query=${searchQuery}`)

      if(res.ok){
        const data = await res.json();
        setImages(data.data)
      }



    }catch(err){
      console.log(err)
    }
  }



  const handleDelete = async (id) => {

    let c = confirm("Are you sure you want to delete costume?");
    if (c) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/deleteCostume/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const message = await response.json();
        // setImages((prevImages) => prevImages.filter(image => image.id !== id));
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

      }
    }





  }





  const handleChangeOpen = () => {
    setIsOpen(true)
  }

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        setImages(data.data);
      }
    } catch (err) {
      console.log(err);
    }

    try {

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/getCatagory`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        const fetchedCatagories = data.data.map((cat) => cat.catagory);
        const UniqData = Array.from(new Set(["All", ...fetchedCatagories]));
        setCategories(UniqData);

      }

    } catch (err) {

      console.log(err);


    }





  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter((image) => image.catagory === selectedCategory);

  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  const CategoryButton = ({ category }) => (
    <button
      onClick={() => {
        setSelectedCategory(category);
        setIsMobileFiltersOpen(false);
      }}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-full sm:w-auto ${selectedCategory === category
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
        }`}
    >
      {category}
    </button>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">CP Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedImages.map((image, index) => (
            <tr
              key={index}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <img
                  src={`${image.fileUrl}?auto=format&fit=crop&w=100&q=80`}
                  alt={image.costumename}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  {image.costumename}
                  {image.isNew && (
                    <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                      New Arrival
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{image.cpname}</td>
              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                {image.description}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {image.quantity}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  image.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {image.availability ? "In Stock" : "Out of Stock"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToAddCart(image.id);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate(`/admin/costumeDetails/${image.id}`);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="View Details"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Delete Costume"
                  >
                    <Trash2 size={18} className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {sortedImages.map((image, index) => (
        <div
          key={index}
          onClick={() => navigate(`/admin/costumeDetails/${image.id}`)}
          className="rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer border border-gray-200"
        >
          <div className="relative pb-[100%]">
            <img
              src={`${image.fileUrl}?auto=format&fit=crop&w=400&q=80`}
              alt={image.costumename}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {image.isNew && (
              <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
                New Arrival
              </div>
            )}
          </div>
  
          <div className="p-3 sm:p-4">
            {/* Costume Name */}
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 line-clamp-1">
              {image.costumename}
            </h3>
  
            {/* Display cpname */}
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{image.cpname}</p>
  
            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
  
            {/* Quantity */}
            <p className="text-sm font-medium text-gray-700 mb-3">Quantity: {image.quantity}</p>
  
            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-2 mt-3">
              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToAddCart(image.id);
                }}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition text-sm"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
  
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleEdit(image.id);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                  title="Edit Costume"
                >
                  <Edit size={18} />
                </button>
  
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                  title="Delete Costume"
                >
                  <Trash2 size={18} className="text-red-500 hover:text-red-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  


  return (
    <>



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

      {isOpen && <CatagoryModal onClose={() => setIsOpen(false)} setCategories={setCategories} categories={categories} />}

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <GallaryNavbar toggalMobileFilter={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} />

        {/* Mobile Filters Drawer */}
        {!isMobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden">
            <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <CategoryButton key={category} category={category} />


                ))}
                <button
                   onClick={handleChangeOpen}
                  className={`px-4 py-2 rounded-lg flex justify-center text-sm font-medium transition-colors duration-200 w-full sm:w-autob bg-white text-gray-800 hover:bg-gray-100 border border-gray-200`}
                >
                  <Plus size={20} />
                </button>

              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Search and Filters Section */}
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search costumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(); // Trigger search on Enter key
                  }
                }}
                className="block w-full pl-11 pr-16 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-gray-900 focus:border-gray-900
                       bg-white text-gray-900 placeholder-gray-500
                       transition-all duration-300 ease-in-out
                       hover:border-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <kbd className="hidden sm:block px-2 py-1 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded">
                  /
                </kbd>
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-600" />
                {categories.map((category) => (
                  <CategoryButton key={category} category={category} />
                ))}
                <button
                  onClick={handleChangeOpen}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200  sm:w-autob bg-white text-gray-800 hover:bg-gray-100 border border-gray-200`}
                >
                  <Plus size={20} />
                </button>

              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-gray-900"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>

           
                <button
                  onClick={() => handleViewTypeChange(viewType === "grid" ? "table" : "grid")}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2"
                >
                  {viewType === "grid" ? (
                    <List className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Grid className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {sortedImages.length} results in {selectedCategory}
          </div>

          {/* Content View */}
          {viewType === "grid" ? <GridView /> : <TableView />}
        </div>
      </div>
    </>
  );
};

export default Gallery;