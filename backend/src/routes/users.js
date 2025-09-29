const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Validation middleware
const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role').isIn(['user', 'admin', 'moderator']).withMessage('Invalid role')
];

const updateUserValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin', 'moderator'])
];

// Protected routes (require authentication)
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, userValidation, userController.createUser);
router.put('/:id', authMiddleware, adminMiddleware, updateUserValidation, userController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.patch('/:id/status', authMiddleware, adminMiddleware, userController.updateUserStatus);

// User profile routes
router.get('/profile/me', authMiddleware, userController.getMyProfile);
router.put('/profile/me', authMiddleware, userController.updateMyProfile);

module.exports = router;
