'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api'; // Axios instance

// TypeScript interface for the donation record
interface DonationRecord {
  _id: string;
  createdAt: string;
  category: string;
  quantity: number;
  ngoId?: { organizationName: string; email: string };
  status: string;
  donorId: { _id: string }; // Required for filtering
}

export default function DonorHistoryPage() {
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Get the logged-in user's ID from localStorage
        const userId = localStorage.getItem('userId');
        
        // Fetch all donations from the API
        const response = await api.get('/donations');
        
        // Filter the results on the client side to show only this specific donor's records
        const userDonations = response.data.data.filter(
          (donation: DonationRecord) => donation.donorId?._id === userId
        );
        
        setHistory(userDonations);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch donation history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="container mt-5 text-center"><h5>Loading your history...</h5></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Donation History</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Request ID</th>
                  <th>Items Donated</th>
                  <th>NGO Assigned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                      {/* Display a shortened version of the MongoDB Object ID as Request ID */}
                      <td><strong>REQ-{record._id.substring(0, 6).toUpperCase()}</strong></td>
                      <td>{record.category} ({record.quantity})</td>
                      <td>{record.ngoId?.organizationName || 'Pending Assignment'}</td>
                      <td>
                        <span className={`badge ${
                          record.status === 'Pending' ? 'bg-warning text-dark' : 
                          record.status === 'Accepted' ? 'bg-info text-dark' : 
                          record.status === 'Collected' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      You haven't scheduled any donations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}