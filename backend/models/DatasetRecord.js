const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DatasetRecord = sequelize.define('DatasetRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dataset_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  screen_time: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  social_media_usage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  study_time: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sleep_duration: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  device_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apps_used: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productivity_score: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'datasetrecords',
  freezeTableName: true,
  timestamps: false
});

module.exports = DatasetRecord;
