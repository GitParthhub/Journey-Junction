import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState({});
  const [trips, setTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchTrips();
    fetchUsers();
  }, []);

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
            Statistics
          </button>
          <button 
            className={activeTab === 'trips' ? 'active' : ''} 
            onClick={() => setActiveTab('trips')}
          >
            Trips Management
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Users
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
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Category</th>
                      <th>User</th>
                      <th>Price</th>
                      <th>Days</th>
                      <th>Seats</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip._id}>
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
                            >
                              Details
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
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
