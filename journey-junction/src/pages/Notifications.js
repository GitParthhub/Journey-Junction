import React, { useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await authAPI.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await authAPI.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handlePaymentClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate to payment methods page with trip data
    navigate('/payment-methods', {
      state: {
        tripData: {
          tripId: notification.tripId,
          tripTitle: notification.actionData?.tripTitle,
          destination: notification.actionData?.destination,
          basePrice: notification.actionData?.basePrice,
          currency: notification.actionData?.currency || 'USD',
          preferredStartDate: notification.actionData?.preferredStartDate,
          preferredEndDate: notification.actionData?.preferredEndDate,
          image: notification.actionData?.image, // Include trip image
          applicantId: notification.actionData?.applicantId // Include applicant ID
        }
      }
    });
    
    console.log('Navigating to payment with data:', {
      tripId: notification.tripId,
      applicantId: notification.actionData?.applicantId,
      tripTitle: notification.actionData?.tripTitle
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <Navbar />
        <div className="notifications-container">
          <div className="loading-spinner">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <Navbar />
      
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <p>Stay updated with your trip applications and bookings</p>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔔</div>
            <h3>No notifications yet</h3>
            <p>You'll see updates about your trip applications here</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-date">{formatDate(notification.createdAt)}</span>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                {notification.actionRequired && notification.actionType === 'payment' && (
                  <div className="notification-actions">
                    <button 
                      className="btn-payment"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaymentClick(notification);
                      }}
                    >
                      💳 Proceed with Payment
                    </button>
                    <div className="payment-info">
                      <span>Amount: {notification.actionData?.currency} {notification.actionData?.basePrice}</span>
                    </div>
                  </div>
                )}
                
                {!notification.isRead && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;