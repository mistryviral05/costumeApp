import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home';
import Page from './pages/Page/Page';
import Qrcode from './pages/QrCode/Qrcode';
import Costumes from './pages/Costumes/Costumes';
import Scan from './pages/Scan/Scan';
import { v4 as uuidv4 } from 'uuid';
import CreateCupboard from './pages/CreateCupboard/CreateCupboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup';
import { ToastContainer, toast } from 'react-toastify';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/Users/Users';
import AddNewUser from './pages/AddNewUser/AddNewUser';
import Gallary from './pages/Gallary/Gallary';
import AddNewCostume from './pages/AddNewCostumes/AddNewCostume'
import AuthProtected from './middleware/AuthProtected'
import Cart from './pages/Gallary/Cart';
import DetailsCostume from './pages/Gallary/DetailsCostume';
import ClientLogin from '../client/pages/ClientLogin/ClientLogin';
import HomePage from '../client/pages/homepage/homepage';
import Navbar from '../client/components/Navbar/Navbar';
import Gallery from '../client/pages/GallaryPage/GallaryPage';
import ScanPage from '../client/pages/Scanner/Scan';
import CartPage from '../client/pages/CartPage/CartPage';
import DetailsCos from '../client/pages/Details/DetailsCos';
import HolderCostumeDetails from './pages/Dashboard/HolderCostumes';
import CostumeDetail from '../client/pages/CostumeDetail/CostumeDetail';
import ClientAuthProtected from '../client/middleware/ClientAuthProtected';
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
      path: '/admin/costumeDetails/:id',
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
    ,
    {
      path: '/',
      element: <><ClientLogin/></>
    }
    ,
    {
      path: '/admin/holderCostumeDetails/:id',
      element: <><AuthProtected><HolderCostumeDetails/></AuthProtected></>
    }
    ,
    {
      path: '/client/homepage',
      element: <><ClientAuthProtected><Navbar/><HomePage/></ClientAuthProtected></>
    }
    ,
    {
      path: '/client/Gallary',
      element: <><ClientAuthProtected><Navbar/><Gallery/></ClientAuthProtected></>
    }
    ,
    {
      path: '/client/qr-scanner',
      element: <><ClientAuthProtected><ScanPage/></ClientAuthProtected></>
    }
    ,
    {
      path: '/client/cartpage',
      element: <><ClientAuthProtected><Navbar/><CartPage/></ClientAuthProtected></>
    }
    ,
    {
      path: '/client/Costumes/:id',
      element: <><ClientAuthProtected><Navbar/><DetailsCos/></ClientAuthProtected></>
    }
    ,
    {
      path: '/client/CostumesDetail/:id',
      element: <><ClientAuthProtected><CostumeDetail/></ClientAuthProtected></>
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