const User = require('./User');
const Dataset = require('./Dataset');
const DatasetRecord = require('./DatasetRecord');
const Analysis = require('./Analysis');
const Report = require('./Report');
const ActivityLog = require('./ActivityLog');
const GuestSession = require('./GuestSession');

// Associations
User.hasMany(Dataset, { foreignKey: 'user_id' });
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

User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Dataset,
  DatasetRecord,
  Analysis,
  Report,
  ActivityLog,
  GuestSession
};
