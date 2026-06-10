class StatisticsEngine {
  // Descriptive Statistics
  calculateMean(data) {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  calculateMedian(data) {
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  calculateMode(data) {
    if (data.length === 0) return null;
    const counts = {};
    let maxCount = 0;
    let modes = [];

    data.forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
      if (counts[val] > maxCount) {
        maxCount = counts[val];
      }
    });

    for (const val in counts) {
      if (counts[val] === maxCount) {
        modes.push(Number(val));
      }
    }
    return modes.length === data.length ? null : modes;
  }

  calculateVariance(data) {
    if (data.length === 0) return 0;
    const mean = this.calculateMean(data);
    const squareDiffs = data.map(val => Math.pow(val - mean, 2));
    return this.calculateMean(squareDiffs);
  }

  calculateStandardDeviation(data) {
    return Math.sqrt(this.calculateVariance(data));
  }

  // Correlation Analysis (Pearson Correlation Coefficient)
  calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;
    const n = x.length;
    const meanX = this.calculateMean(x);
    const meanY = this.calculateMean(y);

    let numerator = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      denX += Math.pow(diffX, 2);
      denY += Math.pow(diffY, 2);
    }

    const denominator = Math.sqrt(denX * denY);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Probability Analysis
  calculateProbability(data, condition) {
    if (data.length === 0) return 0;
    const favorable = data.filter(condition).length;
    return favorable / data.length;
  }

  // Predictive Model (Simple Linear Regression: y = mx + b)
  getLinearRegression(x, y) {
    const n = x.length;
    const meanX = this.calculateMean(x);
    const meanY = this.calculateMean(y);

    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - meanX) * (y[i] - meanY);
      den += Math.pow(x[i] - meanX, 2);
    }

    const m = den === 0 ? 0 : num / den;
    const b = meanY - m * meanX;

    return { m, b };
  }

  // AI Interpretation Engine
  generateInterpretation(metric, value) {
    if (metric === 'correlation') {
      if (value > 0.7) return "Strong positive relationship. As one variable increases, the other tends to increase significantly.";
      if (value > 0.3) return "Moderate positive relationship.";
      if (value > -0.3) return "Weak or no relationship.";
      if (value > -0.7) return "Moderate negative relationship.";
      return "Strong negative relationship. As one variable increases, the other tends to decrease significantly.";
    }
    // Add more interpretations as needed
    return "";
  }
}

module.exports = new StatisticsEngine();
