import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    number: '',
    password: '',
    cpassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        toast(data.message, {
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
        setFormData(({
          name: '',
          username:'',
          email: '',
          number: '',
          password: '',
          cpassword: '',
        }))

      }
    } catch (err) {
      console.log(err)
    }

  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}

      />
      <div className="flex flex-col justify-center items-center font-[sans-serif] bg-gradient-to-r bg-white lg:h-screen p-6">
        <div className="items-center gap-y-8 bg-white max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md overflow-hidden">
          <form className="sm:p-8 p-4 w-full" onSubmit={handleSubmit}>
            <div className="md:mb-12 mb-8">
              <h3 className="text-gray-800 text-3xl font-bold">Register</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">First Name</label>
                <input
                  name="name"
                  type="text"
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Username</label>
                <input
                  name="username"
                  type="text"
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all"
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
                <input
                  name="email"
                  type="text"
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Mobile No.</label>
                <input
                  name="number"
                  type="number"
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all"
                  placeholder="Enter mobile number"
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
                <input
                  name="cpassword"
                  type="password"
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all"
                  placeholder="Enter confirm password"
                  value={formData.cpassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              If you have an account, you can{' '}
              <p>
                <NavLink to={'/admin/'} className="text-blue-700 font-bold">
                  login Here
                </NavLink>
              </p>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="py-3 px-6 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
