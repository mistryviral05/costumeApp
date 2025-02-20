import React, { useEffect, useState } from 'react'
import CupboardsTable from '../../components/cupboardTable/CupboardTable'

const HomePage = () => {
  const [cupboards, setCupboards] = useState([])
  const [loading,setLoading]= useState(false)





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
