// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Donation & Reuse Platform',
  description: 'Connecting donors with verified NGOs for seamless doorstep collection.',
};

// Define an interface for the layout props
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mt-4">
          {children}
        </main>
      </body>
    </html>
  );
}