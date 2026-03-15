import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI, tripAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TripDetails.css';

const TripDetails = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      
      // Try admin API first (for admin users or featured trips)
      try {
        response = await adminAPI.getTripById(id);
        console.log('Trip data fetched via admin API:', response.data);
      } catch (adminError) {
        console.log('Admin API failed, trying regular trip API:', adminError.message);
        // Fallback to regular trip API
        response = await tripAPI.getTripById(id);
        console.log('Trip data fetched via trip API:', response.data);
      }
      
      if (response && response.data) {
        setTrip(response.data);
      } else {
        throw new Error('No trip data received');
      }
    } catch (error) {
      console.error('Error fetching trip details:', error);
      setError('Failed to load trip details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    });
    const end = new Date(endDate).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="trip-details">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="trip-details">
        <Navbar />
        <div className="error-container">
          <h2>Trip Not Found</h2>
          <p>{error || 'The requested trip could not be found.'}</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details">
      <Navbar />
      
      <div className="trip-details-container">
        {/* Header Section */}
        <div className="trip-header">
          <div className="trip-header-content">
            <div className="trip-badges">
              {trip.tripType && <span className="badge trip-type">{trip.tripType}</span>}
              <span className={`badge status ${trip.status?.toLowerCase()}`}>
                {trip.status || 'Planned'}
              </span>
              {trip.isFeatured && <span className="badge featured">⭐ Featured</span>}
            </div>
            
            <h1 className="trip-title">{trip.title}</h1>
            <div className="trip-subtitle">
              <span className="trip-destination">📍 {trip.destinationCity && trip.destinationCountry ? `${trip.destinationCity}, ${trip.destinationCountry}` : trip.destination || 'Destination TBD'}</span>
            </div>
          </div>
          
          <div className="trip-actions">
            <button onClick={() => navigate(`/trip/${id}/edit`)} className="btn-edit">
              ✏️ Edit Trip
            </button>
            <button onClick={() => navigate(-1)} className="btn-back">
              ← Back
            </button>
          </div>
        </div>

        <div className="trip-content">
          
          {/* 1. BASIC TRIP INFORMATION */}
          <div className="content-section">
            <h2>1️⃣ Basic Trip Information</h2>
            <div className="info-grid">
              {trip.title && (
                <div className="info-card">
                  <span className="info-label">Trip Title</span>
                  <span className="info-value">{trip.title}</span>
                </div>
              )}
              {trip.destinationCountry && (
                <div className="info-card">
                  <span className="info-label">Destination Country</span>
                  <span className="info-value">{trip.destinationCountry}</span>
                </div>
              )}
              {trip.destinationCity && (
                <div className="info-card">
                  <span className="info-label">Destination City</span>
                  <span className="info-value">{trip.destinationCity}</span>
                </div>
              )}
              {trip.tripType && (
                <div className="info-card">
                  <span className="info-label">Trip Type</span>
                  <span className="info-value">{trip.tripType}</span>
                </div>
              )}
              {trip.numberOfTravelers && (
                <div className="info-card">
                  <span className="info-label">Number of Travelers</span>
                  <span className="info-value">{trip.numberOfTravelers}</span>
                </div>
              )}
              {trip.tripDuration && (
                <div className="info-card">
                  <span className="info-label">Trip Duration</span>
                  <span className="info-value">{trip.tripDuration} Days</span>
                </div>
              )}
              {trip.startDate && trip.endDate && (
                <div className="info-card">
                  <span className="info-label">Travel Dates</span>
                  <span className="info-value">{formatDateRange(trip.startDate, trip.endDate)}</span>
                </div>
              )}
              {trip.flexibleDates && (
                <div className="info-card">
                  <span className="info-label">Flexible Dates</span>
                  <span className="info-value">{trip.flexibleDates === 'yes' ? '✅ Yes' : '❌ No'}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. TRAVELER DETAILS */}
          {trip.fullName && (
            <div className="content-section">
              <h2>2️⃣ Traveler Details</h2>
              <div className="info-grid">
                {trip.fullName && (
                  <div className="info-card">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{trip.fullName}</span>
                  </div>
                )}
                {trip.email && (
                  <div className="info-card">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{trip.email}</span>
                  </div>
                )}
                {trip.mobileNumber && (
                  <div className="info-card">
                    <span className="info-label">Mobile Number</span>
                    <span className="info-value">{trip.mobileNumber}</span>
                  </div>
                )}
                {trip.ageGroup && (
                  <div className="info-card">
                    <span className="info-label">Age Group</span>
                    <span className="info-value">{trip.ageGroup}</span>
                  </div>
                )}
                {trip.nationality && (
                  <div className="info-card">
                    <span className="info-label">Nationality</span>
                    <span className="info-value">{trip.nationality}</span>
                  </div>
                )}
                {trip.passportAvailable && (
                  <div className="info-card">
                    <span className="info-label">Passport Available</span>
                    <span className="info-value">{trip.passportAvailable === 'yes' ? '✅ Yes' : '❌ No'}</span>
                  </div>
                )}
                {trip.emergencyContactName && (
                  <div className="info-card">
                    <span className="info-label">Emergency Contact</span>
                    <span className="info-value">{trip.emergencyContactName}</span>
                  </div>
                )}
                {trip.emergencyContactNumber && (
                  <div className="info-card">
                    <span className="info-label">Emergency Contact Number</span>
                    <span className="info-value">{trip.emergencyContactNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. BUDGET PREFERENCES */}
          {trip.budgetRange && (
            <div className="content-section">
              <h2>3️⃣ Budget Preferences</h2>
              <div className="info-grid">
                {trip.budgetRange && (
                  <div className="info-card highlight">
                    <span className="info-label">Budget Range</span>
                    <span className="info-value">{trip.budgetRange}</span>
                  </div>
                )}
                {trip.customBudget && (
                  <div className="info-card highlight">
                    <span className="info-label">Custom Budget</span>
                    <span className="info-value">₹{trip.customBudget}</span>
                  </div>
                )}
                {trip.preferredCurrency && (
                  <div className="info-card">
                    <span className="info-label">Preferred Currency</span>
                    <span className="info-value">{trip.preferredCurrency}</span>
                  </div>
                )}
                {trip.budgetType && (
                  <div className="info-card">
                    <span className="info-label">Budget Type</span>
                    <span className="info-value">{trip.budgetType}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. ACCOMMODATION PREFERENCES */}
          {(trip.hotelCategory || trip.roomType || trip.mealPlan) && (
            <div className="content-section">
              <h2>4️⃣ Accommodation Preferences</h2>
              <div className="info-grid">
                {trip.hotelCategory && (
                  <div className="info-card">
                    <span className="info-label">Hotel Category</span>
                    <span className="info-value">{trip.hotelCategory}</span>
                  </div>
                )}
                {trip.roomType && (
                  <div className="info-card">
                    <span className="info-label">Room Type</span>
                    <span className="info-value">{trip.roomType}</span>
                  </div>
                )}
                {trip.bedPreference && (
                  <div className="info-card">
                    <span className="info-label">Bed Preference</span>
                    <span className="info-value">{trip.bedPreference}</span>
                  </div>
                )}
                {trip.mealPlan && (
                  <div className="info-card">
                    <span className="info-label">Meal Plan</span>
                    <span className="info-value">{trip.mealPlan}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. TRANSPORTATION PREFERENCES */}
          {(trip.internationalFlightRequired || trip.localTransportType) && (
            <div className="content-section">
              <h2>5️⃣ Transportation Preferences</h2>
              <div className="info-grid">
                {trip.internationalFlightRequired && (
                  <div className="info-card">
                    <span className="info-label">International Flight Required</span>
                    <span className="info-value">{trip.internationalFlightRequired === 'yes' ? '✅ Yes' : '❌ No'}</span>
                  </div>
                )}
                {trip.preferredDepartureCity && (
                  <div className="info-card">
                    <span className="info-label">Preferred Departure City</span>
                    <span className="info-value">{trip.preferredDepartureCity}</span>
                  </div>
                )}
                {trip.preferredAirline && (
                  <div className="info-card">
                    <span className="info-label">Preferred Airline</span>
                    <span className="info-value">{trip.preferredAirline}</span>
                  </div>
                )}
                {trip.localTransportType && (
                  <div className="info-card">
                    <span className="info-label">Local Transport Type</span>
                    <span className="info-value">{trip.localTransportType}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. ACTIVITIES & EXPERIENCES */}
          {(trip.selectedActivities?.length > 0 || trip.specialActivitiesRequested) && (
            <div className="content-section">
              <h2>6️⃣ Activities & Experiences</h2>
              {trip.selectedActivities && trip.selectedActivities.length > 0 && (
                <div className="activities-section">
                  <h3>Selected Activities</h3>
                  <div className="tags-container">
                    {trip.selectedActivities.map((activity, idx) => (
                      <span key={idx} className="activity-tag">{activity}</span>
                    ))}
                  </div>
                </div>
              )}
              {trip.specialActivitiesRequested && (
                <div className="text-section">
                  <h3>Special Activities Requested</h3>
                  <p>{trip.specialActivitiesRequested}</p>
                </div>
              )}
            </div>
          )}

          {/* 7. ITINERARY PREFERENCES */}
          {(trip.numberOfDestinations || trip.mustVisitPlaces || trip.dailyActivityLevel) && (
            <div className="content-section">
              <h2>7️⃣ Itinerary Preferences</h2>
              <div className="info-grid">
                {trip.numberOfDestinations && (
                  <div className="info-card">
                    <span className="info-label">Number of Destinations</span>
                    <span className="info-value">{trip.numberOfDestinations}</span>
                  </div>
                )}
                {trip.dailyActivityLevel && (
                  <div className="info-card">
                    <span className="info-label">Daily Activity Level</span>
                    <span className="info-value">{trip.dailyActivityLevel}</span>
                  </div>
                )}
              </div>
              {trip.mustVisitPlaces && (
                <div className="text-section">
                  <h3>Must Visit Places</h3>
                  <p>{trip.mustVisitPlaces}</p>
                </div>
              )}
            </div>
          )}

          {/* 8. SPECIAL REQUESTS */}
          {(trip.dietaryRequirements || trip.accessibilityNeeds || trip.celebrationType || trip.specialNotes) && (
            <div className="content-section">
              <h2>8️⃣ Special Requests</h2>
              <div className="info-grid">
                {trip.dietaryRequirements && (
                  <div className="info-card">
                    <span className="info-label">Dietary Requirements</span>
                    <span className="info-value">{trip.dietaryRequirements}</span>
                  </div>
                )}
                {trip.accessibilityNeeds && (
                  <div className="info-card">
                    <span className="info-label">Accessibility Needs</span>
                    <span className="info-value">{trip.accessibilityNeeds}</span>
                  </div>
                )}
                {trip.celebrationType && trip.celebrationType !== 'None' && (
                  <div className="info-card highlight">
                    <span className="info-label">Celebration Type</span>
                    <span className="info-value">{trip.celebrationType}</span>
                  </div>
                )}
              </div>
              {trip.specialNotes && (
                <div className="text-section">
                  <h3>Special Notes / Requests</h3>
                  <p>{trip.specialNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* 9. DOCUMENT UPLOAD */}
          {(trip.passportCopy || trip.idProof || trip.visaDocument) && (
            <div className="content-section">
              <h2>9️⃣ Document Upload</h2>
              <div className="documents-grid">
                {trip.passportCopy && (
                  <div className="document-card">
                    <span className="document-icon">📄</span>
                    <span className="document-name">Passport Copy</span>
                    <span className="document-status">✅ Uploaded</span>
                  </div>
                )}
                {trip.idProof && (
                  <div className="document-card">
                    <span className="document-icon">📄</span>
                    <span className="document-name">ID Proof</span>
                    <span className="document-status">✅ Uploaded</span>
                  </div>
                )}
                {trip.visaDocument && (
                  <div className="document-card">
                    <span className="document-icon">📄</span>
                    <span className="document-name">Visa Document</span>
                    <span className="document-status">✅ Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 10. PAYMENT INFORMATION */}
          {(trip.paymentMethod || trip.advancePaymentAmount || trip.billingAddress) && (
            <div className="content-section">
              <h2>🔟 Payment Information</h2>
              <div className="info-grid">
                {trip.paymentMethod && (
                  <div className="info-card">
                    <span className="info-label">Payment Method</span>
                    <span className="info-value">{trip.paymentMethod}</span>
                  </div>
                )}
                {trip.advancePaymentAmount && (
                  <div className="info-card highlight">
                    <span className="info-label">Advance Payment Amount</span>
                    <span className="info-value">₹{trip.advancePaymentAmount}</span>
                  </div>
                )}
              </div>
              {trip.billingAddress && (
                <div className="text-section">
                  <h3>Billing Address</h3>
                  <p>{trip.billingAddress}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TripDetails;
