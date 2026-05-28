# 🏙️ Urban Resolve — Smart City Administration Portal

Urban Resolve is a modern, full-stack smart city administration and citizen engagement platform. It bridges the gap between citizens, municipal departments, and system administrators, enabling structured reporting, real-time ticket tracking, and efficient resolution of civic issues.

---

## 🚀 Key Features

### 👥 Citizen Portal
- **Interactive Dashboard:** Report municipal issues (potholes, sanitation, streetlights, etc.) with category, description, and location details.
- **Ticket Tracking:** Real-time updates on reported issues with status indicators (Pending, In-Progress, Resolved).
- **Communication:** Submit feedback and receive notifications upon resolution.

### 🏢 Department Portal
- **Role-based Access:** Custom view for specific civic departments (e.g., Water, Sanitation, Electricity, Roads).
- **Ticket Lifecycle Management:** Assign field officers, update progress logs, and mark tasks as resolved.
- **Internal Analytics:** View departmental resolution times and workload stats.

### 👑 Admin Control Panel
- **User & Department Management:** Add, edit, or remove departments and department managers.
- **Smart Dispatch:** Automatically route new tickets to the corresponding department based on categories.
- **Global Analytics:** Executive view of active issues, resolution rates, and system-wide metrics.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js (via Vite)
- **Styling:** CSS3, Tailwind CSS (for custom utility layouts)
- **Routing:** React Router DOM
- **HTTP Client:** Axios (for seamless API consumption)

### Backend & Database
- **Runtime:** Node.js
- **Framework:** Express.js (MVC Pattern)
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & Google OAuth
- **File Uploads:** Multer (for ticket attachments/proofs)

---

## 📁 Repository Structure

```text
smart-city/
├── Frontend/           # React client application
│   ├── public/         # Static assets
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # General, Admin, Citizen, and Department views
│       ├── App.jsx     # Main routes and layouts
│       └── main.jsx    # Entry point
│
└── backend/            # Express REST API
    ├── src/
    │   ├── controllers/# Business logic handlers
    │   ├── models/     # Mongoose database schemas
    │   ├── routes/     # Express API endpoints
    │   └── middleware/ # Authentication & validation middleware
    ├── server.js       # Express server configuration
    └── seed.js         # Database seeder utility
```

---

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance running or MongoDB Atlas Connection URI)

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Seed mock data (Optional):
   ```bash
   node seed.js
   ```
5. Start the backend dev server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the Frontend folder:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.

---

## 🤝 Contribution Guidelines
Contributions are welcome! Please fork the repository, make your changes on a separate branch, and submit a pull request with a detailed description of the changes.

---

*Developed by Abhay Gupta. Focused on making smart governance accessible and transparent.*
