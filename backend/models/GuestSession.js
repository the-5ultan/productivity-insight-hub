const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GuestSession = sequelize.define('GuestSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activity: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false
});

module.exports = GuestSession;
