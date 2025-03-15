import React from 'react';
import AuthProtected from './middleware/AuthProtected';
import Layout from './components/Layout';
import Login from './pages/Login/Login';
import Signup from './pages/Signup';
import Home from './pages/Home/Home';
import CreateCupboard from './pages/CreateCupboard/CreateCupboard';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import AddNewUser from './pages/AddNewUser/AddNewUser';
import Gallery from './pages/Gallary/Gallary';
import DetailsCostume from './pages/Gallary/DetailsCostume';
import AddNewCostume from './pages/AddNewCostumes/AddNewCostume';
import Cart from './pages/Gallary/Cart';
import HolderCostumeDetails from './pages/Dashboard/HolderCostumes';
import Washing from './pages/Washing/Washing';
import Costumes from './pages/Costumes/Costumes';
import Page from './pages/Page/Page';
import Qrcode from './pages/QrCode/Qrcode';
import Scan from './pages/Scan/Scan';
import Profile from './pages/Profile/Profile';
import Damaged from './pages/Damaged/Damaged';
import Lost from './pages/Lost/Lost';
import Logs from './pages/Logs/Logs';
import CartsDe from './pages/Carts/CartsDe';

export const getAdminRoutes =  [
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
        <Home  />
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

        <CreateCupboard  />
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
    element: <> <AuthProtected><Gallery/></AuthProtected></>
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
    path: '/admin/holderCostumeDetails/:id',
    element: <><AuthProtected><HolderCostumeDetails/></AuthProtected></>
  }
  ,
  {
    path: '/admin/wash',
    element: <><AuthProtected><Layout><Washing/></Layout></AuthProtected></>
  }
  ,
  {
    path: '/admin/profile',
    element: <><AuthProtected><Layout><Profile/></Layout></AuthProtected></>
  }
  ,
  {
    path: '/admin/return-policy/Damaged',
    element: <><AuthProtected><Layout><Damaged/></Layout></AuthProtected></>
  }
  ,
  {
    path: '/admin/return-policy/Lost',
    element: <><AuthProtected><Layout><Lost/></Layout></AuthProtected></>
  }
  ,
  {
    path: '/admin/allLogs',
    element: <><AuthProtected><Layout><Logs/></Layout></AuthProtected></>
  }
  ,
  {
    path: '/admin/CartsDe',
    element: <><AuthProtected><Layout><CartsDe/></Layout></AuthProtected></>
  }
];
