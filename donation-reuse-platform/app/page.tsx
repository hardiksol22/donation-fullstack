import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-5 mb-4 bg-light rounded-3 shadow-sm mt-4">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold text-dark">Donation & Reuse Platform</h1>
        <p className="col-md-8 fs-4 text-muted mt-3">
          Connect with verified NGOs, orphanages, and individuals in need to donate unused clothes and household items seamlessly through doorstep collection.
        </p>
        <div className="d-flex gap-3 mt-4">
          <Link href="/donor/donate" className="btn btn-primary btn-lg">
            Schedule a Donation
          </Link>
          <Link href="/ngo/requests" className="btn btn-outline-dark btn-lg">
            NGO Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}