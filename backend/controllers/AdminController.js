const { User, Dataset, Report, ActivityLog, GuestSession, DatasetRecord } = require('../models');
const StatisticsEngine = require('../statistics');

class AdminController {
  async getStats(req, res) {
    try {
      const totalUsers = await User.count();
      const totalDatasets = await Dataset.count();
      const totalReports = await Report.count();
      const totalGuestSessions = await GuestSession.count();
      
      // Calculate Most Influential Productivity Factor
      const allRecords = await DatasetRecord.findAll();
      const fields = ['screen_time', 'social_media_usage', 'study_time', 'sleep_duration', 'apps_used'];
      
      let mostInfluential = { field: 'None', correlation: 0 };
      
      if (allRecords.length > 0) {
        const prodScores = allRecords.map(r => r.productivity_score);
        fields.forEach(field => {
          const fieldData = allRecords.map(r => r[field]);
          const corr = Math.abs(StatisticsEngine.calculateCorrelation(fieldData, prodScores));
          if (corr > mostInfluential.correlation) {
            mostInfluential = { field, correlation: corr };
          }
        });
      }

      res.json({
        totalUsers,
        totalDatasets,
        totalReports,
        totalGuestSessions,
        mostInfluential: mostInfluential.field.replace('_', ' ').toUpperCase()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActivityLogs(req, res) {
    try {
      const logs = await ActivityLog.findAll({ include: [User], order: [['created_at', 'DESC']], limit: 100 });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdminController();
