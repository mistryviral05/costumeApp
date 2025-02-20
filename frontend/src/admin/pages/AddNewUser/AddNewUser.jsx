import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, CheckCircle, Phone } from "lucide-react";

import { ToastContainer, toast, Bounce } from 'react-toastify';

function AddNewUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        phonenumber: "",
        password: "",
        cpassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required.";
        } else if (formData.name.length < 3) {
            newErrors.name = "Full name must be at least 3 characters.";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters.";
        } else if (/\s/.test(formData.username)) {
            newErrors.username = "Username should not contain spaces.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.phonenumber.trim()) {
            newErrors.phonenumber = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.phonenumber)) {
            newErrors.phonenumber = "Phone number must be 10 digits.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (!formData.cpassword) {
            newErrors.cpassword = "Confirm password is required.";
        } else if (formData.password !== formData.cpassword) {
            newErrors.cpassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData }),
                });

                if (res.ok) {
                    const message = await res.json();
                    toast(message.message, {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });

                    setFormData({
                        name: "",
                        username: "",
                        email: "",
                        phonenumber: "",
                        password: "",
                        cpassword: "",
                    })
                }
            } catch (error) {
                console.log(error);
            }

            setErrors({});
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnHover
                draggable
                theme="dark"
                transition={Bounce}
            />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-500 hover:text-gray-700 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-2 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-1">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-2 text-gray-400" />
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-2 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phonenumber" className="block text-sm font-semibold text-gray-900 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-2 text-gray-400" />
                                <input
                                    type="text"
                                    id="phonenumber"
                                    placeholder="Enter phone number"
                                    value={formData.phonenumber}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                                />
                            </div>
                            {errors.phonenumber && <p className="text-red-500 text-sm mt-1">{errors.phonenumber}</p>}
                        </div>

                        {/* Password & Confirm Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-2 text-gray-400" />
                                <input type="password" placeholder="Enter the password" id="password" value={formData.password} onChange={handleChange} className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="cpassword" className="block text-sm font-semibold text-gray-900 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute  left-4 top-2 text-gray-400" />
                                <input type="password" placeholder="Enter confirm password" id="cpassword" value={formData.cpassword} onChange={handleChange} className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg flex justify-center items-center">
                            Add User <CheckCircle className="ml-2" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNewUser;
