import React from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine } from 'lucide-react';

const ScanPage = () => {
  const [data, setData] = React.useState("Not Found");
  const [torchOn, setTorchOn] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0  right-0 z-10 bg-gradient-to-b from-black to-transparent p-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Scanner Container */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className=" w-[600px] h-[450px] relative">
          <BarcodeScannerComponent
            width="100%"
            height="100%"
            torch={torchOn}
            onUpdate={(err, result) => {
              if (result) {
                navigate(`/client/Costumes/${result}`);
                setData(result);
              } else {
                setData("Not Found");
              }
            }}
          />
        </div>

        {/* Scanner Frame Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark corners */}
          <div className="absolute inset-0 grid grid-cols-[1fr_5fr_1fr] grid-rows-[1fr_1.5fr_1fr] md:grid-cols-[1fr_1fr_1fr] md:grid-rows-[1fr_2fr_1fr]">
            <div className="bg-black/60"></div>
            <div className="bg-black/60"></div>
            <div className="bg-black/60"></div>
            <div className="bg-black/60"></div>
            <div className="relative">
              {/* Scanner Window */}
              <div className="absolute -inset-3 ">
                {/* Animated Scanner Line */}
                <div className="absolute inset-x-0 h-0.5 bg-blue-500/70 top-1/2 transform -translate-y-1/2 animate-scan">
                  <div className="absolute inset-0 blur-sm bg-blue-400"></div>
                </div>

                {/* Corner Markers */}
                {/* Top-Left Corner */}
                <div className="absolute -top-1 -left-1 w-8 h-8 md:w-10 md:h-10">
                  <div className="absolute top-0 left-0 w-[60px] h-[10px] bg-orange-500 rounded-l-lg"></div>
                  <div className="absolute top-0 left-0 w-[10px] h-[60px] bg-orange-500 rounded-t-lg"></div>
                </div>

                {/* Top-Right Corner */}
                <div className="absolute -top-1 -right-1 w-8 h-8 md:w-10 md:h-10">
                  <div className="absolute top-0 right-0 w-[60px] h-[10px] bg-yellow-500 rounded-r-lg"></div>
                  <div className="absolute top-0 right-0 w-[10px] h-[60px] bg-yellow-500 rounded-t-lg"></div>
                </div>

                {/* Bottom-Left Corner */}
                <div className="absolute -bottom-1 -left-1 w-8 h-8 md:w-10 md:h-10">
                  <div className="absolute bottom-0 left-0 w-[60px] h-[10px] bg-green-500 rounded-l-lg"></div>
                  <div className="absolute bottom-0 left-0 w-[10px] h-[60px] bg-green-500 rounded-b-lg"></div>
                </div>

                {/* Bottom-Right Corner */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10">
                  <div className="absolute bottom-0 right-0 w-[60px] h-[10px] bg-blue-500 rounded-r-lg"></div>
                  <div className="absolute bottom-0 right-0 w-[10px] h-[60px] bg-blue-500 rounded-b-lg"></div>
                </div>

              </div>
            </div>
            <div className="bg-black/60"></div>
            <div className="bg-black/60"></div>
            <div className="bg-black/60"></div>
            <div className="bg-black/60"></div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black to-transparent">
        <div className="flex flex-col items-center gap-4">
          {/* Status Message */}
          <div className="bg-white/10 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2">
            <ScanLine size={18} className="text-blue-500" />
            <span className="text-sm font-medium">
              {data === "Not Found" ? "Position QR code within frame" : `Code detected: ${data}`}
            </span>
          </div>

          {/* Torch Toggle */}
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${torchOn
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            {torchOn ? 'Turn Off Flash' : 'Turn On Flash'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;