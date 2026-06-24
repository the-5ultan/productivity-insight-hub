const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dataset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  analysis_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  result_json: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'analyses',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Analysis;
