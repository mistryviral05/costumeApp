import React, { useContext, useEffect, useState } from 'react'
import CupboardsTable from '../../components/cupboardTable/CupboardTable'
import { SocketContext } from '@/Context/SocketContext'

const HomePage = () => {
  const [cupboards, setCupboards] = useState([])
  const [loading,setLoading]= useState(false)
  const {socket}= useContext(SocketContext)

  useEffect(() => {
   const handleFetch = (data)=>{
        setCupboards((prev)=>[...prev,data.newCupboard])
   }
   const handleDeleteCupboard = (data)=>{
        setCupboards((prev)=>prev.filter((cupboard)=>cupboard.id!==data.id))
   }

   const handleUpdate = (data)=>{
    setCupboards((prev)=>prev.map((e)=>e.id === data.id ?{...e,name:data.name}:e))
   }

   socket.on("addNewCupboard",handleFetch)
   socket.on("deleteCupboard",handleDeleteCupboard)
   socket.on("updateCupboard",handleUpdate)
   
   return () => {
     socket.off("addNewCupboard",handleFetch)
     socket.off("deleteCupboard",handleDeleteCupboard)
     socket.off("updateCupboard",handleUpdate)
    }
  }, [socket])
  




  const fetchCupboards = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboard`);
      if (response.ok) {
        const data = await response.json();
         setCupboards(data.cupboards)
      }
    } catch (err) {
      console.log(err);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchCupboards();
  }, []);




  return (
    <div className='pb-5'>
        <CupboardsTable cupboards={cupboards} loading={loading}/>
    </div>
  )
}

export default HomePage
