import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrGenerator = () => {
  const [url, setUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!url.trim()) return alert("Please enter a valid URL.");
    setShowQR(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">🔗 URL to QR Code Generator</h1>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL (https://...)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Generate QR Code
          </button>
        </form>

        {showQR && (
          <div className="mt-8 text-center">
            <QRCodeCanvas value={url} size={200} />
            <p className="mt-4 text-sm text-gray-500 break-words">{url}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrGenerator;
