import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TripDetails.css';

// Import himalaya images
import him2 from '../../../images/himalaya/him2.jpeg';
import him3 from '../../../images/himalaya/him3.jpg';
import him4 from '../../../images/himalaya/him4.jpeg';
import hampta from '../../../images/himalaya/hampta.jpeg';
import bhamhatal from '../../../images/himalaya/bhamhatal.jpeg';
import triund from '../../../images/himalaya/triund.jpeg';
import kedar from '../../../images/himalaya/kedar.png';
import valley from '../../../images/himalaya/valley.jpg';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState({});

  // Himalaya images uploaded by admin in the images/himalaya folder
  const himalayaImages = [
    '/images/himalaya/him2.jpeg',
    '/images/himalaya/him3.jpg',
    '/images/himalaya/him4.jpeg',
    '/images/himalaya/hampta.jpeg',
    '/images/himalaya/bhamhatal.jpeg',
    '/images/himalaya/triund.jpeg',
    '/images/himalaya/kedar.png',
    '/images/himalaya/valley.jpg'
  ];

  // Rajasthan images for royal heritage trips
  const rajasthanImages = [
    '/images/rajasthan/rajasthan1.jpeg',
    '/images/rajasthan/-zgcUxh4KMeyquudTNwFqaJ7SIxIa6eW7PutoEOk2jZuL-nFeMwxWoHgp9e6kJi7LrLMmtDtAK1Eaw6QdTZIvSXidZYu8nRvKQ1NrmBvi0w.jpeg',
    '/images/rajasthan/kc997oKX_Rfk8Xlbg21RfRlKF0m3DjmiYfDY0Iq2lAQQdjuND3yVLTEtHp7hv100dxzWq_8_BvYHvZy3HpVfSB3sCP2_AswPnnGv5XIlEM8.jpeg',
    '/images/rajasthan/mJhhnB4vUqAFJ2OYJRHS3LlL391K-PVwZVcpVSqYHQMxrZzhIBHVBcBsTxWuoTD4jymZBSv_1UG95Su0f3T3Roq9516gFbgr6BaYKeM7fq4.jpeg',
    '/images/rajasthan/XS2aDXkV0VjtL_Jg7AbUEMOjwCSBR-yTVCMs722zI-NDtrGM_0p-kiumaYtVHxlFXCAnvGSEEpUMKF9opM9mWKXYhutLQWpnLuBF2fIoLXg.jpeg'
  ];

  const defaultImages = [
    '/images/bali.webp',
    '/images/bali-2.jpg', 
    '/images/bali-3.jpg',
    '/images/ubud-bali.jpg'
  ];

  useEffect(() => {
    fetchTripDetails();
    fetchFeaturedTrips();
  }, [id]);

  // Auto-carousel effect for main trip images
  useEffect(() => {
    const images = getImages();
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [trip]);

  // Auto-carousel for featured trips
  useEffect(() => {
    const intervals = {};
    
    featuredTrips.forEach(featuredTrip => {
      const tripImages = getFeaturedTripImages(featuredTrip);
      
      if (tripImages.length > 1) {
        // Initialize image index if not set
        if (featuredImageIndex[featuredTrip._id] === undefined) {
          setFeaturedImageIndex(prev => ({ ...prev, [featuredTrip._id]: 0 }));
        }
        
        // Auto-advance carousel every 2.5 seconds
        intervals[featuredTrip._id] = setInterval(() => {
          setFeaturedImageIndex(prev => ({
            ...prev,
            [featuredTrip._id]: ((prev[featuredTrip._id] || 0) + 1) % tripImages.length
          }));
        }, 2500);
      }
    });

    // Cleanup function
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [featuredTrips]);

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

  const fetchFeaturedTrips = async () => {
    try {
      const { data } = await tripAPI.getFeaturedTrips();
      // Filter out current trip and limit to 4 featured trips
      const filteredTrips = data.filter(featuredTrip => featuredTrip._id !== id).slice(0, 4);
      setFeaturedTrips(filteredTrips);
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    }
  };

  const getFeaturedTripImages = (featuredTrip) => {
    // Check if trip is Rajasthan related
    const destination = featuredTrip?.destination?.toLowerCase() || '';
    const title = featuredTrip?.title?.toLowerCase() || '';
    
    if (destination.includes('rajasthan') || title.includes('rajasthan') || 
        title.includes('royal') || title.includes('heritage')) {
      return rajasthanImages;
    }
    
    // Default to himalaya images for other featured trips
    return himalayaImages;
  };

  const getFeaturedTripImage = (featuredTrip) => {
    const images = getFeaturedTripImages(featuredTrip);
    const imageIndex = featuredImageIndex[featuredTrip._id] || 0;
    return images[imageIndex % images.length];
  };

  const getImages = () => {
    // Check if trip has uploaded images
    if (trip?.images && trip.images.length > 0) {
      return trip.images;
    }
    if (trip?.galleryImages && trip.galleryImages.length > 0) {
      return trip.galleryImages;
    }
    if (trip?.image) {
      return [trip.image];
    }
    
    // Check if trip is himalaya/adventure related
    const destination = trip?.destination?.toLowerCase() || '';
    const category = trip?.category?.toLowerCase() || '';
    
    if (destination.includes('himalaya') || destination.includes('himachal') || 
        destination.includes('manali') || destination.includes('shimla') ||
        destination.includes('dharamshala') || destination.includes('kasol') ||
        category.includes('trekking') || category.includes('adventure') ||
        destination.includes('mountain') || destination.includes('trek')) {
      return himalayaImages;
    }
    
    return defaultImages;
  };

  const nextImage = () => {
    const images = getImages();
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImages();
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const formatBudget = (tripData = trip) => {
    let amount = tripData?.customBudget || tripData?.budget || tripData?.basePrice;
    let currency = tripData?.preferredCurrency || tripData?.currency || 'INR';
    
    if (tripData?.budgetRange && tripData.budgetRange !== 'Custom') {
      return tripData.budgetRange;
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

        {/* Component 2: Photo Gallery - Removed */}
        {/* Photo gallery component removed from view details page */}

        {/* Component 2: Travel Dates & Duration */}
        <div className="detail-component dates-component">
          <div className="component-header">
            <h2 className="component-title">2. Travel Dates & Duration</h2>
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

        {/* Component 3: Budget Information */}
        <div className="detail-component budget-component">
          <div className="component-header">
            <h2 className="component-title">3. Budget & Pricing</h2>
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

        {/* Component 4: Activities & Itinerary */}
        <div className="detail-component activities-component">
          <div className="component-header">
            <h2 className="component-title">4. Activities & Experiences</h2>
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

        {/* Component 5: Accommodation Details */}
        <div className="detail-component accommodation-component">
          <div className="component-header">
            <h2 className="component-title">5. Accommodation</h2>
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

        {/* Component 6: Transportation */}
        <div className="detail-component transport-component">
          <div className="component-header">
            <h2 className="component-title">6. Transportation</h2>
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

        {/* Component 7: Travel Requirements */}
        <div className="detail-component requirements-component">
          <div className="component-header">
            <h2 className="component-title">7. Travel Requirements</h2>
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

        {/* Component 8: Weather & Best Time */}
        <div className="detail-component weather-component">
          <div className="component-header">
            <h2 className="component-title">8. Weather & Climate</h2>
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

        {/* Component 9: Additional Information */}
        <div className="detail-component notes-component">
          <div className="component-header">
            <h2 className="component-title">9. Additional Information</h2>
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

        {/* Featured Trips Carousel Section */}
        {featuredTrips.length > 0 && (
          <div className="detail-component featured-trips-component">
            <div className="component-header">
              <h2 className="component-title">10. ⭐ More Featured Adventures</h2>
            </div>
            <div className="component-content">
              <div className="featured-trips-carousel">
                {featuredTrips.map((featuredTrip, index) => (
                  <div key={featuredTrip._id} className="featured-trip-card">
                    <div className="featured-trip-image-container">
                      <img 
                        src={getFeaturedTripImage(featuredTrip)} 
                        alt={featuredTrip.title}
                        className="featured-trip-image"
                        onClick={() => navigate(`/trip/${featuredTrip._id}/details`)}
                      />
                      <div className="featured-trip-overlay">
                        <div className="featured-trip-badges">
                          <div className={`featured-status-badge ${featuredTrip.status || 'planned'}`}>
                            {(featuredTrip.status || 'Planned').charAt(0).toUpperCase() + (featuredTrip.status || 'planned').slice(1)}
                          </div>
                          <div className="featured-star-badge">⭐</div>
                        </div>
                        <div className="auto-carousel-badge">
                          🔄 Auto
                        </div>
                      </div>
                    </div>
                    
                    <div className="featured-trip-content">
                      <h3 className="featured-trip-title">{featuredTrip.title}</h3>
                      <div className="featured-trip-destination">
                        <span className="featured-location-icon">📍</span>
                        {featuredTrip.destinationCity && featuredTrip.destinationCountry 
                          ? `${featuredTrip.destinationCity}, ${featuredTrip.destinationCountry}` 
                          : featuredTrip.destination || 'Destination TBD'
                        }
                      </div>
                      
                      <p className="featured-trip-description">
                        {featuredTrip.shortDescription || 
                         (featuredTrip.description && featuredTrip.description.length > 80 
                           ? featuredTrip.description.substring(0, 80) + '...' 
                           : featuredTrip.description) || 
                         'Discover amazing adventures and create unforgettable memories.'}
                      </p>
                      
                      <div className="featured-trip-details">
                        <div className="featured-detail-item">
                          <span className="featured-detail-icon">⏱️</span>
                          <span className="featured-detail-text">
                            {featuredTrip.startDate && featuredTrip.endDate 
                              ? formatDateRange(featuredTrip.startDate, featuredTrip.endDate)
                              : featuredTrip.duration?.days 
                                ? `${featuredTrip.duration.days} days`
                                : 'Flexible'
                            }
                          </span>
                        </div>
                        <div className="featured-detail-item">
                          <span className="featured-detail-icon">💰</span>
                          <span className="featured-detail-text">
                            {formatBudget(featuredTrip)}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/trip/${featuredTrip._id}/details`)} 
                        className="featured-trip-btn"
                      >
                        👁️ View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="featured-trips-footer">
                <button 
                  onClick={() => navigate('/featured')} 
                  className="view-all-featured-btn"
                >
                  🌟 View All Featured Trips
                </button>
              </div>
            </div>
          </div>
        )}
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
                onClick={prevImage}
                className="nav-btn prev-btn"
              >
                ‹
              </button>
              <span className="image-counter-modal">
                {currentImageIndex + 1} / {images.length}
              </span>
              <button 
                onClick={nextImage}
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