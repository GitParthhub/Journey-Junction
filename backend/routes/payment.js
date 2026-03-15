const express = require('express');
const router = express.Router();
const { processPayment, getPaymentHistory, getAdminNotifications, markAdminNotificationRead } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/process', auth, processPayment);
router.get('/history', auth, getPaymentHistory);
router.get('/admin/notifications', auth, getAdminNotifications);
router.patch('/admin/notifications/:notificationId/read', auth, markAdminNotificationRead);

module.exports = router;