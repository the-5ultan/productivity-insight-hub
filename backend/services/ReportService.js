const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Report } = require('../models');

class ReportService {
  async generatePDF(reportData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const fileName = `Dataset_Report_${reportData.dataset.id}.pdf`;
        const filePath = path.join('reports', fileName);

        if (!fs.existsSync('reports')) {
          fs.mkdirSync('reports', { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const { dataset, rawRecords, statistics, correlationMatrix, probabilities, regression, weightedIndex, mcda, insights, impactAnalysis, problemIdentification, summary } = reportData;

        // ============ COVER PAGE ============
        doc.fontSize(36).font('Helvetica-Bold').fillColor('#1a1a2e').text('TechLytics', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(14).font('Helvetica').fillColor('#666666').text('Research Analytics Platform', { align: 'center' });
        doc.moveDown(2);
        doc.moveTo(150, doc.y).lineTo(460, doc.y).strokeColor('#cccccc').stroke();
        doc.moveDown(2);
        doc.fontSize(28).font('Helvetica-Bold').fillColor('#000000').text('Analytics Report', { align: 'center' });
        doc.moveDown(1.5);
        doc.fontSize(14).font('Helvetica').fillColor('#333333').text(`Dataset: ${dataset.name}`, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#666666').text(`Dataset ID: ${dataset.id}`, { align: 'center' });
        doc.text(`Records Analyzed: ${dataset.recordCount}`, { align: 'center' });
        doc.text(`Analysis Type: ${dataset.analysisType}`, { align: 'center' });
        doc.moveDown(1);
        doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, { align: 'center' });

        doc.addPage();

        // ============ SECTION 1: DATASET OVERVIEW ============
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('1. Dataset Overview');
        doc.moveDown(0.8);
        this.drawTable(doc,
          ['Property', 'Value'],
          [
            ['Dataset Name', dataset.name],
            ['Dataset ID', String(dataset.id)],
            ['Number of Records', String(dataset.recordCount)],
            ['Upload Date', dataset.uploadDate ? new Date(dataset.uploadDate).toLocaleDateString() : 'N/A'],
            ['Analysis Type', dataset.analysisType],
            ['Report Generated', new Date(reportData.generatedAt).toLocaleString()]
          ],
          [150, 340]
        );
        doc.moveDown(1);

        // ============ SECTION 2: RAW DATASET ============
        doc.addPage();
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('2. Raw Dataset');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#444444').text('The following table displays all data records entered by the user:');
        doc.moveDown(0.5);

        if (rawRecords.length > 0) {
          const sampleFields = ['screen_time', 'social_media_usage', 'study_time', 'sleep_duration', 'device_type', 'apps_used', 'productivity_score'];
          const headers = ['#', ...sampleFields.map(f => this.formatFieldName(f))];
          const rows = rawRecords.slice(0, 50).map((r, i) =>
            [String(i + 1), ...sampleFields.map(f => r[f] != null ? String(r[f]) : 'N/A')]
          );
          const colWidths = [25, 55, 55, 55, 55, 55, 45, 55];
          this.drawTable(doc, headers, rows, colWidths);

          if (rawRecords.length > 50) {
            doc.moveDown(0.3);
            doc.fontSize(9).fillColor('#888888').text(`Showing 50 of ${rawRecords.length} records.`, { align: 'center' });
          }
        } else {
          doc.fontSize(10).fillColor('#888888').text('No records available.');
        }

        // ============ SECTION 3: STATISTICAL ANALYSIS ============
        doc.addPage();
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('3. Statistical Analysis');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#444444').text('Descriptive statistics computed across all numeric fields:');
        doc.moveDown(0.5);

        if (statistics) {
          const fields = Object.keys(statistics);
          const statHeaders = ['Metric', 'Mean', 'Median', 'Mode', 'Variance', 'Std Dev', 'Min', 'Max', 'Range'];
          const statRows = fields.map(f => {
            const s = statistics[f];
            const modeVal = Array.isArray(s.mode) ? s.mode.join(', ') : (s.mode != null ? String(s.mode) : 'N/A');
            return [
              this.formatFieldName(f),
              s.mean != null ? s.mean.toFixed(2) : 'N/A',
              s.median != null ? s.median.toFixed(2) : 'N/A',
              modeVal,
              s.variance != null ? s.variance.toFixed(2) : 'N/A',
              s.stdDev != null ? s.stdDev.toFixed(2) : 'N/A',
              s.min != null ? s.min.toFixed(2) : 'N/A',
              s.max != null ? s.max.toFixed(2) : 'N/A',
              s.range != null ? s.range.toFixed(2) : 'N/A'
            ];
          });
          this.drawTable(doc, statHeaders, statRows, [60, 50, 50, 50, 50, 50, 40, 40, 40]);
        }

        // ============ SECTION 4: CORRELATION ANALYSIS ============
        doc.addPage();
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('4. Correlation Analysis');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#444444').text('Pearson correlation coefficients between all variable pairs:');
        doc.moveDown(0.5);

        if (correlationMatrix) {
          const corrFields = Object.keys(correlationMatrix);
          const corrHeaders = ['Variable', ...corrFields.map(f => this.formatFieldName(f))];
          const corrRows = corrFields.map(f1 =>
            [this.formatFieldName(f1), ...corrFields.map(f2 =>
              correlationMatrix[f1][f2] != null ? correlationMatrix[f1][f2].toFixed(3) : 'N/A'
            )]
          );
          const colWidth = Math.min(80, Math.floor(430 / corrFields.length));
          this.drawTable(doc, corrHeaders, corrRows, [80, ...corrFields.map(() => colWidth)]);

          doc.moveDown(1);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text('Interpretation:');
          doc.moveDown(0.3);
          doc.fontSize(10).fillColor('#444444');

          if (correlationMatrix.productivity_score) {
            const prodCorr = correlationMatrix.productivity_score;
            for (const field in prodCorr) {
              if (field === 'productivity_score') continue;
              const val = prodCorr[field];
              if (val == null) continue;
              const abs = Math.abs(val);
              let strength = 'Weak';
              if (abs > 0.7) strength = 'Strong';
              else if (abs > 0.3) strength = 'Moderate';
              const direction = val > 0 ? 'positive' : 'negative';
              doc.fontSize(9).fillColor('#333333').text(`  ${this.formatFieldName(field)} \u2194 Productivity: Correlation = ${val.toFixed(3)} (${strength} ${direction})`);
            }
          }
        }

        // ============ SECTION 5: REGRESSION ANALYSIS ============
        if (regression) {
          doc.addPage();
          doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('5. Regression Analysis');
          doc.moveDown(0.8);

          this.drawTable(doc,
            ['Property', 'Value'],
            [
              ['Regression Type', 'Simple Linear Regression'],
              ['Independent Variable', regression.independent || 'N/A'],
              ['Dependent Variable', regression.dependent || 'N/A'],
              ['Equation', regression.equation || 'N/A'],
              ['Slope (Coefficient)', regression.slope != null ? regression.slope.toFixed(4) : 'N/A'],
              ['Intercept', regression.intercept != null ? regression.intercept.toFixed(4) : 'N/A']
            ],
            [160, 330]
          );

          doc.moveDown(1);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text('Predicted Values:');
          doc.moveDown(0.3);
          doc.fontSize(9).fillColor('#444444').text(`Using the equation ${regression.equation || 'y = mx + b'}, predicted productivity scores can be calculated for any given ${regression.independent || 'input'} value.`);
        }

        // ============ SECTION 6: PROBABILITY ANALYSIS ============
        if (probabilities) {
          doc.addPage();
          doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('6. Probability Analysis');
          doc.moveDown(0.8);

          this.drawTable(doc,
            ['Outcome', 'Probability'],
            [
              ['High Productivity (Score \u2265 7)', probabilities.highProductivity != null ? `${(probabilities.highProductivity * 100).toFixed(1)}%` : 'N/A'],
              ['Low Productivity (Score \u2264 4)', probabilities.lowProductivity != null ? `${(probabilities.lowProductivity * 100).toFixed(1)}%` : 'N/A'],
              ['Moderate Productivity (4 < Score < 7)', probabilities.highProductivity != null && probabilities.lowProductivity != null
                ? `${((1 - probabilities.highProductivity - probabilities.lowProductivity) * 100).toFixed(1)}%` : 'N/A']
            ],
            [250, 100]
          );

          doc.moveDown(1);
          doc.fontSize(10).fillColor('#444444').text(`Based on the dataset of ${rawRecords.length} records, the probability of achieving high productivity (\u22657) is ${probabilities.highProductivity != null ? (probabilities.highProductivity * 100).toFixed(1) : 'N/A'}%, while low productivity (\u22644) probability is ${probabilities.lowProductivity != null ? (probabilities.lowProductivity * 100).toFixed(1) : 'N/A'}%.`);
        }

        // ============ SECTION 7: MCDA RESULTS ============
        if (mcda && mcda.topPerformers) {
          doc.addPage();
          doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('7. MCDA Results');
          doc.moveDown(0.5);
          doc.fontSize(9).fillColor('#444444').text(`Method: ${mcda.method || 'Weighted Scoring Model'}`);
          doc.moveDown(0.5);

          this.drawTable(doc,
            ['Rank', 'Student ID', 'MCDA Score'],
            mcda.topPerformers.map((p, i) => [
              String(i + 1),
              String(p.studentId),
              p.score != null ? p.score.toFixed(1) : 'N/A'
            ]),
            [100, 100, 150]
          );

          if (weightedIndex) {
            doc.moveDown(1);
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text('Weighted Productivity Index:');
            doc.moveDown(0.3);
            doc.fontSize(10).fillColor('#444444').text(`  Composite Score: ${weightedIndex.average != null ? weightedIndex.average.toFixed(2) : 'N/A'}`);
            doc.fontSize(9).fillColor('#666666').text(`  ${weightedIndex.description || ''}`);
          }
        }

        // ============ SECTION 8: VISUALIZATION DATA ============
        doc.addPage();
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('8. Visualization Data');
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor('#444444').text('Chart data used to render visualizations on the dashboards:');
        doc.moveDown(0.5);

        if (statistics) {
          doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text('Average Metrics (Bar Chart Data):');
          doc.moveDown(0.3);
          const barHeaders = ['Metric', 'Mean'];
          const barRows = Object.keys(statistics).map(f => [this.formatFieldName(f), statistics[f].mean != null ? statistics[f].mean.toFixed(2) : 'N/A']);
          this.drawTable(doc, barHeaders, barRows, [120, 80]);

          doc.moveDown(0.8);

          if (correlationMatrix && correlationMatrix.productivity_score) {
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text('Productivity Correlations (Chart Data):');
            doc.moveDown(0.3);
            const corrHeaders = ['Metric', 'Correlation'];
            const corrRows = Object.keys(correlationMatrix.productivity_score)
              .filter(k => k !== 'productivity_score')
              .map(k => [this.formatFieldName(k), correlationMatrix.productivity_score[k] != null ? correlationMatrix.productivity_score[k].toFixed(3) : 'N/A']);
            this.drawTable(doc, corrHeaders, corrRows, [120, 80]);
          }
        }

        // ============ SECTION 9: AI / ANALYSIS SUMMARY ============
        doc.addPage();
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a1a2e').text('9. AI / Analysis Summary');
        doc.moveDown(1);
        doc.fontSize(11).fillColor('#333333').text(summary || 'Analysis completed successfully.', { align: 'left', lineGap: 6 });
        doc.moveDown(1.5);

        if (insights && insights.length > 0) {
          doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a2e').text('Key Insights');
          doc.moveDown(0.5);
          insights.forEach((insight, i) => {
            doc.fontSize(10).fillColor('#444444').text(`${i + 1}. ${insight}`, { lineGap: 4 });
          });
        }

        if (impactAnalysis) {
          doc.moveDown(1);
          doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a2e').text('Variable Impact Analysis');
          doc.moveDown(0.3);
          doc.fontSize(9).fillColor('#444444').text(`Experiment: Removing "${impactAnalysis.removedVariable}" from the predictive model.`);
          doc.moveDown(0.5);

          if (impactAnalysis.comparisons && impactAnalysis.comparisons.length > 0) {
            const compHeaders = ['Variable', 'Original Corr', 'Post-Removal', 'Change'];
            const compRows = impactAnalysis.comparisons.map(c => [
              c.variable,
              c.before != null ? c.before.toFixed(3) : 'N/A',
              c.after != null ? c.after.toFixed(3) : 'N/A',
              c.change != null ? (c.change > 0 ? '+' : '') + c.change.toFixed(3) : 'N/A'
            ]);
            this.drawTable(doc, compHeaders, compRows, [100, 80, 80, 80]);
          }
          doc.moveDown(0.5);
          doc.fontSize(9).fillColor('#666666').text(`Conclusion: ${impactAnalysis.conclusion || ''}`);
        }

        doc.fontSize(8).fillColor('#aaaaaa').text('— End of Report —', { align: 'center' });

        doc.end();

        stream.on('finish', async () => {
          const report = await Report.create({
            user_id: reportData.userId || null,
            dataset_id: reportData.dataset.id,
            report_path: filePath
          });
          resolve(report);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateExcel(reportData) {
    const workbook = new ExcelJS.Workbook();
    const { dataset, rawRecords, statistics, correlationMatrix, probabilities, regression, mcda, insights, impactAnalysis, summary } = reportData;

    // Sheet 1: Dataset Overview
    const overviewSheet = workbook.addWorksheet('Dataset Overview');
    overviewSheet.columns = [{ header: 'Property', key: 'prop', width: 25 }, { header: 'Value', key: 'val', width: 50 }];
    overviewSheet.addRow({ prop: 'Dataset Name', val: dataset.name });
    overviewSheet.addRow({ prop: 'Dataset ID', val: dataset.id });
    overviewSheet.addRow({ prop: 'Record Count', val: dataset.recordCount });
    overviewSheet.addRow({ prop: 'Upload Date', val: dataset.uploadDate ? new Date(dataset.uploadDate).toLocaleDateString() : 'N/A' });
    overviewSheet.addRow({ prop: 'Analysis Type', val: dataset.analysisType });
    overviewSheet.addRow({ prop: 'Report Generated', val: new Date(reportData.generatedAt).toLocaleString() });
    overviewSheet.getRow(1).font = { bold: true };

    // Sheet 2: Raw Data
    const rawSheet = workbook.addWorksheet('Raw Data');
    const rawFields = ['screen_time', 'social_media_usage', 'study_time', 'sleep_duration', 'device_type', 'apps_used', 'productivity_score'];
    rawSheet.columns = rawFields.map(f => ({ header: this.formatFieldName(f), key: f, width: 16 }));
    rawRecords.forEach(r => rawSheet.addRow(r));

    // Sheet 3: Processed Data
    const procSheet = workbook.addWorksheet('Processed Data');
    const numFields = ['screen_time', 'social_media_usage', 'study_time', 'sleep_duration', 'apps_used', 'productivity_score'];
    procSheet.columns = numFields.map(f => ({ header: this.formatFieldName(f), key: f, width: 16 }));
    rawRecords.forEach(r => {
      const row = {};
      numFields.forEach(f => { row[f] = r[f]; });
      procSheet.addRow(row);
    });

    // Sheet 4: Statistical Analysis
    if (statistics) {
      const statSheet = workbook.addWorksheet('Statistical Analysis');
      statSheet.columns = [
        { header: 'Metric', key: 'metric', width: 22 },
        { header: 'Mean', key: 'mean', width: 12 },
        { header: 'Median', key: 'median', width: 12 },
        { header: 'Mode', key: 'mode', width: 14 },
        { header: 'Variance', key: 'variance', width: 12 },
        { header: 'Std Dev', key: 'stdDev', width: 12 },
        { header: 'Min', key: 'min', width: 10 },
        { header: 'Max', key: 'max', width: 10 },
        { header: 'Range', key: 'range', width: 10 }
      ];
      for (const f in statistics) {
        const s = statistics[f];
        statSheet.addRow({
          metric: this.formatFieldName(f),
          mean: s.mean != null ? Number(s.mean.toFixed(2)) : 'N/A',
          median: s.median != null ? Number(s.median.toFixed(2)) : 'N/A',
          mode: s.mode != null ? (Array.isArray(s.mode) ? s.mode.join(', ') : Number(s.mode)) : 'N/A',
          variance: s.variance != null ? Number(s.variance.toFixed(2)) : 'N/A',
          stdDev: s.stdDev != null ? Number(s.stdDev.toFixed(2)) : 'N/A',
          min: s.min != null ? Number(s.min.toFixed(2)) : 'N/A',
          max: s.max != null ? Number(s.max.toFixed(2)) : 'N/A',
          range: s.range != null ? Number(s.range.toFixed(2)) : 'N/A'
        });
      }
      statSheet.getRow(1).font = { bold: true };
    }

    // Sheet 5: Correlation Analysis
    if (correlationMatrix) {
      const corrSheet = workbook.addWorksheet('Correlation Analysis');
      const corrFields = Object.keys(correlationMatrix);
      corrSheet.addRow(['Variable', ...corrFields.map(f => this.formatFieldName(f))]);
      corrFields.forEach(f1 => {
        corrSheet.addRow([this.formatFieldName(f1), ...corrFields.map(f2 =>
          correlationMatrix[f1][f2] != null ? Number(correlationMatrix[f1][f2].toFixed(3)) : 'N/A'
        )]);
      });
      corrSheet.getRow(1).font = { bold: true };

      if (correlationMatrix.productivity_score) {
        corrSheet.addRow([]);
        corrSheet.addRow(['Interpretation']);
        corrSheet.addRow(['Variable Pair', 'Correlation', 'Strength', 'Direction']);
        const prodCorr = correlationMatrix.productivity_score;
        for (const f in prodCorr) {
          if (f === 'productivity_score') continue;
          const val = prodCorr[f];
          if (val == null) continue;
          const abs = Math.abs(val);
          let strength = 'Weak';
          if (abs > 0.7) strength = 'Strong';
          else if (abs > 0.3) strength = 'Moderate';
          const direction = val > 0 ? 'Positive' : 'Negative';
          corrSheet.addRow([this.formatFieldName(f), Number(val.toFixed(3)), strength, direction]);
        }
      }
    }

    // Sheet 6: Regression Analysis
    if (regression) {
      const regSheet = workbook.addWorksheet('Regression Analysis');
      regSheet.addRow(['Property', 'Value']);
      regSheet.addRow(['Type', 'Simple Linear Regression']);
      regSheet.addRow(['Independent Variable', regression.independent || 'N/A']);
      regSheet.addRow(['Dependent Variable', regression.dependent || 'N/A']);
      regSheet.addRow(['Equation', regression.equation || 'N/A']);
      regSheet.addRow(['Slope', regression.slope != null ? Number(regression.slope.toFixed(4)) : 'N/A']);
      regSheet.addRow(['Intercept', regression.intercept != null ? Number(regression.intercept.toFixed(4)) : 'N/A']);
      regSheet.getRow(1).font = { bold: true };

      regSheet.addRow([]);
      regSheet.addRow(['Predicted Values']);
      regSheet.addRow(['Input', 'Predicted Output']);
      for (let i = 1; i <= 10; i++) {
        const predicted = regression.slope != null && regression.intercept != null
          ? Number((regression.slope * i + regression.intercept).toFixed(2))
          : 'N/A';
        regSheet.addRow([i, predicted]);
      }
    }

    // Sheet 7: Probability Results
    if (probabilities) {
      const probSheet = workbook.addWorksheet('Probability Results');
      probSheet.addRow(['Outcome', 'Probability']);
      probSheet.addRow(['High Productivity (Score >= 7)', probabilities.highProductivity != null ? `${(probabilities.highProductivity * 100).toFixed(1)}%` : 'N/A']);
      probSheet.addRow(['Low Productivity (Score <= 4)', probabilities.lowProductivity != null ? `${(probabilities.lowProductivity * 100).toFixed(1)}%` : 'N/A']);
      probSheet.addRow(['Moderate Productivity', probabilities.highProductivity != null && probabilities.lowProductivity != null
        ? `${((1 - probabilities.highProductivity - probabilities.lowProductivity) * 100).toFixed(1)}%` : 'N/A']);
      probSheet.getRow(1).font = { bold: true };
    }

    // Sheet 8: MCDA Results
    if (mcda) {
      const mcdaSheet = workbook.addWorksheet('MCDA Results');
      mcdaSheet.addRow(['Method', mcda.method || 'Weighted Scoring Model']);
      mcdaSheet.addRow([]);
      mcdaSheet.addRow(['Rank', 'Student ID', 'Score']);
      if (mcda.topPerformers && Array.isArray(mcda.topPerformers)) {
        mcda.topPerformers.forEach((p, i) => {
          mcdaSheet.addRow([i + 1, p.studentId, p.score != null ? Number(p.score.toFixed(1)) : 'N/A']);
        });
      }
      mcdaSheet.getRow(3).font = { bold: true };
    }

    // Sheet 9: Visualization Data
    const visSheet = workbook.addWorksheet('Visualization Data');
    visSheet.addRow(['=== Average Metrics (Bar Chart) ===']);
    if (statistics) {
      visSheet.addRow(['Metric', 'Mean', 'Median', 'Std Dev']);
      for (const f in statistics) {
        const s = statistics[f];
        visSheet.addRow([this.formatFieldName(f), s.mean, s.median, s.stdDev]);
      }
    }
    visSheet.addRow([]);
    visSheet.addRow(['=== Productivity Correlations (Chart) ===']);
    if (correlationMatrix && correlationMatrix.productivity_score) {
      visSheet.addRow(['Variable', 'Correlation']);
      for (const f in correlationMatrix.productivity_score) {
        if (f === 'productivity_score') continue;
        visSheet.addRow([this.formatFieldName(f), correlationMatrix.productivity_score[f]]);
      }
    }

    // Sheet 10: Summary
    const sumSheet = workbook.addWorksheet('Summary');
    sumSheet.addRow(['TechLytics Analytics Report Summary']);
    sumSheet.addRow([]);
    sumSheet.addRow(['Generated:', new Date(reportData.generatedAt).toLocaleString()]);
    sumSheet.addRow(['Dataset:', dataset.name]);
    sumSheet.addRow(['Records:', dataset.recordCount]);
    sumSheet.addRow([]);
    sumSheet.addRow(['AI Analysis Summary:']);
    sumSheet.addRow([summary || 'Analysis completed successfully.']);
    sumSheet.addRow([]);
    if (insights && insights.length > 0) {
      sumSheet.addRow(['Key Insights:']);
      insights.forEach((ins, i) => sumSheet.addRow([`${i + 1}. ${ins}`]));
    }

    const fileName = `Dataset_Report_${dataset.id}.xlsx`;
    const filePath = path.join('reports', fileName);

    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);

    const report = await Report.create({
      user_id: reportData.userId || null,
      dataset_id: reportData.dataset.id,
      report_path: filePath
    });

    return report;
  }

  // Helper: format field name
  formatFieldName(field) {
    return field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // Helper: draw a table on the PDF
  drawTable(doc, headers, rows, colWidths) {
    const startX = 50;
    let startY = doc.y;
    const rowHeight = 18;
    const fontSize = 8;

    if (startY > 700) {
      doc.addPage();
      startY = 50;
    }

    // Draw header
    doc.fontSize(fontSize).font('Helvetica-Bold').fillColor('#1a1a2e');
    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x, startY, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });
    startY += rowHeight;

    // Draw rows
    doc.font('Helvetica').fillColor('#333333');
    rows.forEach((row) => {
      if (startY > 720) {
        doc.addPage();
        startY = 50;
        doc.fontSize(fontSize).font('Helvetica-Bold').fillColor('#1a1a2e');
        x = startX;
        headers.forEach((header, i) => {
          doc.text(header, x, startY, { width: colWidths[i], align: 'left' });
          x += colWidths[i];
        });
        startY += rowHeight;
        doc.font('Helvetica').fillColor('#333333');
      }
      x = startX;
      row.forEach((cell, i) => {
        doc.text(String(cell), x, startY, { width: colWidths[i], align: 'left' });
        x += colWidths[i];
      });
      startY += rowHeight;
    });
    doc.y = startY + 5;
  }

  async getUserReports(userId) {
    return await Report.findAll({ where: { user_id: userId }, order: [['generated_at', 'DESC']] });
  }
}

module.exports = new ReportService();