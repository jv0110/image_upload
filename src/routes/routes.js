const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const UploadController = require('../controllers/uploadController');

router.get('/', (req, res) => {
  return res.status(200).json({
    msg: 'Hello world'
  });
});
router.get('/upload', UploadController.get_images);
router.post('/upload', multer(multerConfig).single('file'), UploadController.upload);
router.delete('/upload', UploadController.remove_image);

module.exports = router;