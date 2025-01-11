const express = require('express');
const router = express.Router();
const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  const upload = multer({ storage: storage })

  router.post('/', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      error: 'File upload failed',
      details: error.message,
    });
  }
});



module.exports = router