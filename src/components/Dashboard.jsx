import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/qr/analytics/${id}`);
        setAnalytics(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [id]);
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  
  if (error) {
    return (
      <div className="alert alert-danger mt-4">
        {error}
        <Link to="/" className="btn btn-primary mt-3 d-block">Back to Generator</Link>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>QR Code Analytics</h2>
        <Link to="/" className="btn btn-primary">Create New QR</Link>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">QR Code Details</h5>
              <p><strong>ID:</strong> {analytics.qr.id}</p>
              <p><strong>Target URL:</strong> <a href={analytics.qr.target_url} target="_blank" rel="noopener noreferrer">{analytics.qr.target_url}</a></p>
              <p><strong>Created:</strong> {new Date(analytics.qr.created_at).toLocaleString()}</p>
              <p><strong>Logo Included:</strong> {analytics.qr.with_logo ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Scan Statistics</h5>
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="p-3 border rounded mb-3">
                    <h2 className="text-primary">{analytics.stats.total_scans}</h2>
                    <p className="mb-0">Total Scans</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded mb-3">
                    <h2 className="text-success">{analytics.stats.unique_visitors}</h2>
                    <p className="mb-0">Unique Visitors</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded mb-3">
                    <h2 className="text-info">{analytics.stats.last_scan ? new Date(analytics.stats.last_scan).toLocaleDateString() : 'N/A'}</h2>
                    <p className="mb-0">Last Scan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Daily Scan Activity</h5>
              {analytics.dailyScans.length === 0 ? (
                <p className="text-center">No scan data available yet</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Scans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.dailyScans.map((day) => (
                      <tr key={day.date}>
                        <td>{new Date(day.date).toLocaleDateString()}</td>
                        <td>{day.scans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;