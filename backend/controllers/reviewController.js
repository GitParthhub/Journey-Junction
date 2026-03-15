const Review = require('../models/Review');
const User = require('../models/User');

exports.submitReview = async (req, res) => {
  try {
    const { guideId, guideTitle, rating, comment } = req.body;
    if (!guideId || !rating || !comment) {
      return res.status(400).json({ message: 'guideId, rating, and comment are required' });
    }

    const user = await User.findById(req.user.id).select('name');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existing = await Review.findOne({ guideId, userId: req.user.id });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ message: 'Review updated', review: existing });
    }

    const review = await Review.create({
      guideId,
      guideTitle,
      userId: req.user.id,
      userName: user.name,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ guideId: req.params.guideId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
