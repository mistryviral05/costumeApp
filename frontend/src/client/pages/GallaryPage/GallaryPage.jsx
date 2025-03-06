import React, { useContext, useEffect, useState } from 'react';
import { Search, ShoppingCart, Plus, Filter, Package, Loader, Check } from 'lucide-react';
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '@/Context/SocketContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useAuth from '@/hooks/useAuth';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [costumes, setCostumes] = useState([]);
  const [allCostumes, setAllCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCostumes, setSelectedCostumes] = useState([]);
  const navigate = useNavigate();
  const {user}=useAuth()

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const handleDel = async(data) => {
      setCostumes((prevImages) => prevImages.filter(image => image.id !== data.message));
    };
    
    const handleUpdateQuantity = (data) => {
      setCostumes((prevCostumes) => prevCostumes.map((e) => e.id === data.id ? {...e, quantity: data.newQuantity} : e));
    };
    
    const fetchRealTimeData = (data) => {
      setCostumes((prev) => [...prev, data.newDetails]);
    };
    const handleUpdateCartQuantity = (data)=>{
      setCostumes((prevCostumes) =>
        prevCostumes.map((e) => (e.id === data.message ? { ...e, quantity:e.quantity+data.removedQuantity,status:data.status } : e)),
    )
  }
  const handleIncrement = (data) => {
    
      setCostumes((prevCostumes) =>
        prevCostumes.map((item) =>
          item.id === data.id ? { ...item, quantity:item.quantity-1 } : item
        )
      );
    
  }

  const handleDecrement = (data) => {
   
      setCostumes((prevCostumes) =>
        prevCostumes.map((item) =>
          item.id === data.id ? { ...item, quantity: item.quantity+1 } : item
        )
      );
   
  };
  
  socket.on("incrementQuantity", handleIncrement);  
  socket.on("decrementQuantity", handleDecrement);
    socket.on("deleteGallary", handleDel);
    socket.on("updateCostumeQuantity", handleUpdateQuantity);
    socket.on("addNewCostumes", fetchRealTimeData);
    socket.on("removeToCart",handleUpdateCartQuantity)
    
    return () => {
      socket.off("removeToCart",handleUpdateCartQuantity)
      socket.off("deleteGallary", handleDel);
      socket.off("updateCostumeQuantity", handleUpdateQuantity);
      socket.off("addNewCostumes", fetchRealTimeData);
      socket.off("incrementQuantity", handleIncrement);
      socket.off("decrementQuantity", handleDecrement);  
    };
  }, [socket]);

  const handleSearch = async() => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/searchCostume?query=${searchQuery}`);
      if(res.ok) {
        const data = await res.json();
        setCostumes(data.data);
      }
    } catch(err) {
      console.log(err);
    }
  };

  const handleSelectCostume = (id) => {
    setSelectedCostumes(prev => {
      if (prev.includes(id)) {
        return prev.filter(costumeId => costumeId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAddSelectedToCart = async () => {
    if (selectedCostumes.length === 0) {
      toast("Please select at least one costume", {
        position: "top-center",
        type: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedCostumes,userphonenumber:user.phonenumber }),
      });

      if (res.ok) {
        const message = await res.json();
        toast(`${message.message || "Items added to cart successfully"}`, {
          position: "top-center",
          autoClose: 1500,
          type: "success",
        });
        setSelectedCostumes([]);
      }
    } catch (err) {
      console.log(err);
      toast("Failed to add items to cart", {
        position: "top-center",
        type: "error",
      });
    }
  };

  const handleToAddCart = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id,userphonenumber:user.phonenumber}),
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
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

    setLoading(false);
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

      {/* Search, Category Filters and Selection Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Input
              type="text"
              placeholder="Search costumes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); handleSearch();}}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-2">
            {selectedCostumes.length > 0 && (
              <Button 
                onClick={handleAddSelectedToCart}
                variant="default"
                className="bg-purple-900 hover:bg-purple-800 flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                Add Selected ({selectedCostumes.length})
              </Button>
            )}
          </div>
        </div>

        <div className="flex overflow-x-auto max-w-full items-center gap-2 pb-2">
          <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-purple-900 text-white" : ""}
              size="sm"
            >
              {category}
            </Button>
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
          <Card className="flex flex-col items-center justify-center h-96 p-6">
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <Package className="text-purple-600 w-16 h-16 mb-3" />
              <h2 className="text-lg font-semibold text-foreground">No Costumes Available</h2>
              <p className="text-muted-foreground text-sm text-center">
                It looks like no costumes are available at the moment. Please check back later or contact admin.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {costumes.map((costume, index) => (
              <Card 
                key={index} 
                className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  selectedCostumes.includes(costume.id) ? "ring-2 ring-purple-600" : ""
                }`}
              >
                <div className="relative h-64">
                  <img
                    src={costume.fileUrl}
                    alt={costume.costumename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      checked={selectedCostumes.includes(costume.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCostume(costume.id);
                      }}
                      disabled={costume.quantity === 0}
                      className="h-5 w-5 bg-white border-gray-300"
                    />
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{costume.costumename}</h3>
                      <span className="text-sm text-purple-600">{costume.description}</span>
                    </div>
                    <Badge variant="outline" className="text-sm font-medium">
                      {costume.cpname}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Available Quantity: <span className="font-semibold">{costume.quantity}</span>
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/client/CostumesDetail/${costume.id}`);
                    }}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToAddCart(costume.id);
                    }}
                    className="flex-1 bg-purple-900 hover:bg-purple-800"
                    disabled={costume.quantity === 0}
                  >
                    {costume.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Gallery;