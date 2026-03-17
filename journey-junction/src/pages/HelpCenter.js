import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const topics = [
  { icon: '✈️', title: 'Trip Planning', desc: 'Create, edit, and manage your trips directly from your dashboard.' },
  { icon: '🔐', title: 'Account & Security', desc: 'Manage your profile, update your password, and secure your account.' },
  { icon: '💳', title: 'Payments & Billing', desc: 'Understand payment methods, refunds, and billing details.' },
  { icon: '⭐', title: 'Featured Trips', desc: 'Discover how trips get featured and explore community picks.' },
  { icon: '🔔', title: 'Notifications', desc: 'Control what alerts you receive and how you receive them.' },
  { icon: '📖', title: 'Travel Guides', desc: 'Access expert guides, tips, and destination insights.' },
];

const guides = [
  { q: 'How do I create my first trip?', a: 'Go to your Dashboard and click "Plan Your Trip". Fill in the destination, dates, budget, and activities, then hit Create Trip. Your trip will appear on your dashboard immediately.' },
  { q: 'Can I edit a trip after creating it?', a: 'Yes! Click the ✏️ edit icon on any trip card from your dashboard. You can update all details including dates, budget, and activities at any time.' },
  { q: 'How do I delete my account?', a: 'Navigate to Settings → Account → Delete Account. This action is permanent and will remove all your trips and data. Contact us before deleting if you need help.' },
  { q: 'Why can\'t I see my trip in Featured Trips?', a: 'Featured trips are curated by our admin team. If you\'d like your trip featured, make sure it has a complete description, dates, and a good image. Admins review trips regularly.' },
  { q: 'How do I reset my password?', a: 'Go to Settings → Security → Change Password. Enter your current password and your new password twice to confirm. Changes take effect immediately.' },
  { q: 'How do I contact a trip organizer?', a: 'Open the trip details from Featured Trips and click "Book This Trip". You can include a message to the organizer in your application.' },
];

const HelpCenter = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredGuides = guides.filter(g =>
    g.q.toLowerCase().includes(search.toLowerCase()) ||
    g.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="info-page">
      <Navbar />

      {/* Hero */}
      <div className="info-hero">
        <div className="info-hero-inner">
          <span className="info-hero-eyebrow">🛟 Support</span>
          <h1>Help Center</h1>
          <p>Everything you need to get the most out of Journey Junction</p>
          <div className="hc-search-bar">
            <span className="hc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for help topics, guides..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="hc-search-input"
            />
          </div>
        </div>
      </div>

      <div className="info-container">

        {/* Topics */}
        <div className="hc-section">
          <div className="hc-section-header">
            <h2 className="hc-section-title">Browse by Topic</h2>
            <p className="hc-section-sub">Find answers organised by category</p>
          </div>
          <div className="info-cards-grid">
            {topics.map((t, i) => (
              <div className="info-card" key={i}>
                <div className="info-card-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="hc-card-link">Learn more →</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guides */}
        <div className="hc-section">
          <div className="hc-section-header">
            <h2 className="hc-section-title">Quick Start Guides</h2>
            <p className="hc-section-sub">
              {search ? `${filteredGuides.length} result${filteredGuides.length !== 1 ? 's' : ''} for "${search}"` : 'Common questions answered'}
            </p>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="hc-empty">
              <span>🔍</span>
              <p>No results found for "<strong>{search}</strong>". Try a different keyword.</p>
            </div>
          ) : (
            <div className="faq-list">
              {filteredGuides.map((g, i) => (
                <div className={`faq-item ${openIdx === i ? 'active' : ''}`} key={i}>
                  <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                    <span>{g.q}</span>
                    <span className={`faq-chevron ${openIdx === i ? 'open' : ''}`}>▼</span>
                  </button>
                  {openIdx === i && <div className="faq-answer">{g.a}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact channels */}
        <div className="hc-section">
          <div className="hc-section-header">
            <h2 className="hc-section-title">Other Ways to Get Help</h2>
            <p className="hc-section-sub">Reach us through any of these channels</p>
          </div>
          <div className="hc-channels">
            <div className="hc-channel-card">
              <div className="hc-channel-icon">💬</div>
              <h4>Live Chat</h4>
              <p>Chat with our support team in real time, available 24/7.</p>
              <span className="hc-channel-badge available">● Available Now</span>
            </div>
            <div className="hc-channel-card">
              <div className="hc-channel-icon">📧</div>
              <h4>Email Support</h4>
              <p>Send us an email and we'll respond within 24 hours.</p>
              <span className="hc-channel-badge">support@journeyjunction.com</span>
            </div>
            <div className="hc-channel-card">
              <div className="hc-channel-icon">📞</div>
              <h4>Phone Support</h4>
              <p>Speak directly with a travel expert Mon–Sat, 9am–6pm.</p>
              <span className="hc-channel-badge">+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="info-cta">
          <div className="info-cta-inner">
            <div>
              <h2>Still need help?</h2>
              <p>Our support team is available 24/7 to assist you with any questions.</p>
            </div>
            <button className="info-cta-btn" onClick={() => navigate('/contact-us')}>
              Contact Support →
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
