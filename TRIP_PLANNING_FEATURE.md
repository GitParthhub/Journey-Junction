# Trip Planning Feature - Implementation Guide

## Overview
Users can now submit comprehensive trip planning requests through a detailed form. When submitted, the system automatically notifies admins to review and contact the user.

## Features Implemented

### 1. Comprehensive Trip Planning Form
Located at: `/plan-trip`

**10 Sections:**
1. **Basic Trip Information**
   - Trip title, destination country/city
   - Trip type (Adventure, Honeymoon, Family, Solo, Group, Cultural)
   - Number of travelers, dates
   - Auto-calculated trip duration
   - Flexible dates option

2. **Traveler Details**
   - Full name, email, mobile number
   - Age group, nationality
   - Passport availability
   - Emergency contact information

3. **Budget Preferences**
   - Budget range (₹50k-₹1L, ₹1L-₹2L, ₹2L-₹5L, Custom)
   - Preferred currency (INR, USD, EUR, GBP)
   - Budget type (Economy, Standard, Luxury)

4. **Accommodation Preferences**
   - Hotel category (3-5 Star, Resort, Homestay)
   - Room type (Single, Double, Family)
   - Bed preference (Twin, King)
   - Meal plan (Breakfast Only, Half Board, Full Board)

5. **Transportation Preferences**
   - International flight requirements
   - Preferred departure city and airline
   - Local transport type (Private Car, Rental Bike, Public Transport, Tour Bus)

6. **Activities & Experiences**
   - Checkbox selection of activities:
     - Sightseeing Tours
     - Adventure Sports
     - Hiking/Trekking
     - Beach Activities
     - Cultural Tours
     - Shopping
     - Food & Wine Experience
     - Photography Tours
   - Special activities text field

7. **Itinerary Preferences**
   - Number of destinations
   - Must-visit places
   - Daily activity level (Relaxed, Moderate, Busy)

8. **Special Requests**
   - Dietary requirements
   - Accessibility needs
   - Celebration type (Birthday, Anniversary, Honeymoon)
   - Special notes

9. **Document Upload**
   - Passport copy
   - ID proof
   - Visa document
   - Files converted to base64 for storage

10. **Payment Information**
    - Payment method (Credit Card, Debit Card, UPI, Net Banking)
    - Advance payment amount
    - Billing address

### 2. Backend Implementation

**New Models:**
- `Notification.js` - Stores admin notifications about trip requests

**Updated Models:**
- `Trip.js` - Added all comprehensive form fields, made admin fields optional

**Updated Controllers:**
- `tripController.js` - Creates notification when user submits trip request

**New Routes:**
- `/api/notifications` - Notification management
- `/api/admin/notifications` - Admin notification endpoints

### 3. Admin Notification System

When a user submits a trip request:
1. Trip is saved to database with status 'planned'
2. Automatic notification created for admins with:
   - User details (name, email, phone)
   - Trip details (destination, dates, travelers, budget, type)
   - Priority: HIGH
   - Type: trip_request

**Admin Notification Endpoints:**
- `GET /api/admin/notifications` - Get all notifications
- `GET /api/admin/notifications/stats` - Get notification statistics
- `PATCH /api/admin/notifications/:id/read` - Mark as read
- `PATCH /api/admin/notifications/read-all` - Mark all as read
- `DELETE /api/admin/notifications/:id` - Delete notification

## How to Use

### For Users:
1. Login to your account
2. Click "Plan Your Trip" button on dashboard
3. Fill out the comprehensive form with your trip details
4. Upload required documents (optional)
5. Click "Create Trip"
6. Success message appears: "Trip request created successfully! Our team will review your request and contact you soon."
7. Redirects to dashboard after 3 seconds

### For Admins:
1. Login to admin account
2. View notifications at `/admin/notifications` (to be implemented in UI)
3. Review trip request details
4. Contact user via email/phone to finalize itinerary
5. Mark notification as read when processed

## Database Schema

### Trip Model - New Fields:
```javascript
{
  // User Trip Planning Fields
  destinationCountry: String,
  destinationCity: String,
  tripType: String,
  numberOfTravelers: Number,
  tripDuration: Number,
  flexibleDates: String,
  
  // Traveler Details
  fullName: String,
  email: String,
  mobileNumber: String,
  ageGroup: String,
  nationality: String,
  passportAvailable: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  
  // Budget Preferences
  budgetRange: String,
  customBudget: Number,
  preferredCurrency: String,
  budgetType: String,
  
  // Accommodation Preferences
  hotelCategory: String,
  roomType: String,
  bedPreference: String,
  mealPlan: String,
  
  // Transportation Preferences
  internationalFlightRequired: String,
  preferredDepartureCity: String,
  preferredAirline: String,
  localTransportType: String,
  
  // Activities & Experiences
  selectedActivities: [String],
  specialActivitiesRequested: String,
  
  // Itinerary Preferences
  numberOfDestinations: Number,
  mustVisitPlaces: String,
  dailyActivityLevel: String,
  
  // Special Requests
  dietaryRequirements: String,
  accessibilityNeeds: String,
  celebrationType: String,
  specialNotes: String,
  
  // Document Upload
  passportCopy: String, // base64
  idProof: String, // base64
  visaDocument: String, // base64
  
  // Payment Information
  paymentMethod: String,
  advancePaymentAmount: Number,
  billingAddress: String
}
```

### Notification Model:
```javascript
{
  type: String, // 'trip_request', 'booking', 'payment', 'general'
  priority: String, // 'low', 'medium', 'high', 'urgent'
  title: String,
  message: String,
  customer: {
    id: ObjectId,
    name: String,
    email: String,
    phone: String
  },
  trip: {
    id: ObjectId,
    title: String,
    destination: String,
    startDate: Date,
    endDate: Date,
    numberOfTravelers: Number,
    budgetRange: String,
    tripType: String
  },
  read: Boolean,
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
cd journey-junction
npm start
```

### Test Flow:
1. Register/Login as regular user
2. Navigate to `/plan-trip`
3. Fill out form with test data
4. Submit form
5. Check console logs for:
   - Trip creation success
   - Notification creation success
6. Login as admin
7. Check notifications (API endpoint or database)

## Troubleshooting

### Server Won't Start:
- Check if port 5000 is in use: `netstat -ano | findstr :5000`
- Kill process: `taskkill /F /PID <PID>`
- Check MongoDB connection in `.env`

### Form Submission Errors:
- Check browser console for detailed error messages
- Verify backend is running on port 5000
- Check MongoDB is connected
- Review backend console logs

### Notifications Not Created:
- Check if Notification model is properly imported
- Verify user is authenticated (token in localStorage)
- Check backend logs for notification creation errors

## Future Enhancements

1. **Admin Notification UI**
   - Notification panel in admin dashboard
   - Real-time notifications with WebSocket
   - Notification badges/counters

2. **Email Notifications**
   - Send email to admin when trip request created
   - Send confirmation email to user

3. **Trip Request Management**
   - Admin can approve/reject requests
   - Status tracking (pending, approved, rejected)
   - Admin can edit and finalize trip details

4. **Enhanced Document Handling**
   - Cloud storage for documents (AWS S3, Cloudinary)
   - Document preview in admin panel
   - Secure document access

## Files Modified/Created

### Backend:
- ✅ `models/Notification.js` (NEW)
- ✅ `models/Trip.js` (UPDATED)
- ✅ `controllers/tripController.js` (UPDATED)
- ✅ `routes/notifications.js` (NEW)
- ✅ `routes/admin.js` (UPDATED)
- ✅ `server.js` (UPDATED)

### Frontend:
- ✅ `pages/PlanTrip.js` (NEW)
- ✅ `pages/PlanTrip.css` (NEW)
- ✅ `pages/Dashboard.js` (UPDATED)
- ✅ `services/api.js` (UPDATED)
- ✅ `App.js` (UPDATED)

## Support

For issues or questions, check:
1. Backend console logs
2. Frontend browser console
3. MongoDB connection status
4. Network tab in browser DevTools

---

**Status:** ✅ Fully Implemented and Ready for Testing
**Last Updated:** 2024
