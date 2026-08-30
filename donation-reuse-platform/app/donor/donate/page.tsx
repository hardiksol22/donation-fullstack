'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api'; // Make sure this path points to your api.ts

export default function DonateItemsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Optional: Fetch NGOs list from backend to populate the select dropdown dynamically
  const [ngos, setNgos] = useState<{ _id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    category: 'Clothes',
    quantity: 1,
    condition: 'Gently Used',
    pickupAddress: '',
    pickupDate: '',
    selectedNgo: '',
  });

  // Fetch verified NGOs when page loads
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await api.get('/admin/ngos?status=verified');
        setNgos(response.data.data);
      } catch (err) {
        console.error('Failed to load NGOs', err);
      }
    };
    fetchNGOs();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Decode user ID from token or retrieve from localStorage 
      // (Ensure you saved userId in localStorage during login/register for this to work perfectly, 
      // or rely on backend token decoding in a real production app)
      const donorId = localStorage.getItem('userId') || 'placeholder-id'; 

      const payload = {
        donorId: donorId,
        category: formData.category,
        quantity: Number(formData.quantity),
        condition: formData.condition,
        pickupAddress: formData.pickupAddress,
        scheduledTime: formData.pickupDate,
        ngoId: formData.selectedNgo || null,
      };

      await api.post('/donations', payload);
      
      alert('Your donation request has been scheduled successfully!');
      router.push('/donor/history'); // Redirect to history dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm mt-5">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Schedule a Donation</h4>
          </div>
          <div className="card-body">
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Item Details Section */}
              <h5 className="mb-3">Item Details</h5>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                  <option value="Clothes">Clothes</option>
                  <option value="Household Items">Household Items</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                </select>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-control" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required />
                </div>
                <div className="col">
                  <label className="form-label">Condition</label>
                  <select className="form-select" name="condition" value={formData.condition} onChange={handleChange}>
                    <option value="New">New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <hr />

              {/* Logistics Section */}
              <h5 className="mb-3">Pickup Logistics</h5>
              <div className="mb-3">
                <label className="form-label">Pickup Address</label>
                <textarea className="form-control" name="pickupAddress" rows={2} value={formData.pickupAddress} onChange={handleChange} placeholder="Enter full address for doorstep collection" required></textarea>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Preferred Date & Time</label>
                  <input type="datetime-local" className="form-control" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
                </div>
                <div className="col">
                  <label className="form-label">Select NGO (Optional)</label>
                  <select className="form-select" name="selectedNgo" value={formData.selectedNgo} onChange={handleChange}>
                    <option value="">Any Available NGO</option>
                    {ngos.map(ngo => (
                      <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100 mt-3" disabled={loading}>
                {loading ? 'Scheduling...' : 'Schedule Pickup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}