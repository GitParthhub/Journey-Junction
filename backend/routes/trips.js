const express = require('express');
const router = express.Router();
const { createTrip, getMyTrips, getFeaturedTrips, getTripById, updateTrip, deleteTrip, applyForTrip } = require('../controllers/tripController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createTrip);
router.get('/my-trips', auth, getMyTrips);
router.get('/featured', getFeaturedTrips);
router.get('/:id', auth, getTripById);
router.put('/:id', auth, updateTrip);
router.delete('/:id', auth, deleteTrip);
router.post('/:id/apply', auth, applyForTrip);

module.exports = router;
