const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createNotification,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats
} = require('../controllers/notificationController');

// All routes require authentication
router.use(auth);

// Get all notifications (admin only)
router.get('/', getAllNotifications);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Create notification
router.post('/', createNotification);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Delete all notifications
router.delete('/', deleteAllNotifications);

module.exports = router;
