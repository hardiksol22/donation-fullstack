# DaanSetu-Donation & Reuse Platform for Clothes and Household Items ♻️

A full-stack, real-time web application designed to bridge the gap between individual donors and verified NGOs. This platform streamlines the process of giving gently used clothes, electronics, and household items a second life through a secure, gamified, and location-aware ecosystem.

## 🌟 Key Features

### For Donors 🎁
*   **Seamless Item Listing:** Upload images (powered by Cloudinary) and details of items you wish to donate.
*   **Smart Scheduling:** Set preferred pickup times and addresses.
*   **Impact Dashboard:** Track your complete donation history and real-time pickup status.
*   **Gamified Leaderboard:** A dynamic Hall of Fame ranking top contributors based on real-time MongoDB aggregation pipelines.

### For NGO Partners 🤝
*   **Command Center:** A dedicated dashboard to view and claim available local donations.
*   **Status Management:** Update donation statuses (Requested, Accepted, Completed) to keep donors informed.

### For Super Admins 🛡️
*   **Centralized Overview:** Real-time platform metrics (total users, active donations, completed pickups).
*   **Strict Verification:** An approval queue to manually verify NGO credentials before granting platform access.

### Security & Architecture 🔒
*   **Role-Based Access Control (RBAC):** Strict JWT-based authentication ensuring isolated routing for Donors, NGOs, and Admins.
*   **Client-Side Route Protection:** Custom React wrappers preventing unauthorized access to private dashboards.
*   **Secure Password Hashing:** Implemented via bcryptjs.

---

## 💻 Tech Stack

**Frontend (Client)**
*   [Next.js 14](https://nextjs.org/) (App Router)
*   React.js
*   Tailwind CSS
*   [Shadcn UI](https://ui.shadcn.com/) (Accessible components)
*   Lucide React (Iconography)

**Backend (Server)**
*   Node.js & Express.js
*   MongoDB (Mongoose ODM)
*   JSON Web Tokens (JWT) for stateless authentication
*   Bcrypt.js

**External Services**
*   **Cloudinary:** Image hosting and management.

---

## ⚙️ Environment Variables

To run this project locally, create `.env` files in both your frontend and backend directories.

### Backend (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key