require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./models/Trip');
const User = require('./models/User');

const createHimalayaTrek = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found. Please create admin user first.');
      process.exit(1);
    }

    // Check if Himalaya trek already exists
    const existingTrek = await Trip.findOne({ title: 'Himalaya Adventure Trek' });
    if (existingTrek) {
      console.log('Himalaya Adventure Trek already exists');
      process.exit(0);
    }

    // Create Himalaya Adventure Trek
    const himalayaTrek = new Trip({
      title: 'Himalaya Adventure Trek',
      tripId: 'HIMALAYA001',
      destination: 'Himachal Pradesh, India',
      city: 'Manali',
      category: 'Trekking',
      shortDescription: 'Experience the breathtaking beauty of the Himalayas with our adventure trek package.',
      detailedDescription: 'Embark on an unforgettable journey through the majestic Himalayas. This comprehensive trekking package includes visits to Hampta Pass, Beas Kund, Triund, and the stunning valleys of Himachal Pradesh. Perfect for adventure enthusiasts seeking to explore pristine mountain landscapes, ancient temples, and local culture.',
      
      // Duration and Dates
      duration: { days: 7, nights: 6 },
      availableDates: [
        { startDate: new Date('2024-04-15'), endDate: new Date('2024-04-21') },
        { startDate: new Date('2024-05-01'), endDate: new Date('2024-05-07') },
        { startDate: new Date('2024-05-15'), endDate: new Date('2024-05-21') }
      ],
      
      // Pricing
      basePrice: 25000,
      childPrice: 18000,
      currency: 'INR',
      
      // Travel Details
      departureCity: 'Delhi',
      arrivalDestination: 'Manali',
      groupSizeLimit: 15,
      minimumTravelers: 4,
      totalSeats: 15,
      
      // Itinerary
      itinerary: [
        {
          dayNumber: 1,
          dayTitle: 'Arrival in Manali',
          dayDescription: 'Arrive in Manali, check-in to hotel, acclimatization walk around Mall Road',
          activitiesIncluded: 'Hotel check-in, local sightseeing, briefing session',
          mealsIncluded: 'Dinner',
          accommodationDetails: '3-star hotel in Manali'
        },
        {
          dayNumber: 2,
          dayTitle: 'Manali to Hampta Pass Base Camp',
          dayDescription: 'Drive to Jobra, trek to Chika via Hampta Pass base camp',
          activitiesIncluded: 'Trekking, photography, nature walks',
          mealsIncluded: 'Breakfast, Lunch, Dinner',
          accommodationDetails: 'Camping at Chika'
        },
        {
          dayNumber: 3,
          dayTitle: 'Hampta Pass Crossing',
          dayDescription: 'Cross the famous Hampta Pass (4270m) and descend to Shea Goru',
          activitiesIncluded: 'High altitude trekking, mountain photography',
          mealsIncluded: 'Breakfast, Lunch, Dinner',
          accommodationDetails: 'Camping at Shea Goru'
        },
        {
          dayNumber: 4,
          dayTitle: 'Shea Goru to Chatru',
          dayDescription: 'Trek through the barren landscape of Spiti valley to Chatru',
          activitiesIncluded: 'Desert mountain trekking, landscape photography',
          mealsIncluded: 'Breakfast, Lunch, Dinner',
          accommodationDetails: 'Camping at Chatru'
        },
        {
          dayNumber: 5,
          dayTitle: 'Chatru to Chandratal Lake',
          dayDescription: 'Visit the pristine Chandratal Lake, one of the most beautiful lakes in Himalayas',
          activitiesIncluded: 'Lake visit, photography, stargazing',
          mealsIncluded: 'Breakfast, Lunch, Dinner',
          accommodationDetails: 'Camping near Chandratal'
        },
        {
          dayNumber: 6,
          dayTitle: 'Chandratal to Manali',
          dayDescription: 'Drive back to Manali via Rohtang Pass, evening at leisure',
          activitiesIncluded: 'Scenic drive, Rohtang Pass visit, shopping',
          mealsIncluded: 'Breakfast, Lunch',
          accommodationDetails: 'Hotel in Manali'
        },
        {
          dayNumber: 7,
          dayTitle: 'Departure',
          dayDescription: 'Check-out from hotel, departure to Delhi',
          activitiesIncluded: 'Check-out, departure',
          mealsIncluded: 'Breakfast',
          accommodationDetails: 'N/A'
        }
      ],
      
      // Places to Visit
      placesToVisit: [
        {
          placeName: 'Hampta Pass',
          shortDescription: 'High altitude mountain pass at 4270m offering stunning views',
          image: '/images/himalaya/hampta.jpeg'
        },
        {
          placeName: 'Chandratal Lake',
          shortDescription: 'Pristine high altitude lake known as Moon Lake',
          image: '/images/himalaya/valley.jpg'
        },
        {
          placeName: 'Triund Hill',
          shortDescription: 'Popular trekking destination with panoramic mountain views',
          image: '/images/himalaya/triund.jpeg'
        },
        {
          placeName: 'Kedarnath Valley',
          shortDescription: 'Sacred valley with ancient temples and spiritual significance',
          image: '/images/himalaya/kedar.png'
        }
      ],
      
      // Services Included
      includedServices: {
        flights: false,
        hotelAccommodation: true,
        localTransport: true,
        tourGuide: true,
        entryTickets: true,
        meals: true,
        activities: true
      },
      
      // Excluded Services
      excludedServices: [
        'International flights',
        'Personal expenses',
        'Travel insurance',
        'Tips and gratuities',
        'Alcoholic beverages'
      ],
      
      // Activities
      activitiesIncluded: {
        adventure: true,
        cultural: true,
        sightseeing: true,
        waterSports: false,
        trekking: true
      },
      
      // Accommodation
      accommodation: {
        hotelName: 'Mountain View Resort & Camps',
        hotelRating: '3 Star',
        roomType: 'Twin Sharing',
        location: 'Manali & Camping Sites'
      },
      
      // Gallery Images from Himalaya folder
      galleryImages: [
        '/images/himalaya/him2.jpeg',
        '/images/himalaya/him3.jpg',
        '/images/himalaya/him4.jpeg',
        '/images/himalaya/hampta.jpeg',
        '/images/himalaya/bhamhatal.jpeg',
        '/images/himalaya/triund.jpeg',
        '/images/himalaya/kedar.png',
        '/images/himalaya/valley.jpg'
      ],
      coverImage: '/images/himalaya/him2.jpeg',
      mainImage: '/images/himalaya/him2.jpeg',
      bestPhotoIndex: 0,
      
      // System fields
      userId: adminUser._id,
      status: 'Active',
      isFeatured: true,
      bookingDeadline: new Date('2024-03-31'),
      
      // Additional trek-specific fields
      destinationCountry: 'India',
      destinationCity: 'Manali',
      tripType: 'Adventure Trekking',
      highlights: 'Hampta Pass crossing, Chandratal Lake, High altitude trekking, Spiti valley experience, Professional guides, All meals included',
      
      createdAt: new Date()
    });

    await himalayaTrek.save();
    console.log('Himalaya Adventure Trek created successfully!');
    console.log('Trip ID:', himalayaTrek.tripId);
    console.log('Featured:', himalayaTrek.isFeatured);
    console.log('Images:', himalayaTrek.galleryImages.length, 'photos added');
    
  } catch (error) {
    console.error('Error creating Himalaya trek:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createHimalayaTrek();