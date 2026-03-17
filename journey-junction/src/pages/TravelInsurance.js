import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const plans = [
  {
    icon: '🌱',
    name: 'Basic',
    price: '₹499',
    amount: 499,
    per: '/ trip',
    features: [
      'Medical emergency cover up to ₹5 Lakh',
      'Trip cancellation (up to ₹25,000)',
      'Lost baggage cover (up to ₹10,000)',
      '24/7 helpline',
      'Flight delay cover (6+ hrs)',
    ],
  },
  {
    icon: '🌟',
    name: 'Standard',
    price: '₹999',
    amount: 999,
    per: '/ trip',
    popular: true,
    features: [
      'Medical emergency cover up to ₹20 Lakh',
      'Trip cancellation (up to ₹75,000)',
      'Lost baggage cover (up to ₹30,000)',
      'Adventure sports cover',
      'Emergency evacuation',
      'Personal accident cover',
      '24/7 concierge support',
    ],
  },
  {
    icon: '💎',
    name: 'Premium',
    price: '₹1,999',
    amount: 1999,
    per: '/ trip',
    features: [
      'Medical emergency cover up to ₹1 Crore',
      'Trip cancellation (unlimited)',
      'Lost baggage cover (up to ₹1 Lakh)',
      'All adventure sports covered',
      'Emergency evacuation worldwide',
      'Personal accident + disability',
      'Home burglary cover during travel',
      'Dedicated claims manager',
    ],
  },
];

const coverageItems = [
  { icon: '🏥', title: 'Medical Emergencies', desc: 'Covers hospitalisation, doctor visits, and emergency treatment abroad or domestically.' },
  { icon: '✈️', title: 'Trip Cancellation', desc: 'Reimbursement if your trip is cancelled due to illness, natural disaster, or unforeseen events.' },
  { icon: '🧳', title: 'Baggage Loss', desc: 'Compensation for lost, stolen, or damaged luggage and personal belongings.' },
  { icon: '⏰', title: 'Travel Delays', desc: 'Daily allowance for meals and accommodation if your flight is delayed beyond 6 hours.' },
  { icon: '🏔️', title: 'Adventure Sports', desc: 'Standard and Premium plans cover trekking, scuba diving, paragliding, and more.' },
  { icon: '🚁', title: 'Emergency Evacuation', desc: 'Air ambulance and emergency evacuation to the nearest suitable medical facility.' },
];

const TravelInsurance = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGetPlan = (plan) => {
    navigate('/payment-methods', {
      state: {
        tripData: {
          tripTitle: `${plan.name} Travel Insurance Plan`,
          destination: 'Travel Insurance',
          basePrice: plan.amount,
          currency: 'INR',
          image: '/images/photo-1476514525535-07fb3b4ae5f1.avif',
          category: 'insurance',
          planName: plan.name,
          planFeatures: plan.features,
          isInsurance: true,
        }
      }
    });
  };

  return (
    <div className="info-page">
      <Navbar />
      <div className="info-hero">
        <div className="info-hero-inner">
          <span className="info-hero-eyebrow">🛡️ Coverage</span>
          <h1>Travel Insurance</h1>
          <p>Travel worry-free with comprehensive coverage for every adventure</p>
        </div>
      </div>

      <div className="info-container">
        <div className="info-alert">
          <div className="info-alert-icon">⚠️</div>
          <div>
            <h3>Why Travel Insurance Matters</h3>
            <p>
              Medical emergencies abroad can cost ₹10–50 Lakh. A single trip cancellation can mean losing your entire booking amount.
              Journey Junction partners with IRDAI-registered insurers to offer you reliable, affordable coverage — starting at just ₹499.
            </p>
          </div>
        </div>

        <div className="hc-section">
          <div className="hc-section-header">
            <h2 className="hc-section-title">Choose Your Plan</h2>
            <p className="hc-section-sub">Select the coverage that best fits your travel needs</p>
          </div>
          <div className="insurance-plans">
            {plans.map((p, i) => (
              <div className={`insurance-plan ${p.popular ? 'popular' : ''}`} key={i}>
                {p.popular && <div className="plan-badge">⭐ Most Popular</div>}
                <div className="plan-icon">{p.icon}</div>
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">{p.price} <span>{p.per}</span></div>
                <ul className="plan-features">
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <button className="plan-btn" onClick={() => handleGetPlan(p)}>
                  Get {p.name} Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="hc-section">
          <div className="hc-section-header">
            <h2 className="hc-section-title">What's Covered</h2>
            <p className="hc-section-sub">Comprehensive protection across all major travel risks</p>
          </div>
          <div className="info-cards-grid">
            {coverageItems.map((c, i) => (
              <div className="info-card" key={i}>
                <div className="info-card-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="info-cta">
          <div className="info-cta-inner">
            <div>
              <h2>Ready to Travel Safe?</h2>
              <p>Add insurance when planning your next trip — it takes less than 2 minutes.</p>
            </div>
            <button className="info-cta-btn" onClick={() => navigate('/plan-trip')}>
              Plan a Trip →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelInsurance;
