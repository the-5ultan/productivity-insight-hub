// Load environment variables at the very beginning
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Strict Environment Validation
const requiredEnv = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
requiredEnv.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`CRITICAL ERROR: ${envVar} is missing in .env file`);
    process.exit(1);
  }
});

// Initialize passport config
require('./config/passport'); 

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session support for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'techlytics_research_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/analysis', analysisRoutes);
console.log("Analysis routes loaded");
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Techlytics API' });
});

// Centralized Error Handling
app.use(errorHandler);

// Sync Database — authenticate only, no schema modifications
const syncDatabase = async () => {
  try {
    const connected = await sequelize.testDirectConnection();
    if (!connected) {
      console.error('\n✗ Database connection failed. Exiting.');
      process.exit(1);
    }

    console.log('\n--- Sequelize Authentication ---');
    await sequelize.authenticate();
    console.log('✓ Sequelize authenticated successfully');
    console.log('\n✓ Database Connected');
    
    // Diagnostic Logs
    if (process.env.JWT_ACCESS_SECRET && process.env.JWT_REFRESH_SECRET) {
      console.log('✓ JWT Loaded');
    } else {
      console.log('⚠ JWT Secret Missing');
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('✓ SMTP Loaded');
    } else {
      console.log('⚠ SMTP Credentials Missing');
    }

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      console.log('✓ Google OAuth Loaded');
    } else {
      console.log('⚠ Google OAuth Credentials Missing');
    }
  } catch (err) {
    console.error('✗ Sequelize authentication failed:', err.message);
    console.error(err);
    process.exit(1);
  }
};

syncDatabase();

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
