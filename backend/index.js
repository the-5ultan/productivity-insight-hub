const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const sequelize = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Techlytics API' });
});

// Centralized Error Handling
app.use(errorHandler);

// Sync Database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
