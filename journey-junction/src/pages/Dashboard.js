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
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState({});
  const [featuredTransitioning, setFeaturedTransitioning] = useState({});

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Selected 5 best Himalaya images for carousel
  const himalayaCarouselImages = [
    '/images/himalaya/him2.jpeg',
    '/images/himalaya/him3.jpg',
    '/images/himalaya/hampta.jpeg',
    '/images/himalaya/triund.jpeg',
    '/images/himalaya/valley.jpg'
  ];

  // Rajasthan cover photo for dashboard cards
  const rajasthanCoverPhoto = '/images/rajasthan/rajasthan1.jpeg';

  // Rajasthan royal heritage images - using actual uploaded images with Hawa Mahal as primary
  const rajasthanImages = [
    '/images/rajasthan/h71soQPJS_ZzkQ9GduAHl4Go_e7gUqPKZ_-UfjpCoWrH1Wu8zpILpQ1m9UgTVLElKaLVCHxbHJtI9_O7_hs1x2Vj4QWUJJSllgWNJ6kBJHM.jpeg', // Hawa Mahal - primary image
    '/images/rajasthan/rajasthan1.jpeg',
    '/images/rajasthan/-zgcUxh4KMeyquudTNwFqaJ7SIxIa6eW7PutoEOk2jZuL-nFeMwxWoHgp9e6kJi7LrLMmtDtAK1Eaw6QdTZIvSXidZYu8nRvKQ1NrmBvi0w.jpeg',
    '/images/rajasthan/kc997oKX_Rfk8Xlbg21RfRlKF0m3DjmiYfDY0Iq2lAQQdjuND3yVLTEtHp7hv100dxzWq_8_BvYHvZy3HpVfSB3sCP2_AswPnnGv5XIlEM8.jpeg',
    '/images/rajasthan/mJhhnB4vUqAFJ2OYJRHS3LlL391K-PVwZVcpVSqYHQMxrZzhIBHVBcBsTxWuoTD4jymZBSv_1UG95Su0f3T3Roq9516gFbgr6BaYKeM7fq4.jpeg'
  ];

  const defaultImages = [
    '/images/himalaya/him2.jpeg',
    '/images/himalaya/him3.jpg', 
    '/images/himalaya/him4.jpeg',
    '/images/himalaya/valley.jpg',
    '/images/bali.webp',
    '/images/bali-2.jpg',
    '/images/ubud-bali.jpg'
  ];

  const getImagesByDestination = (destination, category, title) => {
    const dest = destination?.toLowerCase() || '';
    const cat = category?.toLowerCase() || '';
    const tripTitle = title?.toLowerCase() || '';
    
    // Check for Rajasthan/Royal Heritage trips
    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('jodhpur') ||
        dest.includes('jaisalmer') || dest.includes('udaipur') || tripTitle.includes('rajasthan') ||
        tripTitle.includes('royal') || tripTitle.includes('heritage') || cat.includes('cultural')) {
      return rajasthanImages;
    }
    
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
    
    // Enhanced Himalaya/Adventure Trek detection - using curated 5 images
    if (dest.includes('himalaya') || dest.includes('himachal') || dest.includes('triund') || 
        dest.includes('hampta') || dest.includes('kedar') || dest.includes('bhamhatal') ||
        dest.includes('manali') || dest.includes('shimla') || dest.includes('dharamshala') ||
        dest.includes('kasol') || dest.includes('tosh') || dest.includes('kheerganga') ||
        cat.includes('trekking') || cat.includes('adventure') || dest.includes('mountain') || 
        dest.includes('trek') || dest.includes('valley') || cat.includes('himalaya')) {
      return himalayaCarouselImages;
    }
    
    if (cat.includes('beach') || dest.includes('beach') || dest.includes('island')) {
      return [
        '/images/bali/beach.jpeg',
        '/images/bali/kutabeach.jpeg',
        '/images/bali/nusapenida.jpeg'
      ];
    }
    
    // Default to himalaya carousel for better visual experience
    return himalayaCarouselImages;
  };

  useEffect(() => {
    fetchTrips();
    fetchFeaturedTrips();
    if (user?.role === 'admin') fetchAllReviews();
  }, []);

  useEffect(() => {
    const intervals = {};
    featuredTrips.forEach(trip => {
      const images = getFeaturedImageSet(trip);
      if (images.length > 1) {
        intervals[trip._id] = setInterval(() => {
          setFeaturedTransitioning(prev => ({ ...prev, [trip._id]: true }));
          setTimeout(() => {
            setFeaturedImageIndex(prev => ({ ...prev, [trip._id]: ((prev[trip._id] || 0) + 1) % images.length }));
            setTimeout(() => setFeaturedTransitioning(prev => ({ ...prev, [trip._id]: false })), 50);
          }, 250);
        }, 4000);
      }
    });
    return () => Object.values(intervals).forEach(clearInterval);
  }, [featuredTrips]);

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

  const fetchFeaturedTrips = async () => {
    try {
      const { data } = await tripAPI.getFeaturedTrips();
      setFeaturedTrips(data);
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    }
  };

  const getFeaturedImageSet = (trip) => {
    if (trip.galleryImages && trip.galleryImages.length > 0) return trip.galleryImages;
    if (trip.image) return [trip.image];
    const dest = trip.destination?.toLowerCase() || '';
    const cat = trip.category?.toLowerCase() || '';
    const title = trip.title?.toLowerCase() || '';
    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('jodhpur') || dest.includes('udaipur') || title.includes('rajasthan'))
      return ['/images/rajasthan/rajasthan1.jpeg'];
    if (dest.includes('bali') || title.includes('bali'))
      return ['/images/bali/bali.webp', '/images/bali/bali-2.jpg', '/images/bali/bali-3.jpg', '/images/bali/ubud-bali.jpg'];
    if (dest.includes('himalaya') || dest.includes('himachal') || dest.includes('trek') || cat.includes('adventure') || title.includes('trek'))
      return ['/images/himalaya/him2.avif', '/images/himalaya/him3.avif', '/images/himalaya/him4.jpg', '/images/himalaya/hampta.jpg', '/images/himalaya/bhamhatal.jpg'];
    return ['/images/background.jpg', '/images/photo-1476514525535-07fb3b4ae5f1.avif'];
  };

  const getFeaturedImage = (trip) => {
    const images = getFeaturedImageSet(trip);
    return images[(featuredImageIndex[trip._id] || 0) % images.length];
  };

  const featuredNextImage = (tripId, e) => {
    e.stopPropagation();
    const images = getFeaturedImageSet(featuredTrips.find(t => t._id === tripId));
    setFeaturedTransitioning(prev => ({ ...prev, [tripId]: true }));
    setTimeout(() => {
      setFeaturedImageIndex(prev => ({ ...prev, [tripId]: ((prev[tripId] || 0) + 1) % images.length }));
      setTimeout(() => setFeaturedTransitioning(prev => ({ ...prev, [tripId]: false })), 50);
    }, 250);
  };

  const featuredPrevImage = (tripId, e) => {
    e.stopPropagation();
    const images = getFeaturedImageSet(featuredTrips.find(t => t._id === tripId));
    setFeaturedTransitioning(prev => ({ ...prev, [tripId]: true }));
    setTimeout(() => {
      setFeaturedImageIndex(prev => ({ ...prev, [tripId]: (prev[tripId] || 0) === 0 ? images.length - 1 : (prev[tripId] || 0) - 1 }));
      setTimeout(() => setFeaturedTransitioning(prev => ({ ...prev, [tripId]: false })), 50);
    }, 250);
  };

  const formatCurrency = (amount, currency = 'INR') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
  };

  const fetchAllReviews = async () => {
    try {
      const { data } = await reviewAPI.getAllReviews();
      setAllReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
        alert('Failed to delete trip. Please try again.');
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
    // Handle gallery images
    if (trip.galleryImages && trip.galleryImages.length > 0) {
      const bestIndex = trip.bestPhotoIndex || 0;
      return trip.galleryImages[bestIndex] || trip.galleryImages[0];
    }
    // Handle single image from old format
    if (trip.image) {
      return trip.image;
    }
    // Get single image by destination - use Rajasthan cover photo for Rajasthan trips
    const dest = trip.destination?.toLowerCase() || '';
    const tripTitle = trip.title?.toLowerCase() || '';
    
    // Check for Rajasthan/Royal Heritage trips and use Rajasthan cover photo
    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('jodhpur') ||
        dest.includes('jaisalmer') || dest.includes('udaipur') || tripTitle.includes('rajasthan') ||
        tripTitle.includes('royal') || tripTitle.includes('heritage')) {
      return rajasthanCoverPhoto; // Use dedicated cover photo for dashboard cards
    }
    
    // Get single image by destination (no carousel)
    const destImages = getImagesByDestination(trip.destination, trip.category, trip.title);
    return destImages[0] || himalayaCarouselImages[0];
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

        {/* Featured Trips Section */}
        <div className="db-featured-section">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Trips</h2>
            <button className="btn-view-all-featured" onClick={() => navigate('/featured')}>View All →</button>
          </div>
          {featuredTrips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h3>No featured trips yet</h3>
              <p>{user?.role === 'admin' ? 'Create your first featured trip package.' : 'Check back soon for amazing travel experiences.'}</p>
              {user?.role === 'admin' && <button onClick={() => navigate('/admin/trips/new')} className="btn btn-primary">Create Featured Trip</button>}
            </div>
          ) : (
            <div className="db-featured-grid">
              {featuredTrips.map(trip => {
                const images = getFeaturedImageSet(trip);
                const currentIdx = featuredImageIndex[trip._id] || 0;
                const CATEGORY_ICONS = { adventure: '🏔️', beach: '🏖️', cultural: '🏛️', luxury: '💎', budget: '💰', family: '👨‍👩‍👧', honeymoon: '💑', wildlife: '🦁' };
                return (
                  <div key={trip._id} className="db-featured-card">
                    <div className="db-featured-carousel">
                      <img
                        src={getFeaturedImage(trip)}
                        alt={trip.title}
                        className={`db-featured-img ${featuredTransitioning[trip._id] ? 'fade-out' : 'fade-in'}`}
                        onError={e => { e.target.src = '/images/background.jpg'; }}
                      />
                      {images.length > 1 && (
                        <>
                          <button className="db-carousel-btn db-carousel-prev" onClick={e => featuredPrevImage(trip._id, e)}>‹</button>
                          <button className="db-carousel-btn db-carousel-next" onClick={e => featuredNextImage(trip._id, e)}>›</button>
                          <div className="db-carousel-dots">
                            {images.map((_, i) => <button key={i} className={`db-carousel-dot ${currentIdx === i ? 'active' : ''}`} onClick={e => { e.stopPropagation(); setFeaturedImageIndex(prev => ({ ...prev, [trip._id]: i })); }} />)}
                          </div>
                        </>
                      )}
                      <div className="db-card-overlay">
                        <span className="db-badge-featured">⭐ Featured</span>
                        {trip.category && <span className="db-badge-category">{CATEGORY_ICONS[trip.category?.toLowerCase()] || '🌍'} {trip.category}</span>}
                      </div>
                      <div className="db-price-pill">
                        <span className="db-price-from">From</span>
                        <span className="db-price-amount">{formatCurrency(trip.basePrice || trip.budget, trip.currency)}</span>
                      </div>
                    </div>

                    <div className="db-featured-body">
                      <h3 className="db-featured-title">{trip.title}</h3>
                      <p className="db-featured-dest">📍 {trip.destination}{trip.city ? `, ${trip.city}` : ''}</p>
                      <p className="db-featured-desc">{trip.shortDescription || trip.description}</p>

                      <div className="db-info-row">
                        <span>🕐 {trip.duration?.days ? `${trip.duration.days}D/${trip.duration.nights}N` : trip.numberOfDays ? `${trip.numberOfDays} days` : 'Flexible'}</span>
                        <span>💺 {trip.totalSeats ? `${trip.totalSeats} seats` : 'Open'}</span>
                        <span>👥 {trip.applicants?.length || 0} joined</span>
                      </div>

                      {trip.activities?.length > 0 && (
                        <div className="db-activity-tags">
                          {trip.activities.slice(0, 3).map((a, i) => <span key={i} className="db-activity-tag">{a.trim()}</span>)}
                        </div>
                      )}

                      <div className="db-featured-author">
                        <div className="db-author-avatar">{trip.userId?.name ? trip.userId.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</div>
                        <div>
                          <div className="db-author-name">{trip.userId?.name || 'Organizer'}</div>
                          <div className="db-author-role">Trip Organizer</div>
                        </div>
                      </div>

                      <div className="db-featured-actions">
                        <button className="db-btn-details" onClick={() => navigate(`/trip/${trip._id}/details`)}>👁️ View Details</button>
                        {user?.role === 'admin'
                          ? <button className="db-btn-book" onClick={() => navigate(`/admin/trips/${trip._id}/edit`)}>✏️ Edit Trip</button>
                          : <button className="db-btn-book" onClick={() => navigate('/confirm-trip', { state: { tripData: { tripTitle: trip.title, destination: trip.destination, basePrice: trip.basePrice || trip.budget, currency: trip.currency || 'INR', image: getFeaturedImage(trip), duration: trip.duration, category: trip.category, tripId: trip._id } } })}>🏷️ Book This Trip</button>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
                      {trip.shortDescription || (trip.description && trip.description.length > 120 ? trip.description.substring(0, 120) + '...' : trip.description) || (trip.detailedDescription && trip.detailedDescription.length > 120 ? trip.detailedDescription.substring(0, 120) + '...' : trip.detailedDescription) || 'Experience an amazing adventure with breathtaking views and unforgettable memories.'}
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