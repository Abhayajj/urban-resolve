const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const connectDB = require('./src/config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ✅ FIX 1: Proper CORS config (important for frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"] : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

// ✅ FIX 2: Body parsers (already correct, just structured)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ FIX 3: File upload safer config
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root test route
app.get('/', (req, res) => {
  res.send('Smart City API is running...');
});

// Route files
const adminRoutes = require('./src/routes/adminRoutes');
const citizenRoutes = require('./src/routes/citizenRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const complaintRoutes = require('./src/routes/complaintRoutes');
const noticeRoutes = require('./src/routes/noticeRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

// Mount routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/citizen', citizenRoutes);
app.use('/api/v1/dept', departmentRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/messages', messageRoutes);

// ✅ DEBUG (optional but powerful)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error middleware (ALWAYS LAST)
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});