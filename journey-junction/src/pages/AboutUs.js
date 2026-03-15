import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CompanyPages.css';

const stats = [
  { number: '2M+', label: 'Happy Travelers' },
  { number: '180+', label: 'Destinations' },
  { number: '50K+', label: 'Trips Planned' },
  { number: '4.9★', label: 'Average Rating' },
];

const team = [
  { emoji: '👨‍💼', name: 'Arjun Mehta', role: 'CEO & Co-Founder', bio: 'Former travel journalist with 12 years exploring 90+ countries. Passionate about making travel accessible to everyone.' },
  { emoji: '👩‍💻', name: 'Priya Sharma', role: 'CTO & Co-Founder', bio: 'Ex-Google engineer who built scalable platforms for millions of users. Loves hiking and weekend road trips.' },
  { emoji: '👨‍🎨', name: 'Rohan Kapoor', role: 'Head of Design', bio: 'Award-winning UX designer focused on creating seamless travel experiences. Backpacked across Southeast Asia solo.' },
  { emoji: '👩‍📊', name: 'Sneha Iyer', role: 'Head of Operations', bio: 'Operations expert who has coordinated group trips for 500+ travelers. Certified travel consultant.' },
  { emoji: '👨‍🤝‍👨', name: 'Vikram Nair', role: 'Head of Partnerships', bio: 'Built a network of 300+ travel partners across 40 countries. Former hospitality industry veteran.' },
  { emoji: '👩‍🎓', name: 'Ananya Bose', role: 'Head of Content', bio: 'Travel writer and photographer whose work has appeared in National Geographic Traveller India.' },
];

const values = [
  { icon: '🌍', title: 'Explore Fearlessly', desc: 'We believe every person deserves to experience the world without barriers — financial, logistical, or informational.' },
  { icon: '🤝', title: 'Community First', desc: 'Our platform is built on trust. Every review, guide, and recommendation comes from real travelers like you.' },
  { icon: '♻️', title: 'Responsible Travel', desc: 'We promote sustainable tourism practices that protect destinations for future generations of explorers.' },
  { icon: '🔒', title: 'Safety Always', desc: 'From insurance partnerships to real-time safety alerts, your security is our highest priority.' },
  { icon: '💡', title: 'Constant Innovation', desc: 'We never stop improving. Every feature we build is driven by feedback from our traveler community.' },
  { icon: '❤️', title: 'Passion for Travel', desc: 'Every team member at Journey Junction is a traveler at heart. We build what we wish existed when we travel.' },
];

const milestones = [
  { year: '2020', icon: '🚀', title: 'Journey Junction Founded', desc: 'Arjun and Priya launched the platform from a small apartment in Hyderabad with a vision to democratize travel planning.' },
  { year: '2021', icon: '📈', title: '100K Users Milestone', desc: 'Reached 100,000 registered travelers within 18 months of launch. Expanded the team to 25 people.' },
  { year: '2022', icon: '🌏', title: 'International Expansion', desc: 'Launched destination coverage across Southeast Asia, Europe, and the Americas. Partnered with 50+ travel operators.' },
  { year: '2023', icon: '🏆', title: 'Best Travel App Award', desc: 'Won the India Travel Tech Award for Best Trip Planning Platform. Crossed 1 million trips planned.' },
  { year: '2024', icon: '💎', title: 'Series A Funding', desc: 'Raised ₹45 Crore in Series A funding to accelerate product development and global expansion.' },
  { year: '2025', icon: '🌟', title: '2 Million Travelers', desc: 'Celebrating 2 million happy travelers and 180+ destinations. Launching AI-powered trip recommendations.' },
];

const AboutUs = () => (
  <div className="company-page">
    <Navbar />

    <div className="company-hero">
      <div className="company-hero-badge">🌍 Our Story</div>
      <div className="company-hero-icon">✈️</div>
      <h1>About Journey Junction</h1>
      <p>We started with a simple belief — that travel has the power to transform lives. Since 2020, we've been building the platform we always wished existed.</p>
    </div>

    <div className="company-container">

      {/* Stats */}
      <div className="company-stats">
        {stats.map((s, i) => (
          <div className="company-stat" key={i}>
            <div className="company-stat-number">{s.number}</div>
            <div className="company-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="company-two-col" style={{ marginBottom: '64px' }}>
        <div className="company-text-block">
          <div className="company-section-label">Our Mission</div>
          <h2>Making the World Accessible, One Trip at a Time</h2>
          <p>Journey Junction was born out of frustration. Our founders spent hours across dozens of tabs, spreadsheets, and WhatsApp groups just to plan a single trip. There had to be a better way.</p>
          <p>We built a platform where planning a trip is as exciting as the trip itself — where you can discover destinations, build itineraries, connect with fellow travelers, and book with confidence, all in one place.</p>
          <p>Today, over 2 million travelers trust Journey Junction to plan their adventures. But we're just getting started.</p>
        </div>
        <div className="company-visual">
          <div className="company-visual-icon">🗺️</div>
          <h3>Our Vision</h3>
          <p>To become the world's most trusted travel companion — a platform where every traveler, from first-timers to seasoned explorers, finds everything they need to journey with confidence and joy.</p>
        </div>
      </div>

      {/* Values */}
      <div className="company-section-label">What We Stand For</div>
      <div className="company-section-title">Our Core Values</div>
      <div className="company-divider"></div>
      <div className="values-list">
        {values.map((v, i) => (
          <div className="value-item" key={i}>
            <div className="value-icon">{v.icon}</div>
            <div className="value-text">
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="company-section-label">The People Behind the Platform</div>
      <div className="company-section-title">Meet Our Team</div>
      <div className="company-divider"></div>
      <div className="team-grid">
        {team.map((m, i) => (
          <div className="team-card" key={i}>
            <div className="team-avatar">{m.emoji}</div>
            <div className="team-name">{m.name}</div>
            <div className="team-role">{m.role}</div>
            <div className="team-bio">{m.bio}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="company-section-label">How We Got Here</div>
      <div className="company-section-title">Our Journey</div>
      <div className="company-divider"></div>
      <div className="timeline">
        {milestones.map((m, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-dot">{m.icon}</div>
            <div className="timeline-content">
              <div className="timeline-year">{m.year}</div>
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="company-cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join 2 million travelers who plan smarter, explore deeper, and travel with confidence.</p>
        <div className="company-cta-btns">
          <Link to="/dashboard" className="company-cta-primary">Start Planning ✈️</Link>
          <Link to="/contact-us" className="company-cta-secondary">Get in Touch</Link>
        </div>
      </div>

    </div>
    <Footer />
  </div>
);

export default AboutUs;
