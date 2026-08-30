'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand font-weight-bold">
          Donation Platform
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/donor/donate" className="nav-link">Donate Items</Link>
            </li>
            <li className="nav-item">
              <Link href="/ngo/requests" className="nav-link">NGO Dashboard</Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link href="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link href="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}