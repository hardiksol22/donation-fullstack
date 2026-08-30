'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';

// TypeScript interface for Donation data structure
interface DonationRequest {
  _id: string;
  donorId: { name: string; email: string; contactNumber: string };
  category: string;
  quantity: number;
  condition: string;
  pickupAddress: string;
  scheduledTime: string;
  status: string;
}

export default function NgoDashboardPage() {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch data from backend on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetching all donations (Admin/NGO view). 
        // We can pass ?status=Pending query if we only want pending ones.
        const response = await api.get('/donations');
        setRequests(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load donation requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // 2. Handle Status Update API Call
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const ngoId = localStorage.getItem('userId');
      
      // Patch request to backend
      await api.patch(`/donations/${id}/status`, { 
        status: newStatus, 
        ngoId: ngoId 
      });

      // Update the UI optimistically without reloading the page
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
      
      alert(`Donation status successfully updated to: ${newStatus}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update request status.');
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center"><h5>Loading active requests...</h5></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>NGO Collection Dashboard</h2>
        <span className="badge bg-primary fs-6">Active Requests: {requests.length}</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Donor Info</th>
                  <th>Items</th>
                  <th>Pickup Details</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div><strong>{req.donorId?.name || 'Unknown Donor'}</strong></div>
                      <small className="text-muted">{req.donorId?.contactNumber || 'No contact provided'}</small>
                    </td>
                    <td>
                      <div>{req.category} ({req.quantity})</div>
                      <small className="text-muted">Condition: {req.condition}</small>
                    </td>
                    <td>
                      <div>{new Date(req.scheduledTime).toLocaleString()}</div>
                      <small className="text-muted">{req.pickupAddress}</small>
                    </td>
                    <td>
                      <span className={`badge ${
                        req.status === 'Pending' ? 'bg-warning text-dark' : 
                        req.status === 'Accepted' ? 'bg-info text-dark' : 
                        req.status === 'Collected' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {req.status === 'Pending' && (
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleUpdateStatus(req._id, 'Accepted')}
                        >
                          Accept Pickup
                        </button>
                      )}
                      {req.status === 'Accepted' && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateStatus(req._id, 'Collected')}
                        >
                          Mark Collected
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {requests.length === 0 && (
              <div className="text-center p-4 text-muted">
                No active donation requests at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}