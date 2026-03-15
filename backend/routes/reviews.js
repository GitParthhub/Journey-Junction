const express = require('express');
const router = express.Router();
const { submitReview, getReviews, getAllReviews } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

router.post('/', auth, submitReview);
router.get('/all', getReviews); // placeholder — overridden below
router.get('/:guideId', getReviews);

module.exports = router;
