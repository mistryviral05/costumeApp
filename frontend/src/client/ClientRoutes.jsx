
import React from "react";
import ClientAuthProtected from "./middleware/ClientAuthProtected";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/homepage/homepage";
import Gallery from "./pages/GallaryPage/GallaryPage";
import ScanPage from "./pages/Scanner/Scan";
import CartPage from "./pages/CartPage/CartPage";
import DetailsCos from "./pages/Details/DetailsCos";
import CostumeDetail from "./pages/CostumeDetail/CostumeDetail";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ClientLogin from "./pages/ClientLogin/ClientLogin"
import WashingClient from "./pages/washingClient/WashingClient";
import ForgotPass from "./pages/ForgotPass/ForgotPass";

const clientRoutes = [
  {
    path:'/',
    element:<><ClientLogin/></>
  },
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
      ,
      {
        path: '/client/profile',
        element: <><ClientAuthProtected><Navbar/><ProfilePage/></ClientAuthProtected></>
      }
      ,
      {
        path: '/client/clientWashing',
        element: <><ClientAuthProtected><Navbar/><WashingClient/></ClientAuthProtected></>
      }
      ,
      {
        path: '/forgotPass',
        element: <><ForgotPass/></>
      }
];

export default clientRoutes;