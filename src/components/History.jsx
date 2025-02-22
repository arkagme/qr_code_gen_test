import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, History as HistoryIcon } from 'lucide-react';
import axios from 'axios';

const QRHistoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/qr/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-16 bottom-16 right-16 bg-red-500 hover:bg-blue-600 text-black rounded-full p-3 shadow-lg"
      >
        <HistoryIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">QR Code History</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No QR codes generated yet</div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.target_url}</div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/${item.id}`)}
                    className="ml-4 text-blue-500 hover:text-blue-600"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRHistoryModal;