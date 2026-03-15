const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const User = require('../models/User');
const photoService = require('../services/photoService');

exports.createTrip = async (req, res) => {
  try {
    console.log('Creating trip with data:', req.body);
    
    // Determine destination for photo search
    const destination = req.body.destinationCity || req.body.destination || 'travel';
    console.log('Fetching photos for destination:', destination);
    
    // Fetch destination photos automatically
    let destinationPhotos = [];
    let mainImage = null;
    
    try {
      destinationPhotos = await photoService.getDestinationPhotos(destination, 3);
      mainImage = photoService.getBestPhoto(destinationPhotos)?.url;
      console.log('Photos fetched successfully:', destinationPhotos.length);
    } catch (photoError) {
      console.error('Error fetching photos:', photoError);
      // Continue with trip creation even if photo fetch fails
    }
    
    // Create trip with user ID and photos
    const trip = new Trip({ 
      ...req.body, 
      userId: req.user.id,
      status: 'planned', // Set default status for user trips
      images: destinationPhotos.map(photo => photo.url), // Store all photo URLs
      mainImage: mainImage, // Store the best photo as main image
      bestPhotoIndex: 0 // First photo is the best
    });
    
    await trip.save();
    console.log('Trip saved successfully:', trip._id);
    
    // Get user details
    const user = await User.findById(req.user.id);
    console.log('User found:', user.name);
    
    // Create notification for admins
    try {
      const notification = new Notification({
        type: 'trip_request',
        priority: 'high',
        title: `New Trip Request from ${user.name}`,
        message: `${user.name} has requested a custom trip plan to ${req.body.destinationCity || req.body.destination || 'destination'}. Please review the details and contact them to finalize the itinerary.`,
        customer: {
          id: user._id,
          name: user.name,
          email: user.email || req.body.email,
          phone: req.body.mobileNumber
        },
        trip: {
          id: trip._id,
          title: req.body.title,
          destination: req.body.destinationCity ? `${req.body.destinationCity}, ${req.body.destinationCountry}` : req.body.destination,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          numberOfTravelers: req.body.numberOfTravelers,
          budgetRange: req.body.budgetRange === 'Custom' ? `₹${req.body.customBudget}` : req.body.budgetRange,
          tripType: req.body.tripType
        }
      });
      
      await notification.save();
      console.log('Notification created successfully');
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the trip creation if notification fails
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Trip request created successfully! Our team will review your request and contact you soon.',
      trip 
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating trip request', 
      error: error.message 
    });
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
    console.log('Fetching trip by ID:', req.params.id);
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

// Refresh photos for a trip
exports.refreshTripPhotos = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    // Check authorization
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Determine destination for photo search
    const destination = trip.destinationCity || trip.destination || trip.title;
    console.log('Refreshing photos for destination:', destination);
    
    // Fetch new destination photos
    const destinationPhotos = await photoService.getDestinationPhotos(destination, 3);
    const mainImage = photoService.getBestPhoto(destinationPhotos)?.url;
    
    // Update trip with new photos
    trip.images = destinationPhotos.map(photo => photo.url);
    trip.mainImage = mainImage;
    trip.bestPhotoIndex = 0;
    
    await trip.save();
    
    res.json({ 
      message: 'Photos refreshed successfully', 
      trip,
      photosCount: destinationPhotos.length 
    });
  } catch (error) {
    console.error('Error refreshing photos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
