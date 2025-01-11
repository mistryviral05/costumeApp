import React from 'react'
import { NavLink } from 'react-router-dom'

const Signup = () => {
  return (
    <div className="flex flex-col justify-center items-center font-[sans-serif] bg-gradient-to-r bg-white lg:h-screen p-6">
      <div className=" items-center gap-y-8 bg-white max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md overflow-hidden">
       

        <form className="sm:p-8 p-4 w-full">
          <div className="md:mb-12 mb-8">
            <h3 className="text-gray-800 text-3xl font-bold">Register</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">First Name</label>
              <input name="name" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all" placeholder="Enter name" />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
              <input name="lname" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all" placeholder="Enter last name" />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
              <input name="email" type="text" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all" placeholder="Enter email" />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Mobile No.</label>
              <input name="number" type="number" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all" placeholder="Enter mobile number" />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <input name="password" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all" placeholder="Enter password" />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
              <input name="cpassword" type="password" className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-2.5 rounded-md border focus:bg-transparent focus:border-black outline-none transition-all" placeholder="Enter confirm password" />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            If have account you can  <p><NavLink to={'/'} className='text-blue-700 font-bold'> login Here</NavLink></p>
          </div>

          <div className="mt-6">
            <button type="button" className="py-3 px-6 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
