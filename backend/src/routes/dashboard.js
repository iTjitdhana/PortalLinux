const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const optionalAuthMiddleware = require('../middleware/optionalAuth');

// All dashboard routes use optional authentication (for testing)
router.use(optionalAuthMiddleware);

// Dashboard overview
router.get('/overview', dashboardController.getOverview);

// Statistics
router.get('/stats', dashboardController.getStats);

// Recent activities
router.get('/activities', dashboardController.getRecentActivities);

// Charts data
router.get('/charts/users', dashboardController.getUserChartData);
router.get('/charts/orders', dashboardController.getOrderChartData);
router.get('/charts/revenue', dashboardController.getRevenueChartData);

// Notifications
router.get('/notifications', dashboardController.getNotifications);
router.patch('/notifications/:id/read', dashboardController.markNotificationAsRead);
router.patch('/notifications/read-all', dashboardController.markAllNotificationsAsRead);

// Subsystems
router.get('/subsystems', dashboardController.getSubsystems);
router.get('/subsystems/:id', dashboardController.getSubsystemById);

// Departments
router.get('/departments', dashboardController.getDepartments);

// Announcements
router.get('/announcements', dashboardController.getAnnouncements);
router.post('/announcements', dashboardController.createAnnouncement);

// Events
router.get('/events', dashboardController.getEvents);

module.exports = router;
