import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-container">
                <img src="/images/bali.webp" alt="Journey Junction" className="footer-logo-image" />
                <div className="footer-logo-overlay">
                  <span className="footer-logo-icon">✈️</span>
                </div>
              </div>
              <div className="footer-logo-text">
                <span className="footer-logo-title">Journey Junction</span>
                <span className="footer-logo-subtitle">Your Gateway to Adventure</span>
              </div>
            </div>
            <p className="footer-description">
              Discover extraordinary destinations, create unforgettable memories, and connect with fellow travelers. 
              Your journey begins here at Journey Junction.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <span className="social-icon">📘</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <span className="social-icon">📺</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">🗺️ Explore</h3>
            <ul className="footer-links">
              <li><Link to="/featured">Featured Trips</Link></li>
              <li><Link to="/plan-trip">Plan Your Trip</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><a href="#">Travel Guides</a></li>
              <li><a href="#">Destinations</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">🤝 Support</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Travel Insurance</a></li>
              <li><a href="#">Safety Guidelines</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">🏢 Company</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          <div className="footer-section footer-newsletter">
            <h3 className="footer-title">📧 Stay Updated</h3>
            <p className="newsletter-description">
              Get the latest travel deals, destination guides, and exclusive offers delivered to your inbox.
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <span className="newsletter-icon">🚀</span>
                Subscribe
              </button>
            </div>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>hello@journeyjunction.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <span>© {currentYear} Journey Junction. All rights reserved.</span>
              <span className="footer-tagline">Made with ❤️ for travelers worldwide</span>
            </div>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-decoration">
        <div className="decoration-item">🌍</div>
        <div className="decoration-item">✈️</div>
        <div className="decoration-item">🏔️</div>
        <div className="decoration-item">🏖️</div>
        <div className="decoration-item">🗺️</div>
      </div>
    </footer>
  );
};

export default Footer;