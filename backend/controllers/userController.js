const { User, UserProfile, ActivityLog } = require('../models');
const activityService = require('../services/activityService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email', 'avatar_url', 'role', 'accountStatus', 'lastLogin'] }]
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
    const user = await User.findByPk(req.user.id);
    const profile = await UserProfile.findOne({ where: { userId: req.user.id } });
    
    // Update User model fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.avatar_url) user.avatar_url = req.body.avatar_url;
    await user.save();

    // Update UserProfile model fields
    const fields = [
      'dateOfBirth', 'gender', 'university', 'degreeProgram', 
      'currentSemester', 'country', 'city', 'researchArea', 'secondaryEmail'
    ];

    let completedFields = 0;
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
      if (profile[field]) completedFields++;
    });

    profile.profileCompletionPercentage = Math.round((completedFields / fields.length) * 100);
    await profile.save();

    if (profile.profileCompletionPercentage === 100) {
      user.profileCompleted = true;
      await user.save();
    }

    await activityService.logActivity(req.user.id, 'PROFILE_UPDATED', 'User updated profile information', req.ip);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...profile.toJSON(),
        User: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url
        }
      }
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
