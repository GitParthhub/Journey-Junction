const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
  try {
    const trip = new Trip({ ...req.body, userId: req.user.id });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeaturedTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isFeatured: true })
      .populate('userId', 'name')
      .populate('applicants.userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('applicants.userId', 'name email');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a featured trip
exports.applyForTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (!trip.isFeatured) return res.status(400).json({ message: 'Can only apply for featured trips' });
    
    // Check if user already applied
    const existingApplication = trip.applicants.find(
      applicant => applicant.userId.toString() === req.user.id
    );
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this trip' });
    }
    
    // Extract application data from request body
    const { preferredStartDate, preferredEndDate, message } = req.body;
    
    // Add user to applicants with their preferred dates
    trip.applicants.push({ 
      userId: req.user.id,
      preferredStartDate,
      preferredEndDate,
      message
    });
    await trip.save();
    
    const updatedTrip = await Trip.findById(trip._id)
      .populate('userId', 'name')
      .populate('applicants.userId', 'name email');
    
    res.json({ message: 'Application submitted successfully', trip: updatedTrip });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
