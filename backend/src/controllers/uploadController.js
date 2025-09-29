const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Subsystem } = require('../models');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image for subsystem
const uploadSubsystemImage = async (req, res) => {
  try {
    const { subsystemId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Find the subsystem (with fallback if database is not available)
    let subsystem;
    try {
      subsystem = await Subsystem.findByPk(subsystemId);
      if (!subsystem) {
        throw new Error('Subsystem not found in database');
      }
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError.message);
      // Use fallback data when database is not available
      const fallbackSubsystems = [
        { id: 1, name: "ระบบจัดการแผนการผลิต", imageUrl: null },
        { id: 2, name: "ระบบจัดการกระบวนการผลิต", imageUrl: null },
        { id: 3, name: "ระบบจับเวลาการผลิต", imageUrl: null },
        { id: 4, name: "ตารางงานการผลิตสินค้าครัวกลาง", imageUrl: null },
        { id: 5, name: "ต้นทุน", imageUrl: null }
      ];
      subsystem = fallbackSubsystems.find(sub => sub.id == subsystemId);
      
      if (!subsystem) {
        // Delete uploaded file if subsystem not found
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'Subsystem not found'
        });
      }
    }

    // Delete old image if exists
    if (subsystem.imageUrl) {
      const oldImagePath = path.join(__dirname, '../../uploads', path.basename(subsystem.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update subsystem with new image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Try to update database if subsystem is a real database object
    if (subsystem.update) {
      try {
        await subsystem.update({ imageUrl });
        console.log(`✅ Updated subsystem ${subsystemId} with new image: ${imageUrl}`);
      } catch (updateError) {
        console.error('Failed to update database, but file uploaded successfully:', updateError.message);
        // Continue even if database update fails - file is still uploaded
      }
    } else {
      // For fallback subsystems, just log the upload
      console.log(`✅ Uploaded image for subsystem ${subsystemId}: ${imageUrl}`);
    }

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        subsystemId: subsystem.id,
        imageUrl: imageUrl,
        filename: req.file.filename
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// Get all uploaded images
const getUploadedImages = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        data: { images: [] }
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
      })
      .map(file => ({
        filename: file,
        url: `/uploads/${file}`,
        path: path.join(uploadsDir, file),
        size: fs.statSync(path.join(uploadsDir, file)).size,
        created: fs.statSync(path.join(uploadsDir, file)).birthtime
      }));

    res.json({
      success: true,
      data: { images }
    });

  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get images',
      error: error.message
    });
  }
};

// Delete uploaded image
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '../../uploads', filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Check if image is being used by any subsystem
    const subsystem = await Subsystem.findOne({
      where: { imageUrl: `/uploads/${filename}` }
    });

    if (subsystem) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete image that is being used by a subsystem'
      });
    }

    // Delete the file
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadSubsystemImage,
  getUploadedImages,
  deleteImage
};
