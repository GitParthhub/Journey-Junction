# Journey Junction - Component Cards Overview

## 10 Detailed Component/Card Data Structures

### 1. **Featured Trip Card** (FeaturedTrips.js)
```javascript
const featuredTripCard = {
  id: "trip_001",
  title: "Ultimate Bali Adventure",
  destination: "Bali, Indonesia",
  city: "Ubud",
  category: "Adventure",
  shortDescription: "Experience the magic of Bali with temple visits, rice terraces, and beach relaxation",
  basePrice: 85000,
  currency: "INR",
  duration: { days: 7, nights: 6 },
  totalSeats: 12,
  availableSeats: 8,
  status: "Active",
  isFeatured: true,
  userId: {
    _id: "user_001",
    name: "Priya Sharma",
    email: "priya@example.com"
  },
  galleryImages: [
    "/images/bali.webp",
    "/images/bali-2.jpg",
    "/images/bali-3.jpg",
    "/images/ubud-bali.jpg"
  ],
  activitiesIncluded: {
    sightseeingTours: true,
    culturalTours: true,
    beachActivities: true,
    adventureSports: false,
    foodExperience: true
  },
  applicants: [
    {
      _id: "app_001",
      userId: { _id: "user_002", name: "Rahul Kumar", email: "rahul@example.com" },
      preferredStartDate: "2024-03-15",
      preferredEndDate: "2024-03-22",
      message: "Excited to explore Bali's culture and beaches!",
      appliedAt: "2024-02-01T10:30:00Z",
      status: "pending"
    }
  ],
  createdAt: "2024-01-15T08:00:00Z"
}
```

### 2. **Dashboard Trip Card** (Dashboard.js)
```javascript
const dashboardTripCard = {
  _id: "trip_002",
  title: "Himalayan Trek Experience",
  destination: "Manali, Himachal Pradesh",
  destinationCity: "Manali",
  destinationCountry: "India",
  description: "A challenging yet rewarding trek through the beautiful Himalayan landscapes",
  status: "planned",
  startDate: "2024-04-10",
  endDate: "2024-04-17",
  budget: 45000,
  customBudget: 45000,
  preferredCurrency: "INR",
  budgetRange: "₹40k - ₹50k",
  budgetType: "Standard",
  mainImage: "/images/him2.jpeg",
  images: [
    "/images/him2.jpeg",
    "/images/him3.jpg",
    "/images/him4.jpeg",
    "/images/triund.jpeg"
  ],
  bestPhotoIndex: 0,
  isFeatured: false,
  userId: "user_003",
  createdAt: "2024-01-20T14:15:00Z"
}
```

### 3. **Travel Guide Card** (TravelGuides.js)
```javascript
const travelGuideCard = {
  id: 1,
  title: "The Ultimate Backpacking Guide to Southeast Asia",
  category: "Backpacking",
  emoji: "🎒",
  readTime: "12 min read",
  image: "/images/bali.webp",
  excerpt: "Everything you need to know about travelling through Thailand, Vietnam, Cambodia, and Indonesia on a budget — from visa tips to hidden gems.",
  tags: ["Budget Travel", "Asia", "Backpacking"],
  author: {
    name: "Travel Expert",
    avatar: "TE",
    expertise: "Southeast Asia Specialist"
  },
  publishedDate: "2024-01-10",
  views: 2450,
  likes: 189,
  difficulty: "Beginner",
  estimatedCost: "₹80,000 - ₹1,20,000",
  bestTimeToVisit: "November - March"
}
```

### 4. **Payment Processor Card** (PaymentProcessor.js)
```javascript
const paymentCard = {
  orderId: "ORD1706789123456",
  merchantId: "JOURNEY_JUNCTION",
  amount: 85000,
  currency: "INR",
  description: "Payment for Ultimate Bali Adventure",
  customerName: "Amit Patel",
  customerEmail: "amit@example.com",
  customerPhone: "+91 9876543210",
  timestamp: "2024-02-01T15:30:00Z",
  paymentMethod: "UPI",
  transactionId: "TXN1706789123456ABC",
  status: "success",
  gatewayResponse: {
    bankName: "HDFC Bank",
    paymentMode: "UPI",
    securityLevel: "256-bit SSL",
    processingTime: "3.2 seconds"
  },
  breakdown: {
    tripCost: 85000,
    serviceFee: 0,
    gatewayFee: 0,
    taxes: 0,
    totalAmount: 85000
  }
}
```

### 5. **Admin Panel Trip Card** (AdminPanel.js)
```javascript
const adminTripCard = {
  _id: "trip_003",
  title: "Romantic Paris Getaway",
  destination: "Paris, France",
  city: "Paris",
  category: "Honeymoon",
  userId: {
    _id: "user_004",
    name: "Sarah Johnson",
    email: "sarah@example.com"
  },
  basePrice: 150000,
  currency: "INR",
  duration: { days: 5, nights: 4 },
  totalSeats: 6,
  status: "Active",
  isFeatured: true,
  galleryImages: [
    "/images/paris.webp",
    "/images/paris-2.jpg",
    "/images/notre-dame-de-paris-cathedral-paris-france.webp",
    "/images/montmartre.jpeg"
  ],
  applicants: [
    {
      _id: "app_002",
      userId: { _id: "user_005", name: "Vikram Singh", email: "vikram@example.com" },
      preferredStartDate: "2024-05-01",
      preferredEndDate: "2024-05-06",
      message: "Planning honeymoon trip to Paris",
      appliedAt: "2024-02-05T09:15:00Z",
      status: "approved"
    }
  ],
  createdAt: "2024-01-25T11:20:00Z"
}
```

### 6. **Plan Trip Form Card** (PlanTrip.js)
```javascript
const planTripFormData = {
  // Basic Trip Information
  title: "Summer Beach Vacation",
  destinationCountry: "Thailand",
  destinationCity: "Phuket",
  tripType: "Family",
  numberOfTravelers: 4,
  startDate: "2024-06-15",
  endDate: "2024-06-22",
  flexibleDates: "no",
  
  // Traveler Details
  fullName: "Rajesh Gupta",
  email: "rajesh.gupta@email.com",
  mobileNumber: "+91 9876543210",
  ageGroup: "36-45",
  nationality: "Indian",
  passportAvailable: "yes",
  emergencyContactName: "Sunita Gupta",
  emergencyContactNumber: "+91 9876543211",
  
  // Budget Preferences
  budgetRange: "₹2L – ₹5L",
  customBudget: null,
  preferredCurrency: "INR",
  budgetType: "Standard",
  
  // Accommodation Preferences
  hotelCategory: "4 Star",
  roomType: "Family",
  bedPreference: "King Bed",
  mealPlan: "Half Board",
  
  // Transportation Preferences
  internationalFlightRequired: "yes",
  preferredDepartureCity: "Mumbai",
  preferredAirline: "Air India",
  localTransportType: "Private Car",
  
  // Activities & Experiences
  selectedActivities: [
    "Beach Activities",
    "Sightseeing Tours",
    "Food & Wine Experience",
    "Cultural Tours"
  ],
  specialActivitiesRequested: "Snorkeling and island hopping tours",
  
  // Special Requests
  dietaryRequirements: "Vegetarian",
  celebrationType: "None",
  specialNotes: "Family with 2 children (ages 8 and 12)"
}
```

### 7. **User Profile Card** (AdminPanel.js - Users Tab)
```javascript
const userProfileCard = {
  _id: "user_006",
  name: "Ananya Reddy",
  email: "ananya.reddy@email.com",
  role: "user",
  createdAt: "2024-01-10T12:00:00Z",
  profileImage: null,
  preferences: {
    preferredDestinations: ["Europe", "Southeast Asia"],
    budgetRange: "₹1L – ₹2L",
    travelStyle: "Adventure",
    groupSize: "2-4 people"
  },
  statistics: {
    tripsCreated: 3,
    tripsAppliedTo: 7,
    tripsCompleted: 2,
    totalSpent: 180000
  },
  lastLogin: "2024-02-01T08:30:00Z",
  isActive: true,
  verificationStatus: {
    email: true,
    phone: true,
    identity: false
  }
}
```

### 8. **Notification Card** (AdminPanel.js - Notifications)
```javascript
const notificationCard = {
  id: "notif_001",
  type: "payment_success",
  title: "Payment Received",
  message: "Payment of ₹85,000 received for 'Ultimate Bali Adventure' from Amit Patel",
  timestamp: "2024-02-01T15:30:00Z",
  read: false,
  priority: "high",
  data: {
    tripId: "trip_001",
    tripTitle: "Ultimate Bali Adventure",
    userId: "user_007",
    userName: "Amit Patel",
    amount: 85000,
    currency: "INR",
    paymentMethod: "UPI",
    transactionId: "TXN1706789123456ABC"
  },
  actions: [
    {
      label: "View Trip",
      action: "navigate",
      target: "/admin/trips/trip_001"
    },
    {
      label: "Mark as Read",
      action: "mark_read",
      target: "notif_001"
    }
  ]
}
```

### 9. **Review Card** (AdminPanel.js - Reviews Modal)
```javascript
const reviewCard = {
  _id: "review_001",
  userName: "Priya Sharma",
  userEmail: "priya@example.com",
  guideTitle: "The Ultimate Backpacking Guide to Southeast Asia",
  guideId: 1,
  rating: 5,
  comment: "Excellent guide! Helped me plan my entire Southeast Asia trip. The budget breakdown and visa information were particularly useful.",
  createdAt: "2024-01-28T16:45:00Z",
  helpful: 23,
  verified: true,
  tripCompleted: true,
  photos: [
    "/images/user-review-1.jpg",
    "/images/user-review-2.jpg"
  ],
  tags: ["Helpful", "Detailed", "Budget-friendly"],
  adminResponse: null
}
```

### 10. **Statistics Dashboard Card** (AdminPanel.js - Stats Tab)
```javascript
const statisticsCard = {
  totalUsers: 1247,
  totalTrips: 89,
  featuredTrips: 12,
  adminUsers: 3,
  monthlyGrowth: {
    users: 15.2,
    trips: 8.7,
    revenue: 22.3
  },
  revenueStats: {
    totalRevenue: 2450000,
    monthlyRevenue: 380000,
    averageTripValue: 95000,
    currency: "INR"
  },
  popularDestinations: [
    { name: "Bali, Indonesia", count: 15, percentage: 16.9 },
    { name: "Paris, France", count: 12, percentage: 13.5 },
    { name: "Manali, India", count: 10, percentage: 11.2 },
    { name: "Dubai, UAE", count: 8, percentage: 9.0 }
  ],
  userActivity: {
    activeUsers: 892,
    newRegistrations: 45,
    tripApplications: 156,
    completedTrips: 23
  },
  systemHealth: {
    uptime: "99.8%",
    responseTime: "1.2s",
    errorRate: "0.1%",
    lastUpdated: "2024-02-01T18:00:00Z"
  }
}
```

## NEW COMPONENT: **Destination Explorer Card**

### 11. **Destination Explorer Card** (New Component)
```javascript
const destinationExplorerCard = {
  _id: "dest_001",
  name: "Santorini, Greece",
  country: "Greece",
  region: "Mediterranean",
  coordinates: {
    latitude: 36.3932,
    longitude: 25.4615
  },
  description: "A stunning Greek island known for its white-washed buildings, blue-domed churches, and breathtaking sunsets over the Aegean Sea.",
  highlights: [
    "Iconic blue-domed churches",
    "Spectacular sunset views",
    "Volcanic beaches",
    "Traditional Greek cuisine",
    "Charming villages"
  ],
  images: {
    hero: "/images/santorini-hero.jpg",
    gallery: [
      "/images/santorini-sunset.jpg",
      "/images/santorini-village.jpg",
      "/images/santorini-beach.jpg",
      "/images/santorini-food.jpg"
    ]
  },
  bestTimeToVisit: {
    months: ["April", "May", "September", "October"],
    weather: "Mild temperatures, less crowded",
    season: "Spring & Fall"
  },
  budgetEstimate: {
    budget: { min: 80000, max: 120000 },
    standard: { min: 120000, max: 200000 },
    luxury: { min: 200000, max: 350000 },
    currency: "INR",
    duration: "7 days"
  },
  activities: {
    adventure: ["Volcano hiking", "Scuba diving", "Sailing"],
    cultural: ["Museum visits", "Local cooking classes", "Wine tasting"],
    relaxation: ["Beach lounging", "Spa treatments", "Sunset watching"],
    photography: ["Architecture shots", "Landscape photography", "Golden hour"]
  },
  travelRequirements: {
    visa: "Schengen visa required for Indians",
    vaccination: "No special vaccinations required",
    currency: "Euro (EUR)",
    language: "Greek (English widely spoken)",
    timeZone: "GMT+2"
  },
  localInfo: {
    transportation: {
      airport: "Santorini (Thira) Airport (JTR)",
      localTransport: ["Buses", "Taxis", "Car rental", "ATVs"],
      walkability: "High in main areas"
    },
    accommodation: {
      types: ["Luxury resorts", "Boutique hotels", "Traditional villas", "Budget hostels"],
      averageCost: {
        budget: 3000,
        mid: 8000,
        luxury: 20000,
        currency: "INR",
        per: "night"
      }
    },
    dining: {
      specialties: ["Fresh seafood", "Fava beans", "Assyrtiko wine", "Greek salad"],
      priceRange: "₹1,500 - ₹4,000 per meal",
      diningStyle: ["Tavernas", "Fine dining", "Beachside cafes"]
    }
  },
  statistics: {
    popularity: 9.2,
    safetyRating: 9.5,
    touristRating: 9.0,
    valueForMoney: 7.8,
    totalReviews: 1847,
    averageStay: 5.2
  },
  nearbyAttractions: [
    {
      name: "Mykonos",
      distance: "2 hours by ferry",
      type: "Island"
    },
    {
      name: "Crete",
      distance: "3 hours by ferry",
      type: "Island"
    },
    {
      name: "Athens",
      distance: "1 hour by flight",
      type: "City"
    }
  ],
  availablePackages: [
    {
      id: "pkg_001",
      title: "Romantic Santorini Escape",
      duration: 5,
      price: 145000,
      includes: ["Flights", "Accommodation", "Transfers", "Sunset cruise"]
    },
    {
      id: "pkg_002",
      title: "Greek Island Hopping",
      duration: 10,
      price: 285000,
      includes: ["Multi-island tour", "All transfers", "Guided tours"]
    }
  ],
  weatherData: {
    spring: { temp: "18-24°C", rainfall: "Low", conditions: "Pleasant" },
    summer: { temp: "24-30°C", rainfall: "Very low", conditions: "Hot & dry" },
    autumn: { temp: "20-26°C", rainfall: "Low", conditions: "Ideal" },
    winter: { temp: "12-18°C", rainfall: "Moderate", conditions: "Mild" }
  },
  tags: ["Romantic", "Photography", "Luxury", "Island", "Sunset", "Mediterranean", "Honeymoon"],
  lastUpdated: "2024-02-01T12:00:00Z",
  featured: true,
  trending: true
}
```