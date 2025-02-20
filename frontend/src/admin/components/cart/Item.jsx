import { DeleteIcon, ShoppingCart, Plus, Minus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ setCartId }) => {
  const [costumes, setCostumes] = useState([]);
 

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCartDetails`,
        { method: "GET" }
      );

      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setCartId(data.cartId);
        setCostumes(
          Array.isArray(data.message) ? data.message.map(item => ({ ...item, quantity: item.quantity || 1 })) : []
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
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
          toast.success(message.message, { position: "top-center", autoClose: 1000, transition: Bounce });
          fetchData();
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to remove item from cart", { position: "top-center", autoClose: 3000 });
      }
    }
  };

  const handleQuantityDecrement = async(id,newQuantity)=>{
     if (newQuantity < 1 ) return;

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
        toast.success(message.message, { position: "top-center", autoClose: 1000, transition: Bounce });
       
        setCostumes((prevCostumes) =>
          prevCostumes.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.log(err);
    }

  }




  const handleQuantityIncrement = async (id, newQuantity) => {
    if (newQuantity < 1 ) return;

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
        toast.success(message.message, { position: "top-center", autoClose: 1000, transition: Bounce });
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

  return (
    <div className="bg-gray-50">
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Your Cart
          </h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
            {costumes.length} {costumes.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {costumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">Add some amazing costumes to get started!</p>
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
                        onClick={() => handleQuantityDecrement(item.id, item.quantity - 1)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      >
                        <Minus className="w-5 h-5 text-gray-700" />
                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityIncrement(item.id, item.quantity + 1)}
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
