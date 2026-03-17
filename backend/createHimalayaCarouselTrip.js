const mongoose = require('mongoose');
const Trip = require('./models/Trip');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/journey-junction';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createHimalayaCarouselTrip = async () => {
  try {
    // Sample user ID (replace with actual user ID from your database)
    const sampleUserId = new mongoose.Types.ObjectId();

    const himalayaTrip = new Trip({
      title: "Himalaya Adventure Trek - 5 Photo Carousel",
      destination: "Himachal Pradesh, India",
      destinationCity: "Manali",
      destinationCountry: "India",
      description: "Experience the breathtaking beauty of the Himalayas with our curated 5-photo carousel showcasing the most stunning mountain landscapes.",
      shortDescription: "Stunning Himalaya trek with 5 beautiful mountain views in an auto-rotating carousel",
      detailedDescription: "Embark on an unforgettable journey through the majestic Himalayas. This adventure trek features a carefully curated collection of 5 stunning photographs that automatically rotate every 2 seconds, showcasing the diverse beauty of mountain landscapes including pristine valleys, snow-capped peaks, and serene trekking trails.",
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      duration: {
        days: 7,
        nights: 6
      },
      budget: 25000,
      basePrice: 25000,
      currency: 'INR',
      preferredCurrency: 'INR',
      budgetRange: '₹20,000 - ₹30,000',
      customBudget: 25000,
      category: 'Adventure Trekking',
      status: 'planned',
      isFeatured: true,
      userId: sampleUserId,
      
      // 5 Selected Himalaya Images for Carousel
      images: [
        '/images/himalaya/him2.jpeg',
        '/images/himalaya/him3.jpg',
        '/images/himalaya/hampta.jpeg',
        '/images/himalaya/triund.jpeg',
        '/images/himalaya/valley.jpg'
      ],
      
      galleryImages: [
        '/images/himalaya/him2.jpeg',
        '/images/himalaya/him3.jpg',
        '/images/himalaya/hampta.jpeg',
        '/images/himalaya/triund.jpeg',
        '/images/himalaya/valley.jpg'
      ],
      
      mainImage: '/images/himalaya/him2.jpeg',
      bestPhotoIndex: 0,
      
      activities: [
        'Mountain Trekking',
        'Photography',
        'Camping',
        'Nature Walks',
        'Sunrise Views',
        'Valley Exploration',
        'Adventure Sports'
      ],
      
      itinerary: [
        {
          day: 1,
          title: "Arrival in Manali",
          description: "Check-in and acclimatization",
          activities: ["Hotel check-in", "Local market visit", "Rest"]
        },
        {
          day: 2,
          title: "Trek to Base Camp",
          description: "Start the himalayan adventure",
          activities: ["Morning trek", "Photography session", "Camp setup"]
        },
        {
          day: 3,
          title: "Valley Exploration",
          description: "Explore the beautiful valleys",
          activities: ["Valley trek", "Nature photography", "Local culture"]
        },
        {
          day: 4,
          title: "Peak Ascent",
          description: "Climb to scenic viewpoints",
          activities: ["Peak climbing", "Panoramic views", "Adventure activities"]
        },
        {
          day: 5,
          title: "Triund Trek",
          description: "Famous Triund hill trek",
          activities: ["Triund ascent", "Sunset views", "Camping"]
        },
        {
          day: 6,
          title: "Hampta Pass",
          description: "Cross the famous Hampta Pass",
          activities: ["Pass crossing", "Mountain views", "Photography"]
        },
        {
          day: 7,
          title: "Return Journey",
          description: "Return to Manali and departure",
          activities: ["Descent", "Packing", "Departure"]
        }
      ],
      
      inclusions: [
        "Accommodation in camps/hotels",
        "All meals during trek",
        "Professional trek guide",
        "Trekking equipment",
        "Transportation",
        "Photography assistance"
      ],
      
      exclusions: [
        "Personal expenses",
        "Travel insurance",
        "Tips for guides",
        "Emergency evacuation"
      ],
      
      difficulty: 'Moderate',
      groupSize: {
        min: 4,
        max: 12
      },
      
      highlights: [
        "5 stunning photo locations with auto-carousel",
        "Professional photography guidance",
        "Breathtaking mountain views",
        "Valley exploration",
        "Cultural experiences",
        "Adventure activities"
      ],
      
      requirements: [
        "Good physical fitness",
        "Trekking experience preferred",
        "Proper trekking gear",
        "Medical fitness certificate"
      ],
      
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await himalayaTrip.save();
    console.log('✅ Himalaya Carousel Trip created successfully!');
    console.log('📸 Features 5 selected photos with auto-carousel:');
    console.log('   - him2.jpeg (Main mountain view)');
    console.log('   - him3.jpg (Scenic landscape)');
    console.log('   - hampta.jpeg (Hampta Pass)');
    console.log('   - triund.jpeg (Triund hill)');
    console.log('   - valley.jpg (Beautiful valley)');
    console.log('🔄 Auto-rotates every 2 seconds');
    console.log('Trip ID:', himalayaTrip._id);
    
  } catch (error) {
    console.error('❌ Error creating trip:', error);
  } finally {
    mongoose.connection.close();
  }
};

createHimalayaCarouselTrip();