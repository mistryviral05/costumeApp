
import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Page from './pages/Page'
import Qrcode from './pages/Qrcode'
import Costumes from './pages/Costumes'
import Scan from './pages/Scan'
import { v4 as uuidv4 } from 'uuid';
import CreateCupboard from './pages/CreateCupboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';








function App() {

  const [cupboard, setCupboard] = useState([])
  const [count, setCount] = useState(0)
  const id = uuidv4()

  let newCount = count + 1;


  const handleCreateCupboard = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/cupboards/addCupboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, id: id })
      })
      if (response.ok) {

        setCupboard([...cupboard, { ...formData, id: id }])
        setCount(newCount)
        toast('Cupboard created', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
          });
      }
    } catch (err) {
      console.log(err)
    }
  }
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Login /></>
    },
    {
      path: '/signup',
      element: <><Signup /></>
    },
    {
      path: '/home',
      element: <><Navbar /><Home cupBoard={cupboard} setCupboards={setCupboard} /></>,
    },
    {
      path: '/page',
      element: <><Page /></>,
    }
    ,
    {
      path: '/qrcode/:params',
      element: <><Qrcode /></>,
    }
    ,
    {
      path: '/costumes/:id',
      element: <><Costumes /></>,
    }
    ,
    {
      path: '/scanner',
      element: <><Scan /></>,
    },
    {
      path: '/createCupboard',
      element: <><CreateCupboard createCupboard={handleCreateCupboard} /></>,
    }

  ])

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
        theme="light"

      />

      <RouterProvider router={router} />


    </>
  )
}

export default App
