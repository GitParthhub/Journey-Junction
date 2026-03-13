const express = require('express');
const router = express.Router();
const { getAllTrips, getAllUsers, toggleFeaturedTrip, deleteUser, getStats, createTripAsAdmin, updateTripAsAdmin, deleteTripAsAdmin, getTripById } = require('../controllers/adminController');
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

module.exports = router;
