import React from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, QrCode } from 'lucide-react';

const Scan = () => {
  const [data, setData] = React.useState("Not Found");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg shadow-sm border border-gray-200 transition duration-200"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Scan QR Code</h1>
          </div>
          <p className="text-gray-600">Position the QR code within the frame to scan</p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            {/* Scanner overlay design */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl opacity-50"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-600 rounded-br-2xl"></div>
              
              {/* Scanning animation line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-scan"></div>
            </div>

            {/* Scanner component */}
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  if (result) {
                    navigate(result.text);
                    setData(result.text);
                  } else {
                    setData("Not Found");
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3">
            <Camera className="w-5 h-5 text-gray-500" />
            <p className="text-gray-600 text-sm">
              {data === "Not Found" 
                ? "Waiting for QR code..." 
                : `Detected: ${data}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;