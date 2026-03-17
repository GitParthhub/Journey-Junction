import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ConfirmTrip.css';

const ConfirmTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const tripData = location.state?.tripData;

  const formatPrice = (amount, currency = 'INR') => {
    if (!amount) return 'Price not set';
    const num = parseFloat(amount);
    if (currency === 'INR') return `₹${num.toLocaleString('en-IN')}`;
    if (currency === 'USD') return `$${num.toLocaleString('en-US')}`;
    return `${currency} ${num.toLocaleString()}`;
  };

  const handleProceedToPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/payment-methods', { state: { tripData } });
    }, 1500);
  };

  if (!tripData) {
    return (
      <div className="ct-page">
        <Navbar />
        <div className="ct-error">
          <div className="ct-error-icon">✈️</div>
          <h2>No Trip Selected</h2>
          <p>Please go back and select a trip to book.</p>
          <button onClick={() => navigate('/featured')} className="ct-error-btn">
            ← Browse Featured Trips
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const inclusions = [
    { icon: '🏨', title: 'Premium Accommodation', desc: '3–4 star hotels with breakfast' },
    { icon: '🚐', title: 'Transportation', desc: 'All transfers & sightseeing' },
    { icon: '🎯', title: 'Guided Tours', desc: 'Professional local guides' },
    { icon: '📱', title: '24/7 Support', desc: 'Round-the-clock assistance' },
    { icon: '🛡️', title: 'Travel Insurance', desc: 'Comprehensive coverage' },
    { icon: '📸', title: 'Photo Session', desc: 'Photography at key spots' },
  ];

  const policies = [
    { icon: '🔄', title: 'Free Cancellation', desc: 'Cancel up to 7 days before for full refund' },
    { icon: '📅', title: 'Date Changes', desc: 'Modify dates up to 15 days before travel' },
    { icon: '💳', title: 'Secure Payment', desc: 'Bank-level security on all transactions' },
    { icon: '⚡', title: 'Instant Confirmation', desc: 'Booking confirmed right after payment' },
  ];

  return (
    <div className="ct-page">
      <Navbar />

      {/* ── Page Hero ── */}
      <div className="ct-hero">
        {tripData.image && (
          <div className="ct-hero-bg" style={{ backgroundImage: `url(${tripData.image})` }} />
        )}
        <div className="ct-hero-overlay" />
        <div className="ct-hero-content">
          <nav className="ct-breadcrumb">
            <span onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span className="ct-sep">›</span>
            <span onClick={() => navigate('/featured')}>Featured Trips</span>
            <span className="ct-sep">›</span>
            <span className="ct-sep-active">Confirm Booking</span>
          </nav>
          <h1 className="ct-hero-title">Confirm Your Journey</h1>
          <p className="ct-hero-sub">Review your trip details and proceed to secure payment</p>
          <div className="ct-hero-badge">
            <span>✓ Ready to Book</span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="ct-wrapper">
        <div className="ct-layout">

          {/* ════ LEFT COLUMN ════ */}
          <div className="ct-left">

            {/* Trip Summary */}
            <div className="ct-card">
              <div className="ct-card-head">
                <span className="ct-card-icon">🗺️</span>
                <h2>Trip Summary</h2>
              </div>

              <div className="ct-trip-banner">
                {tripData.image && (
                  <div className="ct-trip-img-wrap">
                    <img src={tripData.image} alt={tripData.tripTitle} className="ct-trip-img" />
                    <div className="ct-trip-img-overlay">
                      <span className="ct-img-badge">⭐ Featured</span>
                    </div>
                  </div>
                )}
                <div className="ct-trip-info">
                  <h3 className="ct-trip-title">{tripData.tripTitle}</h3>
                  <p className="ct-trip-dest">📍 {tripData.destination}</p>
                  {tripData.category && (
                    <span className="ct-trip-cat">{tripData.category}</span>
                  )}
                  <div className="ct-meta-grid">
                    <div className="ct-meta-item">
                      <span className="ct-meta-icon">⏱️</span>
                      <div>
                        <span className="ct-meta-label">Duration</span>
                        <span className="ct-meta-val">
                          {tripData.duration
                            ? `${tripData.duration.days}D / ${tripData.duration.nights}N`
                            : 'Flexible'}
                        </span>
                      </div>
                    </div>
                    <div className="ct-meta-item">
                      <span className="ct-meta-icon">👥</span>
                      <div>
                        <span className="ct-meta-label">Travelers</span>
                        <span className="ct-meta-val">{tripData.travelers || '1–2'} People</span>
                      </div>
                    </div>
                    <div className="ct-meta-item">
                      <span className="ct-meta-icon">💰</span>
                      <div>
                        <span className="ct-meta-label">Price / Person</span>
                        <span className="ct-meta-val ct-price-highlight">
                          {formatPrice(tripData.basePrice, tripData.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="ct-meta-item">
                      <span className="ct-meta-icon">📋</span>
                      <div>
                        <span className="ct-meta-label">Status</span>
                        <span className="ct-meta-val ct-status-active">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="ct-card">
              <div className="ct-card-head">
                <span className="ct-card-icon">✅</span>
                <h2>What's Included</h2>
              </div>
              <div className="ct-inclusions-grid">
                {inclusions.map((item, i) => (
                  <div className="ct-inclusion-item" key={i}>
                    <div className="ct-inclusion-icon">{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Policies */}
            <div className="ct-card">
              <div className="ct-card-head">
                <span className="ct-card-icon">📋</span>
                <h2>Booking Policies</h2>
              </div>
              <div className="ct-policies-grid">
                {policies.map((p, i) => (
                  <div className="ct-policy-item" key={i}>
                    <div className="ct-policy-icon">{p.icon}</div>
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="ct-right">

            {/* Price Breakdown */}
            <div className="ct-card ct-sticky-card">
              <div className="ct-card-head">
                <span className="ct-card-icon">💰</span>
                <h2>Price Breakdown</h2>
              </div>

              <div className="ct-price-list">
                <div className="ct-price-row">
                  <span>Base Price (per person)</span>
                  <span className="ct-price-val">{formatPrice(tripData.basePrice, tripData.currency)}</span>
                </div>
                <div className="ct-price-row">
                  <span>Taxes & Service Fees</span>
                  <span className="ct-price-included">Included</span>
                </div>
                <div className="ct-price-row">
                  <span>Travel Insurance</span>
                  <span className="ct-price-included">Included</span>
                </div>
                <div className="ct-price-divider" />
                <div className="ct-price-row ct-price-total">
                  <span>Total Amount</span>
                  <span>{formatPrice(tripData.basePrice, tripData.currency)}</span>
                </div>
              </div>

              <div className="ct-savings-tag">
                🎉 Best price guaranteed on this booking!
              </div>

              <div className="ct-security-row">
                <span className="ct-sec-badge">🔒 SSL Secured</span>
                <span className="ct-sec-badge">🛡️ PCI Compliant</span>
              </div>

              {/* CTA Buttons */}
              <div className="ct-actions">
                <button className="ct-btn-back" onClick={() => navigate(-1)}>
                  ← Back
                </button>
                <button
                  className={`ct-btn-pay ${isLoading ? 'ct-loading' : ''}`}
                  onClick={handleProceedToPayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="ct-spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <span className="ct-arrow">→</span>
                    </>
                  )}
                </button>
              </div>

              <p className="ct-disclaimer">
                By proceeding, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="ct-trust-card">
              <div className="ct-trust-item">
                <span className="ct-trust-icon">🏆</span>
                <div>
                  <strong>Trusted Platform</strong>
                  <p>10,000+ happy travelers</p>
                </div>
              </div>
              <div className="ct-trust-item">
                <span className="ct-trust-icon">⭐</span>
                <div>
                  <strong>Top Rated</strong>
                  <p>4.8 / 5 average rating</p>
                </div>
              </div>
              <div className="ct-trust-item">
                <span className="ct-trust-icon">🔐</span>
                <div>
                  <strong>100% Secure</strong>
                  <p>Encrypted transactions</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConfirmTrip;
