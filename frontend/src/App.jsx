
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import clientRoutes from './client/ClientRoutes';
import { getAdminRoutes } from './admin/AdminRoutes';
import { Toaster } from 'sonner';


const router = createBrowserRouter([...getAdminRoutes, ...clientRoutes]);


function App() {


  return (

    <> <Toaster  position='top-center' /><RouterProvider router={router} /></>

  )
}

export default App
