const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // This directory should exist in your server root.
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the date to prevent overwriting.
  }
});

const upload = multer({ storage: storage });

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageUrl = `http://localhost:5200/uploads/${req.file.filename}`;
  
  res.json({ success: true, data: { url: imageUrl } });
});

module.exports = router;
