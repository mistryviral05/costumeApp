import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = ({cartId}) => {
    const [formData, setFormData] = useState({
        personname: '',
        contact: '',
        email: '',
        address: '',
        deadline: ''
    });

    const [errors, setErrors] = useState({});
    const location = useLocation()
  const currentPath = location.pathname

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        // Name validation
        if (!formData.personname.trim()) {
            newErrors.personname = 'Recipient Name is required';
        }

        // Contact number validation (only digits and must be 10 digits long)
        if (!formData.contact.trim()) {
            newErrors.contact = 'Contact Number is required';
        } else if (!/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = 'Contact Number must be 10 digits';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid Email address';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        // Deadline validation
        if (!formData.deadline) {
            newErrors.deadline = 'Deadline is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (validate()) {
            console.log('Form submitted:', formData);
            console.log(cartId)
            try{
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL }/cpdetails/assignTo`,{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({cartId:cartId ,...formData})
                })
                if(res.ok){
                    const message = await res.json();
                       toast.success(message.message, {
                                position: "top-center",
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                theme: "light",
                                transition: Bounce,
                              });
                              setFormData({
                                personname: '',
                                contact: '',
                                email: '',
                                address: '',
                                deadline: ''
                              })

                   
                }

            }catch(err){
                console.log(err);
            }
        }
    };

    return (
        <div className="bg-gray-50 p-6 w-full rounded-lg">
             <ToastContainer />
            <h3 className="text-lg font-semibold mb-3">Give to Another Person</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Recipient Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                    <input
                        type="text"
                        name="personname"
                        value={formData.personname}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md`}
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${
                            errors.contact ? 'border-red-500' : 'border-gray-300'
                        } rounded-md`}
                        required
                    />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md`}
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                        } rounded-md`}
                        required
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${
                            errors.deadline ? 'border-red-500' : 'border-gray-300'
                        } rounded-md`}
                        required
                    />
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>

                <button
                    type="submit"
                    className={`w-full ${currentPath==='/client/cartpage'?'bg-purple-900 hover:bg-purple-800': 'bg-gray-900 hover:bg-gray-950'}  text-white py-3 px-6 rounded-lg  transition`}
                >
                    Give to Another Person
                </button>
            </form>
        </div>
    );
};

export default Form;
