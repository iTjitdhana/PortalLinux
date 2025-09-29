const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const optionalAuthMiddleware = require('../middleware/optionalAuth');

// Use optional authentication for testing
router.use(optionalAuthMiddleware);

// Upload image for subsystem
router.post('/subsystem/:subsystemId', uploadController.upload.single('image'), uploadController.uploadSubsystemImage);

// Get all uploaded images
router.get('/images', uploadController.getUploadedImages);

// Delete image
router.delete('/images/:filename', uploadController.deleteImage);

module.exports = router;
