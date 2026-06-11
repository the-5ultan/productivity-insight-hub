const { User, UserProfile, ActivityLog, GuestSession } = require('../models');
const { Sequelize } = require('sequelize');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: UserProfile, as: 'profile' }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: UserProfile, as: 'profile' }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const verifiedUsers = await User.count({ where: { isEmailVerified: true } });
    const completedProfiles = await User.count({ where: { profileCompleted: true } });
    
    const guestSessions = await GuestSession.count();

    const researchAreaStats = await UserProfile.findAll({
      attributes: [
        'researchArea',
        [Sequelize.fn('COUNT', Sequelize.col('researchArea')), 'count']
      ],
      group: ['researchArea']
    });

    res.status(200).json({
      success: true,
      data: {
        userMetrics: {
          totalUsers,
          verifiedUsers,
          completedProfiles
        },
        guestSessions,
        researchAreaStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getActivityLogs,
  getStatistics
};
