'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api'; // Axios API instance

// TypeScript interfaces for data structures
interface KPIStats {
  totalDonors: number;
  verifiedNgos: number;
  totalDonations: number;
  completedCollections: number;
}

interface PendingNGO {
  _id: string;
  name: string;
  organizationName: string;
  email: string;
  contactNumber: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<KPIStats>({
    totalDonors: 0,
    verifiedNgos: 0,
    totalDonations: 0,
    completedCollections: 0
  });
  const [pendingNgos, setPendingNgos] = useState<PendingNGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch KPIs and Pending NGOs from backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Run both API calls in parallel for faster loading
        const [statsResponse, ngosResponse] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/ngos?status=pending')
        ]);

        setStats(statsResponse.data.data);
        setPendingNgos(ngosResponse.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // 2. Handle NGO Verification API Call
  const handleVerify = async (id: string) => {
    try {
      await api.patch(`/admin/ngo/${id}/verify`, { isVerified: true });
      
      // Update UI: Remove verified NGO from pending list and increment KPI
      setPendingNgos(pendingNgos.filter(ngo => ngo._id !== id));
      setStats(prev => ({ ...prev, verifiedNgos: prev.verifiedNgos + 1 }));
      
      alert('NGO successfully verified and activated.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify NGO.');
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center"><h5>Loading Admin Dashboard...</h5></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Control Center</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow-sm">
            <div className="card-body">
              <h5>Total Donors</h5>
              <h2>{stats.totalDonors}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <h5>Verified NGOs</h5>
              <h2>{stats.verifiedNgos}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body">
              <h5>Total Donations</h5>
              <h2>{stats.totalDonations}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-white shadow-sm">
            <div className="card-body">
              <h5>Completed Pickups</h5>
              <h2>{stats.completedCollections}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* NGO Verification Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Pending NGO Verifications</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Organization Name</th>
                  <th>Representative</th>
                  <th>Email & Contact</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingNgos.length > 0 ? pendingNgos.map((ngo) => (
                  <tr key={ngo._id}>
                    <td><strong>{ngo.organizationName || 'N/A'}</strong></td>
                    <td>{ngo.name}</td>
                    <td>
                      <div>{ngo.email}</div>
                      <small className="text-muted">{ngo.contactNumber}</small>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleVerify(ngo._id)}
                      >
                        Approve & Verify
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">No pending verifications. All caught up!</td>
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