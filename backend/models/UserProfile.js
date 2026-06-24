const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  secondaryEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Prefer Not To Say'),
    allowNull: true
  },
  university: {
    type: DataTypes.STRING,
    allowNull: true
  },
  degreeProgram: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currentSemester: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  researchArea: {
    type: DataTypes.ENUM('Statistics', 'Data Science', 'Machine Learning', 'Software Engineering', 'Research Analytics'),
    allowNull: true
  },
  profileCompletionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'userprofiles',
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId'],
      name: 'userprofiles_userId_unique'
    }
  ]
});

module.exports = UserProfile;
