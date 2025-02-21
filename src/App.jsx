import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRGenerator from './components/QRGenerator';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="container">
        <header className="my-4">
          <h1 className="text-center">Dynamic QR Code Generator</h1>
        </header>
        <Routes>
          <Route path="/" element={<QRGenerator />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;