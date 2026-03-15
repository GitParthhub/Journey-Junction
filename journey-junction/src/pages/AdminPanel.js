import React, { useState, useEffect } from 'react';
import { adminAPI, paymentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState({});
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [imageTransitioning, setImageTransitioning] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchTrips();
    fetchUsers();
    fetchApplicants();
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const notificationInterval = setInterval(loadNotifications, 30000);
    
    // Listen for payment notifications from localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'adminNotifications') {
        loadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(notificationInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auto-advance carousel for trips with multiple images
  useEffect(() => {
    const intervals = {};
    
    trips.forEach(trip => {
      const totalImages = getTotalImagesForTrip(trip);
      
      // Only set up carousel for trips with multiple images
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
          }, 200);
        }, 4000);
      }
    });

    // Cleanup function
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [trips]);

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTrips = async () => {
    try {
      const { data } = await adminAPI.getAllTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchApplicants = async () => {
    try {
      const { data } = await adminAPI.getTripApplicants();
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      // Try to load from API first (for real-time notifications)
      try {
        const { data } = await paymentAPI.getAdminNotifications();
        setNotifications(data);
        
        // Count unread notifications
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
        
        // Also store in localStorage as backup
        localStorage.setItem('adminNotifications', JSON.stringify(data));
      } catch (apiError) {
        // Fallback to localStorage if API fails
        const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        setNotifications(storedNotifications);
        
        // Count unread notifications
        const unread = storedNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      const updatedNotifications = storedNotifications.map(notification => 
        notification.timestamp === notificationId 
          ? { ...notification, read: true }
          : notification
      );
      
      localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      const updatedNotifications = storedNotifications.map(notification => ({ ...notification, read: true }));
      
      localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
      loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      localStorage.setItem('adminNotifications', JSON.stringify([]));
      loadNotifications();
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getImageForTrip = (trip, imageIndex = 0) => {
    // Only use trip-specific uploaded images (galleryImages from the new format)
    if (trip.galleryImages && trip.galleryImages.length > 0) {
      // Filter to only include base64 uploaded images, not default images
      const uploadedImages = trip.galleryImages.filter(imageUrl => 
        imageUrl.startsWith('data:image/') || 
        (!imageUrl.includes('/images/') && !imageUrl.includes('/assets/') && 
         !imageUrl.includes('default') && !imageUrl.includes('placeholder'))
      );
      
      if (uploadedImages.length > 0) {
        return uploadedImages[imageIndex % uploadedImages.length];
      }
    }
    
    // Fallback: check for single uploaded image in old format
    if (trip.image && trip.image.startsWith('data:image/')) {
      return trip.image;
    }
    
    // If no uploaded images, return null to show placeholder
    return null;
  };

  const getTotalImagesForTrip = (trip) => {
    // Only count trip-specific uploaded images
    if (trip.galleryImages && trip.galleryImages.length > 0) {
      const uploadedImages = trip.galleryImages.filter(imageUrl => 
        imageUrl.startsWith('data:image/') || 
        (!imageUrl.includes('/images/') && !imageUrl.includes('/assets/') && 
         !imageUrl.includes('default') && !imageUrl.includes('placeholder'))
      );
      return uploadedImages.length;
    }
    
    // Check for single uploaded image in old format
    if (trip.image && trip.image.startsWith('data:image/')) {
      return 1;
    }
    
    // No uploaded images
    return 0;
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
    }, 200);
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
    }, 200);
  };

  const toggleFeatured = async (id) => {
    try {
      await adminAPI.toggleFeaturedTrip(id);
      fetchTrips();
      fetchStats();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure? This will delete the user and all their trips.')) {
      try {
        await adminAPI.deleteUser(id);
        fetchUsers();
        fetchStats();
        fetchTrips();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await adminAPI.deleteTrip(id);
        fetchTrips();
        fetchStats();
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysCount = (trip) => {
    // Use new duration format if available
    if (trip.duration && trip.duration.days) {
      return trip.duration.days;
    }
    // Fallback to old numberOfDays format
    if (trip.numberOfDays) {
      return trip.numberOfDays;
    }
    // Calculate from date range if available
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 'N/A';
  };

  const updateApplicantStatus = async (tripId, applicantId, status) => {
    try {
      await adminAPI.updateApplicantStatus(tripId, applicantId, status);
      fetchApplicants(); // Refresh the applicants list
      fetchTrips(); // Refresh trips to update applicant counts
      alert(`Applicant ${status} successfully!`);
    } catch (error) {
      console.error('Error updating applicant status:', error);
      alert('Error updating applicant status');
    }
  };

  const toggleTripApplicants = (tripId) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  const getTripApplicants = (tripId) => {
    const trip = trips.find(t => t._id === tripId);
    return trip?.applicants || [];
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-section">
        <div className="section-header">
          <h1 className="section-title">Admin Panel</h1>
          <p className="section-subtitle">Manage trips, users, and platform settings</p>
        </div>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'stats' ? 'active' : ''} 
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
          <button 
            className={activeTab === 'trips' ? 'active' : ''} 
            onClick={() => setActiveTab('trips')}
          >
            ✈️ Trips Management
          </button>
          <button 
            className={activeTab === 'applicants' ? 'active' : ''} 
            onClick={() => setActiveTab('applicants')}
          >
            📋 Trip Applicants
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={activeTab === 'notifications' ? 'active' : ''} 
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          <button 
            className="admin-notifications-link" 
            onClick={() => navigate('/admin/notifications')}
          >
            📋 Full Notifications Page
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'stats' && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✈️</div>
                <div className="stat-number">{stats.totalTrips}</div>
                <div className="stat-label">Total Trips</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">{stats.featuredTrips}</div>
                <div className="stat-label">Featured Trips</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-number">{stats.adminUsers}</div>
                <div className="stat-label">Admin Users</div>
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div>
              <div className="admin-actions">
                <button 
                  onClick={() => navigate('/admin/trips/new')} 
                  className="btn btn-primary"
                >
                  + Create New Trip
                </button>
              </div>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Category</th>
                      <th>User</th>
                      <th>Price</th>
                      <th>Days</th>
                      <th>Seats</th>
                      <th>Applicants</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <React.Fragment key={trip._id}>
                        <tr>
                          <td>
                            {getTotalImagesForTrip(trip) > 0 ? (
                              <div className="admin-image-carousel">
                                <img 
                                  src={getImageForTrip(trip, currentImageIndex[trip._id] || 0)} 
                                  alt={trip.title}
                                  className={`admin-trip-image ${
                                    imageTransitioning[trip._id] ? 'fade-out' : 'fade-in'
                                  }`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                
                                {/* Carousel Controls - Only show if multiple images */}
                                {getTotalImagesForTrip(trip) > 1 && (
                                  <>
                                    <button 
                                      className="admin-carousel-btn admin-carousel-prev"
                                      onClick={(e) => prevImage(trip._id, e)}
                                      aria-label="Previous image"
                                    >
                                      ‹
                                    </button>
                                    <button 
                                      className="admin-carousel-btn admin-carousel-next"
                                      onClick={(e) => nextImage(trip._id, e)}
                                      aria-label="Next image"
                                    >
                                      ›
                                    </button>
                                    
                                    {/* Image counter */}
                                    <div className="admin-image-counter">
                                      {(currentImageIndex[trip._id] || 0) + 1}/{getTotalImagesForTrip(trip)}
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="admin-image-placeholder">
                                <div className="admin-placeholder-icon">📸</div>
                              </div>
                            )}
                          </td>
                          <td>{trip.title}</td>
                          <td>{trip.destination}{trip.city ? `, ${trip.city}` : ''}</td>
                          <td>
                            <span className={`category-badge ${trip.category?.toLowerCase() || 'adventure'}`}>
                              {trip.category || 'Adventure'}
                            </span>
                          </td>
                          <td>{trip.userId?.name || 'Unknown'}</td>
                          <td>{formatCurrency(trip.basePrice || trip.budget, trip.currency)}</td>
                          <td>
                            <span className="days-badge">
                              {getDaysCount(trip)} {getDaysCount(trip) !== 'N/A' ? 'days' : ''}
                            </span>
                          </td>
                          <td>{trip.totalSeats || 'N/A'}</td>
                          <td>
                            <button 
                              className="applicants-count-btn"
                              onClick={() => toggleTripApplicants(trip._id)}
                              disabled={!trip.applicants || trip.applicants.length === 0}
                              style={{
                                color: trip.applicants?.length > 0 ? '#4299e1' : '#a0aec0',
                                cursor: trip.applicants?.length > 0 ? 'pointer' : 'not-allowed',
                                fontWeight: trip.applicants?.length > 0 ? '600' : '400'
                              }}
                            >
                              {trip.applicants?.length || 0} applicant{(trip.applicants?.length || 0) !== 1 ? 's' : ''}
                              {trip.applicants?.length > 0 && (
                                <span className="expand-icon">
                                  {expandedTrip === trip._id ? ' ▼' : ' ▶'}
                                </span>
                              )}
                            </button>
                          </td>
                          <td>
                            <span className={`status-badge ${(trip.status || 'active').toLowerCase()}`}>
                              {trip.status || 'Active'}
                            </span>
                          </td>
                          <td>
                            {trip.isFeatured ? (
                              <div className="featured-indicator">⭐</div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                onClick={() => navigate(`/trip/${trip._id}`)} 
                                className="btn-table btn-details"
                                title="View complete trip details"
                              >
                                👁️ View Details
                              </button>
                              <button 
                                onClick={() => navigate(`/admin/trips/${trip._id}/edit`)} 
                                className="btn-table btn-edit"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => toggleFeatured(trip._id)} 
                                className={`btn-table ${trip.isFeatured ? 'btn-unfeature' : 'btn-feature'}`}
                              >
                                {trip.isFeatured ? 'Unfeature' : 'Feature'}
                              </button>
                              <button 
                                onClick={() => deleteTrip(trip._id)} 
                                className="btn-table btn-delete-trip"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expandable Applicants Section */}
                        {expandedTrip === trip._id && (
                          <tr className="applicants-row">
                            <td colSpan="12">
                              <div className="applicants-container">
                                <div className="applicants-header">
                                  <h4>Applicants for "{trip.title}"</h4>
                                  <span className="applicants-count-badge">
                                    {trip.applicants?.length || 0} total applicant{(trip.applicants?.length || 0) !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                {trip.applicants && trip.applicants.length > 0 ? (
                                  <div className="applicants-table-container">
                                    <table className="applicants-table">
                                      <thead>
                                        <tr>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>Applied Date</th>
                                          <th>Preferred Dates</th>
                                          <th>Status</th>
                                          <th>Message</th>
                                          <th>Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {trip.applicants.map((applicant) => (
                                          <tr key={applicant._id}>
                                            <td>
                                              <div className="applicant-name">
                                                <div className="applicant-avatar">
                                                  {(applicant.userId?.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <span>{applicant.userId?.name || 'Unknown'}</span>
                                              </div>
                                            </td>
                                            <td>{applicant.userId?.email || 'N/A'}</td>
                                            <td>{formatDate(applicant.appliedAt)}</td>
                                            <td>
                                              {applicant.preferredStartDate && applicant.preferredEndDate ? (
                                                <div className="preferred-dates">
                                                  <div className="date-range">
                                                    {formatDate(applicant.preferredStartDate)} - {formatDate(applicant.preferredEndDate)}
                                                  </div>
                                                  <small className="date-duration">
                                                    {Math.ceil((new Date(applicant.preferredEndDate) - new Date(applicant.preferredStartDate)) / (1000 * 60 * 60 * 24))} days
                                                  </small>
                                                </div>
                                              ) : (
                                                <span className="no-dates">Not specified</span>
                                              )}
                                            </td>
                                            <td>
                                              <span className={`status-badge ${applicant.status}`}>
                                                {applicant.status === 'pending' && '⏳'}
                                                {applicant.status === 'approved' && '✓'}
                                                {applicant.status === 'rejected' && '✗'}
                                                {' '}{applicant.status}
                                              </span>
                                            </td>
                                            <td>
                                              <div className="message-cell">
                                                {applicant.message ? (
                                                  <div className="message-content" title={applicant.message}>
                                                    {applicant.message}
                                                  </div>
                                                ) : (
                                                  <span className="no-message">No message</span>
                                                )}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="table-actions">
                                                {applicant.status === 'pending' && (
                                                  <>
                                                    <button 
                                                      onClick={() => updateApplicantStatus(trip._id, applicant._id, 'approved')}
                                                      className="btn-table btn-approve"
                                                      title="Approve applicant"
                                                    >
                                                      ✓ Approve
                                                    </button>
                                                    <button 
                                                      onClick={() => updateApplicantStatus(trip._id, applicant._id, 'rejected')}
                                                      className="btn-table btn-reject"
                                                      title="Reject applicant"
                                                    >
                                                      ✗ Reject
                                                    </button>
                                                  </>
                                                )}
                                                {applicant.status === 'approved' && (
                                                  <button 
                                                    onClick={() => updateApplicantStatus(trip._id, applicant._id, 'rejected')}
                                                    className="btn-table btn-reject"
                                                    title="Reject applicant"
                                                  >
                                                    ✗ Reject
                                                  </button>
                                                )}
                                                {applicant.status === 'rejected' && (
                                                  <button 
                                                    onClick={() => updateApplicantStatus(trip._id, applicant._id, 'approved')}
                                                    className="btn-table btn-approve"
                                                    title="Approve applicant"
                                                  >
                                                    ✓ Approve
                                                  </button>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="no-applicants">
                                    <div className="no-applicants-icon">📝</div>
                                    <p>No applicants for this trip yet</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                
                {trips.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">✈️</div>
                    <div className="empty-state-title">No trips found</div>
                    <div className="empty-state-description">Create the first trip to get started</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'applicants' && (
            <div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Trip</th>
                      <th>Applicant</th>
                      <th>Email</th>
                      <th>Applied Date</th>
                      <th>Preferred Dates</th>
                      <th>Status</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.flatMap(trip => 
                      trip.applicants.map(applicant => (
                        <tr key={`${trip._id}-${applicant._id}`}>
                          <td>
                            <div>
                              <strong>{trip.title}</strong>
                              <br />
                              <small>{trip.destination}</small>
                            </div>
                          </td>
                          <td>{applicant.userId?.name || 'Unknown'}</td>
                          <td>{applicant.userId?.email || 'N/A'}</td>
                          <td>{formatDate(applicant.appliedAt)}</td>
                          <td>
                            {applicant.preferredStartDate && applicant.preferredEndDate ? (
                              <div>
                                <small>
                                  {formatDate(applicant.preferredStartDate)} - {formatDate(applicant.preferredEndDate)}
                                </small>
                              </div>
                            ) : (
                              'Not specified'
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${applicant.status}`}>
                              {applicant.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {applicant.message || 'No message'}
                            </div>
                          </td>
                          <td>
                            <div className="table-actions">
                              {applicant.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => updateApplicantStatus(trip._id, applicant._id, 'approved')}
                                    className="btn-table btn-approve"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => updateApplicantStatus(trip._id, applicant._id, 'rejected')}
                                    className="btn-table btn-reject"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {applicant.status === 'approved' && (
                                <button 
                                  onClick={() => updateApplicantStatus(trip._id, applicant._id, 'rejected')}
                                  className="btn-table btn-reject"
                                >
                                  Reject
                                </button>
                              )}
                              {applicant.status === 'rejected' && (
                                <button 
                                  onClick={() => updateApplicantStatus(trip._id, applicant._id, 'approved')}
                                  className="btn-table btn-approve"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {applicants.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-title">No applicants yet</div>
                    <div className="empty-state-description">Trip applicants will appear here when users apply to featured trips</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => deleteUser(user._id)} 
                            className="btn-table btn-delete-user"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-title">No users found</div>
                  <div className="empty-state-description">Users will appear here once they register</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-section">
              <div className="notifications-header">
                <h3>Admin Notifications</h3>
                <div className="notification-actions">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="btn btn-secondary"
                    >
                      Mark All as Read
                    </button>
                  )}
                  <button 
                    onClick={clearAllNotifications}
                    className="btn btn-danger"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">🔔</div>
                    <div className="empty-state-title">No notifications</div>
                    <div className="empty-state-description">Payment and booking notifications will appear here</div>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div 
                      key={notification.timestamp || index}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.timestamp)}
                    >
                      <div className="notification-icon">
                        {notification.type === 'payment_completed' ? '💳' : '🔔'}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">
                          {notification.type === 'payment_completed' ? 'Payment Completed' : 'New Notification'}
                        </div>
                        <div className="notification-message">
                          {notification.user && notification.trip && notification.payment ? (
                            <>
                              <strong>{notification.user.name}</strong> completed payment for 
                              <strong> {notification.trip.title}</strong> - 
                              {notification.payment.currency} {notification.payment.amount} 
                              via {notification.payment.method.toUpperCase()}
                            </>
                          ) : (
                            notification.message || 'New notification received'
                          )}
                        </div>
                        <div className="notification-details">
                          {notification.user && (
                            <div className="detail-item">
                              <span className="detail-label">Customer:</span>
                              <span className="detail-value">{notification.user.name} ({notification.user.email})</span>
                            </div>
                          )}
                          {notification.payment && (
                            <div className="detail-item">
                              <span className="detail-label">Transaction:</span>
                              <span className="detail-value">{notification.payment.transactionId}</span>
                            </div>
                          )}
                        </div>
                        <div className="notification-time">
                          {formatNotificationTime(notification.timestamp)}
                        </div>
                      </div>
                      {!notification.read && <div className="unread-indicator"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
