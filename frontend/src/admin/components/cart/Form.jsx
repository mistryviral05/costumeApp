import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from '@/hooks/useAuth';
import useAuthAdmin from '@/hooks/useAuthAdmin';

const Form = ({ cartId }) => {
    const [formData, setFormData] = useState({
        personname: '',
        contact: '',
        Refrence: '',
        deadline: ''
    });

    const [errors, setErrors] = useState({});
    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname
    const {user}= useAuth();
    const {admin}= useAuthAdmin()

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




        // Deadline validation
        if (!formData.deadline) {
            newErrors.deadline = 'Deadline is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            console.log('Form submitted:', formData);
            console.log(cartId)
            console.log(admin)
            const phonenumber = user?.phonenumber || admin?.phonenumber
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/assignTo`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cartId: cartId, ...formData,userphonenumber:phonenumber })
                })
                if (res.ok) {
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
                        Refrence: '',
                        deadline: ''
                    })

                    if (location.pathname === '/admin/Gallary/cart') {

                        setTimeout(() => {
                            
                            navigate('/admin/dashboard');
                        }, 1000);
                    }
                    



                }

            } catch (err) {
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
                        className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
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
                        className={`mt-1 block w-full p-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'
                            } rounded-md`}
                        required
                    />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                </div>


                {/* Refrence */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Refrence</label>
                    <input
                        type="text"
                        name="Refrence"
                        value={formData.Refrence}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${errors.Refrence ? 'border-red-500' : 'border-gray-300'
                            } rounded-md`}
                        required
                    />
                    {errors.Refrence && <p className="text-red-500 text-sm mt-1">{errors.Refrence}</p>}
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 border ${errors.deadline ? 'border-red-500' : 'border-gray-300'
                            } rounded-md`}
                        min={new Date().toISOString().split("T")[0]}
                        required
                    />
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>

                <button
                    type="submit"
                    className={`w-full ${currentPath === '/client/cartpage' ? 'bg-purple-900 hover:bg-purple-800' : 'bg-gray-900 hover:bg-gray-950'}  text-white py-3 px-6 rounded-lg  transition`}
                >
                    Give to Another Person
                </button>
            </form>
        </div>
    );
};

export default Form;
