const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const collectorRoutes = require('./routes/collectorRoutes');
const recyclerRoutes = require('./routes/recyclerRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/recycler', recyclerRoutes);
app.use('/api/admin', adminRoutes);

// Base Health Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Kabadiwala Connect API is running smoothly 🚀',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error occurred',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});