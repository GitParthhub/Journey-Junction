import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CompanyPages.css';

const pressReleases = [
  {
    date: 'January 15, 2025',
    title: 'Journey Junction Crosses 2 Million Travelers Milestone',
    excerpt: 'The Hyderabad-based travel platform announces it has helped over 2 million travelers plan trips across 180+ destinations, marking a major growth milestone since its 2020 launch.',
  },
  {
    date: 'November 8, 2024',
    title: 'Journey Junction Raises ₹45 Crore in Series A Funding',
    excerpt: 'Led by Sequoia Capital India with participation from Accel Partners, the funding will accelerate AI-powered trip planning features and international market expansion.',
  },
  {
    date: 'September 3, 2024',
    title: 'Launching AI-Powered Trip Recommendations',
    excerpt: 'Journey Junction introduces its intelligent recommendation engine that personalises destination suggestions based on travel history, preferences, and budget — a first for Indian travel platforms.',
  },
  {
    date: 'June 20, 2024',
    title: 'Partnership with IRCTC for Seamless Rail Bookings',
    excerpt: 'Travelers can now book train tickets directly within Journey Junction trip itineraries, making end-to-end trip planning possible without leaving the platform.',
  },
  {
    date: 'March 12, 2024',
    title: 'Journey Junction Wins India Travel Tech Award 2024',
    excerpt: 'Recognised as the Best Trip Planning Platform at the India Travel Tech Summit in Mumbai, beating 120+ nominees across the travel technology sector.',
  },
  {
    date: 'December 1, 2023',
    title: 'Expanding to Southeast Asia — 40 New Destinations Added',
    excerpt: 'Journey Junction adds comprehensive destination guides, local partner networks, and curated itineraries for Thailand, Vietnam, Indonesia, Malaysia, and the Philippines.',
  },
];

const mediaMentions = [
  '📰 The Economic Times', '📺 NDTV', '📱 YourStory', '🗞️ Business Standard',
  '📻 Inc42', '📰 Mint', '🎙️ Entrackr', '📺 ET Now',
];

const pressStats = [
  { number: '200+', label: 'Media Mentions' },
  { number: '45Cr', label: 'Series A Raised' },
  { number: '12', label: 'Industry Awards' },
  { number: '2025', label: 'Founded' },
];

const Press = () => (
  <div className="company-page">
    <Navbar />

    <div className="company-hero">
      <div className="company-hero-badge">📰 Newsroom</div>
      <div className="company-hero-icon">🗞️</div>
      <h1>Press & Media</h1>
      <p>The latest news, announcements, and media resources from Journey Junction</p>
    </div>

    <div className="company-container">

      {/* Stats */}
      <div className="company-stats">
        {pressStats.map((s, i) => (
          <div className="company-stat" key={i}>
            <div className="company-stat-number">{s.number}</div>
            <div className="company-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Press kit */}
      <div className="company-two-col" style={{ marginBottom: '64px' }}>
        <div className="company-text-block">
          <div className="company-section-label">Media Resources</div>
          <h2>Press Kit & Brand Assets</h2>
          <p>Journalists and media professionals can download our official press kit, which includes high-resolution logos, product screenshots, founder headshots, and brand guidelines.</p>
          <p>For interview requests, product demos, or exclusive data insights, please reach out to our communications team directly.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#00798C,#30638E)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              📦 Download Press Kit
            </button>
            <Link to="/contact-us" style={{ padding: '11px 24px', background: 'white', color: '#00798C', border: '2px solid #00798C', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
              📧 Media Enquiry
            </Link>
          </div>
        </div>
        <div className="company-visual">
          <div className="company-visual-icon">📬</div>
          <h3>Press Contact</h3>
          <p style={{ marginBottom: '8px' }}>Ananya Bose — Head of Communications</p>
          <p style={{ marginBottom: '8px' }}>press@journeyjunction.com</p>
          <p>+91 98765 11111</p>
          <p style={{ marginTop: '12px', fontSize: '13px', opacity: 0.75 }}>Response within 4 business hours</p>
        </div>
      </div>

      {/* Press releases */}
      <div className="company-section-label">Latest News</div>
      <div className="company-section-title">Press Releases</div>
      <div className="company-divider"></div>
      <div className="press-grid">
        {pressReleases.map((p, i) => (
          <div className="press-card" key={i}>
            <div className="press-card-header">
              <div className="press-card-date">{p.date}</div>
              <div className="press-card-title">{p.title}</div>
            </div>
            <div className="press-card-body">
              <p>{p.excerpt}</p>
              <button className="press-read-btn">Read Full Release →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Media mentions */}
      <div className="company-section-label">As Seen In</div>
      <div className="company-section-title">Media Coverage</div>
      <div className="company-divider"></div>
      <div className="press-media">
        {mediaMentions.map((m, i) => (
          <div className="press-media-badge" key={i}>{m}</div>
        ))}
      </div>

      {/* CTA */}
      <div className="company-cta">
        <h2>Want to Cover Our Story?</h2>
        <p>We're happy to provide data, interviews, and exclusive insights for your publication.</p>
        <div className="company-cta-btns">
          <Link to="/contact-us" className="company-cta-primary">Contact Press Team</Link>
          <Link to="/about-us" className="company-cta-secondary">Our Story</Link>
        </div>
      </div>

    </div>
    <Footer />
  </div>
);

export default Press;
