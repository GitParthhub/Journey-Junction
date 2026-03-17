import React, { useState, useEffect, useContext } from 'react';
import { tripAPI, reviewAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [allReviews, setAllReviews] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Using Bali images as default with fallbacks
  const defaultImages = [
    '/images/bali.webp',
    '/images/bali-2.jpg', 
    '/images/bali-3.jpg',
    '/images/ubud-bali.jpg'
  ];

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
    
    return defaultImages;
  };

  useEffect(() => {
    fetchTrips();
    if (user?.role === 'admin') {
      fetchAllReviews();
      fetchFeaturedTrips();
    }
  }, []);

  // Refresh trips when returning to dashboard (e.g., after editing)
  useEffect(() => {
    const handleFocus = () => {
      fetchTrips();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTrips();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data } = await tripAPI.getMyTrips();
      setTrips(data);
      setFilteredTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const { data } = await reviewAPI.getAllReviews();
      setAllReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchFeaturedTrips = async () => {
    try {
      const { data } = await tripAPI.getFeaturedTrips();
      setFeaturedTrips(data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    }
  };

  const filterTrips = (status) => {
    setActiveFilter(status);
    if (status === 'all') {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter(trip => {
        const tripStatus = trip.status || 'planned';
        return tripStatus.toLowerCase() === status.toLowerCase();
      });
      setFilteredTrips(filtered);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripAPI.deleteTrip(id);
        fetchTrips();
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const getImageForTrip = (trip, index) => {
    // Use best photo if available
    if (trip.mainImage) {
      return trip.mainImage;
    }
    // Handle multiple images from new format
    if (trip.images && trip.images.length > 0) {
      const bestIndex = trip.bestPhotoIndex || 0;
      return trip.images[bestIndex] || trip.images[0];
    }
    // Handle single image from old format
    if (trip.image) {
      return trip.image;
    }
    // Get images by destination
    const destImages = getImagesByDestination(trip.destination, trip.category);
    const carouselIndex = currentImageIndex[trip._id] || 0;
    return destImages[carouselIndex % destImages.length];
  };

  const formatBudget = (trip) => {
    // Priority order: customBudget > budget > basePrice
    let amount = trip.customBudget || trip.budget || trip.basePrice;
    let currency = trip.preferredCurrency || trip.currency || 'INR';
    
    // If we have a budget range, show that instead
    if (trip.budgetRange && trip.budgetRange !== 'Custom') {
      return trip.budgetRange;
    }
    
    // If we have an amount, format it with the appropriate currency
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
    
    // Fallback
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
      month: 'short',
      year: 'numeric'
    });
  };

  const openTripDetails = (trip) => {
    navigate(`/trip/${trip._id}/details`);
  };

  const getTotalImagesForTrip = (trip) => {
    const destImages = getImagesByDestination(trip.destination, trip.category);
    return destImages.length;
  };

  const nextImage = (tripId, e) => {
    e.stopPropagation();
    const trip = filteredTrips.find(t => t._id === tripId);
    const totalImages = getTotalImagesForTrip(trip);
    setCurrentImageIndex(prev => ({
      ...prev,
      [tripId]: ((prev[tripId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (tripId, e) => {
    e.stopPropagation();
    const trip = filteredTrips.find(t => t._id === tripId);
    const totalImages = getTotalImagesForTrip(trip);
    setCurrentImageIndex(prev => ({
      ...prev,
      [tripId]: prev[tripId] === 0 ? totalImages - 1 : prev[tripId] - 1
    }));
  };

  return (
    <div className={`dashboard ${user?.role === 'admin' ? 'admin-dashboard' : ''}`}>
      <Navbar />
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome back, {user?.name}!</h1>
              <p>
                {user?.role === 'admin' 
                  ? 'Manage trip packages, users, and platform analytics' 
                  : 'Plan amazing adventures and manage your travel experiences'
                }
              </p>
            </div>
            <div className="hero-actions">
              {user?.role !== 'admin' ? (
                <>
                  <button onClick={() => navigate('/plan-trip')} className="btn-primary-hero">
                    <span>✈️</span>
                    Plan Your Trip
                  </button>
                  <button onClick={() => navigate('/featured')} className="btn-secondary-hero">
                    Explore Featured
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/admin/trips/new')} className="btn-primary-hero">
                    <span>➕</span>
                    Create Trip Package
                  </button>
                  <button onClick={() => navigate('/admin')} className="btn-secondary-hero">
                    Admin Panel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="actions-grid">
            {user?.role !== 'admin' ? (
              <>
                <div className="action-card" onClick={() => navigate('/plan-trip')}>
                  <div className="action-icon">✈️</div>
                  <h3 className="action-title">Plan Your Trip</h3>
                  <p className="action-description">Start planning your next amazing adventure</p>
                </div>
                <div className="action-card" onClick={() => navigate('/featured')}>
                  <div className="action-icon">⭐</div>
                  <h3 className="action-title">Featured Trips</h3>
                  <p className="action-description">Discover amazing trips curated by our community</p>
                </div>
                <div className="action-card" onClick={() => navigate('/notifications')}>
                  <div className="action-icon">🔔</div>
                  <h3 className="action-title">Notifications</h3>
                  <p className="action-description">Stay updated with your trip activities</p>
                </div>
                <div className="action-card" onClick={() => navigate('/settings')}>
                  <div className="action-icon">⚙️</div>
                  <h3 className="action-title">Settings</h3>
                  <p className="action-description">Manage your profile and preferences</p>
                </div>
              </>
            ) : (
              <>
                <div className="action-card admin" onClick={() => navigate('/admin/trips/new')}>
                  <div className="action-icon">🎆</div>
                  <h3 className="action-title">Create Trip Package</h3>
                  <p className="action-description">Design new travel experiences for users</p>
                </div>
                <div className="action-card admin" onClick={() => navigate('/admin')}>
                  <div className="action-icon">📈</div>
                  <h3 className="action-title">Analytics Dashboard</h3>
                  <p className="action-description">View platform statistics and user insights</p>
                </div>
                <div className="action-card admin" onClick={() => navigate('/featured')}>
                  <div className="action-icon">🌟</div>
                  <h3 className="action-title">Manage Featured</h3>
                  <p className="action-description">Curate and promote the best travel experiences</p>
                </div>
                <div className="action-card admin" onClick={() => { fetchAllReviews(); setShowReviewsModal(true); }}>
                  <div className="action-icon">💬</div>
                  <h3 className="action-title">Guide Reviews <span className="reviews-count-badge">{allReviews.length}</span></h3>
                  <p className="action-description">View all user-submitted guide reviews</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Featured Trips Section for Admin */}
        {user?.role === 'admin' && featuredTrips.length > 0 && (
          <div className="featured-trips-section">
            <div className="section-header">
              <h2 className="section-title">⭐ Featured Trips</h2>
            </div>
            <div className="trips-grid">
              {featuredTrips.map((trip, index) => (
                <div key={trip._id} className={`trip-card-new featured-trip ${trip.status || 'planned'}`}>
                  <div className="trip-card-header">
                    <div className="trip-image-wrapper">
                      <img 
                        src={getImageForTrip(trip, index)} 
                        alt={trip.title}
                        className="trip-image-new"
                        onError={(e) => {
                          e.target.src = defaultImages[0];
                        }}
                      />
                      {getTotalImagesForTrip(trip) > 1 && (
                        <>
                          <button 
                            className="carousel-btn carousel-prev"
                            onClick={(e) => prevImage(trip._id, e)}
                          >
                            ‹
                          </button>
                          <button 
                            className="carousel-btn carousel-next"
                            onClick={(e) => nextImage(trip._id, e)}
                          >
                            ›
                          </button>
                          <div className="image-counter">
                            {(currentImageIndex[trip._id] || 0) + 1}/{getTotalImagesForTrip(trip)}
                          </div>
                        </>
                      )}
                      <div className="trip-overlay">
                        <div className="trip-badges">
                          <div className={`status-badge ${trip.status || 'planned'}`}>
                            {(trip.status || 'Planned').charAt(0).toUpperCase() + (trip.status || 'planned').slice(1)}
                          </div>
                          <div className="featured-star">⭐</div>
                        </div>
                        <div className="trip-quick-actions">
                          <button 
                            onClick={() => navigate(`/trip/${trip._id}/edit`)} 
                            className="quick-action-btn edit-btn"
                            title="Edit Trip"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => openTripDetails(trip)} 
                            className="quick-action-btn details-btn"
                            title="View Details"
                          >
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="trip-card-body">
                    <div className="trip-header-info">
                      <h3 className="trip-title-new">{trip.title}</h3>
                      <div className="trip-destination-new">
                        <span className="location-icon">📍</span>
                        {trip.destinationCity && trip.destinationCountry 
                          ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                          : trip.destination || 'Destination TBD'
                        }
                      </div>
                    </div>
                    
                    <p className="trip-description-new">
                      {trip.description || trip.detailedDescription || trip.shortDescription || 'No description available'}
                    </p>
                    
                    <div className="trip-details-grid">
                      <div className="detail-item">
                        <div className="detail-icon">⏱️</div>
                        <div className="detail-content">
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">
                            {trip.startDate && trip.endDate 
                              ? formatDateRange(trip.startDate, trip.endDate)
                              : trip.duration?.days 
                                ? `${trip.duration.days} days`
                                : 'Flexible'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon">💰</div>
                        <div className="detail-content">
                          <span className="detail-label">Budget</span>
                          <span className="detail-value">
                            {formatBudget(trip)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="trip-card-footer">
                      <div className="trip-actions-new">
                        <button 
                          onClick={() => openTripDetails(trip)} 
                          className="btn-primary-new"
                        >
                          <span className="btn-icon">👁️</span>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trips Section - Only show for regular users */}
        {user?.role !== 'admin' && (
        <div className="trips-section">
          <div className="section-header">
            <h2 className="section-title">Your Trips</h2>
            
            {/* Filter Buttons */}
            <div className="trip-filters">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => filterTrips('all')}
              >
                All ({trips.length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'planned' ? 'active' : ''}`}
                onClick={() => filterTrips('planned')}
              >
                Planned ({trips.filter(t => (t.status || 'planned').toLowerCase() === 'planned').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'ongoing' ? 'active' : ''}`}
                onClick={() => filterTrips('ongoing')}
              >
                Ongoing ({trips.filter(t => (t.status || 'planned').toLowerCase() === 'ongoing').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => filterTrips('completed')}
              >
                Completed ({trips.filter(t => (t.status || 'planned').toLowerCase() === 'completed').length})
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your trips...</p>
            </div>
          ) : filteredTrips.length === 0 && activeFilter !== 'all' ? (
            <div className="empty-filter-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No {activeFilter} trips found</h3>
              <p>You don't have any {activeFilter} trips yet.</p>
              <button onClick={() => filterTrips('all')} className="btn btn-secondary">
                Show All Trips
              </button>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✈️</div>
              <h3>{user?.role === 'admin' ? 'No trip packages created yet' : 'No trips planned yet'}</h3>
              <p>
                {user?.role === 'admin' 
                  ? 'Start creating amazing travel packages for your users to discover and book.' 
                  : 'Start planning your first adventure and create unforgettable memories.'
                }
              </p>
              {user?.role !== 'admin' ? (
                <button onClick={() => navigate('/plan-trip')} className="btn btn-primary">
                  Plan Your First Trip
                </button>
              ) : (
                <button onClick={() => navigate('/admin/trips/new')} className="btn btn-primary">
                  Create First Package
                </button>
              )}
            </div>
          ) : (
            <div className="trips-grid">
              {filteredTrips.slice(0, 6).map((trip, index) => (
                <div key={trip._id} className={`trip-card-new ${trip.status || 'planned'} ${trip.isFeatured ? 'featured-trip' : ''}`}>
                  <div className="trip-card-header">
                    <div className="trip-image-wrapper">
                      <img 
                        src={getImageForTrip(trip, index)} 
                        alt={trip.title}
                        className="trip-image-new"
                        onError={(e) => {
                          e.target.src = defaultImages[0];
                        }}
                      />
                      {getTotalImagesForTrip(trip) > 1 && (
                        <>
                          <button 
                            className="carousel-btn carousel-prev"
                            onClick={(e) => prevImage(trip._id, e)}
                          >
                            ‹
                          </button>
                          <button 
                            className="carousel-btn carousel-next"
                            onClick={(e) => nextImage(trip._id, e)}
                          >
                            ›
                          </button>
                          <div className="image-counter">
                            {(currentImageIndex[trip._id] || 0) + 1}/{getTotalImagesForTrip(trip)}
                          </div>
                        </>
                      )}
                      <div className="trip-overlay">
                        <div className="trip-badges">
                          <div className={`status-badge ${trip.status || 'planned'}`}>
                            {(trip.status || 'Planned').charAt(0).toUpperCase() + (trip.status || 'planned').slice(1)}
                          </div>
                          {trip.isFeatured && (
                            <div className="featured-star">
                              ⭐
                            </div>
                          )}
                        </div>
                        <div className="trip-quick-actions">
                          <button 
                            onClick={() => navigate(`/trip/${trip._id}/edit`)} 
                            className="quick-action-btn edit-btn"
                            title="Edit Trip"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => openTripDetails(trip)} 
                            className="quick-action-btn details-btn"
                            title="View Details"
                          >
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="trip-card-body">
                    <div className="trip-header-info">
                      <h3 className="trip-title-new">{trip.title}</h3>
                      <div className="trip-destination-new">
                        <span className="location-icon">📍</span>
                        {trip.destinationCity && trip.destinationCountry 
                          ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                          : trip.destination || 'Destination TBD'
                        }
                      </div>
                    </div>
                    
                    <p className="trip-description-new">
                      {trip.description || trip.detailedDescription || trip.shortDescription || 'No description available'}
                    </p>
                    
                    <div className="trip-details-grid">
                      <div className="detail-item">
                        <div className="detail-icon">⏱️</div>
                        <div className="detail-content">
                          <span className="detail-label">Duration</span>
                          <span className="detail-value">
                            {trip.startDate && trip.endDate 
                              ? formatDateRange(trip.startDate, trip.endDate)
                              : trip.duration?.days 
                                ? `${trip.duration.days} days`
                                : 'Flexible'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon">💰</div>
                        <div className="detail-content">
                          <span className="detail-label">Budget</span>
                          <span className="detail-value">
                            {formatBudget(trip)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="trip-card-footer">
                      <div className="trip-actions-new">
                        <button 
                          onClick={() => openTripDetails(trip)} 
                          className="btn-primary-new"
                        >
                          <span className="btn-icon">👁️</span>
                          View Details
                        </button>
                        <button 
                          onClick={() => handleDelete(trip._id)} 
                          className="btn-danger-new"
                        >
                          <span className="btn-icon">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredTrips.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button 
                onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')} 
                className="btn-secondary-hero"
              >
                View All {activeFilter === 'all' ? '' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} {user?.role === 'admin' ? 'Packages' : 'Trips'} ({filteredTrips.length})
              </button>
            </div>
          )}
        </div>
        )}

      </div>

      {showReviewsModal && (
        <div className="modal-overlay" onClick={() => setShowReviewsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💬 Guide Reviews ({allReviews.length})</h2>
              <button className="modal-close" onClick={() => setShowReviewsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {allReviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Reviews submitted by users will appear here</p>
                </div>
              ) : (
                <div className="reviews-admin-list">
                  {allReviews.map(r => (
                    <div key={r._id} className="reviews-admin-card">
                      <div className="reviews-admin-top">
                        <div className="reviews-admin-avatar">{r.userName.charAt(0).toUpperCase()}</div>
                        <div className="reviews-admin-meta">
                          <span className="reviews-admin-name">{r.userName}</span>
                          <span className="reviews-admin-guide">{r.guideTitle}</span>
                          <span className="reviews-admin-date">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="reviews-admin-stars">
                          {'★'.repeat(r.rating)}<span className="reviews-admin-stars-empty">{'★'.repeat(5 - r.rating)}</span>
                        </div>
                      </div>
                      <p className="reviews-admin-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
