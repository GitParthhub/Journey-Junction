import React, { useState, useEffect, useContext } from 'react';
import { tripAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
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
      const { data } = await tripAPI.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
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
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-header-bg" style={{ backgroundImage: `url(/images/bali.webp)` }}></div>
          <div className="dashboard-header-overlay"></div>
          <div className="dashboard-header-content">
            <div className="dashboard-welcome">
              <h1>Welcome back, {user?.name}</h1>
              <p>Manage your travel plans and discover new destinations</p>
            </div>
            {user?.role !== 'admin' && (
              <button onClick={() => navigate('/plan-trip')} className="btn-new-trip">
                <span>+</span>
                New Trip
              </button>
            )}
          </div>
        </div>

        <div className="trips-section">
          <h2 className="section-title">Your Trips</h2>
          
          {trips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✈️</div>
              <h3>No trips planned yet</h3>
              <p>Start planning your next adventure and create unforgettable memories.</p>
              {user?.role !== 'admin' && (
                <button onClick={() => navigate('/plan-trip')} className="btn btn-primary">
                  Plan Your First Trip
                </button>
              )}
              {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="btn btn-primary">
                  Go to Admin Panel
                </button>
              )}
            </div>
          ) : (
            <div className="trips-grid">
              {trips.map((trip, index) => (
                <div key={trip._id} className="trip-card">
                  <img 
                    src={getImageForTrip(trip, index)} 
                    alt={trip.title}
                    className="trip-image"
                    onError={(e) => {
                      e.target.src = defaultImages[0];
                    }}
                  />
                  <div className="trip-content">
                    <h3 className="trip-title">{trip.title}</h3>
                    <p className="trip-destination">{trip.destination}</p>
                    <p className="trip-description">
                      {trip.description || trip.detailedDescription || 'No description available'}
                    </p>
                    
                    {/* Trip Highlights */}
                    {trip.highlights && (
                      <div className="trip-highlights">
                        <h4 className="highlights-title">✨ Highlights</h4>
                        <p className="highlights-text">{trip.highlights}</p>
                      </div>
                    )}
                    
                    <div className="trip-meta">
                      <div className="trip-meta-item">
                        <span className="trip-meta-label">Duration</span>
                        <span className="trip-meta-value">
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </span>
                      </div>
                      <div className="trip-meta-item">
                        <span className="trip-meta-label">Budget</span>
                        <span className="trip-meta-value">{formatCurrency(trip.budget)}</span>
                      </div>
                    </div>
                    
                    <div className="trip-meta">
                      <div className="trip-meta-item">
                        <span className="trip-meta-label">Status</span>
                        <span className={`trip-status ${trip.status}`}>{trip.status}</span>
                      </div>
                      {trip.activities && trip.activities.length > 0 && (
                        <div className="trip-meta-item">
                          <span className="trip-meta-label">Activities</span>
                          <span className="trip-meta-value">{trip.activities.length} planned</span>
                        </div>
                      )}
                      {trip.images && trip.images.length > 1 && (
                        <div className="trip-meta-item">
                          <span className="trip-meta-label">Photos</span>
                          <span className="trip-meta-value">{trip.images.length} photos</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="trip-actions">
                      <button 
                        onClick={() => navigate(`/trip/${trip._id}`)} 
                        className="btn-details"
                      >
                        Show Details
                      </button>
                      {user?.role !== 'admin' && (
                        <button 
                          onClick={() => navigate(`/plan-trip/${trip._id}`)} 
                          className="btn-edit"
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(trip._id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
