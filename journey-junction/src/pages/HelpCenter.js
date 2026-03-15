import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const topics = [
  { icon: '✈️', title: 'Trip Planning', desc: 'Learn how to create, edit, and manage your trips from the dashboard.' },
  { icon: '🔐', title: 'Account & Security', desc: 'Manage your profile, change password, and keep your account secure.' },
  { icon: '💳', title: 'Payments & Billing', desc: 'Understand payment methods, refunds, and billing cycles.' },
  { icon: '⭐', title: 'Featured Trips', desc: 'Discover how trips get featured and how to explore community picks.' },
  { icon: '🔔', title: 'Notifications', desc: 'Control what alerts you receive and how you receive them.' },
  { icon: '📖', title: 'Travel Guides', desc: 'Access expert guides, tips, and destination insights.' },
];

const guides = [
  { q: 'How do I create my first trip?', a: 'Go to your Dashboard and click "Plan Your Trip". Fill in the destination, dates, budget, and activities, then hit Create Trip. Your trip will appear on your dashboard immediately.' },
  { q: 'Can I edit a trip after creating it?', a: 'Yes! Click the ✏️ edit icon on any trip card from your dashboard. You can update all details including dates, budget, and activities at any time.' },
  { q: 'How do I delete my account?', a: 'Navigate to Settings → Account → Delete Account. This action is permanent and will remove all your trips and data. Contact us before deleting if you need help.' },
  { q: 'Why can\'t I see my trip in Featured Trips?', a: 'Featured trips are curated by our admin team. If you\'d like your trip featured, make sure it has a complete description, dates, and a good image. Admins review trips regularly.' },
];

const HelpCenter = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <Navbar />
      <div className="info-hero">
        <div>
          <div className="info-hero-icon">🛟</div>
          <h1>Help Center</h1>
          <p>Everything you need to get the most out of Journey Junction</p>
        </div>
      </div>

      <div className="info-container">
        <h2 className="info-section-title">Browse by Topic</h2>
        <div className="info-cards-grid">
          {topics.map((t, i) => (
            <div className="info-card" key={i}>
              <div className="info-card-icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="info-section-title">Quick Start Guides</h2>
        <div className="faq-list">
          {guides.map((g, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                {g.q}
                <span className={`faq-chevron ${openIdx === i ? 'open' : ''}`}>▼</span>
              </button>
              {openIdx === i && <div className="faq-answer">{g.a}</div>}
            </div>
          ))}
        </div>

        <div className="info-cta">
          <h2>Still need help?</h2>
          <p>Our support team is available 24/7 to assist you with any questions.</p>
          <span className="info-cta-btn" style={{ cursor: 'pointer' }} onClick={() => navigate('/contact-us')}>
            Contact Support →
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
