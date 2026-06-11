const { ActivityLog } = require('../models');

const logActivity = async (userId, action, description, ipAddress = null) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      description,
      ipAddress
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = {
  logActivity
};
