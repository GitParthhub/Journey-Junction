const Trip = require('../models/Trip');
const User = require('../models/User');

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleFeaturedTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.isFeatured = !trip.isFeatured;
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Trip.deleteMany({ userId: req.params.id });
    await user.deleteOne();
    res.json({ message: 'User and associated trips deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const featuredTrips = await Trip.countDocuments({ isFeatured: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    res.json({ totalUsers, totalTrips, featuredTrips, adminUsers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin trip management functions
exports.createTripAsAdmin = async (req, res) => {
  try {
    console.log('Creating trip with data:', req.body);
    
    // Validate required fields
    const requiredFields = ['title', 'destination', 'shortDescription', 'detailedDescription', 
                           'departureCity', 'arrivalDestination', 'basePrice', 'groupSizeLimit', 
                           'minimumTravelers', 'totalSeats'];
    
    const missingFields = requiredFields.filter(field => {
      if (field === 'duration') {
        return !req.body.duration || !req.body.duration.days || !req.body.duration.nights;
      }
      return !req.body[field];
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }
    
    // Admin-created trips are automatically featured
    const trip = new Trip({ 
      ...req.body, 
      userId: req.user.id,
      isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : true
    });
    
    await trip.save();
    const populatedTrip = await Trip.findById(trip._id).populate('userId', 'name email');
    
    console.log('Trip created successfully:', populatedTrip._id);
    res.status(201).json(populatedTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors,
        error: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Trip ID already exists', 
        error: 'Duplicate trip ID' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating trip', 
      error: error.message 
    });
  }
};

exports.updateTripAsAdmin = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    Object.assign(trip, req.body);
    await trip.save();
    const populatedTrip = await Trip.findById(trip._id).populate('userId', 'name email');
    res.json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTripAsAdmin = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    await trip.deleteOne();
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userId', 'name email');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
