import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DestinationExplorer from '../components/DestinationExplorer';
import './Destinations.css';

const Destinations = () => {
  return (
    <div className="destinations-page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="destinations-hero">
        <div className="destinations-hero-bg" style={{ backgroundImage: `url(/images/background.jpg)` }}></div>
        <div className="destinations-hero-overlay"></div>
        <div className="destinations-hero-content">
          <h1 className="destinations-hero-title">Explore the World</h1>
          <p className="destinations-hero-subtitle">
            Discover breathtaking destinations and plan your perfect getaway
          </p>
          <div className="destinations-hero-stats">
            <div className="hero-stat">
              <span className="stat-number">150+</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Explorer Component */}
      <DestinationExplorer />
      
      {/* Additional Features Section */}
      <div className="destinations-features">
        <div className="features-container">
          <h2 className="features-title">Why Choose Our Destinations?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Expert Curation</h3>
              <p>Hand-picked destinations by travel experts with insider knowledge and local connections.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Value</h3>
              <p>Competitive pricing with transparent costs and no hidden fees for all budget ranges.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Safe & Secure</h3>
              <p>All destinations are carefully vetted for safety with 24/7 support during your travels.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Unique Experiences</h3>
              <p>Access to exclusive activities and authentic local experiences you won't find elsewhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="destinations-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Start Your Adventure?</h2>
            <p>Join thousands of travelers who have discovered their dream destinations with us.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => window.location.href = '/plan-trip'}>
                🗺️ Plan Your Trip
              </button>
              <button className="cta-btn secondary" onClick={() => window.location.href = '/featured'}>
                ⭐ View Featured Trips
              </button>
            </div>
          </div>
          <div className="cta-image">
            <img src="/images/photo-1476514525535-07fb3b4ae5f1.avif" alt="Travel Adventure" />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Destinations;