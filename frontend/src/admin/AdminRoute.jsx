import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Page from './pages/Page';
import Qrcode from './pages/Qrcode';
import Costumes from './pages/Costumes';
import Scan from './pages/Scan';
import { v4 as uuidv4 } from 'uuid';
import CreateCupboard from './pages/CreateCupboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastContainer, toast } from 'react-toastify';
import Layout from './components/Layout';

const AdminRoute = () => {
  const [cupboard, setCupboard] = useState([]);
  const [count, setCount] = useState(0);
  const id = uuidv4();

  let newCount = count + 1;

  const handleCreateCupboard = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/addCupboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, id: id })
      });
      if (response.ok) {
        setCupboard([...cupboard, { ...formData, id: id }]);
        setCount(newCount);
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
      console.log(err);
    }
  };

  const router = createBrowserRouter([
    {
      path: '/admin/',
      element: <Login />
    },
    {
      path: '/admin/signup',
      element: <Signup />
    },
    {
      path: '/admin/home',
      element: (
        <Layout>
          <Home cupBoard={cupboard} setCupboards={setCupboard} />
        </Layout>
      )
    },
    {
      path: '/admin/page',
      element: (
      
          <Page />
        
      )
    },
    {
      path: '/admin/qrcode/:params',
      element: (
       
          <Qrcode />
       
      )
    },
    {
      path: '/admin/costumes/:id',
      element: (
        
          <Costumes />
        
      )
    },
    {
      path: '/admin/scanner',
      element: (
        
          <Scan />
       
      )
    },
    {
      path: '/admin/createCupboard',
      element: (
        
          <CreateCupboard createCupboard={handleCreateCupboard} />
        
      )
    }
  ]);

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
  );
};

export default AdminRoute;