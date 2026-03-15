import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const categories = [
  {
    label: 'All',
    icon: '🗂️',
  },
  { label: 'Account', icon: '👤' },
  { label: 'Trips', icon: '✈️' },
  { label: 'Payments', icon: '💳' },
  { label: 'Insurance', icon: '🛡️' },
  { label: 'Safety', icon: '🦺' },
];

const faqs = [
  { cat: 'Account', q: 'How do I create a Journey Junction account?', a: 'Visit the app and click "Don\'t have an account? Register". Enter your name, email, and a strong password. You\'ll be logged in immediately after registration.' },
  { cat: 'Account', q: 'I forgot my password. How do I reset it?', a: 'On the login page, click "Forgot Password". Enter your registered email and we\'ll send a reset link within a few minutes. Check your spam folder if you don\'t see it.' },
  { cat: 'Account', q: 'How do I become an admin?', a: 'Admin roles are assigned manually via the database. Contact our support team with your registered email and reason for requesting admin access.' },
  { cat: 'Account', q: 'Can I change my registered email address?', a: 'Yes — go to Settings → Profile and update your email. You\'ll need to verify the new email address before the change takes effect.' },
  { cat: 'Trips', q: 'How many trips can I create?', a: 'There is no limit! Create as many trips as you like — planned, ongoing, or completed. Your dashboard shows all of them with filter options.' },
  { cat: 'Trips', q: 'Can I share my trip with other users?', a: 'Trip sharing is on our roadmap. Currently, admins can feature your trip so the community can discover it on the Featured Trips page.' },
  { cat: 'Trips', q: 'How do I get my trip featured?', a: 'Make sure your trip has a complete title, destination, description, dates, budget, and a good image. Admins review trips regularly and feature the best ones.' },
  { cat: 'Trips', q: 'Can I export or print my trip itinerary?', a: 'PDF export is coming soon. For now, you can view all trip details on the Trip Details page and use your browser\'s print function.' },
  { cat: 'Payments', q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, and popular wallets like Paytm and PhonePe.' },
  { cat: 'Payments', q: 'Is my payment information secure?', a: 'Yes. We use PCI-DSS compliant payment gateways. Journey Junction never stores your full card details on our servers.' },
  { cat: 'Payments', q: 'How do I get a refund?', a: 'Refunds are processed within 5–7 business days to your original payment method. Contact support with your booking ID to initiate a refund.' },
  { cat: 'Insurance', q: 'When should I buy travel insurance?', a: 'Buy insurance as soon as you book your trip. This ensures you\'re covered for cancellations that happen before departure, not just during travel.' },
  { cat: 'Insurance', q: 'Does insurance cover adventure activities?', a: 'Standard and Premium plans cover most adventure sports including trekking, scuba diving, and paragliding. The Basic plan covers standard travel risks only.' },
  { cat: 'Insurance', q: 'How do I file an insurance claim?', a: 'Call our 24/7 helpline or email claims@journeyjunction.com with your policy number, incident details, and supporting documents. Claims are processed within 7–14 days.' },
  { cat: 'Safety', q: 'What should I do in a travel emergency?', a: 'Call local emergency services first (112 in India). Then contact our 24/7 support line. If you have insurance, call the insurer\'s emergency helpline for medical or evacuation assistance.' },
  { cat: 'Safety', q: 'How do I report an unsafe destination or experience?', a: 'Use the "Report" option in the app or email safety@journeyjunction.com. We take all safety reports seriously and review them within 24 hours.' },
];

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = activeCategory === 'All' ? faqs : faqs.filter(f => f.cat === activeCategory);

  const handleCatChange = (cat) => {
    setActiveCategory(cat);
    setOpenIdx(null);
  };

  return (
    <div className="info-page">
      <Navbar />
      <div className="info-hero">
        <div>
          <div className="info-hero-icon">❓</div>
          <h1>FAQs</h1>
          <p>Quick answers to the questions we hear most often</p>
        </div>
      </div>

      <div className="info-container">
        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
          {categories.map(c => (
            <button
              key={c.label}
              onClick={() => handleCatChange(c.label)}
              style={{
                padding: '8px 20px',
                borderRadius: '24px',
                border: '2px solid',
                borderColor: activeCategory === c.label ? 'transparent' : '#e2e8f0',
                background: activeCategory === c.label ? 'linear-gradient(135deg, #00798C, #30638E)' : 'white',
                color: activeCategory === c.label ? 'white' : '#555',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filtered.map((f, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <span>
                  <span style={{ fontSize: '11px', background: '#f0f9fa', color: '#00798C', border: '1px solid #b2e4ec', borderRadius: '10px', padding: '2px 8px', marginRight: '10px', fontWeight: 600 }}>
                    {f.cat}
                  </span>
                  {f.q}
                </span>
                <span className={`faq-chevron ${openIdx === i ? 'open' : ''}`}>▼</span>
              </button>
              {openIdx === i && <div className="faq-answer">{f.a}</div>}
            </div>
          ))}
        </div>

        <div className="info-cta">
          <h2>Didn't find your answer?</h2>
          <p>Our support team is happy to help with anything not covered here.</p>
          <a href="/contact-us" className="info-cta-btn">Contact Us →</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQs;
