import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TripDetails.css';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const defaultImages = [
    '/images/bali.webp',
    '/images/bali-2.jpg', 
    '/images/bali-3.jpg',
    '/images/ubud-bali.jpg'
  ];

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
    if (trip?.images && trip.images.length > 0) {
      return trip.images;
    }
    if (trip?.image) {
      return [trip.image];
    }
    return defaultImages;
  };

  const formatBudget = () => {
    let amount = trip?.customBudget || trip?.budget || trip?.basePrice;
    let currency = trip?.preferredCurrency || trip?.currency || 'INR';
    
    if (trip?.budgetRange && trip.budgetRange !== 'Custom') {
      return trip.budgetRange;
    }
    
    if (amount) {
      if (currency === 'INR') {
        return `₹${amount.toLocaleString('en-IN')}`;
      } else if (currency === 'USD') {
        return `$${amount.toLocaleString('en-US')}`;
      } else if (currency === 'EUR') {
        return `€${amount.toLocaleString('en-EU')}`;
      } else if (currency === 'GBP') {
        return `£${amount.toLocaleString('en-GB')}`;
      } else {
        return `${currency} ${amount.toLocaleString()}`;
      }
    }
    
    return 'Budget TBD';
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
      return `${trip.duration.days} days`;
    }
    return 'Flexible';
  };

  if (loading) {
    return (
      <div className="trip-details">
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
      <div className="trip-details">
        <Navbar />
        <div className="error-container">
          <h2>Trip not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="trip-details">
      <Navbar />
      
      <div className="trip-details-container">
        {/* Header Section */}
        <div className="trip-header">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <div className="trip-status-badge">
            <span className={`status-indicator ${trip.status || 'planned'}`}>
              {(trip.status || 'Planned').charAt(0).toUpperCase() + (trip.status || 'planned').slice(1)}
            </span>
            {trip.isFeatured && <span className="featured-badge">⭐ Featured</span>}
          </div>
        </div>

        {/* Component 1: Trip Title & Location */}
        <div className="detail-component trip-title-component">
          <div className="component-header">
            <h2 className="component-title">1. Trip Overview</h2>
          </div>
          <div className="component-content">
            <h1 className="trip-main-title">{trip.title}</h1>
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span className="location-text">
                {trip.destinationCity && trip.destinationCountry 
                  ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                  : trip.destination || 'Destination TBD'
                }
              </span>
            </div>
            <p className="trip-description">
              {trip.description || trip.detailedDescription || trip.shortDescription || 'No description available'}
            </p>
          </div>
        </div>

        {/* Component 2: Photo Gallery */}
        <div className="detail-component photo-gallery-component">
          <div className="component-header">
            <h2 className="component-title">2. Photo Gallery</h2>
          </div>
          <div className="component-content">
            <div className="main-image-container">
              <img 
                src={images[currentImageIndex]} 
                alt={`${trip.title} - Image ${currentImageIndex + 1}`}
                className="main-image"
                onClick={() => setShowImageModal(true)}
              />
              <div className="image-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
            <div className="thumbnail-gallery">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Component 3: Trip Dates & Duration */}
        <div className="detail-component dates-component">
          <div className="component-header">
            <h2 className="component-title">3. Travel Dates & Duration</h2>
          </div>
          <div className="component-content">
            <div className="dates-grid">
              <div className="date-item">
                <div className="date-icon">🛫</div>
                <div className="date-info">
                  <span className="date-label">Departure</span>
                  <span className="date-value">{formatDate(trip.startDate)}</span>
                </div>
              </div>
              <div className="date-item">
                <div className="date-icon">🛬</div>
                <div className="date-info">
                  <span className="date-label">Return</span>
                  <span className="date-value">{formatDate(trip.endDate)}</span>
                </div>
              </div>
              <div className="date-item">
                <div className="date-icon">⏱️</div>
                <div className="date-info">
                  <span className="date-label">Duration</span>
                  <span className="date-value">{getDuration()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component 4: Budget Information */}
        <div className="detail-component budget-component">
          <div className="component-header">
            <h2 className="component-title">4. Budget & Pricing</h2>
          </div>
          <div className="component-content">
            <div className="budget-info">
              <div className="budget-main">
                <span className="budget-amount">{formatBudget()}</span>
                <span className="budget-label">Total Budget</span>
              </div>
              {trip.budgetBreakdown && (
                <div className="budget-breakdown">
                  <h4>Budget Breakdown:</h4>
                  <ul>
                    {Object.entries(trip.budgetBreakdown).map(([key, value]) => (
                      <li key={key}>
                        <span className="breakdown-item">{key}:</span>
                        <span className="breakdown-value">₹{value.toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Component 5: Activities & Itinerary */}
        <div className="detail-component activities-component">
          <div className="component-header">
            <h2 className="component-title">5. Activities & Experiences</h2>
          </div>
          <div className="component-content">
            {trip.activities && trip.activities.length > 0 ? (
              <div className="activities-list">
                {trip.activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">🎯</span>
                    <span className="activity-text">{activity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-activities">No specific activities planned yet</p>
            )}
            
            {trip.itinerary && (
              <div className="itinerary-section">
                <h4>Detailed Itinerary:</h4>
                <div className="itinerary-content">
                  {trip.itinerary.map((day, index) => (
                    <div key={index} className="itinerary-day">
                      <div className="day-header">
                        <span className="day-number">Day {index + 1}</span>
                        <span className="day-title">{day.title}</span>
                      </div>
                      <p className="day-description">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Component 6: Accommodation Details */}
        <div className="detail-component accommodation-component">
          <div className="component-header">
            <h2 className="component-title">6. Accommodation</h2>
          </div>
          <div className="component-content">
            {trip.accommodation ? (
              <div className="accommodation-info">
                <div className="accommodation-item">
                  <span className="accommodation-icon">🏨</span>
                  <div className="accommodation-details">
                    <span className="accommodation-name">{trip.accommodation.name}</span>
                    <span className="accommodation-type">{trip.accommodation.type}</span>
                    <span className="accommodation-rating">
                      {'⭐'.repeat(trip.accommodation.rating || 3)} ({trip.accommodation.rating || 3}/5)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-accommodation">Accommodation details to be confirmed</p>
            )}
          </div>
        </div>

        {/* Component 7: Transportation */}
        <div className="detail-component transport-component">
          <div className="component-header">
            <h2 className="component-title">7. Transportation</h2>
          </div>
          <div className="component-content">
            {trip.transportation ? (
              <div className="transport-info">
                <div className="transport-item">
                  <span className="transport-icon">✈️</span>
                  <div className="transport-details">
                    <span className="transport-type">{trip.transportation.type}</span>
                    <span className="transport-details-text">{trip.transportation.details}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-transport">Transportation details to be arranged</p>
            )}
          </div>
        </div>

        {/* Component 8: Travel Requirements */}
        <div className="detail-component requirements-component">
          <div className="component-header">
            <h2 className="component-title">8. Travel Requirements</h2>
          </div>
          <div className="component-content">
            <div className="requirements-grid">
              <div className="requirement-item">
                <span className="requirement-icon">📋</span>
                <div className="requirement-info">
                  <span className="requirement-label">Documents</span>
                  <span className="requirement-value">
                    {trip.requirements?.documents || 'Valid ID, Travel Insurance'}
                  </span>
                </div>
              </div>
              <div className="requirement-item">
                <span className="requirement-icon">💉</span>
                <div className="requirement-info">
                  <span className="requirement-label">Health</span>
                  <span className="requirement-value">
                    {trip.requirements?.health || 'No special requirements'}
                  </span>
                </div>
              </div>
              <div className="requirement-item">
                <span className="requirement-icon">🎒</span>
                <div className="requirement-info">
                  <span className="requirement-label">Packing</span>
                  <span className="requirement-value">
                    {trip.requirements?.packing || 'Comfortable clothing, Camera'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component 9: Weather & Best Time */}
        <div className="detail-component weather-component">
          <div className="component-header">
            <h2 className="component-title">9. Weather & Climate</h2>
          </div>
          <div className="component-content">
            <div className="weather-info">
              <div className="weather-item">
                <span className="weather-icon">🌤️</span>
                <div className="weather-details">
                  <span className="weather-label">Expected Weather</span>
                  <span className="weather-value">
                    {trip.weather?.expected || 'Pleasant weather expected'}
                  </span>
                </div>
              </div>
              <div className="weather-item">
                <span className="weather-icon">🌡️</span>
                <div className="weather-details">
                  <span className="weather-label">Temperature Range</span>
                  <span className="weather-value">
                    {trip.weather?.temperature || '20°C - 30°C'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component 10: Trip Notes & Additional Info */}
        <div className="detail-component notes-component">
          <div className="component-header">
            <h2 className="component-title">10. Additional Information</h2>
          </div>
          <div className="component-content">
            <div className="notes-section">
              <h4>Trip Notes:</h4>
              <p className="trip-notes">
                {trip.notes || trip.additionalInfo || 'No additional notes for this trip.'}
              </p>
            </div>
            
            <div className="trip-meta">
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">{formatDate(trip.createdAt)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated:</span>
                <span className="meta-value">{formatDate(trip.updatedAt)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Trip ID:</span>
                <span className="meta-value">{trip._id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="trip-actions">
          <button 
            onClick={() => navigate(`/trip/${trip._id}/edit`)} 
            className="btn-primary"
          >
            ✏️ Edit Trip
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(false)}>×</button>
            <img 
              src={images[currentImageIndex]} 
              alt={`${trip.title} - Full size`}
              className="modal-image"
            />
            <div className="modal-navigation">
              <button 
                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                className="nav-btn prev-btn"
              >
                ‹
              </button>
              <span className="image-counter-modal">
                {currentImageIndex + 1} / {images.length}
              </span>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                className="nav-btn next-btn"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TripDetails;