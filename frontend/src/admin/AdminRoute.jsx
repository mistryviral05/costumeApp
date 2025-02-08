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
import Dashboard from './pages/Dashboard'
import AllCostumes from './pages/AllCostumes';
import Users from './pages/Users';
import AddNewUser from './pages/AddNewUser';
import Gallary from './pages/Gallary/Gallary';
import DetailsCostume from './pages/DetailsCostume';
import AddNewCostume from './pages/AddNewCostume';
import AuthProtected from './middleware/AuthProtected'
import Cart from './pages/Gallary/Cart';
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
        <AuthProtected>

        <Layout>
          <Home cupBoard={cupboard} setCupboards={setCupboard} />
        </Layout>
        </AuthProtected>
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
        <AuthProtected>

          <Qrcode />
        </AuthProtected>
       
      )
    },
    {
      path: '/admin/costumes/:id',
      element: (
        <AuthProtected>

          <Costumes />
        </AuthProtected>
        
      )
    },
    {
      path: '/admin/scanner',
      element: (
        <AuthProtected>

          <Scan />
        </AuthProtected>
       
      )
    },
    {
      path: '/admin/createCupboard',
      element: (
        <AuthProtected>

          <CreateCupboard createCupboard={handleCreateCupboard} />
        </AuthProtected>
        
      )
    }
    ,
    {
      path: '/admin/dashboard',
      element: <> <AuthProtected> <Layout><Dashboard/></Layout></AuthProtected></>
    }
    ,
    {
      path: '/admin/costumes',
      element: <> <AuthProtected><Layout><AllCostumes/></Layout></AuthProtected></>
    }
    ,
    {
      path: '/admin/users',
      element: <> <AuthProtected><Layout><Users/></Layout></AuthProtected></>
    }
    ,
    {
      path: '/admin/users/new',
      element: <> <AuthProtected><Layout><AddNewUser/></Layout></AuthProtected></>
    }
    ,
    {
      path: '/admin/gallary',
      element: <> <AuthProtected><Gallary/></AuthProtected></>
    }
    ,
    {
      path: '/admin/costumeDetails',
      element: <> <AuthProtected><DetailsCostume/></AuthProtected></>
    }
    ,
    {
      path: '/admin/addNewCostume',
      element: <> <AuthProtected><Layout><AddNewCostume/></Layout></AuthProtected></>
    }
    ,
    {
      path: '/admin/Gallary/cart',
      element: <> <AuthProtected><Cart/></AuthProtected></>
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