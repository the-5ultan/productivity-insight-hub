const { Dataset, DatasetRecord, Analysis } = require('../models');
const StatisticsEngine = require('../statistics');

class AnalysisService {
  async analyzeDataset(datasetId, userId = null) {
    const dataset = await Dataset.findByPk(datasetId, {
      include: [DatasetRecord]
    });

    if (!dataset) throw new Error('Dataset not found');

    const records = dataset.DatasetRecords;
    const stats = this.performFullAnalysis(records);

    // Save analysis result
    const analysis = await Analysis.create({
      user_id: userId,
      dataset_id: datasetId,
      analysis_type: 'full',
      result_json: stats
    });

    return { analysis, stats };
  }

  performFullAnalysis(records) {
    const fields = ['screen_time', 'social_media_usage', 'study_time', 'sleep_duration', 'apps_used', 'productivity_score'];
    const descriptive = {};

    fields.forEach(field => {
      const data = records.map(r => r[field]);
      descriptive[field] = {
        mean: StatisticsEngine.calculateMean(data),
        median: StatisticsEngine.calculateMedian(data),
        mode: StatisticsEngine.calculateMode(data),
        variance: StatisticsEngine.calculateVariance(data),
        stdDev: StatisticsEngine.calculateStandardDeviation(data)
      };
    });

    // Correlation Matrix
    const correlationMatrix = {};
    fields.forEach(f1 => {
      correlationMatrix[f1] = {};
      fields.forEach(f2 => {
        correlationMatrix[f1][f2] = StatisticsEngine.calculateCorrelation(
          records.map(r => r[f1]),
          records.map(r => r[f2])
        );
      });
    });

    // Probability Analysis (Example: Prob of High Productivity > 7)
    const productivityScores = records.map(r => r.productivity_score);
    const probHighProductivity = StatisticsEngine.calculateProbability(productivityScores, s => s > 7);

    // Research Conclusions
    const conclusions = this.generateResearchConclusions(correlationMatrix, descriptive);

    return {
      descriptive,
      correlationMatrix,
      probabilities: {
        highProductivity: probHighProductivity
      },
      conclusions
    };
  }

  generateResearchConclusions(matrix, descriptive) {
    const findings = [];
    const prodCorr = matrix.productivity_score;

    // Find strongest relationships
    let strongestPos = { field: '', val: 0 };
    let strongestNeg = { field: '', val: 0 };

    for (const field in prodCorr) {
      if (field === 'productivity_score') continue;
      const val = prodCorr[field];
      if (val > strongestPos.val) strongestPos = { field, val };
      if (val < strongestNeg.val) strongestNeg = { field, val };
    }

    if (strongestPos.field) {
      findings.push(`${this.formatFieldName(strongestPos.field)} shows the strongest positive relationship with productivity (r = ${strongestPos.val.toFixed(2)}).`);
    }
    if (strongestNeg.field) {
      findings.push(`${this.formatFieldName(strongestNeg.field)} shows the strongest negative relationship with productivity (r = ${strongestNeg.val.toFixed(2)}).`);
    }

    return findings;
  }

  formatFieldName(field) {
    return field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  async compareDatasets(datasetIdA, datasetIdB) {
    const dataA = await this.analyzeDataset(datasetIdA);
    const dataB = await this.analyzeDataset(datasetIdB);

    const comparison = {
      datasetA: { id: datasetIdA, stats: dataA.stats },
      datasetB: { id: datasetIdB, stats: dataB.stats },
      differences: {}
    };

    const fields = ['productivity_score', 'screen_time', 'study_time'];
    fields.forEach(field => {
      comparison.differences[field] = dataA.stats.descriptive[field].mean - dataB.stats.descriptive[field].mean;
    });

    return comparison;
  }

  async predictProductivity(inputData) {
    // This would ideally use a more complex model, but for now we'll use a weighted average or pre-calculated coefficients
    // For a real project, we'd use the linear regression coefficients from a reference dataset
    const { screen_time, social_media_usage, study_time, sleep_duration } = inputData;
    
    // Mock prediction logic based on typical trends
    let score = 5; 
    score += (study_time * 0.5);
    score += (sleep_duration * 0.3);
    score -= (social_media_usage * 0.4);
    score -= (screen_time * 0.1);

    return Math.min(Math.max(score, 0), 10).toFixed(1);
  }
}

module.exports = new AnalysisService();
