


exports.uplode = (req, res) => {
    try {
      const uploadedFile = req.file;
  
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uploadedFile.filename}`;
  
      res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl,
      });
    } catch (error) {
      res.status(500).json({
        error: 'File upload failed',
        details: error.message,
      });
    }
  }