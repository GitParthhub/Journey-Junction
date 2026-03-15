const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  // Basic Trip Information
  title: { type: String, required: true },
  tripId: { type: String, unique: true },
  destination: { type: String },
  city: { type: String },
  category: { type: String, enum: ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Trekking'], default: 'Adventure' },
  shortDescription: { type: String },
  detailedDescription: { type: String },
  duration: {
    days: { type: Number },
    nights: { type: Number }
  },

  // Travel Details
  departureCity: { type: String },
  arrivalDestination: { type: String },
  availableDates: [{
    startDate: { type: Date },
    endDate: { type: Date }
  }],
  groupSizeLimit: { type: Number },
  minimumTravelers: { type: Number },

  // Pricing Information
  basePrice: { type: Number },
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
  totalSeats: { type: Number },
  bookingDeadline: { type: Date },
  status: { type: String, enum: ['Active', 'Inactive', 'planned', 'ongoing', 'completed'], default: 'Active' },
  isFeatured: { type: Boolean, default: false },

  // User Trip Planning Fields
  destinationCountry: { type: String },
  destinationCity: { type: String },
  tripType: { type: String },
  numberOfTravelers: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  tripDuration: { type: Number },
  flexibleDates: { type: String },
  
  // Traveler Details
  fullName: { type: String },
  email: { type: String },
  mobileNumber: { type: String },
  ageGroup: { type: String },
  nationality: { type: String },
  passportAvailable: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },
  
  // Budget Preferences
  budgetRange: { type: String },
  customBudget: { type: Number },
  preferredCurrency: { type: String },
  budgetType: { type: String },
  
  // Accommodation Preferences
  hotelCategory: { type: String },
  roomType: { type: String },
  bedPreference: { type: String },
  mealPlan: { type: String },
  
  // Transportation Preferences
  internationalFlightRequired: { type: String },
  preferredDepartureCity: { type: String },
  preferredAirline: { type: String },
  localTransportType: { type: String },
  
  // Activities & Experiences
  selectedActivities: [{ type: String }],
  specialActivitiesRequested: { type: String },
  
  // Itinerary Preferences
  numberOfDestinations: { type: Number },
  mustVisitPlaces: { type: String },
  dailyActivityLevel: { type: String },
  
  // Special Requests
  dietaryRequirements: { type: String },
  accessibilityNeeds: { type: String },
  celebrationType: { type: String },
  specialNotes: { type: String },
  
  // Document Upload
  passportCopy: { type: String },
  idProof: { type: String },
  visaDocument: { type: String },
  
  // Payment Information
  paymentMethod: { type: String },
  advancePaymentAmount: { type: Number },
  billingAddress: { type: String },
  
  // Legacy fields for backward compatibility
  description: { type: String }, // Old description field
  highlights: { type: String }, // Trip highlights
  bestPhotoIndex: { type: Number, default: 0 }, // Index of best photo
  mainImage: { type: String }, // Best photo URL
  numberOfDays: { type: Number }, // Old numberOfDays field
  budget: { type: Number }, // Old budget field
  image: { type: String }, // Old single image field
  images: [{ type: String }], // Old images array
  activities: [{ type: String }], // Old activities array
  
  // System fields
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
    preferredStartDate: { type: Date },
    preferredEndDate: { type: Date },
    message: { type: String },
    paymentDetails: {
      method: { type: String },
      transactionId: { type: String },
      amount: { type: Number },
      currency: { type: String },
      paidAt: { type: Date }
    }
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
