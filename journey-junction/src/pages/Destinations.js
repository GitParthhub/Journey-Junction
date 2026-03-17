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
        <div className="destinations-hero-bg" style={{ backgroundImage: `url(/images/photo-1476514525535-07fb3b4ae5f1.avif)` }}></div>
        <div className="destinations-hero-overlay"></div>
        <div className="destinations-hero-content">
          <span className="destinations-eyebrow">🌍 Explore the World</span>
          <h1 className="destinations-hero-title">Find Your Next<br />Adventure</h1>
          <p className="destinations-hero-subtitle">
            Handpicked destinations curated by travel experts — from Himalayan peaks to tropical shores
          </p>
          <div className="destinations-hero-stats">
            <div className="hero-stat">
              <strong>150+</strong>
              <span>Destinations</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <strong>50+</strong>
              <span>Countries</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <strong>10k+</strong>
              <span>Happy Travelers</span>
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
        <div className="cta-inner">
          <div className="cta-left">
            <img src="/images/photo-1476514525535-07fb3b4ae5f1.avif" alt="Travel Adventure" className="cta-img" />
          </div>
          <div className="cta-right">
            <span className="cta-badge">✈️ Start Exploring</span>
            <h2 className="cta-title">Ready to Start Your Adventure?</h2>
            <p className="cta-desc">Join thousands of travelers who have discovered their dream destinations with Journey Junction.</p>
            <ul className="cta-perks">
              <li>🗺️ Personalised trip planning</li>
              <li>💰 Best price guarantee</li>
              <li>🛡️ 24/7 travel support</li>
            </ul>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => window.location.href = '/plan-trip'}>
                Plan Your Trip
              </button>
              <button className="cta-btn secondary" onClick={() => window.location.href = '/featured'}>
                View Featured Trips
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Destinations;