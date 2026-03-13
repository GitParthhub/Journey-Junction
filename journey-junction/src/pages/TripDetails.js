import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI, tripAPI } from '../services/api';
import Navbar from '../components/Navbar';
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
      // Try admin API first, then regular trip API
      let response;
      try {
        response = await adminAPI.getTripById(id);
      } catch (adminError) {
        response = await tripAPI.getTripById(id);
      }
      setTrip(response.data);
    } catch (error) {
      setError('Failed to load trip details');
      console.error('Error fetching trip details:', error);
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
              {trip.isFeatured && <span className="badge featured">Featured</span>}
              <span className={`badge status ${trip.status?.toLowerCase()}`}>
                {trip.status || 'Active'}
              </span>
              <span className={`badge category ${trip.category?.toLowerCase()}`}>
                {trip.category || 'Adventure'}
              </span>
            </div>
            
            <h1 className="trip-title">{trip.title}</h1>
            <div className="trip-subtitle">
              <span className="trip-id">Trip ID: {trip.tripId}</span>
              <span className="trip-destination">📍 {trip.destination}{trip.city ? `, ${trip.city}` : ''}</span>
            </div>
            
            <div className="trip-meta-header">
              <div className="meta-item">
                <span className="meta-label">Duration</span>
                <span className="meta-value">{trip.duration?.days} Days / {trip.duration?.nights} Nights</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Price</span>
                <span className="meta-value">{formatCurrency(trip.basePrice, trip.currency)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Group Size</span>
                <span className="meta-value">{trip.totalSeats} seats</span>
              </div>
            </div>
          </div>
          
          <div className="trip-actions">
            <button onClick={() => navigate(-1)} className="btn-back">
              ← Back
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        {((trip.galleryImages && trip.galleryImages.length > 0) || 
          (trip.images && trip.images.length > 0) || 
          trip.image || trip.mainImage) && (
          <div className="trip-gallery">
            <div className="gallery-grid">
              {/* Show trip images or fallback to Bali images */}
              {(trip.galleryImages || trip.images || [trip.image || trip.mainImage || '/images/bali.webp']).slice(0, 5).map((image, index) => (
                <div key={index} className={`gallery-item ${index === 0 ? 'main-image' : ''}`}>
                  <img 
                    src={image || '/images/bali.webp'} 
                    alt={`${trip.title} - Image ${index + 1}`} 
                    onError={(e) => {
                      e.target.src = '/images/bali.webp';
                    }}
                  />
                  {index === 0 && <div className="cover-badge">Cover Image</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="trip-content">
          {/* Description Section */}
          <div className="content-section">
            <h2>Trip Description</h2>
            <div className="description-content">
              <div className="short-description">
                <h3>Overview</h3>
                <p>{trip.shortDescription}</p>
              </div>
              <div className="detailed-description">
                <h3>Detailed Information</h3>
                <p>{trip.detailedDescription}</p>
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="content-section">
            <h2>Travel Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Departure City</span>
                <span className="detail-value">{trip.departureCity}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Arrival Destination</span>
                <span className="detail-value">{trip.arrivalDestination}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Group Size Limit</span>
                <span className="detail-value">{trip.groupSizeLimit} people</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Minimum Travelers</span>
                <span className="detail-value">{trip.minimumTravelers} people</span>
              </div>
            </div>
          </div>

          {/* Available Dates */}
          {trip.availableDates && trip.availableDates.length > 0 && (
            <div className="content-section">
              <h2>Available Dates</h2>
              <div className="dates-grid">
                {trip.availableDates.map((dateRange, index) => (
                  <div key={index} className="date-range">
                    <span className="date-start">{formatDate(dateRange.startDate)}</span>
                    <span className="date-separator">to</span>
                    <span className="date-end">{formatDate(dateRange.endDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Information */}
          <div className="content-section">
            <h2>Pricing Information</h2>
            <div className="pricing-grid">
              <div className="price-item main-price">
                <span className="price-label">Base Price per Person</span>
                <span className="price-value">{formatCurrency(trip.basePrice, trip.currency)}</span>
              </div>
              {trip.childPrice > 0 && (
                <div className="price-item">
                  <span className="price-label">Child Price</span>
                  <span className="price-value">{formatCurrency(trip.childPrice, trip.currency)}</span>
                </div>
              )}
              {trip.discountPrice > 0 && (
                <div className="price-item discount">
                  <span className="price-label">Discount Price</span>
                  <span className="price-value">{formatCurrency(trip.discountPrice, trip.currency)}</span>
                </div>
              )}
              {trip.taxes > 0 && (
                <div className="price-item">
                  <span className="price-label">Taxes & Fees</span>
                  <span className="price-value">{formatCurrency(trip.taxes, trip.currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Itinerary */}
          {trip.itinerary && trip.itinerary.length > 0 && (
            <div className="content-section">
              <h2>Day-by-Day Itinerary</h2>
              <div className="itinerary-timeline">
                {trip.itinerary.map((day, index) => (
                  <div key={index} className="itinerary-day">
                    <div className="day-number">Day {day.dayNumber}</div>
                    <div className="day-content">
                      <h3 className="day-title">{day.dayTitle}</h3>
                      <p className="day-description">{day.dayDescription}</p>
                      {day.activitiesIncluded && (
                        <div className="day-detail">
                          <strong>Activities:</strong> {day.activitiesIncluded}
                        </div>
                      )}
                      {day.mealsIncluded && (
                        <div className="day-detail">
                          <strong>Meals:</strong> {day.mealsIncluded}
                        </div>
                      )}
                      {day.accommodationDetails && (
                        <div className="day-detail">
                          <strong>Accommodation:</strong> {day.accommodationDetails}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Places to Visit */}
          {trip.placesToVisit && trip.placesToVisit.length > 0 && (
            <div className="content-section">
              <h2>Places to Visit</h2>
              <div className="places-grid">
                {trip.placesToVisit.map((place, index) => (
                  <div key={index} className="place-card">
                    {place.image && (
                      <div className="place-image">
                        <img src={place.image} alt={place.placeName} />
                      </div>
                    )}
                    <div className="place-content">
                      <h3 className="place-name">{place.placeName}</h3>
                      <p className="place-description">{place.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services & Activities */}
          <div className="content-section">
            <h2>What's Included</h2>
            <div className="services-grid">
              <div className="services-column">
                <h3>Included Services</h3>
                <ul className="services-list">
                  {Object.entries(trip.includedServices || {}).map(([key, value]) => 
                    value && (
                      <li key={key} className="service-included">
                        ✅ {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </li>
                    )
                  )}
                </ul>
              </div>
              
              <div className="services-column">
                <h3>Activities Included</h3>
                <ul className="services-list">
                  {Object.entries(trip.activitiesIncluded || {}).map(([key, value]) => 
                    value && (
                      <li key={key} className="activity-included">
                        🎯 {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            
            {trip.excludedServices && trip.excludedServices.length > 0 && (
              <div className="excluded-services">
                <h3>Not Included</h3>
                <ul className="services-list">
                  {trip.excludedServices.map((service, index) => (
                    <li key={index} className="service-excluded">
                      ❌ {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Accommodation Details */}
          {trip.accommodation && (trip.accommodation.hotelName || trip.accommodation.roomType) && (
            <div className="content-section">
              <h2>Accommodation Details</h2>
              <div className="accommodation-card">
                <div className="accommodation-details">
                  {trip.accommodation.hotelName && (
                    <div className="accommodation-item">
                      <span className="accommodation-label">Hotel</span>
                      <span className="accommodation-value">
                        {trip.accommodation.hotelName}
                        {trip.accommodation.hotelRating && (
                          <span className="hotel-rating">
                            {' '}({trip.accommodation.hotelRating} Star)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {trip.accommodation.roomType && (
                    <div className="accommodation-item">
                      <span className="accommodation-label">Room Type</span>
                      <span className="accommodation-value">{trip.accommodation.roomType}</span>
                    </div>
                  )}
                  {trip.accommodation.location && (
                    <div className="accommodation-item">
                      <span className="accommodation-label">Location</span>
                      <span className="accommodation-value">{trip.accommodation.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Information */}
          <div className="content-section">
            <h2>Booking Information</h2>
            <div className="booking-info">
              <div className="booking-item">
                <span className="booking-label">Total Seats Available</span>
                <span className="booking-value">{trip.totalSeats}</span>
              </div>
              {trip.bookingDeadline && (
                <div className="booking-item">
                  <span className="booking-label">Booking Deadline</span>
                  <span className="booking-value">{formatDate(trip.bookingDeadline)}</span>
                </div>
              )}
              <div className="booking-item">
                <span className="booking-label">Trip Organizer</span>
                <span className="booking-value">{trip.userId?.name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;