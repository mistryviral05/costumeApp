


exports.uplode = (req, res) => {
    try {
      const uploadedFile = req.file;
  
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uploadedFile.filename}`;
      // const fileUrl = `https://hnm7m1w1-3002.inc1.devtunnels.ms/uploads/${uploadedFile.filename}`;
  
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