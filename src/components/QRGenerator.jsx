import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

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
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      const a = document.createElement("a");
      a.download = "qrcode.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
                      src: "https://i.ibb.co/s9HqZSqd/DCS-icon-1-1.png",
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
    </div>
  );
};

export default QRGenerator;