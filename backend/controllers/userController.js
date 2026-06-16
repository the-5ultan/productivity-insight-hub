const { User, UserProfile, ActivityLog } = require('../models');
const activityService = require('../services/activityService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'role', 'accountStatus', 'lastLogin'] }]
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ where: { userId: req.user.id } });
    
    const fields = [
      'dateOfBirth', 'gender', 'university', 'degreeProgram', 
      'currentSemester', 'country', 'city', 'researchArea'
    ];

    let completedFields = 0;
    fields.forEach(field => {
      if (req.body[field]) {
        profile[field] = req.body[field];
      }
      if (profile[field]) completedFields++;
    });

    profile.profileCompletionPercentage = Math.round((completedFields / fields.length) * 100);
    await profile.save();

    if (profile.profileCompletionPercentage === 100) {
      const user = await User.findByPk(req.user.id);
      user.profileCompleted = true;
      await user.save();
    }

    await activityService.logActivity(req.user.id, 'PROFILE_UPDATED', 'User updated profile information', req.ip);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

const getActivityLog = async (req, res, next) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getActivityLog
};
