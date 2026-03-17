import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TripDetailsNew.css';

const TripDetailsNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const getImagesByDestination = (destination, category) => {
    const dest = destination?.toLowerCase() || '';
    const cat = category?.toLowerCase() || '';
    
    if (dest.includes('bali')) {
      return [
        '/images/bali/bali.webp',
        '/images/bali/bali-2.jpg',
        '/images/bali/bali-3.jpg',
        '/images/bali/ubud-bali.jpg'
      ];
    }
    
    if (dest.includes('paris') || dest.includes('france')) {
      return [
        '/images/paris/paris.webp',
        '/images/paris/paris-2.jpg',
        '/images/paris/paris-4.jpeg'
      ];
    }
    
    if (dest.includes('himalaya') || dest.includes('himachal') || dest.includes('triund') || dest.includes('hampta') || dest.includes('kedar') || dest.includes('bhamhatal')) {
      return [
        '/images/himalaya/him2.avif',
        '/images/himalaya/him3.avif',
        '/images/himalaya/him4.jpg',
        '/images/himalaya/hampta.jpg',
        '/images/himalaya/bhamhatal.jpg'
      ];
    }
    
    if (cat.includes('trekking') || cat.includes('adventure') || dest.includes('mountain') || dest.includes('trek')) {
      return [
        '/images/himalaya/him2.avif',
        '/images/himalaya/him3.avif',
        '/images/himalaya/him4.jpg',
        '/images/himalaya/hampta.jpg',
        '/images/himalaya/bhamhatal.jpg'
      ];
    }
    
    if (cat.includes('beach') || dest.includes('beach') || dest.includes('island')) {
      return [
        '/images/beach/beach.jpeg',
        '/images/beach/kutabeach.jpeg',
        '/images/beach/nusapenida.jpeg'
      ];
    }
    
    return [
      '/images/background.jpg',
      '/images/photo-1476514525535-07fb3b4ae5f1.avif'
    ];
  };

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
    return getImagesByDestination(trip?.destination, trip?.category);
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
      <div className="trip-details-new">
        <Navbar />
        <div className="loading-container-new">
          <div className="loading-spinner-new"></div>
          <p>Loading trip details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-details-new">
        <Navbar />
        <div className="error-container-new">
          <h2>Trip not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-back-new">
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="trip-details-new">
      <Navbar />
      
      <div className="trip-details-wrapper">
        {/* Header with Back Button */}
        <div className="trip-header-new">
          <button onClick={() => navigate('/dashboard')} className="btn-back-new">
            ← Back
          </button>
          <div className="trip-badges-header">
            <span className={`badge-status ${trip.status || 'planned'}`}>
              {(trip.status || 'Planned').charAt(0).toUpperCase() + (trip.status || 'planned').slice(1)}
            </span>
            {trip.isFeatured && <span className="badge-featured-header">⭐ Featured</span>}
          </div>
        </div>

        {/* Hero Section with Image Gallery */}
        <div className="hero-section-new">
          <div className="main-image-container-new">
            <img 
              src={images[currentImageIndex]} 
              alt={`${trip.title} - Image ${currentImageIndex + 1}`}
              className="main-image-new"
              onClick={() => setShowImageModal(true)}
              onError={(e) => e.target.src = '/images/background.jpg'}
            />
            <div className="image-counter-new">
              {currentImageIndex + 1} / {images.length}
            </div>
            {images.length > 1 && (
              <div className="image-nav-new">
                <button 
                  className="nav-btn-new prev"
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                >
                  ‹
                </button>
                <button 
                  className="nav-btn-new next"
                  onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="thumbnail-gallery-new">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail-new ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => e.target.src = '/images/background.jpg'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid-new">
          {/* Left Column - Main Info */}
          <div className="left-column-new">
            {/* Card 1: Trip Title & Overview */}
            <div className="card-new card-primary">
              <div className="card-header-new">
                <h1 className="trip-title-new">{trip.title}</h1>
                <div className="location-badge-new">
                  <span className="location-icon-new">📍</span>
                  <span>
                    {trip.destinationCity && trip.destinationCountry 
                      ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                      : trip.destination || 'Destination TBD'
                    }
                  </span>
                </div>
              </div>
              <p className="trip-description-new">
                {trip.description || trip.detailedDescription || trip.shortDescription || 'No description available'}
              </p>
            </div>

            {/* Card 2: Quick Info Grid */}
            <div className="card-new card-grid">
              <div className="info-card-new">
                <div className="info-icon-new">📅</div>
                <div className="info-content-new">
                  <span className="info-label-new">Duration</span>
                  <span className="info-value-new">{getDuration()}</span>
                </div>
              </div>
              <div className="info-card-new">
                <div className="info-icon-new">💰</div>
                <div className="info-content-new">
                  <span className="info-label-new">Budget</span>
                  <span className="info-value-new">{formatBudget()}</span>
                </div>
              </div>
              <div className="info-card-new">
                <div className="info-icon-new">👥</div>
                <div className="info-content-new">
                  <span className="info-label-new">Group Size</span>
                  <span className="info-value-new">{trip.groupSizeLimit || trip.numberOfTravelers || 'Flexible'}</span>
                </div>
              </div>
              <div className="info-card-new">
                <div className="info-icon-new">🎯</div>
                <div className="info-content-new">
                  <span className="info-label-new">Category</span>
                  <span className="info-value-new">{trip.category || 'Adventure'}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Travel Dates */}
            <div className="card-new">
              <h2 className="card-title-new">📅 Travel Dates</h2>
              <div className="dates-container-new">
                <div className="date-box-new">
                  <span className="date-label-new">Departure</span>
                  <span className="date-value-new">{formatDate(trip.startDate)}</span>
                </div>
                <div className="date-box-new">
                  <span className="date-label-new">Return</span>
                  <span className="date-value-new">{formatDate(trip.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Activities */}
            {trip.activities && trip.activities.length > 0 && (
              <div className="card-new">
                <h2 className="card-title-new">🎯 Activities & Experiences</h2>
                <div className="activities-container-new">
                  {trip.activities.map((activity, index) => (
                    <div key={index} className="activity-badge-new">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 5: Itinerary */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <div className="card-new">
                <h2 className="card-title-new">📋 Detailed Itinerary</h2>
                <div className="itinerary-container-new">
                  {trip.itinerary.map((day, index) => (
                    <div key={index} className="itinerary-day-new">
                      <div className="day-header-new">
                        <span className="day-number-new">Day {index + 1}</span>
                        <span className="day-title-new">{day.title || day.dayTitle}</span>
                      </div>
                      <p className="day-description-new">{day.description || day.dayDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 6: Accommodation */}
            {trip.accommodation && (
              <div className="card-new">
                <h2 className="card-title-new">🏨 Accommodation</h2>
                <div className="accommodation-details-new">
                  {trip.accommodation.hotelName && (
                    <div className="detail-row-new">
                      <span className="detail-label-new">Hotel Name:</span>
                      <span className="detail-value-new">{trip.accommodation.hotelName}</span>
                    </div>
                  )}
                  {trip.accommodation.roomType && (
                    <div className="detail-row-new">
                      <span className="detail-label-new">Room Type:</span>
                      <span className="detail-value-new">{trip.accommodation.roomType}</span>
                    </div>
                  )}
                  {trip.accommodation.hotelRating && (
                    <div className="detail-row-new">
                      <span className="detail-label-new">Rating:</span>
                      <span className="detail-value-new">{'⭐'.repeat(trip.accommodation.hotelRating)}</span>
                    </div>
                  )}
                  {trip.accommodation.location && (
                    <div className="detail-row-new">
                      <span className="detail-label-new">Location:</span>
                      <span className="detail-value-new">{trip.accommodation.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card 7: Included Services */}
            {trip.includedServices && Object.values(trip.includedServices).some(Boolean) && (
              <div className="card-new">
                <h2 className="card-title-new">✅ What's Included</h2>
                <div className="services-grid-new">
                  {Object.entries(trip.includedServices).map(([key, value]) =>
                    value && (
                      <div key={key} className="service-item-new">
                        <span className="service-icon-new">✓</span>
                        <span className="service-name-new">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Card 8: Transportation */}
            {trip.transportation && (
              <div className="card-new">
                <h2 className="card-title-new">✈️ Transportation</h2>
                <div className="transport-details-new">
                  {trip.transportation.type && (
                    <div className="detail-row-new">
                      <span className="detail-label-new">Type:</span>
                      <span className="detail-value-new">{trip.transportation.type}</span>
                    </div>
                  )}
                  {trip.transportation.details && (
                    <div className="detail-row-new">
                      <span className="detail-label-new">Details:</span>
                      <span className="detail-value-new">{trip.transportation.details}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card 9: Requirements */}
            {(trip.requirements || trip.dietaryRequirements || trip.accessibilityNeeds) && (
              <div className="card-new">
                <h2 className="card-title-new">📋 Requirements & Special Needs</h2>
                <div className="requirements-grid-new">
                  {trip.requirements?.documents && (
                    <div className="requirement-item-new">
                      <span className="req-icon-new">📄</span>
                      <div>
                        <span className="req-label-new">Documents</span>
                        <span className="req-value-new">{trip.requirements.documents}</span>
                      </div>
                    </div>
                  )}
                  {trip.requirements?.health && (
                    <div className="requirement-item-new">
                      <span className="req-icon-new">💉</span>
                      <div>
                        <span className="req-label-new">Health</span>
                        <span className="req-value-new">{trip.requirements.health}</span>
                      </div>
                    </div>
                  )}
                  {trip.dietaryRequirements && (
                    <div className="requirement-item-new">
                      <span className="req-icon-new">🍽️</span>
                      <div>
                        <span className="req-label-new">Dietary</span>
                        <span className="req-value-new">{trip.dietaryRequirements}</span>
                      </div>
                    </div>
                  )}
                  {trip.accessibilityNeeds && (
                    <div className="requirement-item-new">
                      <span className="req-icon-new">♿</span>
                      <div>
                        <span className="req-label-new">Accessibility</span>
                        <span className="req-value-new">{trip.accessibilityNeeds}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card 10: Weather & Climate */}
            {trip.weather && (
              <div className="card-new">
                <h2 className="card-title-new">🌤️ Weather & Climate</h2>
                <div className="weather-grid-new">
                  {trip.weather.expected && (
                    <div className="weather-item-new">
                      <span className="weather-icon-new">🌡️</span>
                      <div>
                        <span className="weather-label-new">Expected Weather</span>
                        <span className="weather-value-new">{trip.weather.expected}</span>
                      </div>
                    </div>
                  )}
                  {trip.weather.temperature && (
                    <div className="weather-item-new">
                      <span className="weather-icon-new">🌡️</span>
                      <div>
                        <span className="weather-label-new">Temperature</span>
                        <span className="weather-value-new">{trip.weather.temperature}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Card 11: Additional Information */}
            <div className="card-new">
              <h2 className="card-title-new">ℹ️ Additional Information</h2>
              {trip.notes && (
                <div className="notes-section-new">
                  <h4 className="notes-title-new">Trip Notes</h4>
                  <p className="notes-content-new">{trip.notes}</p>
                </div>
              )}
              <div className="metadata-grid-new">
                <div className="metadata-item-new">
                  <span className="metadata-label-new">Created</span>
                  <span className="metadata-value-new">{formatDate(trip.createdAt)}</span>
                </div>
                <div className="metadata-item-new">
                  <span className="metadata-label-new">Last Updated</span>
                  <span className="metadata-value-new">{formatDate(trip.updatedAt)}</span>
                </div>
                <div className="metadata-item-new">
                  <span className="metadata-label-new">Trip ID</span>
                  <span className="metadata-value-new trip-id-new">{trip._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="right-column-new">
            {/* Booking Card */}
            <div className="card-new card-sticky">
              <div className="booking-header-new">
                <h3 className="booking-title-new">Trip Summary</h3>
              </div>
              
              <div className="price-section-new">
                <span className="price-label-new">Total Price</span>
                <span className="price-amount-new">{formatBudget()}</span>
              </div>

              <div className="summary-details-new">
                <div className="summary-item-new">
                  <span className="summary-icon-new">📅</span>
                  <div>
                    <span className="summary-label-new">Duration</span>
                    <span className="summary-value-new">{getDuration()}</span>
                  </div>
                </div>
                <div className="summary-item-new">
                  <span className="summary-icon-new">📍</span>
                  <div>
                    <span className="summary-label-new">Destination</span>
                    <span className="summary-value-new">
                      {trip.destinationCity && trip.destinationCountry 
                        ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                        : trip.destination || 'TBD'
                      }
                    </span>
                  </div>
                </div>
                <div className="summary-item-new">
                  <span className="summary-icon-new">👥</span>
                  <div>
                    <span className="summary-label-new">Group Size</span>
                    <span className="summary-value-new">{trip.groupSizeLimit || 'Flexible'}</span>
                  </div>
                </div>
                <div className="summary-item-new">
                  <span className="summary-icon-new">🎯</span>
                  <div>
                    <span className="summary-label-new">Category</span>
                    <span className="summary-value-new">{trip.category || 'Adventure'}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/trip/${trip._id}/edit`)} 
                className="btn-edit-new"
              >
                ✏️ Edit Trip
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn-back-secondary-new"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Organizer Info */}
            {trip.userId && (
              <div className="card-new">
                <h3 className="card-title-new">👤 Trip Organizer</h3>
                <div className="organizer-info-new">
                  <div className="organizer-avatar-new">
                    {trip.userId.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="organizer-details-new">
                    <span className="organizer-name-new">{trip.userId.name}</span>
                    <span className="organizer-role-new">Journey Junction</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal-overlay-new" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content-new" onClick={e => e.stopPropagation()}>
            <button className="modal-close-new" onClick={() => setShowImageModal(false)}>×</button>
            <img 
              src={images[currentImageIndex]} 
              alt={`${trip.title} - Full size`}
              className="modal-image-new"
              onError={(e) => e.target.src = '/images/background.jpg'}
            />
            <div className="modal-navigation-new">
              <button 
                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                className="modal-nav-btn-new"
              >
                ‹
              </button>
              <span className="modal-counter-new">
                {currentImageIndex + 1} / {images.length}
              </span>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                className="modal-nav-btn-new"
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

export default TripDetailsNew;
