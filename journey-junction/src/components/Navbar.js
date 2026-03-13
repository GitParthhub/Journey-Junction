import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
          <div className="nav-logo-icon">JJ</div>
          Journey Junction
        </Link>
        <ul className="nav-menu">
          <li><Link to="/dashboard">Dashboard</Link></li>
          {user?.role !== 'admin' && <li><Link to="/plan-trip">Plan Trip</Link></li>}
          <li><Link to="/featured">Featured Trips</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
        </ul>
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
