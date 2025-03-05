import { DeleteIcon, ShoppingCart, Plus, Minus, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "@/Context/SocketContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Cart = ({ setCartId }) => {
  const [costumes, setCostumes] = useState([]);
  const [availableCostumes, setAvailableCostumes] = useState([]);
  const [selectedCostumes, setSelectedCostumes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { socket } = useContext(SocketContext);

  // Fetch available costumes

  const fetchAvailableCostumes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`,
        { method: "GET" }
      );

      if (res.ok) {
        const data = await res.json();
        setAvailableCostumes(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch available costumes", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const handleCartDetails = async (data) => {
      setCartId(data.cartId);
      setCostumes(
        Array.isArray(data.message)
          ? data.message.map((item) => ({ ...item, quantity: item.quantity || 1 }))
          : []
      );
    };

    const handleRemoveFromCart = async (data) => {
      setCostumes((prevCos) => prevCos.filter((cos) => cos.id !== data.message));
    };

    const handleRemoveAll = (data) => {
      if (data.success) {
        setCostumes([]);
      }
    };

    const handleIncrement = (data) => {
      setCostumes((prevCostumes) =>
        prevCostumes.map((item) =>
          item.id === data.id ? { ...item, quantity: data.quantity } : item
        )
      );
    };

    const handleDecrement = (data) => {
      setCostumes((prevCostumes) =>
        prevCostumes.map((item) =>
          item.id === data.id ? { ...item, quantity: data.quantity } : item
        )
      );
    };

    socket.on("CartDetails", handleCartDetails);
    socket.on("removeToCart", handleRemoveFromCart);
    socket.on("GiveOther", handleRemoveAll);
    socket.on("incrementQuantity", handleIncrement);
    socket.on("decrementQuantity", handleDecrement);

    return () => {
      socket.off("CartDetails", handleCartDetails);
      socket.off("removeToCart", handleRemoveFromCart);
      socket.off("GiveOther", handleRemoveAll);
      socket.off("incrementQuantity", handleIncrement);
      socket.off("decrementQuantity", handleDecrement);
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCartDetails`,
        { method: "GET" }
      );

      if (res.ok) {
        const data = await res.json();
        setCartId(data.cartId);
        setCostumes(
          Array.isArray(data.message)
            ? data.message.map((item) => ({ ...item, quantity: item.quantity || 1 }))
            : []
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAvailableCostumes();
  }, []);

  const handleRemove = async (id) => {
    let c = confirm("Are you sure you want to remove this item from your cart?");
    if (c) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/cpdetails/removeToCart`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );

        if (res.ok) {
          const message = await res.json();
          toast.success(message.message, {
            position: "top-center",
            autoClose: 1000,
            transition: Bounce,
          });
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to remove item from cart", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  const handleQuantityDecrement = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cpdetails/decrementQuantity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, quantity: newQuantity }),
        }
      );

      if (res.ok) {
        const message = await res.json();
        toast.success(message.message, {
          position: "top-center",
          autoClose: 1000,
          transition: Bounce,
        });

        setCostumes((prevCostumes) =>
          prevCostumes.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleQuantityIncrement = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cpdetails/incrementQuantity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, quantity: newQuantity }),
        }
      );

      if (res.ok) {
        const message = await res.json();
        toast.success(message.message, {
          position: "top-center",
          autoClose: 1000,
          transition: Bounce,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleAddCostume = async () => {
  //   if (!selectedCostume) {
  //     toast.error("Please select a costume", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           id: selectedCostume,
  //           quantity: quantity,
  //         }),
  //       }
  //     );

  //     if (res.ok) {
  //       const data = await res.json();
  //       toast.success(data.message || "Costume added to cart!", {
  //         position: "top-center",
  //         autoClose: 1000,
  //         transition: Bounce,
  //       });
  //       fetchData(); // Refresh cart
  //       setIsModalOpen(false);
  //       setSelectedCostume("");
  //       setQuantity(1);
  //     } else {
  //       const error = await res.json();
  //       toast.error(error.message || "Failed to add costume", {
  //         position: "top-center",
  //         autoClose: 3000,
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Failed to add costume to cart", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });
  //   }
  // };

  // Filter costumes based on search term
  const filteredCostumes = availableCostumes.filter((costume) =>
    costume.costumename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    costume.cpname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    costume.catagory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //new functions
  const toggleCostumeSelection = (costume) => {
    setSelectedCostumes(prevSelected => {
      const isSelected = prevSelected.some(item => item.id === costume.id);

      if (isSelected) {
        // Remove costume from selection
        return prevSelected.filter(item => item.id !== costume.id);
      } else {
        // Add costume to selection with quantity 1
        return [...prevSelected, { ...costume, quantity: 1 }];
      }
    });
  };

  const updateSelectedCostumeQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setSelectedCostumes(prevSelected =>
      prevSelected.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };


  const removeSelectedCostume = (id) => {
    setSelectedCostumes(prevSelected =>
      prevSelected.filter(item => item.id !== id)
    );
  };


  const handleAddMultipleCostumes = async () => {
    if (selectedCostumes.length === 0) {
      toast.error("Please select at least one costume", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      // For simplicity, we'll add costumes one by one
      for (const costume of selectedCostumes) {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: costume.id,
              quantity: costume.quantity,
            }),
          }
        );

        if (!res.ok) {
          const error = await res.json();
          toast.error(`Failed to add ${costume.costumename}: ${error.message}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }

      toast.success(`${selectedCostumes.length} costumes added to cart!`, {
        position: "top-center",
        autoClose: 1000,
        transition: Bounce,
      });

      fetchData(); // Refresh cart
      setIsModalOpen(false);
      setSelectedCostumes([]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to add costumes to cart", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const isCostumeSelected = (id) => {
    return selectedCostumes.some(costume => costume.id === id);
  };

  return (
    <div className="bg-gray-50">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Your Cart
          </h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
              {costumes.length} {costumes.length === 1 ? "Item" : "Items"}
            </span>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 ml-auto sm:ml-0">
                  <Plus className="w-4 h-4" />
                  Add Costumes
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Add Multiple Costumes to Cart</DialogTitle>
                  <DialogDescription>
                    Select costumes and specify quantities to add to your cart.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 h-[60vh]">
                  {/* Left side - Costume selection */}
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="flex items-center mb-2 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search costumes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Tabs defaultValue="table" className="flex-1 flex flex-col">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="table">Table View</TabsTrigger>
                        <TabsTrigger value="card">Card View</TabsTrigger>
                      </TabsList>

                      <TabsContent value="table" className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(60vh-8rem)]">
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Costume</TableHead>
                                  <TableHead>Cupboard</TableHead>
                                  <TableHead>Category</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredCostumes.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                      No costumes found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  filteredCostumes.map((costume) => (
                                    <TableRow
                                      key={costume.id}
                                      className={isCostumeSelected(costume.id) ? "bg-blue-50" : ""}
                                      onClick={() => toggleCostumeSelection(costume)}
                                    >
                                      <TableCell>
                                        <Checkbox
                                          checked={isCostumeSelected(costume.id)}
                                          onCheckedChange={() => toggleCostumeSelection(costume)}
                                          id={`costume-${costume.id}`}
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                          {costume.fileUrl && (
                                            <img
                                              src={costume.fileUrl}
                                              alt={costume.costumename}
                                              className="w-10 h-10 rounded-md object-cover hidden sm:block"
                                            />
                                          )}
                                          {costume.costumename}
                                        </div>
                                      </TableCell>
                                      <TableCell>{costume.cpname}</TableCell>
                                      <TableCell>{costume.catagory}</TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="card" className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(60vh-8rem)]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
                            {filteredCostumes.length === 0 ? (
                              <div className="col-span-full text-center py-6 text-gray-500">
                                No costumes found
                              </div>
                            ) : (
                              filteredCostumes.map((costume) => (
                                <div
                                  key={costume.id}
                                  className={`border rounded-lg p-4 cursor-pointer ${isCostumeSelected(costume.id) ? "border-blue-500 bg-blue-50" : ""
                                    }`}
                                  onClick={() => toggleCostumeSelection(costume)}
                                >
                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      checked={isCostumeSelected(costume.id)}
                                      onCheckedChange={() => toggleCostumeSelection(costume)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                        {costume.fileUrl && (
                                          <img
                                            src={costume.fileUrl}
                                            alt={costume.costumename}
                                            className="w-12 h-12 rounded-md object-cover"
                                          />
                                        )}
                                        <div>
                                          <h3 className="font-medium">{costume.costumename}</h3>
                                          <div className="text-sm text-gray-500">
                                            <div>{costume.cpname}</div>
                                            <div className="inline-block bg-gray-100 px-2 py-0.5 rounded-md text-xs mt-1">
                                              {costume.catagory}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Right side - Selected items */}
                  <div className="border rounded-md p-4 flex flex-col">
                    <h3 className="font-medium mb-2 flex items-center justify-between">
                      Selected Costumes
                      <Badge variant="secondary">{selectedCostumes.length}</Badge>
                    </h3>

                    {selectedCostumes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 flex-1 flex items-center justify-center">
                        <p>No costumes selected</p>
                      </div>
                    ) : (
                      <ScrollArea className="flex-1 h-[calc(60vh-12rem)]">
                        <div className="space-y-4">
                          {selectedCostumes.map((costume) => (
                            <div key={costume.id} className="border-b pb-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{costume.costumename}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSelectedCostume(costume.id);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <DeleteIcon className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateSelectedCostumeQuantity(costume.id, costume.quantity - 1);
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={costume.quantity}
                                  onChange={(e) => updateSelectedCostumeQuantity(
                                    costume.id,
                                    parseInt(e.target.value) || 1
                                  )}
                                  className="w-16 h-7 text-center p-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateSelectedCostumeQuantity(costume.id, costume.quantity + 1);
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    <div className="mt-4 pt-2 border-t">
                      <Button
                        className="w-full"
                        disabled={selectedCostumes.length === 0}
                        onClick={handleAddMultipleCostumes}
                      >
                        Add Selected Costumes
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {costumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">
              Add some amazing costumes to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {costumes.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 p-4">
                    <img
                      src={item.fileUrl}
                      alt={item.costumename}
                      className="w-full h-48 md:h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.costumename}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-medium">
                              {item.catagory}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Cupboard:</span> {item.cpname}
                          </p>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors duration-200"
                        title="Remove from cart"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          handleQuantityDecrement(item.id, item.quantity - 1)
                        }
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      >
                        <Minus className="w-5 h-5 text-gray-700" />
                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityIncrement(item.id, item.quantity + 1)
                        }
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      >
                        <Plus className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;