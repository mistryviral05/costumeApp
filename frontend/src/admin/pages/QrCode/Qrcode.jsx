import React from 'react';
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { ArrowLeft } from 'lucide-react';

const Qrcode = () => {
    const { params } = useParams();
    const handleback = () => {
        window.history.back();
    }
    const handleDownload = () => {
        const qrCodeElement = document.getElementById('qr-code');

        html2canvas(qrCodeElement).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qr-code.png';
            link.click();
        });
    };

    return (
        <div>
            {/* create a back button for go to back */}
            <button onClick={handleback} className="bg-blue-500 hover:bg-blue-600 relative top-3 left-4 text-white px-4 py-2 rounded">
               <ArrowLeft/> 
            </button>
            <div className="flex flex-col gap-4 items-center justify-center h-screen">
                <button
                    onClick={handleDownload}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Download QR Code
                </button>
                <div id="qr-code">

                    <QRCode size={256} value={`${params}`} viewBox="0 0 256 256" />
                </div>
            </div>

        </div>
    );
};

export default Qrcode;
