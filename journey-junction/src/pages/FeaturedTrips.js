import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FeaturedTrips.css';

const CATEGORY_ICONS = {
  adventure: '🏔️', beach: '🏖️', cultural: '🏛️', luxury: '💎',
  budget: '💰', family: '👨‍👩‍👧', honeymoon: '💑', wildlife: '🦁',
};

const FeaturedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [applyingFor, setApplyingFor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [imageTransitioning, setImageTransitioning] = useState({});
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [applicationData, setApplicationData] = useState({
    preferredStartDate: '',
    preferredEndDate: '',
    message: ''
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedTrips();
  }, []);

  useEffect(() => {
    // Initialize carousel for each trip and set up auto-advance
    const intervals = {};
    
    trips.forEach(trip => {
      const totalImages = getTotalImagesForTrip(trip);
      
      // Set up carousel for all trips since we now have predefined images
      if (totalImages > 1) {
        // Initialize current image index if not set
        if (currentImageIndex[trip._id] === undefined) {
          setCurrentImageIndex(prev => ({ ...prev, [trip._id]: 0 }));
        }
        
        // Auto-advance carousel every 4 seconds with smooth transition
        intervals[trip._id] = setInterval(() => {
          // Start transition
          setImageTransitioning(prev => ({ ...prev, [trip._id]: true }));
          
          setTimeout(() => {
            setCurrentImageIndex(prev => ({
              ...prev,
              [trip._id]: ((prev[trip._id] || 0) + 1) % totalImages
            }));
            
            // End transition
            setTimeout(() => {
              setImageTransitioning(prev => ({ ...prev, [trip._id]: false }));
            }, 50);
          }, 250);
        }, 4000);
      }
    });

    // Cleanup function
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [trips]);

  const fetchFeaturedTrips = async () => {
    try {
      const { data } = await tripAPI.getFeaturedTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    }
  };

  // Predefined image sets for different destinations/themes
  const getImageSetForTrip = (trip) => {
    const destination = trip.destination?.toLowerCase() || '';
    const title = trip.title?.toLowerCase() || '';
    const category = trip.category?.toLowerCase() || '';
    
    // Bali-related images
    if (destination.includes('bali') || title.includes('bali')) {
      return [
        '/images/bali/bali.webp',
        '/images/bali/bali-2.jpg',
        '/images/bali/bali-3.jpg',
        '/images/bali/ubud-bali.jpg'
      ];
    }
    
    // Paris-related images
    if (destination.includes('paris') || destination.includes('france') || title.includes('paris')) {
      return [
        '/images/background.jpg',
        '/images/photo-1476514525535-07fb3b4ae5f1.avif'
      ];
    }
    
    // Beach/tropical destinations
    if (destination.includes('beach') || destination.includes('island') || 
        category.includes('beach') || title.includes('beach') || title.includes('tropical')) {
      return [
        '/images/beautiful-girl-standing-boat-looking-mountains-ratchaprapha-dam-khao-sok-national-park-surat-thani-province-thailand_335224-849.avif',
        '/images/background.jpg'
      ];
    }
    
    // Rajasthan
    if (destination.includes('rajasthan') || destination.includes('jaipur') || destination.includes('jodhpur') || destination.includes('udaipur') || title.includes('rajasthan')) {
      return ['/images/rajasthan/rajasthan1.jpeg'];
    }
    
    // Himalaya/adventure/trekking trips
    if (destination.includes('himalaya') || destination.includes('himachal') || destination.includes('trek') ||
        category.includes('adventure') || title.includes('trek') || title.includes('himalaya')) {
      return [
        '/images/himalaya/him2.avif',
        '/images/himalaya/him3.avif',
        '/images/himalaya/him4.jpg',
        '/images/himalaya/hampta.jpg',
        '/images/himalaya/bhamhatal.jpg'
      ];
    }
    
    // Default image set for general trips
    return [
      '/images/bali/bali.webp',
      '/images/photo-1476514525535-07fb3b4ae5f1.avif',
      '/images/background.jpg',
      '/images/beautiful-girl-standing-boat-looking-mountains-ratchaprapha-dam-khao-sok-national-park-surat-thani-province-thailand_335224-849.avif'
    ];
  };

  const getImageForTrip = (trip, imageIndex = 0) => {
    if (trip.galleryImages && trip.galleryImages.length > 0) {
      return trip.galleryImages[imageIndex % trip.galleryImages.length];
    }
    if (trip.image) return trip.image;
    const imageSet = getImageSetForTrip(trip);
    return imageSet[imageIndex % imageSet.length];
  };

  const getTotalImagesForTrip = (trip) => {
    if (trip.galleryImages && trip.galleryImages.length > 0) return trip.galleryImages.length;
    if (trip.image) return 1;
    return getImageSetForTrip(trip).length;
  };

  const nextImage = (tripId, e) => {
    e.stopPropagation();
    const trip = trips.find(t => t._id === tripId);
    const totalImages = getTotalImagesForTrip(trip);
    
    // Start transition
    setImageTransitioning(prev => ({ ...prev, [tripId]: true }));
    
    setTimeout(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [tripId]: (prev[tripId] + 1) % totalImages
      }));
      
      // End transition
      setTimeout(() => {
        setImageTransitioning(prev => ({ ...prev, [tripId]: false }));
      }, 50);
    }, 250);
  };

  const prevImage = (tripId, e) => {
    e.stopPropagation();
    const trip = trips.find(t => t._id === tripId);
    const totalImages = getTotalImagesForTrip(trip);
    
    // Start transition
    setImageTransitioning(prev => ({ ...prev, [tripId]: true }));
    
    setTimeout(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [tripId]: prev[tripId] === 0 ? totalImages - 1 : prev[tripId] - 1
      }));
      
      // End transition
      setTimeout(() => {
        setImageTransitioning(prev => ({ ...prev, [tripId]: false }));
      }, 50);
    }, 250);
  };

  const goToImage = (tripId, index, e) => {
    e.stopPropagation();
    
    // Start transition
    setImageTransitioning(prev => ({ ...prev, [tripId]: true }));
    
    setTimeout(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [tripId]: index
      }));
      
      // End transition
      setTimeout(() => {
        setImageTransitioning(prev => ({ ...prev, [tripId]: false }));
      }, 50);
    }, 250);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateRange = (trip) => {
    // Use new duration format if available
    if (trip.duration && trip.duration.days && trip.duration.nights) {
      return `${trip.duration.days} Days / ${trip.duration.nights} Nights`;
    }
    // Fallback to old numberOfDays format
    if (trip.numberOfDays) {
      return `${trip.numberOfDays} days`;
    }
    // Fallback to legacy date range (for old trips)
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric'
      });
      const end = new Date(trip.endDate).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `${start} - ${end}`;
    }
    // Show available dates if any
    if (trip.availableDates && trip.availableDates.length > 0) {
      return `Multiple dates available - Choose when applying`;
    }
    return 'Flexible dates - Choose your preferred dates when applying';
  };

  const getAuthorInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const handleBookTrip = (trip) => {
    if (!user) {
      navigate('/');
      return;
    }
    navigate('/confirm-trip', {
      state: {
        tripData: {
          tripTitle: trip.title,
          destination: trip.destination,
          basePrice: trip.basePrice || trip.budget,
          currency: trip.currency || 'INR',
          image: getImageForTrip(trip, 0),
          duration: trip.duration,
          category: trip.category,
          tripId: trip._id,
        }
      }
    });
  };

  const handleApplyForTrip = async (tripId) => {
    if (!user) {
      alert('Please login to apply for trips');
      return;
    }

    const trip = trips.find(t => t._id === tripId);
    setSelectedTrip(trip);
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    if (!applicationData.preferredStartDate || !applicationData.preferredEndDate) {
      alert('Please select your preferred travel dates');
      return;
    }

    if (new Date(applicationData.preferredStartDate) >= new Date(applicationData.preferredEndDate)) {
      alert('End date must be after start date');
      return;
    }

    setApplyingFor(selectedTrip._id);
    try {
      await tripAPI.applyForTrip(selectedTrip._id, applicationData);
      alert('Application submitted successfully! The trip organizer will review your application and preferred dates.');
      setShowApplicationModal(false);
      setApplicationData({ preferredStartDate: '', preferredEndDate: '', message: '' });
      fetchFeaturedTrips(); // Refresh to show updated applicant count
    } catch (error) {
      const message = error.response?.data?.message || 'Error applying for trip';
      alert(message);
    } finally {
      setApplyingFor(null);
    }
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedTrip(null);
    setApplicationData({ preferredStartDate: '', preferredEndDate: '', message: '' });
  };

  const hasUserApplied = (trip) => {
    if (!user || !trip.applicants) return false;
    return trip.applicants.some(applicant => 
      applicant && applicant.userId && applicant.userId._id === user._id
    );
  };

  const openTripDetails = (trip) => {
    navigate(`/trip/${trip._id}/details`);
  };

  return (
    <div className="featured-trips">
      <Navbar />

      {/* ── Hero Banner ── */}
      <div className="featured-hero">
        <div className="featured-hero-bg" style={{ backgroundImage: `url(/images/photo-1476514525535-07fb3b4ae5f1.avif)` }}></div>
        <div className="featured-hero-overlay"></div>
        <div className="featured-hero-content">
          <span className="hero-eyebrow">✈️ Handpicked for You</span>
          <h1 className="featured-hero-title">Featured Destinations</h1>
          <p className="featured-hero-subtitle">
            Extraordinary journeys curated by our community of explorers
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><strong>{trips.length}</strong><span>Trips Available</span></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><strong>100%</strong><span>Verified</span></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><strong>24/7</strong><span>Support</span></div>
          </div>
        </div>
      </div>

      <div className="featured-container">
        <div className="featured-header">
          <h2 className="featured-title">Curated Travel Experiences</h2>
          <p className="featured-subtitle">Handpicked destinations and itineraries from seasoned travelers</p>
        </div>

        {trips.length === 0 ? (
          <div className="empty-featured">
            <div className="empty-featured-icon">⭐</div>
            <h3>No featured trips yet</h3>
            <p>Check back soon for amazing travel experiences from our community.</p>
          </div>
        ) : (
          <div className="featured-grid">
            {trips.map((trip) => (
              <div key={trip._id} className="featured-card">

                {/* ── Card Image ── */}
                <div className="image-carousel">
                  <img
                    src={getImageForTrip(trip, currentImageIndex[trip._id] || 0)}
                    alt={trip.title}
                    className={`featured-image ${imageTransitioning[trip._id] ? 'fade-out' : 'fade-in'}`}
                    onError={(e) => { e.target.src = '/images/background.jpg'; }}
                  />
                  <button className="carousel-btn carousel-prev" onClick={(e) => prevImage(trip._id, e)}>‹</button>
                  <button className="carousel-btn carousel-next" onClick={(e) => nextImage(trip._id, e)}>›</button>
                  <div className="carousel-indicators">
                    {Array.from({ length: getTotalImagesForTrip(trip) }, (_, i) => (
                      <button key={i} className={`carousel-dot ${(currentImageIndex[trip._id] || 0) === i ? 'active' : ''}`} onClick={(e) => goToImage(trip._id, i, e)} />
                    ))}
                  </div>

                  {/* Overlay badges */}
                  <div className="card-img-overlay">
                    <span className="badge-featured">⭐ Featured</span>
                    {trip.category && (
                      <span className="badge-category">
                        {CATEGORY_ICONS[trip.category?.toLowerCase()] || '🌍'} {trip.category}
                      </span>
                    )}
                  </div>

                  {/* Price pill on image */}
                  <div className="card-price-pill">
                    <span className="price-from">From</span>
                    <span className="price-amount">{formatCurrency(trip.basePrice || trip.budget, trip.currency)}</span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="featured-content">
                  <div className="card-top">
                    <h3 className="featured-card-title">{trip.title}</h3>
                    <p className="featured-destination">{trip.destination}{trip.city ? `, ${trip.city}` : ''}</p>
                    <p className="featured-description">{trip.shortDescription || trip.description}</p>
                  </div>

                  {/* Duration + Seats row */}
                  <div className="card-info-row">
                    <div className="card-info-item">
                      <span className="info-icon">🕐</span>
                      <span>{formatDateRange(trip)}</span>
                    </div>
                    <div className="card-info-item">
                      <span className="info-icon">💺</span>
                      <span>{trip.totalSeats ? `${trip.totalSeats} seats` : 'Open seats'}</span>
                    </div>
                    <div className="card-info-item">
                      <span className="info-icon">👥</span>
                      <span>{trip.applicants?.length || 0} joined</span>
                    </div>
                  </div>

                  {/* Activities */}
                  {((trip.activitiesIncluded && Object.values(trip.activitiesIncluded).some(Boolean)) ||
                    (trip.activities && trip.activities.length > 0)) && (
                    <div className="activities-tags">
                      {trip.activitiesIncluded
                        ? Object.entries(trip.activitiesIncluded).filter(([, v]) => v).slice(0, 3).map(([k], i) => (
                            <span key={i} className="activity-tag">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                          ))
                        : trip.activities?.slice(0, 3).map((a, i) => (
                            <span key={i} className="activity-tag">{a.trim()}</span>
                          ))
                      }
                    </div>
                  )}

                  {/* Organizer */}
                  <div className="featured-author">
                    <div className="author-avatar">{getAuthorInitials(trip.userId?.name)}</div>
                    <div className="author-info">
                      <h4>{trip.userId?.name}</h4>
                      <p>Trip Organizer</p>
                    </div>
                    <div className="trip-status-dot" data-status={trip.status || 'active'}>
                      {trip.status || 'Active'}
                    </div>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="featured-actions">
                    <button className="btn-details" onClick={() => openTripDetails(trip)}>👁️ View Details</button>

                    {user && user.role === 'admin' ? (
                      <button className="btn-edit-trip" onClick={() => navigate(`/admin/trips/${trip._id}/edit`)}>✏️ Edit Trip</button>
                    ) : user && trip.userId && user._id === trip.userId._id ? (
                      <button className="btn-edit-trip" onClick={() => navigate(`/admin/trips/${trip._id}/edit`)}>✏️ Edit Trip</button>
                    ) : hasUserApplied(trip) ? (
                      <button className="btn-applied" disabled>✅ Applied</button>
                    ) : (
                      <button className="btn-book" onClick={() => handleBookTrip(trip)}>
                        🏷️ Book This Trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Application Modal */}
      {showApplicationModal && selectedTrip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              color: '#1a202c',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>Apply for Trip</h2>
            <h3 style={{ 
              margin: '0 0 8px 0', 
              color: '#2d3748',
              fontSize: '1.2rem',
              fontWeight: '500'
            }}>{selectedTrip.title}</h3>
            <p style={{ 
              margin: '0 0 20px 0', 
              color: '#4a5568',
              fontSize: '0.95rem'
            }}>📍 {selectedTrip.destination}</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '6px', 
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Preferred Start Date *
              </label>
              <input
                type="date"
                value={applicationData.preferredStartDate}
                onChange={(e) => setApplicationData(prev => ({ ...prev, preferredStartDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '6px', 
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Preferred End Date *
              </label>
              <input
                type="date"
                value={applicationData.preferredEndDate}
                onChange={(e) => setApplicationData(prev => ({ ...prev, preferredEndDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '6px', 
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Message to Organizer (Optional)
              </label>
              <textarea
                value={applicationData.message}
                onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell the organizer why you're interested in this trip..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={closeApplicationModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  minWidth: '80px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                disabled={applyingFor === selectedTrip._id}
                style={{
                  padding: '10px 20px',
                  backgroundColor: applyingFor === selectedTrip._id ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: applyingFor === selectedTrip._id ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  minWidth: '120px'
                }}
              >
                {applyingFor === selectedTrip._id ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default FeaturedTrips;
