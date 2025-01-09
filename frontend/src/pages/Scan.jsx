import React from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate } from 'react-router-dom';

const Scan = () => {
  const [data, setData] = React.useState("Not Found");
  const navigate = useNavigate()

  return (
    <>
    
     <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded relative top-4 left-4 transition duration-200"
      >
        ⬅ Back
      </button>
    <div className="flex justify-center items-center   ">
     
      <div className="px-4 py-32">
        <BarcodeScannerComponent
          width={500}
          height={500}
          className="border-2 border-dashed border-blue-500 p-4 relative"
          onUpdate={(err, result) => {
            if (result) {
              navigate(result.text);
              setData(result.text);
            }
            else {setData("Not Found");}
          }}
        />
          
        
      </div>

    </div>
    </>
  );
};

export default Scan;
