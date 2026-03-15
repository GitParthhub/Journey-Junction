const express = require('express');
const router = express.Router();
const { getAllTrips, getAllUsers, toggleFeaturedTrip, deleteUser, getStats, createTripAsAdmin, updateTripAsAdmin, deleteTripAsAdmin, getTripById, getTripApplicants, updateApplicantStatus, confirmTripWithPrice } = require('../controllers/adminController');
const { getAllNotifications, markAsRead, markAllAsRead, deleteNotification, getNotificationStats } = require('../controllers/notificationController');
const { getAllReviews } = require('../controllers/reviewController');
const { auth, adminAuth } = require('../middleware/auth');

// Statistics and user management
router.get('/trips', auth, adminAuth, getAllTrips);
router.get('/users', auth, adminAuth, getAllUsers);
router.patch('/trips/:id/featured', auth, adminAuth, toggleFeaturedTrip);
router.delete('/users/:id', auth, adminAuth, deleteUser);
router.get('/stats', auth, adminAuth, getStats);

// Admin trip management
router.post('/trips', auth, adminAuth, createTripAsAdmin);
router.get('/trips/:id', auth, adminAuth, getTripById);
router.put('/trips/:id', auth, adminAuth, updateTripAsAdmin);
router.delete('/trips/:id', auth, adminAuth, deleteTripAsAdmin);

// Trip applicants management
router.get('/applicants', auth, adminAuth, getTripApplicants);
router.patch('/trips/:tripId/applicants/:applicantId', auth, adminAuth, updateApplicantStatus);

// Admin notifications
router.get('/notifications', auth, adminAuth, getAllNotifications);
router.get('/notifications/stats', auth, adminAuth, getNotificationStats);
router.patch('/notifications/:id/read', auth, adminAuth, markAsRead);
router.patch('/notifications/read-all', auth, adminAuth, markAllAsRead);
router.delete('/notifications/:id', auth, adminAuth, deleteNotification);

// Confirm trip with price and notify user
router.patch('/notifications/:notificationId/confirm', auth, adminAuth, confirmTripWithPrice);

// Reviews
router.get('/reviews', auth, adminAuth, getAllReviews);

module.exports = router;
