'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api'; // Axios API instance

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend par POST request bhejna login ke liye
      const response = await api.post('/auth/login', credentials);
      
      // Token aur user role ko localStorage mein save karna
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);

      alert('Login Successful!');
      
      // User ke role ke hisaab se dashboard par bhejna
      if (response.data.role === 'Admin') {
        router.push('/admin/dashboard');
      } else if (response.data.role === 'NGO') {
        router.push('/ngo/requests');
      } else {
        router.push('/donor/donate');
      }
    } catch (err: any) {
      // API se aane wale error ko UI par dikhana
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Welcome Back</h3>
            
            {/* Error Message Alert */}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="text-center mt-3">
              <small>Don't have an account? <Link href="/register">Sign up here</Link></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}