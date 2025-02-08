import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ImagePlus,
  Tag,
  Info,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Command,
  Star,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  Grid,
  List,
  ShoppingCart,
  Plus
} from "lucide-react";
import CatagoryModal from "../../components/CatagoryModal";
import GallaryNavbar from "./GallaryNavbar";

const Gallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewType, setViewType] = useState("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false)


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
    : images.filter((image) => image.costumename === selectedCategory);

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
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedImages.map((image, index) => (
            <tr
              key={index}
              onClick={() => navigate("/admin/costumeDetails")}
              className="bg-white border-b hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3">
                <img
                  src={`${image.fileUrl}?auto=format&fit=crop&w=100&q=80`}
                  alt={image.costumename}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {image.costumename}
                {image.isNew && (
                  <span className="ml-2 bg-gray-900 text-white px-2 py-1 rounded-full text-xs">
                    New
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < (image.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500">({image.reviews || 42})</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                {image.description}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">${image.price || "49.99"}</span>
                  {image.discount && (
                    <span className="text-xs text-green-600">-{image.discount}%</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${image.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                  {image.availability ? "In Stock" : "Out of Stock"}
                </span>
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
          onClick={() => navigate("/admin/costumeDetails")}
          className="bg-white rounded-xl shadow-sm overflow-hidden transform transition duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative pb-[100%]">
            <img
              src={`${image.fileUrl}?auto=format&fit=crop&w=400&q=80`}
              alt={image.costumename}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {image.isNew && (
              <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                New Arrival
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 line-clamp-1">
              {image.costumename}
            </h3>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < (image.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                />
              ))}
              <span className="text-xs sm:text-sm text-gray-500">({image.reviews || 42})</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
              <p className="line-clamp-2">{image.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ${image.price || "49.99"}
                </span>
                {image.discount && (
                  <span className="text-xs sm:text-sm text-green-600">-{image.discount}%</span>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${image.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                {image.availability ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Added ${image.costumename} to cart`);
              }}
              className="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <>
      {isOpen && <CatagoryModal onClose={() => setIsOpen(false)} setCategories={setCategories} categories={categories} />}

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <GallaryNavbar toggalMobileFilter={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} />

        {/* Mobile Filters Drawer */}
        {isMobileFiltersOpen && (
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

                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-full sm:w-autob bg-white text-gray-800 hover:bg-gray-100 border border-gray-200`}
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
                  onClick={() => setViewType(viewType === "grid" ? "table" : "grid")}
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