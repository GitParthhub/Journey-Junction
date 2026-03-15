import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CompanyPages.css';

const perks = [
  { icon: '🌍', title: 'Remote-First Culture', desc: 'Work from anywhere in the world. We have team members across 8 cities and 3 countries.' },
  { icon: '✈️', title: 'Annual Travel Stipend', desc: '₹1 Lakh annual travel budget to explore destinations and bring real insights to your work.' },
  { icon: '📚', title: 'Learning & Development', desc: '₹50,000 yearly L&D budget for courses, conferences, and certifications of your choice.' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive health coverage for you and your family, including dental and vision.' },
  { icon: '⏰', title: 'Flexible Hours', desc: 'We care about output, not hours. Work when you\'re most productive.' },
  { icon: '🎉', title: 'Team Retreats', desc: 'Twice-yearly company retreats to exciting destinations — fully paid, fully fun.' },
];

const jobs = [
  { title: 'Senior Full Stack Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer (UX/UI)', dept: 'Design', location: 'Hyderabad / Remote', type: 'Full-time' },
  { title: 'Growth Marketing Manager', dept: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'Travel Content Writer', dept: 'Content', location: 'Remote', type: 'Full-time' },
  { title: 'Data Analyst', dept: 'Analytics', location: 'Hyderabad', type: 'Full-time' },
  { title: 'Customer Success Specialist', dept: 'Support', location: 'Remote', type: 'Full-time' },
  { title: 'Backend Engineer (Node.js)', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Partnership Manager', dept: 'Business Dev', location: 'Mumbai / Remote', type: 'Full-time' },
  { title: 'Social Media Intern', dept: 'Marketing', location: 'Remote', type: 'Internship' },
];

const depts = ['All', 'Engineering', 'Design', 'Marketing', 'Content', 'Analytics', 'Support', 'Business Dev'];

const Careers = () => {
  const [activeDept, setActiveDept] = useState('All');
  const filtered = activeDept === 'All' ? jobs : jobs.filter(j => j.dept === activeDept);

  return (
    <div className="company-page">
      <Navbar />

      <div className="company-hero">
        <div className="company-hero-badge">🚀 We're Hiring</div>
        <div className="company-hero-icon">💼</div>
        <h1>Careers at Journey Junction</h1>
        <p>Help us build the future of travel. Join a team of passionate explorers, engineers, and dreamers.</p>
      </div>

      <div className="company-container">

        {/* Why join */}
        <div className="company-two-col" style={{ marginBottom: '64px' }}>
          <div className="company-text-block">
            <div className="company-section-label">Why Join Us</div>
            <h2>Build Something That Moves People — Literally</h2>
            <p>At Journey Junction, your work directly impacts millions of travelers. Every feature you ship, every word you write, every design you craft helps someone discover a new corner of the world.</p>
            <p>We're a remote-first team of 60+ people who are obsessed with travel, technology, and building products people love. We move fast, think big, and celebrate every milestone together.</p>
            <p>If you're passionate about travel and want to work on problems that matter, we'd love to hear from you.</p>
          </div>
          <div className="company-visual">
            <div className="company-visual-icon">🌟</div>
            <h3>60+ Team Members</h3>
            <p>Across 8 cities, 3 countries, and 1 shared passion — making travel better for everyone on the planet.</p>
          </div>
        </div>

        {/* Perks */}
        <div className="company-section-label">Life at Journey Junction</div>
        <div className="company-section-title">Perks & Benefits</div>
        <div className="company-divider"></div>
        <div className="company-cards">
          {perks.map((p, i) => (
            <div className="company-card" key={i}>
              <div className="company-card-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Open roles */}
        <div className="company-section-label">Open Positions</div>
        <div className="company-section-title">Find Your Role</div>
        <div className="company-divider"></div>

        {/* Dept filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
          {depts.map(d => (
            <button key={d} onClick={() => setActiveDept(d)} style={{
              padding: '7px 18px', borderRadius: '20px', border: '2px solid',
              borderColor: activeDept === d ? 'transparent' : '#e2e8f0',
              background: activeDept === d ? 'linear-gradient(135deg,#00798C,#30638E)' : 'white',
              color: activeDept === d ? 'white' : '#555',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
            }}>{d}</button>
          ))}
        </div>

        <div className="jobs-list">
          {filtered.map((j, i) => (
            <div className="job-card" key={i}>
              <div className="job-info">
                <div className="job-title">{j.title}</div>
                <div className="job-meta">
                  <span className="job-tag dept">{j.dept}</span>
                  <span className="job-tag">📍 {j.location}</span>
                  <span className="job-tag type">{j.type}</span>
                </div>
              </div>
              <button className="job-apply-btn">Apply Now →</button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="company-cta">
          <h2>Don't See Your Role?</h2>
          <p>We're always looking for exceptional talent. Send us your resume and tell us how you'd contribute to Journey Junction.</p>
          <div className="company-cta-btns">
            <Link to="/contact-us" className="company-cta-primary">Send Open Application</Link>
            <Link to="/about-us" className="company-cta-secondary">Learn About Us</Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Careers;
