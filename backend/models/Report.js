const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  analysis_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dataset_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  report_path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'reports',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'generated_at',
  updatedAt: false
});

module.exports = Report;
