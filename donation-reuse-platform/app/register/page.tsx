'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api'; 

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Donor',
    organizationName: '',
    contactNumber: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      
      // Token, userRole, aur naya userId localStorage mein save karna
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data._id); 

      alert('Registration Successful!');
      
      if (response.data.role === 'Donor') {
        router.push('/donor/donate');
      } else {
        router.push('/ngo/requests');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Create an Account</h3>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="mb-4">
                <label className="form-label fw-bold">I want to register as a:</label>
                <select 
                  className="form-select" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                >
                  <option value="Donor">Donor (Individual)</option>
                  <option value="NGO">NGO / Beneficiary</option>
                </select>
              </div>

              {/* Common Fields */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Email address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="col">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              {/* Conditional NGO Fields */}
              {formData.role === 'NGO' && (
                <div className="p-3 bg-light border rounded mb-3">
                  <h6 className="mb-3 text-muted">NGO / Organization Details</h6>
                  <div className="mb-3">
                    <label className="form-label">Organization Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required={formData.role === 'NGO'}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required={formData.role === 'NGO'}
                    />
                  </div>
                  <small className="text-warning">
                    * Note: NGO accounts require admin verification before accepting donations.
                  </small>
                </div>
              )}
              
              <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className="text-center mt-3">
              <small>Already have an account? <Link href="/login">Log in here</Link></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}