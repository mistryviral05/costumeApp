import React, { useState } from 'react'







const Page = () => {

  const [file, setFile] = useState(null)
  const [image,setImage]= useState('')

  const handleChange = (e)=>{
    setFile(e.target.files[0])
  }

  const handleUploade = async()=>{
      const formData = new FormData();
      formData.append('file',file);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/uploadefile`,{
        method:'POST',
        body:formData
      })

      if(response.ok){
        const data  = await response.json()
        console.log(data.fileUrl)
        setImage(data.fileUrl)
      }
  }


  return (
    <div className='flex justify-center items-center h-screen'>

      <input type='file' className='cursor-pointer' onChange={handleChange}/>
      <button onClick={handleUploade} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Uploade</button>
     

     <div>
      <img src={image} className='w-96' />
     </div>
    </div>
  )
}

export default Page
