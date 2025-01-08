
import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Page from './pages/Page'
import Qrcode from './pages/Qrcode'
import Costumes from './pages/Costumes'
import Scan from './pages/Scan'
import { v4 as uuidv4 } from 'uuid';





function App() {

  const [cupboard, setCupboard] = useState([])
  const [count, setCount] = useState(0)
  const id = uuidv4()

  let newCount = count+1;
  
 
  const handleCreateCupboard = async() => {
    try{
    const response = await fetch('http://localhost:3000/cupboards/addCupboard',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name:`Cupboard-${newCount}`,id: id})
    })
    if(response.ok){
      
    setCupboard([...cupboard,{ name:`Cupboard-${newCount}`,id: id}])
    setCount(newCount)
    }
  }catch(err){
    console.log(err)
  }
}
 const router = createBrowserRouter([
    {
      path: '/',
      element: <><Navbar createCupboard={handleCreateCupboard}/><Home cupBoard={cupboard} setCupboards={setCupboard} /></>,
    },
    {
      path: '/page',
      element: <><Page/></>,
    }
    ,
    {
      path: '/qrcode/:params',
      element: <><Qrcode/></>,
    }
    ,
    {
      path: '/costumes',
      element: <><Costumes/></>,
    }
    ,
    {
      path: '/scanner',
      element: <><Scan/></>,
    }
 ])

  return (
    <>
    <RouterProvider router={router}/>
    
    
    </>
  )
}

export default App
