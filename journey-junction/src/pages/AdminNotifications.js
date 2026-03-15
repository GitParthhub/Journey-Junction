import React, { useState, useEffect, useContext } from 'react';
import { adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchNotifications();
  }, [user, navigate]);

  const fetchNotifications = async () => {
    try {
      const { data } = await adminAPI.getNotifications();
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await adminAPI.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true, readAt: new Date() } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await adminAPI.markAllNotificationsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date() }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await adminAPI.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);
        break;
      case 'read':
        filtered = filtered.filter(n => n.read);
        break;
      case 'urgent':
        filtered = filtered.filter(n => n.priority === 'urgent' || n.priority === 'high');
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'trip_request': return '✈️';
      case 'booking': return '📅';
      case 'payment': return '💳';
      case 'general': return '📢';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="admin-notifications-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="admin-notifications-page">
      <Navbar />
      
      <div className="notifications-container">
        <div className="page-header">
          <div className="header-info">
            <h1>Admin Notifications</h1>
            <p>{notifications.length} total • {unreadCount} unread</p>
          </div>
          
          <div className="header-actions">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="btn-mark-all">
                Mark All Read
              </button>
            )}
          </div>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="urgent">High Priority</option>
            </select>
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notifications found</h3>
            <p>No notifications match your current filter.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-item ${!notification.read ? 'unread' : 'read'}`}
              >
                <div className="notification-indicator">
                  <div 
                    className="priority-dot" 
                    style={{ backgroundColor: getPriorityColor(notification.priority) }}
                  ></div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>

                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-details">
                    {notification.customer && (
                      <span className="detail-item">
                        👤 {notification.customer.name} • {notification.customer.email}
                      </span>
                    )}
                    {notification.trip && (
                      <span className="detail-item">
                        📍 {notification.trip.destination} • 👥 {notification.trip.numberOfTravelers} travelers
                      </span>
                    )}
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification._id)}
                      className="action-btn read-btn"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notification._id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;