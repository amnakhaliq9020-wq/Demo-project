import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import { testEmailConfig } from './utils/emailService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VidShare Backend API is running!',
    version: '1.0.0',
    endpoints: {
      register: 'POST /users/register',
      login: 'POST /users/login',
      verify: 'POST /users/verify/:userId/:token',
      currentUser: 'GET /users/current-user'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Test email configuration
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await testEmailConfig();
    } else {
      console.warn('⚠️  Email configuration not found. Email verification will not work.');
      console.warn('   Please set EMAIL_USER and EMAIL_PASS in .env file');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

