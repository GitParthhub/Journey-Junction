import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const safetyCategories = [
  {
    icon: '📋',
    title: 'Before You Travel',
    tips: [
      'Research your destination — check government travel advisories',
      'Make copies of passport, visa, and insurance documents',
      'Share your itinerary with a trusted family member or friend',
      'Register with your country\'s embassy if travelling internationally',
      'Get all required vaccinations at least 4–6 weeks before departure',
      'Purchase comprehensive travel insurance before leaving',
    ],
  },
  {
    icon: '🏨',
    title: 'Accommodation Safety',
    tips: [
      'Book only verified, reviewed accommodations',
      'Check that doors and windows lock properly on arrival',
      'Use the hotel safe for passports, cash, and valuables',
      'Keep the front desk number saved on your phone',
      'Don\'t open the door to strangers — verify with the front desk first',
      'Note emergency exits on your floor when you check in',
    ],
  },
  {
    icon: '🚗',
    title: 'Transport Safety',
    tips: [
      'Use only licensed taxis or verified ride-hailing apps',
      'Share your live location when travelling alone at night',
      'Avoid unmarked or unofficial transport at airports',
      'Keep your bag in front of you on public transport',
      'Research local traffic rules if renting a vehicle',
      'Carry a portable charger so your phone never dies mid-journey',
    ],
  },
  {
    icon: '💊',
    title: 'Health & Medical',
    tips: [
      'Carry a basic first-aid kit with your essential medications',
      'Drink only bottled or purified water in high-risk regions',
      'Use sunscreen, insect repellent, and stay hydrated',
      'Know the local emergency number (e.g., 112 in India, 911 in USA)',
      'Locate the nearest hospital or clinic on arrival',
      'Avoid street food from unhygienic stalls in unfamiliar areas',
    ],
  },
  {
    icon: '💰',
    title: 'Financial Safety',
    tips: [
      'Carry only the cash you need for the day',
      'Use ATMs inside banks or hotels — avoid standalone machines',
      'Notify your bank before travelling internationally',
      'Keep a backup card in a separate location from your wallet',
      'Avoid displaying expensive jewellery or electronics in public',
      'Use a money belt or hidden pouch for large amounts of cash',
    ],
  },
  {
    icon: '🌐',
    title: 'Digital Safety',
    tips: [
      'Avoid using public Wi-Fi for banking or sensitive logins',
      'Use a VPN when connecting to hotel or café networks',
      'Enable two-factor authentication on all travel accounts',
      'Back up your photos to cloud storage daily',
      'Keep your phone\'s OS and apps updated before travelling',
      'Use offline maps (Google Maps offline) in case of no signal',
    ],
  },
];

const SafetyGuidelines = () => (
  <div className="info-page">
    <Navbar />
    <div className="info-hero">
      <div>
        <div className="info-hero-icon">🦺</div>
        <h1>Safety Guidelines</h1>
        <p>Stay safe, stay smart — essential tips for every traveller</p>
      </div>
    </div>

    <div className="info-container">
      <div className="info-alert">
        <div className="info-alert-icon">🚨</div>
        <div>
          <h3>Emergency Contacts</h3>
          <p>
            India: Police 100 · Ambulance 108 · Fire 101 · Women Helpline 1091 · Tourist Helpline 1800-11-1363 (toll-free) ·
            International SOS: +91-124-4219-000. Always save local emergency numbers before arriving at a new destination.
          </p>
        </div>
      </div>

      <h2 className="info-section-title">Safety by Category</h2>
      <div className="safety-grid">
        {safetyCategories.map((cat, i) => (
          <div className="safety-card" key={i}>
            <div className="safety-card-header">
              <div className="safety-icon">{cat.icon}</div>
              <h3>{cat.title}</h3>
            </div>
            <ul className="safety-tips">
              {cat.tips.map((tip, j) => <li key={j}>{tip}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="info-cta">
        <h2>Travel Insured, Travel Confident</h2>
        <p>Pair these safety tips with a solid insurance plan for complete peace of mind.</p>
        <a href="/travel-insurance" className="info-cta-btn">View Insurance Plans →</a>
      </div>
    </div>
    <Footer />
  </div>
);

export default SafetyGuidelines;
