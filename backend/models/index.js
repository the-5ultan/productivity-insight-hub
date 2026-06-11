const User = require('./User');
const UserProfile = require('./UserProfile');
const OtpVerification = require('./OtpVerification');
const Dataset = require('./Dataset');
const DatasetRecord = require('./DatasetRecord');
const Analysis = require('./Analysis');
const Report = require('./Report');
const ActivityLog = require('./ActivityLog');
const GuestSession = require('./GuestSession');

// Associations
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(OtpVerification, { foreignKey: 'userId' });
OtpVerification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Dataset, { foreignKey: 'user_id' }); // Keeping user_id for existing models unless I update them too
Dataset.belongsTo(User, { foreignKey: 'user_id' });

Dataset.hasMany(DatasetRecord, { foreignKey: 'dataset_id', onDelete: 'CASCADE' });
DatasetRecord.belongsTo(Dataset, { foreignKey: 'dataset_id' });

User.hasMany(Analysis, { foreignKey: 'user_id' });
Analysis.belongsTo(User, { foreignKey: 'user_id' });

Dataset.hasMany(Analysis, { foreignKey: 'dataset_id', onDelete: 'CASCADE' });
Analysis.belongsTo(Dataset, { foreignKey: 'dataset_id' });

User.hasMany(Report, { foreignKey: 'user_id' });
Report.belongsTo(User, { foreignKey: 'user_id' });

Analysis.hasOne(Report, { foreignKey: 'analysis_id' });
Report.belongsTo(Analysis, { foreignKey: 'analysis_id' });

Dataset.hasMany(Report, { foreignKey: 'dataset_id' });
Report.belongsTo(Dataset, { foreignKey: 'dataset_id' });

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  UserProfile,
  OtpVerification,
  Dataset,
  DatasetRecord,
  Analysis,
  Report,
  ActivityLog,
  GuestSession
};
