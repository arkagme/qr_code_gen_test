import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import QRHistoryModal from './History.jsx';

const QRGenerator = () => {
  const [url, setUrl] = useState('');
  const [isDynamic, setIsDynamic] = useState(true);
  const [withLogo, setWithLogo] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('api/qr/generate', {
        url,
        isDynamic,
        withLogo
      });
      
      setQrData(response.data);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const canvas = document.createElement("canvas");
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous"; // Allow loading external images
    logoImg.src = "https://iili.io/39yM50u.md.png";
    
    Promise.all([
      new Promise((resolve) => {
        img.onload = resolve;
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      }),
      new Promise((resolve) => {
        logoImg.onload = resolve;
      }),
    ]).then(() => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
  
      // Draw the QR code onto the canvas
      ctx.drawImage(img, 0, 0);
  
      // Draw the logo in the center of the QR code
      if (withLogo) {
        const logoSize = 40; // Logo size
        const centerX = (canvas.width - logoSize) / 2;
        const centerY = (canvas.height - logoSize) / 2;
        ctx.drawImage(logoImg, centerX, centerY, logoSize, logoSize);
      }
  
      // Trigger the download
      const a = document.createElement("a");
      a.download = "qrcode.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    }).catch((error) => {
      console.error("Error loading images:", error);
      alert("Failed to download QR code");
    });
  };
  
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Generate QR Code</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="url" className="form-label">URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="dynamic"
                  checked={isDynamic}
                  onChange={() => setIsDynamic(!isDynamic)}
                />
                <label className="form-check-label" htmlFor="dynamic">
                  Dynamic QR Code (with tracking)
                </label>
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="logo"
                  checked={withLogo}
                  onChange={() => setWithLogo(!withLogo)}
                />
                <label className="form-check-label" htmlFor="logo">
                  Add Logo to QR Code
                </label>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !url}
              >
                {isLoading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="col-md-6">
        {qrData && (
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Your QR Code</h5>
              <div className="qr-code">
                <QRCodeSVG
                  ref={qrRef}
                  value={qrData.url}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={
                    withLogo ? {
                      src: "https://iili.io/39yM50u.md.png",
                      excavate: true,
                      height: 40,
                      width: 40,
                      level:'H',
                      marginSize:4
                    } : undefined
                  }
                />
              </div>
              
              <button
                onClick={downloadQRCode}
                className="btn btn-success mt-3"
              >
                Download QR Code
              </button>
              
              {qrData.isDynamic && (
                <div className="mt-3">
                  <p>Tracking ID: {qrData.trackingId}</p>
                  <Link 
                    to={`/dashboard/${qrData.trackingId}`}
                    className="btn btn-info"
                  >
                    View Analytics
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <QRHistoryModal />
    </div>
  );
};

export default QRGenerator;