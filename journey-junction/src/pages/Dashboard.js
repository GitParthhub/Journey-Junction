import React, { useState, useEffect, useContext } from 'react';
import { tripAPI } from '../services/api';
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Using Bali images as default with fallbacks
  const defaultImages = [
    '/images/bali.webp',
    '/images/bali-2.jpg', 
    '/images/bali-3.jpg',
    '/images/ubud-bali.jpg'
  ];

  useEffect(() => {
    fetchTrips();
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
      return trip.images[bestIndex] || trip.images[0]; // Use best photo or first image
    }
    // Handle single image from old format
    if (trip.image) {
      return trip.image;
    }
    // Use default images
    return defaultImages[index % defaultImages.length];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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
              </>
            )}
          </div>
        </div>

        {/* Trips Section */}
        <div className="trips-section">
          <div className="section-header">
            <h2 className="section-title">{user?.role === 'admin' ? 'Trip Packages' : 'Your Trips'}</h2>
            
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
                            onClick={() => navigate(`/trip/${trip._id}`)} 
                            className="quick-action-btn view-btn"
                            title="View Complete Details"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/trips/${trip._id}/edit`)} 
                            className="quick-action-btn edit-btn"
                            title="Edit Trip"
                          >
                            ✏️
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
                        {trip.destination}
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
                            {formatCurrency(trip.budget || trip.basePrice || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="trip-card-footer">
                      <div className="trip-actions-new">
                        <button 
                          onClick={() => navigate(`/trip/${trip._id}`)} 
                          className="btn-primary-new"
                          title="View complete trip details"
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
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
