const express = require('express');
const router = express.Router();
const multer  = require('multer')
const path = require('path');
const { uplode } = require('../controllers/uploadFileController');



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

  router.post('/', upload.single('file'), uplode);



module.exports = router