import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripAPI, adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TripDetailsView.css';

const TripDetailsView = () => {
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
      
      try {
        response = await adminAPI.getTripById(id);
      } catch (adminError) {
        response = await tripAPI.getTripById(id);
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

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="trip-details-view">
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
      <div className="trip-details-view">
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
    <div className="trip-details-view">
      <Navbar />
      
      <div className="trip-details-container">
        {/* Hero Header */}
        <div className="trip-hero">
          <div className="trip-hero-overlay"></div>
          <div className="trip-hero-content">
            <div className="trip-badges-header">
              {trip.tripType && <span className="badge trip-type">{trip.tripType}</span>}
              <span className={`badge status ${trip.status?.toLowerCase() || 'planned'}`}>
                {trip.status || 'Planned'}
              </span>
              {trip.isFeatured && <span className="badge featured">⭐ Featured</span>}
            </div>
            
            <h1 className="trip-main-title">{trip.title}</h1>
            <div className="trip-main-destination">
              <span className="location-icon">📍</span>
              {trip.destinationCity && trip.destinationCountry 
                ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                : trip.destination || 'Destination TBD'}
            </div>
          </div>
          
          <div className="trip-hero-actions">
            <button onClick={() => navigate(`/admin/trips/${id}/edit`)} className="btn-edit-hero">
              ✏️ Edit Trip
            </button>
            <button onClick={() => navigate(-1)} className="btn-back-hero">
              ← Back
            </button>
          </div>
        </div>

        <div className="trip-content-wrapper">
          
          {/* 1. Basic Trip Information */}
          <div className="content-section">
            <div className="section-icon">1️⃣</div>
            <h2 className="section-title">Basic Trip Information</h2>
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
              {trip.destination && (
                <div className="info-card">
                  <span className="info-label">Destination</span>
                  <span className="info-value">{trip.destination}</span>
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
                  <span className="info-value">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
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

          {/* 2. Traveler Details */}
          {(trip.fullName || trip.email || trip.mobileNumber) && (
            <div className="content-section">
              <div className="section-icon">2️⃣</div>
              <h2 className="section-title">Traveler Details</h2>
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

          {/* 3. Budget Preferences */}
          {(trip.budgetRange || trip.budget || trip.basePrice) && (
            <div className="content-section">
              <div className="section-icon">3️⃣</div>
              <h2 className="section-title">Budget Preferences</h2>
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
                {trip.budget && (
                  <div className="info-card highlight">
                    <span className="info-label">Budget</span>
                    <span className="info-value">{formatCurrency(trip.budget, trip.currency)}</span>
                  </div>
                )}
                {trip.basePrice && (
                  <div className="info-card highlight">
                    <span className="info-label">Base Price</span>
                    <span className="info-value">{formatCurrency(trip.basePrice, trip.currency)}</span>
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

          {/* 4. Accommodation Preferences */}
          {(trip.hotelCategory || trip.roomType || trip.mealPlan) && (
            <div className="content-section">
              <div className="section-icon">4️⃣</div>
              <h2 className="section-title">Accommodation Preferences</h2>
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

          {/* 5. Transportation Preferences */}
          {(trip.internationalFlightRequired || trip.localTransportType) && (
            <div className="content-section">
              <div className="section-icon">5️⃣</div>
              <h2 className="section-title">Transportation Preferences</h2>
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

          {/* 6. Activities & Experiences */}
          {(trip.selectedActivities?.length > 0 || trip.activities?.length > 0 || trip.specialActivitiesRequested) && (
            <div className="content-section">
              <div className="section-icon">6️⃣</div>
              <h2 className="section-title">Activities & Experiences</h2>
              {(trip.selectedActivities?.length > 0 || trip.activities?.length > 0) && (
                <div className="activities-section">
                  <h3>Selected Activities</h3>
                  <div className="tags-container">
                    {(trip.selectedActivities || trip.activities || []).map((activity, idx) => (
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

          {/* 7. Itinerary Preferences */}
          {(trip.numberOfDestinations || trip.mustVisitPlaces || trip.dailyActivityLevel) && (
            <div className="content-section">
              <div className="section-icon">7️⃣</div>
              <h2 className="section-title">Itinerary Preferences</h2>
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

          {/* 8. Special Requests */}
          {(trip.dietaryRequirements || trip.accessibilityNeeds || trip.celebrationType || trip.specialNotes || trip.description) && (
            <div className="content-section">
              <div className="section-icon">8️⃣</div>
              <h2 className="section-title">Special Requests</h2>
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
              {trip.description && (
                <div className="text-section">
                  <h3>Description</h3>
                  <p>{trip.description}</p>
                </div>
              )}
            </div>
          )}

          {/* 9. Document Upload */}
          {(trip.passportCopy || trip.idProof || trip.visaDocument) && (
            <div className="content-section">
              <div className="section-icon">9️⃣</div>
              <h2 className="section-title">Document Upload</h2>
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

          {/* 10. Payment Information */}
          {(trip.paymentMethod || trip.advancePaymentAmount || trip.billingAddress) && (
            <div className="content-section">
              <div className="section-icon">🔟</div>
              <h2 className="section-title">Payment Information</h2>
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

        {/* Confirm Trip Bottom Bar */}
        <div className="confirm-trip-bar">
          <button
            onClick={() => navigate('/payment-methods', {
              state: {
                tripData: {
                  tripId: trip._id,
                  tripTitle: trip.title,
                  destination: trip.destinationCity && trip.destinationCountry
                    ? `${trip.destinationCity}, ${trip.destinationCountry}`
                    : trip.destination || 'TBD',
                  basePrice: trip.customBudget || trip.budget || trip.basePrice || 0,
                  currency: trip.preferredCurrency || trip.currency || 'INR',
                  image: trip.mainImage || trip.image || '',
                  preferredStartDate: trip.startDate,
                  preferredEndDate: trip.endDate
                }
              }
            })}
            className="btn-confirm-trip"
          >
            ✅ Confirm Trip & Proceed to Payment
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TripDetailsView;
