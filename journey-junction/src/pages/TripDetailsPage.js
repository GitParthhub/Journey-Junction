import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TripDetailsPage.css';

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const { data } = await tripAPI.getTripById(id);
      setTrip(data);
    } catch (error) {
      console.error('Error fetching trip details:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getImages = () => {
    if (trip?.images && trip.images.length > 0) return trip.images;
    if (trip?.image) return [trip.image];
    return ['/images/bali.webp', '/images/bali-2.jpg', '/images/bali-3.jpg'];
  };

  const formatCurrency = (amount, currency = 'INR') => {
    if (!amount) return 'TBD';
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    if (currency === 'USD') return `$${amount.toLocaleString('en-US')}`;
    if (currency === 'EUR') return `€${amount.toLocaleString('en-EU')}`;
    if (currency === 'GBP') return `£${amount.toLocaleString('en-GB')}`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    if (trip?.startDate && trip?.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    if (trip?.duration?.days) {
      return `${trip.duration.days} days / ${trip.duration.nights || ''} nights`;
    }
    return 'Flexible';
  };

  const handleBookTrip = () => {
    if (!user) {
      alert('Please login to book a trip');
      navigate('/');
      return;
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="trip-details-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading trip details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-details-page">
        <Navbar />
        <div className="error-container">
          <h2>Trip not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="trip-details-page">
      <Navbar />

      {/* Hero Section with Image Gallery */}
      <section className="trip-hero">
        <div className="trip-image-gallery">
          <div className="main-image-container">
            <img
              src={images[currentImageIndex]}
              alt={trip.title}
              className="main-image"
              onError={(e) => e.target.src = '/images/bali.webp'}
            />
            {trip.isFeatured && <span className="featured-badge">⭐ Featured</span>}
            <span className={`status-badge ${trip.status || 'planned'}`}>
              {(trip.status || 'Planned').charAt(0).toUpperCase() + (trip.status || 'planned').slice(1)}
            </span>
          </div>

          {images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  onError={(e) => e.target.src = '/images/bali.webp'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="trip-content">
        <div className="container">
          <div className="trip-layout">
            {/* Left Column - Trip Information */}
            <div className="trip-main">
              {/* Header */}
              <div className="trip-header">
                <h1 className="trip-title">{trip.title}</h1>
                <div className="trip-location">
                  <span className="location-icon">📍</span>
                  <span className="location-text">
                    {trip.destinationCity && trip.destinationCountry
                      ? `${trip.destinationCity}, ${trip.destinationCountry}`
                      : trip.destination || 'Destination TBD'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {(trip.description || trip.detailedDescription || trip.shortDescription) && (
                <div className="trip-description-section">
                  <p className="trip-description">
                    {trip.description || trip.detailedDescription || trip.shortDescription}
                  </p>
                </div>
              )}

              {/* Quick Info Cards */}
              <div className="quick-info-grid">
                <div className="info-card">
                  <div className="info-icon">📅</div>
                  <div className="info-content">
                    <span className="info-label">Duration</span>
                    <span className="info-value">{getDuration()}</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">👥</div>
                  <div className="info-content">
                    <span className="info-label">Group Size</span>
                    <span className="info-value">{trip.groupSizeLimit || trip.numberOfTravelers || 'Flexible'}</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">⭐</div>
                  <div className="info-content">
                    <span className="info-label">Category</span>
                    <span className="info-value">{trip.category || 'Adventure'}</span>
                  </div>
                </div>
              </div>

              {/* Itinerary Section */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <div className="section">
                  <h2 className="section-title">📋 Itinerary</h2>
                  <div className="itinerary-list">
                    {trip.itinerary.map((day, idx) => (
                      <div key={idx} className="itinerary-item">
                        <div className="day-header">
                          <span className="day-number">Day {day.dayNumber || idx + 1}</span>
                          <span className="day-title">{day.dayTitle}</span>
                        </div>
                        {day.dayDescription && (
                          <p className="day-description">{day.dayDescription}</p>
                        )}
                        {day.activitiesIncluded && (
                          <p className="day-detail"><strong>Activities:</strong> {day.activitiesIncluded}</p>
                        )}
                        {day.mealsIncluded && (
                          <p className="day-detail"><strong>Meals:</strong> {day.mealsIncluded}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities Section */}
              {trip.activities && trip.activities.length > 0 && (
                <div className="section">
                  <h2 className="section-title">🎯 Activities & Experiences</h2>
                  <div className="activities-grid">
                    {trip.activities.map((activity, idx) => (
                      <div key={idx} className="activity-badge">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodation Section */}
              {trip.accommodation && (
                <div className="section">
                  <h2 className="section-title">🏨 Accommodation</h2>
                  <div className="accommodation-card">
                    {trip.accommodation.hotelName && (
                      <div className="accommodation-item">
                        <span className="label">Hotel:</span>
                        <span className="value">{trip.accommodation.hotelName}</span>
                      </div>
                    )}
                    {trip.accommodation.roomType && (
                      <div className="accommodation-item">
                        <span className="label">Room Type:</span>
                        <span className="value">{trip.accommodation.roomType}</span>
                      </div>
                    )}
                    {trip.accommodation.hotelRating && (
                      <div className="accommodation-item">
                        <span className="label">Rating:</span>
                        <span className="value">{'⭐'.repeat(trip.accommodation.hotelRating)}</span>
                      </div>
                    )}
                    {trip.accommodation.location && (
                      <div className="accommodation-item">
                        <span className="label">Location:</span>
                        <span className="value">{trip.accommodation.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Included Services */}
              {trip.includedServices && Object.values(trip.includedServices).some(Boolean) && (
                <div className="section">
                  <h2 className="section-title">✅ What's Included</h2>
                  <div className="services-grid">
                    {Object.entries(trip.includedServices).map(([key, value]) =>
                      value && (
                        <div key={key} className="service-item">
                          <span className="service-icon">✓</span>
                          <span className="service-name">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {(trip.dietaryRequirements || trip.accessibilityNeeds || trip.specialNotes) && (
                <div className="section">
                  <h2 className="section-title">📝 Special Information</h2>
                  <div className="special-info">
                    {trip.dietaryRequirements && (
                      <div className="info-item">
                        <strong>Dietary Requirements:</strong> {trip.dietaryRequirements}
                      </div>
                    )}
                    {trip.accessibilityNeeds && (
                      <div className="info-item">
                        <strong>Accessibility Needs:</strong> {trip.accessibilityNeeds}
                      </div>
                    )}
                    {trip.specialNotes && (
                      <div className="info-item">
                        <strong>Special Notes:</strong> {trip.specialNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <aside className="trip-sidebar">
              <div className="booking-card">
                <div className="price-section">
                  <span className="price-label">Total Price</span>
                  <span className="price-amount">
                    {formatCurrency(trip.customBudget || trip.budget || trip.basePrice, trip.preferredCurrency || trip.currency)}
                  </span>
                  {trip.budgetRange && (
                    <span className="price-range">{trip.budgetRange}</span>
                  )}
                </div>

                <div className="trip-details-card">
                  <div className="detail-row">
                    <span className="detail-label">📅 Start Date</span>
                    <span className="detail-value">{formatDate(trip.startDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📅 End Date</span>
                    <span className="detail-value">{formatDate(trip.endDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⏱️ Duration</span>
                    <span className="detail-value">{getDuration()}</span>
                  </div>
                  {trip.groupSizeLimit && (
                    <div className="detail-row">
                      <span className="detail-label">👥 Group Size</span>
                      <span className="detail-value">{trip.groupSizeLimit} people</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBookTrip}
                  className="btn-book-trip"
                >
                  🚀 Book This Trip
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary-trip"
                >
                  Back to Dashboard
                </button>

                {trip.userId && (
                  <div className="organizer-info">
                    <h4>Trip Organizer</h4>
                    <p>{trip.userId.name || 'Journey Junction'}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            <h2>Book This Trip</h2>
            <p className="modal-subtitle">{trip.title}</p>

            <form className="booking-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Enter your full name" required />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="Enter your email" required />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input type="tel" placeholder="Enter your mobile number" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Start Date *</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Preferred End Date *</label>
                  <input type="date" required />
                </div>
              </div>

              <div className="form-group">
                <label>Number of Travelers *</label>
                <input type="number" min="1" placeholder="How many people?" required />
              </div>

              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  placeholder="Tell us about your preferences or special requests..."
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TripDetailsPage;
