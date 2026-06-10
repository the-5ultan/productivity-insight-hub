const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dataset = sequelize.define('Dataset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Nullable for guest uploads (though typically guest won't save)
  },
  dataset_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true // Nullable if data is entered manually
  }
}, {
  timestamps: true,
  createdAt: 'upload_date',
  updatedAt: false
});

module.exports = Dataset;
