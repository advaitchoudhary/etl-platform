const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Dataset = require('../models/Dataset');
const DataProcessor = require('../utils/dataProcessor');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.xlsx') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and XLSX files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload and process file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
    const processedData = await DataProcessor.processFile(req.file.path, fileType);

    const dataset = new Dataset({
      user: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      columns: processedData.columns,
      rowCount: processedData.rowCount,
      previewData: processedData.previewData,
      processedData: processedData.processedFilePath,
      status: 'completed'
    });

    await dataset.save();
    res.status(201).json(dataset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all datasets for current user
router.get('/', auth, async (req, res) => {
  try {
    const datasets = await Dataset.find({ user: req.user._id })
      .select('-processedData -previewData')
      .sort({ createdAt: -1 });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching datasets' });
  }
});

// Get single dataset with preview data
router.get('/:id', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dataset' });
  }
});

// Download processed dataset
router.get('/:id/download', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    res.download(dataset.processedData, `processed_${dataset.originalName}`);
  } catch (error) {
    res.status(500).json({ error: 'Error downloading dataset' });
  }
});

// Delete dataset
router.delete('/:id', auth, async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Delete associated files
    if (fs.existsSync(dataset.processedData)) {
      fs.unlinkSync(dataset.processedData);
    }

    await dataset.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting dataset' });
  }
});

module.exports = router;