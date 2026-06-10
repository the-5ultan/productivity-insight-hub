const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const { Dataset, DatasetRecord } = require('../models');

class DatasetService {
  async uploadDataset(user_id, file, datasetName) {
    const dataset = await Dataset.create({
      user_id,
      dataset_name: datasetName,
      file_path: file.path
    });

    const records = await this.parseFile(file.path);
    const datasetRecords = records.map(record => ({
      ...record,
      dataset_id: dataset.id
    }));

    await DatasetRecord.bulkCreate(datasetRecords);
    return dataset;
  }

  async parseFile(filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      return this.parseCSV(filePath);
    } else if (ext === 'xlsx' || ext === 'xls') {
      return this.parseExcel(filePath);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(this.mapRecord(data)))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  parseExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data.map(record => this.mapRecord(record));
  }

  mapRecord(data) {
    // Normalizing keys to match model fields
    // Assuming CSV/Excel headers match these or are mapped correctly
    return {
      screen_time: parseFloat(data.screen_time || data['Daily Screen Time'] || 0),
      social_media_usage: parseFloat(data.social_media_usage || data['Social Media Usage'] || 0),
      study_time: parseFloat(data.study_time || data['Online Study Time'] || 0),
      sleep_duration: parseFloat(data.sleep_duration || data['Sleep Duration'] || 0),
      device_type: data.device_type || data['Device Type'] || 'Unknown',
      apps_used: parseInt(data.apps_used || data['Apps Used Daily'] || 0),
      productivity_score: parseFloat(data.productivity_score || data['Productivity Score'] || 0)
    };
  }

  async manualEntry(user_id, datasetName, records) {
    const dataset = await Dataset.create({
      user_id,
      dataset_name: datasetName
    });

    const datasetRecords = records.map(record => ({
      ...record,
      dataset_id: dataset.id
    }));

    await DatasetRecord.bulkCreate(datasetRecords);
    return dataset;
  }

  async getUserDatasets(user_id) {
    return await Dataset.findAll({
      where: { user_id },
      order: [['upload_date', 'DESC']]
    });
  }

  async getDatasetWithRecords(datasetId) {
    return await Dataset.findByPk(datasetId, {
      include: [DatasetRecord]
    });
  }

  async deleteDataset(datasetId, userId) {
    const dataset = await Dataset.findOne({ where: { id: datasetId, user_id: userId } });
    if (!dataset) throw new Error('Dataset not found');
    
    // Delete file if exists
    if (dataset.file_path && fs.existsSync(dataset.file_path)) {
      fs.unlinkSync(dataset.file_path);
    }

    await dataset.destroy();
  }
}

module.exports = new DatasetService();
