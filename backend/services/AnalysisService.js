const { Dataset, DatasetRecord, Analysis } = require('../models');
const StatisticsEngine = require('../statistics');

class AnalysisService {
  async analyzeDataset(datasetId, userId = null) {
    const dataset = await Dataset.findByPk(datasetId, {
      include: [DatasetRecord]
    });

    if (!dataset) throw new Error('Dataset not found');

    const records = dataset.DatasetRecords;
    if (records.length === 0) throw new Error('Dataset contains no records');

    const stats = this.performFullAnalysis(records);
    const problemIdentification = this.getProblemIdentification();
    const impactAnalysis = this.performImpactAnalysis(records);
    const advancedAnalysis = this.performAdvancedAnalysis(records);

    const fullResult = {
      ...stats,
      problemIdentification,
      impactAnalysis,
      advancedAnalysis
    };

    // Save analysis result
    const analysis = await Analysis.create({
      user_id: userId,
      dataset_id: datasetId,
      analysis_type: 'comprehensive',
      result_json: fullResult
    });

    return { analysis, stats: fullResult };
  }

  getProblemIdentification() {
    return {
      problem: "A technology research organization is analyzing how digital technology usage affects student productivity and cognitive performance.",
      decisionProblem: "Determining whether measurable technology usage indicators (screen time, social media, study time, sleep) can reliably predict academic productivity.",
      conflictingVariables: [
        { variables: ["Social Media Usage", "Online Study Time"], conflict: "Both contribute to Screen Time but have opposing effects on Productivity." },
        { variables: ["Sleep Duration", "Number of Apps Used"], conflict: "Excessive app usage often correlates with reduced sleep, creating a multi-layered impact on cognitive performance." }
      ],
      statisticalRequirement: "Statistical analysis is required to quantify these relationships, move beyond anecdotal evidence, and identify the 'tipping point' where technology usage becomes counterproductive."
    };
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

    // Probability Interpretation
    const productivityScores = records.map(r => r.productivity_score);
    const probHigh = StatisticsEngine.calculateProbability(productivityScores, s => s >= 7);
    const probLow = StatisticsEngine.calculateProbability(productivityScores, s => s <= 4);

    // Insights Engine
    const insights = this.generateInsights(correlationMatrix, descriptive);

    return {
      descriptive,
      correlationMatrix,
      probabilities: {
        highProductivity: probHigh,
        lowProductivity: probLow
      },
      insights
    };
  }

  generateInsights(matrix, descriptive) {
    const insights = [];
    const prodCorr = matrix.productivity_score;

    // Relationship detection
    const correlations = [];
    for (const field in prodCorr) {
      if (field === 'productivity_score') continue;
      correlations.push({ field, val: prodCorr[field] });
    }

    // Sort by absolute strength
    correlations.sort((a, b) => Math.abs(b.val) - Math.abs(a.val));

    const strongest = correlations[0];
    const trend = strongest.val > 0 ? "positive" : "negative";
    insights.push(`The most influential factor identified is ${this.formatFieldName(strongest.field)}, showing a ${trend} correlation of ${strongest.val.toFixed(2)} with productivity.`);

    correlations.forEach(c => {
      if (Math.abs(c.val) > 0.6) {
        insights.push(`Strong ${c.val > 0 ? 'positive' : 'negative'} relationship detected: ${this.formatFieldName(c.field)} significantly impacts performance.`);
      }
    });

    const avgStudy = descriptive.study_time.mean;
    insights.push(`On average, students spend ${avgStudy.toFixed(1)} hours on online study daily.`);

    return insights;
  }

  performImpactAnalysis(records) {
    // Scenario: Remove Social Media Usage
    const originalCorr = this.calculateTargetCorrelations(records, 'productivity_score');
    
    const fieldsToKeep = ['screen_time', 'study_time', 'sleep_duration', 'apps_used', 'productivity_score'];
    const reducedRecords = records.map(r => {
      const newObj = {};
      fieldsToKeep.forEach(f => newObj[f] = r[f]);
      return newObj;
    });

    const reducedCorr = this.calculateTargetCorrelations(reducedRecords, 'productivity_score');

    const comparisons = [];
    for (const field in originalCorr) {
      if (field === 'social_media_usage' || field === 'productivity_score') continue;
      comparisons.push({
        variable: this.formatFieldName(field),
        before: originalCorr[field],
        after: reducedCorr[field],
        change: reducedCorr[field] - originalCorr[field]
      });
    }

    return {
      removedVariable: "Social Media Usage",
      comparisons,
      conclusion: "Removing Social Media Usage isolates the direct impact of Study Time and Screen Time, often revealing a clearer predictive path for academic performance."
    };
  }

  calculateTargetCorrelations(records, targetField) {
    const fields = Object.keys(records[0]);
    const results = {};
    fields.forEach(field => {
      results[field] = StatisticsEngine.calculateCorrelation(
        records.map(r => r[field]),
        records.map(r => r[targetField])
      );
    });
    return results;
  }

  performAdvancedAnalysis(records) {
    // 1. Simple Linear Regression (Study Time vs Productivity)
    const studyTime = records.map(r => r.study_time);
    const productivity = records.map(r => r.productivity_score);
    const regression = StatisticsEngine.getLinearRegression(studyTime, productivity);

    // 2. Weighted Productivity Index (Example calculation)
    const weightedIndex = records.map(r => {
      return (r.study_time * 0.4) + (r.sleep_duration * 0.3) - (r.social_media_usage * 0.2) - (r.screen_time * 0.1);
    });

    // 3. MCDA Placeholder (Ranking Top Students)
    const rankings = records.map((r, index) => ({
      studentId: index + 1,
      score: (r.study_time * 2) + (r.sleep_duration) - (r.social_media_usage)
    })).sort((a, b) => b.score - a.score).slice(0, 3);

    return {
      regression: {
        independent: "Study Time",
        dependent: "Productivity",
        slope: regression.m,
        intercept: regression.b,
        equation: `y = ${regression.m.toFixed(2)}x + ${regression.b.toFixed(2)}`
      },
      weightedIndex: {
        average: StatisticsEngine.calculateMean(weightedIndex),
        description: "Composite score balancing study, sleep, and digital habits."
      },
      mcda: {
        method: "Weighted Scoring Model",
        topPerformers: rankings
      }
    };
  }

  formatFieldName(field) {
    return field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}

module.exports = new AnalysisService();
