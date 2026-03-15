const express = require('express');
const router = express.Router();
const { register, login, getProfile, getNotifications, markNotificationRead, getUnreadCount, updateProfile, changePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/change-password', auth, changePassword);
router.get('/notifications', auth, getNotifications);
router.patch('/notifications/:notificationId/read', auth, markNotificationRead);
router.get('/notifications/unread-count', auth, getUnreadCount);

module.exports = router;
