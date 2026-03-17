import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI, adminAPI } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);



  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        fetchAdminUnreadCount();
        // Poll for new notifications every 10 seconds for more responsive updates
        const interval = setInterval(fetchAdminUnreadCount, 10000);
        
        // Refresh count when window gains focus
        const handleFocus = () => fetchAdminUnreadCount();
        window.addEventListener('focus', handleFocus);
        
        return () => {
          clearInterval(interval);
          window.removeEventListener('focus', handleFocus);
        };
      } else {
        fetchUnreadCount();
        // Poll for new notifications every 10 seconds for more responsive updates
        const interval = setInterval(fetchUnreadCount, 10000);
        
        // Refresh count when window gains focus
        const handleFocus = () => fetchUnreadCount();
        window.addEventListener('focus', handleFocus);
        
        return () => {
          clearInterval(interval);
          window.removeEventListener('focus', handleFocus);
        };
      }
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await authAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchAdminUnreadCount = async () => {
    try {
      const { data } = await adminAPI.getNotificationStats();
      setAdminUnreadCount(data.data?.overview?.unread || 0);
    } catch (error) {
      console.error('Error fetching admin unread count:', error);
    }
  };



  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <div className="nav-logo-container">
            <img src="/images/bali.webp" alt="Journey Junction" className="nav-logo-image" />
            <div className="nav-logo-overlay">
              <span className="nav-logo-icon">✈️</span>
            </div>
          </div>
          <div className="nav-logo-text">
            <span className="nav-logo-title">Journey Junction</span>
            <span className="nav-logo-subtitle">Explore • Dream • Discover</span>
          </div>
        </Link>
        <ul className="nav-menu">
          <li><Link to="/dashboard" className="nav-link"><span className="nav-icon">🏠</span>Dashboard</Link></li>
          <li><Link to="/featured" className="nav-link"><span className="nav-icon">⭐</span>Featured Trips</Link></li>
          {user?.role !== 'admin' && (
            <li>
              <Link to="/notifications" className="nav-link notifications-link">
                <span className="nav-icon">🔔</span>Notifications
                {unreadCount > 0 && (
                  <span className="notification-dot"></span>
                )}
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin/notifications" className="nav-link notifications-link">
                <span className="nav-icon">🔔</span>Notifications
                {adminUnreadCount > 0 && (
                  <span className="notification-dot"></span>
                )}
              </Link>
            </li>
          )}
          {user?.role === 'admin' && <li><Link to="/admin" className="nav-link"><span className="nav-icon">👑</span>Admin Panel</Link></li>}
        </ul>
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Traveler'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🔓</span>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
