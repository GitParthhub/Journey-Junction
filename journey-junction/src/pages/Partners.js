import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CompanyPages.css';

const platinumPartners = [
  { emoji: '🏨', name: 'Taj Hotels', type: 'Luxury Accommodation' },
  { emoji: '✈️', name: 'IndiGo Airlines', type: 'Airline Partner' },
  { emoji: '🚂', name: 'IRCTC', type: 'Rail Booking' },
];

const goldPartners = [
  { emoji: '🏩', name: 'OYO Rooms', type: 'Budget Hotels' },
  { emoji: '🚗', name: 'Zoomcar', type: 'Self-Drive Rentals' },
  { emoji: '🛡️', name: 'HDFC ERGO', type: 'Travel Insurance' },
  { emoji: '💳', name: 'HDFC Bank', type: 'Travel Credit Cards' },
];

const silverPartners = [
  { emoji: '🏕️', name: 'Zostel', type: 'Hostels' },
  { emoji: '🚌', name: 'RedBus', type: 'Bus Booking' },
  { emoji: '🗺️', name: 'MakeMyTrip', type: 'Travel Portal' },
  { emoji: '📸', name: 'Airbnb', type: 'Unique Stays' },
  { emoji: '🎯', name: 'Thrillophilia', type: 'Activities & Tours' },
];

const partnerBenefits = [
  { icon: '📊', title: 'Access to 2M+ Travelers', desc: 'Reach a highly engaged audience of active travelers who are actively planning trips and ready to book.' },
  { icon: '🎯', title: 'Targeted Visibility', desc: 'Your brand appears contextually — shown to travelers planning trips to your relevant destinations or categories.' },
  { icon: '📈', title: 'Performance Analytics', desc: 'Real-time dashboard showing impressions, clicks, bookings, and revenue attributed to your Journey Junction presence.' },
  { icon: '🤝', title: 'Co-Marketing Opportunities', desc: 'Joint campaigns, featured placements, newsletter features, and social media collaborations with our team.' },
  { icon: '🔗', title: 'Seamless Integration', desc: 'API integration to embed your inventory directly into trip itineraries for a frictionless booking experience.' },
  { icon: '💬', title: 'Dedicated Account Manager', desc: 'A dedicated partner success manager to help you maximise your presence and ROI on the platform.' },
];

const partnerTypes = [
  { icon: '🏨', title: 'Hotels & Resorts', desc: 'List your property and get discovered by travelers planning trips to your destination.' },
  { icon: '✈️', title: 'Airlines & Transport', desc: 'Integrate flight and transport options directly into traveler itineraries.' },
  { icon: '🎭', title: 'Activities & Experiences', desc: 'Showcase tours, treks, workshops, and unique experiences to adventure seekers.' },
  { icon: '🛡️', title: 'Insurance Providers', desc: 'Offer travel insurance at the point of trip planning when travelers need it most.' },
  { icon: '📸', title: 'Travel Creators', desc: 'Collaborate on content, destination guides, and social campaigns with our creator network.' },
  { icon: '🏢', title: 'Corporate Travel', desc: 'Manage business travel for your organisation with our enterprise solutions.' },
];

const Partners = () => (
  <div className="company-page">
    <Navbar />

    <div className="company-hero">
      <div className="company-hero-badge">🤝 Partner Network</div>
      <div className="company-hero-icon">🌐</div>
      <h1>Our Partners</h1>
      <p>We work with the best in travel — airlines, hotels, insurers, and experience providers — to give our travelers a seamless end-to-end journey.</p>
    </div>

    <div className="company-container">

      {/* Stats */}
      <div className="company-stats">
        {[
          { number: '300+', label: 'Active Partners' },
          { number: '40+', label: 'Countries Covered' },
          { number: '2M+', label: 'Travelers Reached' },
          { number: '₹500Cr+', label: 'Partner Revenue' },
        ].map((s, i) => (
          <div className="company-stat" key={i}>
            <div className="company-stat-number">{s.number}</div>
            <div className="company-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platinum */}
      <div className="company-section-label">Our Partners</div>
      <div className="company-section-title">Partner Showcase</div>
      <div className="company-divider"></div>

      <div className="partners-tier">
        <div className="partners-tier-title">🥇 Platinum Partners</div>
        <div className="partners-grid platinum">
          {platinumPartners.map((p, i) => (
            <div className="partner-card platinum" key={i}>
              <div className="partner-logo">{p.emoji}</div>
              <div className="partner-name">{p.name}</div>
              <div className="partner-type">{p.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="partners-tier">
        <div className="partners-tier-title">🥈 Gold Partners</div>
        <div className="partners-grid gold">
          {goldPartners.map((p, i) => (
            <div className="partner-card gold" key={i}>
              <div className="partner-logo">{p.emoji}</div>
              <div className="partner-name">{p.name}</div>
              <div className="partner-type">{p.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="partners-tier" style={{ marginBottom: '64px' }}>
        <div className="partners-tier-title">🥉 Silver Partners</div>
        <div className="partners-grid silver">
          {silverPartners.map((p, i) => (
            <div className="partner-card silver" key={i}>
              <div className="partner-logo">{p.emoji}</div>
              <div className="partner-name">{p.name}</div>
              <div className="partner-type">{p.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner types */}
      <div className="company-section-label">Who We Work With</div>
      <div className="company-section-title">Partnership Categories</div>
      <div className="company-divider"></div>
      <div className="company-cards">
        {partnerTypes.map((p, i) => (
          <div className="company-card" key={i}>
            <div className="company-card-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="company-section-label">Why Partner With Us</div>
      <div className="company-section-title">Partner Benefits</div>
      <div className="company-divider"></div>
      <div className="company-cards">
        {partnerBenefits.map((b, i) => (
          <div className="company-card" key={i}>
            <div className="company-card-icon">{b.icon}</div>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="company-cta">
        <h2>Become a Partner</h2>
        <p>Join our growing network of 300+ travel partners and reach millions of active travelers planning their next adventure.</p>
        <div className="company-cta-btns">
          <Link to="/contact-us" className="company-cta-primary">Apply to Partner →</Link>
          <Link to="/about-us" className="company-cta-secondary">Learn About Us</Link>
        </div>
      </div>

    </div>
    <Footer />
  </div>
);

export default Partners;
