const mongoose = require('mongoose');
const Trip = require('./models/Trip');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/journey-junction', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createRajasthanTrip = async () => {
  try {
    await connectDB();

    const rajasthanTrip = new Trip({
      title: 'Rajasthan Royal Heritage Tour',
      destination: 'Rajasthan, India',
      destinationCity: 'Jaipur',
      destinationCountry: 'India',
      shortDescription: 'Explore the royal heritage of Rajasthan with majestic forts, palaces, desert safari, lakes, and vibrant cultural experiences.',
      description: 'Rajasthan is known for its rich history, royal architecture, colorful culture, and desert landscapes. This trip covers major cities like Jaipur, Jodhpur, Jaisalmer, and Udaipur. Travelers will experience grand forts, beautiful palaces, desert camel safaris, traditional Rajasthani culture, and scenic lakes.',
      detailedDescription: 'Experience the grandeur of Rajasthan with this comprehensive 7-day royal heritage tour. Visit magnificent forts like Amber Fort and Mehrangarh Fort, explore the golden city of Jaisalmer, enjoy desert camel safaris, and witness the romantic lakes of Udaipur. This journey combines history, culture, adventure, and luxury.',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-21'),
      budget: 30000,
      customBudget: 30000,
      budgetRange: '₹18,000 - ₹55,000',
      preferredCurrency: 'INR',
      currency: 'INR',
      basePrice: 30000,
      image: '/images/rajasthan/S6COMtJXx-Fvz5cvFIWlrOgT7u1J7XU_kUdjGkvxC5P0g2bdLqaoFcpo1rQMr0CS-ziXhO-qLo9xc0u_9GV4wjEV5pTr2_npMML9N6HVm14.jpeg',
      images: [
        '/images/rajasthan/h71soQPJS_ZzkQ9GduAHl4Go_e7gUqPKZ_-UfjpCoWrH1Wu8zpILpQ1m9UgTVLElKaLVCHxbHJtI9_O7_hs1x2Vj4QWUJJSllgWNJ6kBJHM.jpeg', // Hawa Mahal
        '/images/rajasthan/rajasthan1.jpeg',
        '/images/rajasthan/-zgcUxh4KMeyquudTNwFqaJ7SIxIa6eW7PutoEOk2jZuL-nFeMwxWoHgp9e6kJi7LrLMmtDtAK1Eaw6QdTZIvSXidZYu8nRvKQ1NrmBvi0w.jpeg',
        '/images/rajasthan/kc997oKX_Rfk8Xlbg21RfRlKF0m3DjmiYfDY0Iq2lAQQdjuND3yVLTEtHp7hv100dxzWq_8_BvYHvZy3HpVfSB3sCP2_AswPnnGv5XIlEM8.jpeg',
        '/images/rajasthan/mJhhnB4vUqAFJ2OYJRHS3LlL391K-PVwZVcpVSqYHQMxrZzhIBHVBcBsTxWuoTD4jymZBSv_1UG95Su0f3T3Roq9516gFbgr6BaYKeM7fq4.jpeg',
        '/images/rajasthan/XS2aDXkV0VjtL_Jg7AbUEMOjwCSBR-yTVCMs722zI-NDtrGM_0p-kiumaYtVHxlFXCAnvGSEEpUMKF9opM9mWKXYhutLQWpnLuBF2fIoLXg.jpeg'
      ],
      galleryImages: [
        '/images/rajasthan/h71soQPJS_ZzkQ9GduAHl4Go_e7gUqPKZ_-UfjpCoWrH1Wu8zpILpQ1m9UgTVLElKaLVCHxbHJtI9_O7_hs1x2Vj4QWUJJSllgWNJ6kBJHM.jpeg', // Hawa Mahal
        '/images/rajasthan/rajasthan1.jpeg',
        '/images/rajasthan/-zgcUxh4KMeyquudTNwFqaJ7SIxIa6eW7PutoEOk2jZuL-nFeMwxWoHgp9e6kJi7LrLMmtDtAK1Eaw6QdTZIvSXidZYu8nRvKQ1NrmBvi0w.jpeg',
        '/images/rajasthan/kc997oKX_Rfk8Xlbg21RfRlKF0m3DjmiYfDY0Iq2lAQQdjuND3yVLTEtHp7hv100dxzWq_8_BvYHvZy3HpVfSB3sCP2_AswPnnGv5XIlEM8.jpeg',
        '/images/rajasthan/mJhhnB4vUqAFJ2OYJRHS3LlL391K-PVwZVcpVSqYHQMxrZzhIBHVBcBsTxWuoTD4jymZBSv_1UG95Su0f3T3Roq9516gFbgr6BaYKeM7fq4.jpeg',
        '/images/rajasthan/XS2aDXkV0VjtL_Jg7AbUEMOjwCSBR-yTVCMs722zI-NDtrGM_0p-kiumaYtVHxlFXCAnvGSEEpUMKF9opM9mWKXYhutLQWpnLuBF2fIoLXg.jpeg'
      ],
      activities: [
        'Fort and palace sightseeing',
        'Desert camel safari',
        'Cultural dance show',
        'Boat ride at Lake Pichola',
        'Local shopping experience',
        'Elephant ride at Amber Fort',
        'Sunset viewing at Nahargarh Fort',
        'Traditional Rajasthani dinner'
      ],
      duration: {
        days: 7,
        nights: 6
      },
      category: 'Cultural',
      status: 'planned',
      isFeatured: true,
      userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Default admin user ID
      highlights: 'Visit 4 royal cities, Desert camping, Camel safari, Royal palaces, Cultural shows, Traditional cuisine, Lake Pichola boat ride, Handicraft shopping',
      specialNotes: 'Best time to visit: October to March. Includes desert camping experience in Jaisalmer. Cultural programs and traditional Rajasthani cuisine included.',
      mustVisitPlaces: 'Hawa Mahal, Amber Fort, Mehrangarh Fort, Jaisalmer Fort, Sam Sand Dunes, Lake Pichola, City Palace Udaipur',
      numberOfDays: 7,
      tripDuration: 7,
      numberOfTravelers: 4,
      groupSizeLimit: 20,
      minimumTravelers: 4,
      totalSeats: 20,
      bookingDeadline: new Date('2024-12-08'),
      departureCity: 'Jaipur',
      arrivalDestination: 'Udaipur',
      coverImage: '/images/rajasthan/S6COMtJXx-Fvz5cvFIWlrOgT7u1J7XU_kUdjGkvxC5P0g2bdLqaoFcpo1rQMr0CS-ziXhO-qLo9xc0u_9GV4wjEV5pTr2_npMML9N6HVm14.jpeg',
      placesToVisit: [
        {
          placeName: 'Hawa Mahal',
          shortDescription: 'Palace of Winds - iconic pink sandstone structure',
          image: '/images/rajasthan/h71soQPJS_ZzkQ9GduAHl4Go_e7gUqPKZ_-UfjpCoWrH1Wu8zpILpQ1m9UgTVLElKaLVCHxbHJtI9_O7_hs1x2Vj4QWUJJSllgWNJ6kBJHM.jpeg'
        },
        {
          placeName: 'Amber Fort',
          shortDescription: 'Magnificent hilltop fort with elephant rides',
          image: '/images/rajasthan/rajasthan1.jpeg'
        },
        {
          placeName: 'Mehrangarh Fort',
          shortDescription: 'Imposing fort overlooking the blue city',
          image: '/images/rajasthan/-zgcUxh4KMeyquudTNwFqaJ7SIxIa6eW7PutoEOk2jZuL-nFeMwxWoHgp9e6kJi7LrLMmtDtAK1Eaw6QdTZIvSXidZYu8nRvKQ1NrmBvi0w.jpeg'
        },
        {
          placeName: 'Jaisalmer Fort',
          shortDescription: 'Golden fort in the heart of Thar Desert',
          image: '/images/rajasthan/kc997oKX_Rfk8Xlbg21RfRlKF0m3DjmiYfDY0Iq2lAQQdjuND3yVLTEtHp7hv100dxzWq_8_BvYHvZy3HpVfSB3sCP2_AswPnnGv5XIlEM8.jpeg'
        },
        {
          placeName: 'Lake Pichola',
          shortDescription: 'Romantic lake with palace views in Udaipur',
          image: '/images/rajasthan/mJhhnB4vUqAFJ2OYJRHS3LlL391K-PVwZVcpVSqYHQMxrZzhIBHVBcBsTxWuoTD4jymZBSv_1UG95Su0f3T3Roq9516gFbgr6BaYKeM7fq4.jpeg'
        }
      ],
      includedServices: {
        flights: false,
        hotelAccommodation: true,
        localTransport: true,
        tourGuide: true,
        entryTickets: false,
        meals: true,
        activities: true
      },
      excludedServices: [
        'Travel to Jaipur / from Udaipur',
        'Personal expenses',
        'Entry tickets to monuments',
        'Lunch and dinner (unless specified)',
        'Tips and gratuities'
      ],
      activitiesIncluded: {
        adventure: true,
        cultural: true,
        sightseeing: true,
        waterSports: false,
        trekking: false
      },
      accommodation: {
        hotelName: 'Heritage Hotels & Desert Camp',
        hotelRating: '4 Star',
        roomType: 'Deluxe Rooms',
        location: 'City Center & Desert'
      },
      hotelCategory: '4 Star',
      roomType: 'Deluxe',
      mealPlan: 'Breakfast Included',
      localTransportType: 'Private AC Vehicle',
      selectedActivities: [
        'Fort sightseeing',
        'Desert safari',
        'Cultural shows',
        'Boat rides',
        'Shopping tours'
      ],
      dailyActivityLevel: 'Moderate',
      tripType: 'Cultural Heritage'
    });

    await rajasthanTrip.save();
    console.log('✅ Rajasthan Royal Heritage Trip created successfully!');
    console.log('Trip ID:', rajasthanTrip._id);
    console.log('Title:', rajasthanTrip.title);
    console.log('Destination:', rajasthanTrip.destination);
    console.log('Duration:', rajasthanTrip.duration.days, 'days');
    console.log('Budget:', `₹${rajasthanTrip.budget.toLocaleString('en-IN')}`);
    console.log('Featured:', rajasthanTrip.isFeatured ? 'Yes' : 'No');
    console.log('Status:', rajasthanTrip.status);

  } catch (error) {
    console.error('❌ Error creating Rajasthan trip:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createRajasthanTrip();