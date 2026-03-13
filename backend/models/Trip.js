const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  // Basic Trip Information
  title: { type: String, required: true },
  tripId: { type: String, unique: true },
  destination: { type: String, required: true },
  city: { type: String },
  category: { type: String, enum: ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Trekking'], default: 'Adventure' },
  shortDescription: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true }
  },

  // Travel Details
  departureCity: { type: String, required: true },
  arrivalDestination: { type: String, required: true },
  availableDates: [{
    startDate: { type: Date },
    endDate: { type: Date }
  }],
  groupSizeLimit: { type: Number, required: true },
  minimumTravelers: { type: Number, required: true },

  // Pricing Information
  basePrice: { type: Number, required: true },
  childPrice: { type: Number },
  discountPrice: { type: Number },
  taxes: { type: Number },
  currency: { type: String, default: 'USD' },

  // Itinerary Section
  itinerary: [{
    dayNumber: { type: Number },
    dayTitle: { type: String },
    dayDescription: { type: String },
    activitiesIncluded: { type: String },
    mealsIncluded: { type: String },
    accommodationDetails: { type: String }
  }],

  // Places to Visit
  placesToVisit: [{
    placeName: { type: String },
    shortDescription: { type: String },
    image: { type: String }
  }],

  // Included Services
  includedServices: {
    flights: { type: Boolean, default: false },
    hotelAccommodation: { type: Boolean, default: false },
    localTransport: { type: Boolean, default: false },
    tourGuide: { type: Boolean, default: false },
    entryTickets: { type: Boolean, default: false },
    meals: { type: Boolean, default: false },
    activities: { type: Boolean, default: false }
  },

  // Excluded Services
  excludedServices: [{ type: String }],

  // Activities Included
  activitiesIncluded: {
    adventure: { type: Boolean, default: false },
    cultural: { type: Boolean, default: false },
    sightseeing: { type: Boolean, default: false },
    waterSports: { type: Boolean, default: false },
    trekking: { type: Boolean, default: false }
  },

  // Accommodation Details
  accommodation: {
    hotelName: { type: String },
    hotelRating: { type: String },
    roomType: { type: String },
    location: { type: String }
  },

  // Media / Gallery
  coverImage: { type: String },
  galleryImages: [{ type: String }],

  // Booking Settings
  totalSeats: { type: Number, required: true },
  bookingDeadline: { type: Date },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  isFeatured: { type: Boolean, default: false },

  // Legacy fields for backward compatibility
  description: { type: String }, // Old description field
  detailedDescription: { type: String }, // Enhanced description
  highlights: { type: String }, // Trip highlights
  bestPhotoIndex: { type: Number, default: 0 }, // Index of best photo
  mainImage: { type: String }, // Best photo URL
  numberOfDays: { type: Number }, // Old numberOfDays field
  budget: { type: Number }, // Old budget field
  image: { type: String }, // Old single image field
  images: [{ type: String }], // Old images array
  activities: [{ type: String }], // Old activities array
  startDate: { type: Date }, // Legacy start date
  endDate: { type: Date }, // Legacy end date
  
  // System fields
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    preferredStartDate: { type: Date },
    preferredEndDate: { type: Date },
    message: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to generate tripId if not provided
tripSchema.pre('save', function(next) {
  if (!this.tripId) {
    this.tripId = 'TRIP' + Date.now().toString().slice(-6);
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
