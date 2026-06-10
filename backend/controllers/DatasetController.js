const DatasetService = require('../services/DatasetService');

class DatasetController {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const { dataset_name } = req.body;
      const user_id = req.user ? req.user.id : null;
      const dataset = await DatasetService.uploadDataset(user_id, req.file, dataset_name || req.file.originalname);
      res.status(201).json(dataset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async manualEntry(req, res) {
    try {
      const { dataset_name, records } = req.body;
      const user_id = req.user ? req.user.id : null;
      const dataset = await DatasetService.manualEntry(user_id, dataset_name, records);
      res.status(201).json(dataset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const datasets = await DatasetService.getUserDatasets(req.user.id);
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const dataset = await DatasetService.getDatasetWithRecords(req.params.id);
      if (!dataset) return res.status(404).json({ error: 'Dataset not found' });
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await DatasetService.deleteDataset(req.params.id, req.user.id);
      res.json({ message: 'Dataset deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DatasetController();
