const Trip = require('../models/Trip');
const User = require('../models/User');

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('userId', 'name email')
      .populate('applicants.userId', 'name email createdAt')
      .sort({ createdAt: -1 });
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
    console.log('Admin fetching trip by ID:', req.params.id);
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('applicants.userId', 'name email');
    
    if (!trip) {
      console.log('Trip not found');
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    console.log('Trip found:', trip.title);
    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all applicants for admin's trips
exports.getTripApplicants = async (req, res) => {
  try {
    // Get all trips created by admin users
    const adminTrips = await Trip.find({
      applicants: { $exists: true, $not: { $size: 0 } }
    })
    .populate('userId', 'name email')
    .populate('applicants.userId', 'name email createdAt')
    .sort({ createdAt: -1 });

    // Filter trips to only show those with applicants
    const tripsWithApplicants = adminTrips.filter(trip => trip.applicants && trip.applicants.length > 0);

    res.json(tripsWithApplicants);
  } catch (error) {
    console.error('Error fetching trip applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm trip for a user notification with price
exports.confirmTripWithPrice = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { confirmedPrice, currency, message } = req.body;

    if (!confirmedPrice || confirmedPrice <= 0) {
      return res.status(400).json({ message: 'Valid price is required' });
    }

    // Find the admin notification
    const Notification = require('../models/Notification');
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    // Find the trip
    const trip = await Trip.findById(notification.trip?.id || notification.trip);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Find the user (customer)
    const customerId = notification.customer?.id || notification.customer;
    const user = await User.findById(customerId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Mark admin notification as confirmed
    notification.read = true;
    notification.readAt = new Date();
    notification.confirmed = true;
    notification.confirmedPrice = confirmedPrice;
    await notification.save();

    // Send payment notification to user
    const userNotification = {
      id: `confirm_${notificationId}_${Date.now()}`,
      type: 'trip_approved',
      title: '✅ Trip Confirmed! Proceed to Payment',
      message: message || `Great news! Your trip "${trip.title}" has been confirmed by our team. The total price is ${currency || trip.currency || 'INR'} ${confirmedPrice}. Please proceed to payment to secure your booking.`,
      tripId: trip._id,
      isRead: false,
      actionRequired: true,
      actionType: 'payment',
      actionData: {
        tripTitle: trip.title,
        destination: trip.destinationCity && trip.destinationCountry
          ? `${trip.destinationCity}, ${trip.destinationCountry}`
          : trip.destination || 'TBD',
        basePrice: confirmedPrice,
        currency: currency || trip.currency || 'INR',
        image: trip.mainImage || trip.coverImage || trip.image || '',
        applicantId: notification.customer?.applicantId || null
      }
    };

    user.notifications.push(userNotification);
    await user.save();

    res.json({ success: true, message: 'Trip confirmed and user notified successfully' });
  } catch (error) {
    console.error('Error confirming trip:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateApplicantStatus = async (req, res) => {
  try {
    const { tripId, applicantId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const trip = await Trip.findById(tripId).populate('userId', 'name email');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const applicant = trip.applicants.id(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    const oldStatus = applicant.status;
    applicant.status = status;
    await trip.save();

    // Send notification to user when status changes
    if (oldStatus !== status && applicant.userId) {
      const user = await User.findById(applicant.userId);
      if (user) {
        const notificationId = `${tripId}_${applicant._id}_${Date.now()}`;
        
        if (status === 'approved') {
          // Create approval notification with payment request
          const notification = {
            id: notificationId,
            type: 'trip_approved',
            title: 'Trip Application Approved! 🎉',
            message: `Congratulations! Your application for "${trip.title}" has been approved. Please proceed with payment to confirm your booking.`,
            tripId: trip._id,
            isRead: false,
            actionRequired: true,
            actionType: 'payment',
            actionData: {
              tripTitle: trip.title,
              destination: trip.destination,
              basePrice: trip.basePrice,
              currency: trip.currency || 'USD',
              preferredStartDate: applicant.preferredStartDate,
              preferredEndDate: applicant.preferredEndDate,
              applicantId: applicant._id, // Include applicant ID for reference
              image: trip.image // Include trip image
            }
          };
          
          user.notifications.push(notification);
        } else if (status === 'rejected') {
          // Create rejection notification
          const notification = {
            id: notificationId,
            type: 'trip_rejected',
            title: 'Trip Application Update',
            message: `Unfortunately, your application for "${trip.title}" was not approved this time. Don't worry, there are many other amazing trips waiting for you!`,
            tripId: trip._id,
            isRead: false,
            actionRequired: false
          };
          
          user.notifications.push(notification);
        }
        
        await user.save();
        console.log(`Notification sent to user ${user.name} for trip ${trip.title}`);
      }
    }

    // Populate the updated trip with user details
    const updatedTrip = await Trip.findById(tripId)
      .populate('userId', 'name email')
      .populate('applicants.userId', 'name email createdAt');

    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating applicant status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
