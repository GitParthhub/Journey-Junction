import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Destinations.css';

const destinations = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    region: 'Asia',
    emoji: '🌴',
    image: '/images/bali.webp',
    tagline: 'Island of the Gods',
    description: 'Lush rice terraces, ancient temples, vibrant nightlife, and world-class surf breaks make Bali one of the most beloved destinations on earth.',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    bestTime: 'Apr – Oct',
    avgBudget: '₹45,000',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Ubud, Bali',
    region: 'Asia',
    emoji: '🌿',
    image: '/images/ubud-bali.jpg',
    tagline: 'Cultural Heart of Bali',
    description: 'Nestled among rice paddies and jungle ravines, Ubud is Bali\'s cultural centre — home to art galleries, yoga retreats, and traditional dance.',
    highlights: ['Monkey Forest', 'Tegallalang Rice Terrace', 'Campuhan Ridge Walk', 'Art Markets'],
    bestTime: 'May – Sep',
    avgBudget: '₹38,000',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Maldives',
    region: 'Indian Ocean',
    emoji: '🐠',
    image: '/images/bali-2.jpg',
    tagline: 'Paradise on Earth',
    description: 'Crystal-clear lagoons, overwater bungalows, and some of the world\'s best snorkelling and diving await in this tropical paradise.',
    highlights: ['Overwater Villas', 'Coral Reefs', 'Whale Shark Diving', 'Sunset Cruises'],
    bestTime: 'Nov – Apr',
    avgBudget: '₹1,20,000',
    rating: 5.0,
  },
  {
    id: 4,
    name: 'Santorini, Greece',
    region: 'Europe',
    emoji: '🏛️',
    image: '/images/bali-3.jpg',
    tagline: 'Jewel of the Aegean',
    description: 'Iconic white-washed buildings, blue-domed churches, dramatic caldera views, and spectacular sunsets make Santorini unforgettable.',
    highlights: ['Oia Sunset', 'Caldera Views', 'Red Beach', 'Wine Tasting'],
    bestTime: 'Jun – Sep',
    avgBudget: '₹95,000',
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Manali, India',
    region: 'India',
    emoji: '🏔️',
    image: '/images/background.jpg',
    tagline: 'Valley of the Gods',
    description: 'Snow-capped peaks, adventure sports, ancient monasteries, and the famous Rohtang Pass make Manali a year-round favourite.',
    highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'River Rafting'],
    bestTime: 'Oct – Jun',
    avgBudget: '₹18,000',
    rating: 4.7,
  },
  {
    id: 6,
    name: 'Thailand',
    region: 'Asia',
    emoji: '🐘',
    image: '/images/login-background.jpg',
    tagline: 'Land of Smiles',
    description: 'From the bustling streets of Bangkok to the serene beaches of Koh Samui and the ancient temples of Chiang Mai — Thailand has it all.',
    highlights: ['Grand Palace Bangkok', 'Phi Phi Islands', 'Chiang Mai Temples', 'Floating Markets'],
    bestTime: 'Nov – Mar',
    avgBudget: '₹55,000',
    rating: 4.8,
  },
];

const regions = ['All', 'Asia', 'India', 'Europe', 'Indian Ocean'];

const Destinations = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = destinations.filter(d => {
    const matchRegion = activeRegion === 'All' || d.region === activeRegion;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tagline.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div className="dest-page">
      <Navbar />

      {/* Hero */}
      <div className="dest-hero" style={{ backgroundImage: "url('/images/ubud-bali.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="dest-hero-overlay" />
        <div className="dest-hero-content">
          <div className="dest-hero-icon">🌍</div>
          <h1>Destinations</h1>
          <p>Explore the world's most breathtaking places — curated just for you</p>
          <div className="dest-search-wrap">
            <span className="dest-search-icon">🔍</span>
            <input
              className="dest-search"
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="dest-container">

        {/* Region Filter */}
        <div className="dest-filters">
          {regions.map(r => (
            <button
              key={r}
              className={`dest-filter-btn ${activeRegion === r ? 'active' : ''}`}
              onClick={() => setActiveRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="dest-count">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Grid */}
        <div className="dest-grid">
          {filtered.map(dest => (
            <div key={dest.id} className="dest-card">
              <div className="dest-card-img-wrap">
                <img src={dest.image} alt={dest.name} className="dest-card-img" />
                <div className="dest-card-overlay">
                  <span className="dest-region-badge">{dest.region}</span>
                  <span className="dest-rating">⭐ {dest.rating}</span>
                </div>
              </div>
              <div className="dest-card-body">
                <div className="dest-card-header">
                  <span className="dest-emoji">{dest.emoji}</span>
                  <div>
                    <h3 className="dest-name">{dest.name}</h3>
                    <p className="dest-tagline">{dest.tagline}</p>
                  </div>
                </div>
                <p className="dest-desc">{dest.description}</p>

                <div className="dest-highlights">
                  <p className="dest-highlights-label">✨ Highlights</p>
                  <div className="dest-highlights-list">
                    {dest.highlights.map(h => (
                      <span key={h} className="dest-highlight-tag">{h}</span>
                    ))}
                  </div>
                </div>

                <div className="dest-info-row">
                  <div className="dest-info-item">
                    <span className="dest-info-label">Best Time</span>
                    <span className="dest-info-value">📅 {dest.bestTime}</span>
                  </div>
                  <div className="dest-info-item">
                    <span className="dest-info-label">Avg Budget</span>
                    <span className="dest-info-value">💰 {dest.avgBudget}</span>
                  </div>
                </div>

                <button className="dest-explore-btn" onClick={() => navigate('/featured')}>
                  Explore Trips →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="dest-empty">
            <div className="dest-empty-icon">🗺️</div>
            <h3>No destinations found</h3>
            <p>Try a different search or region filter</p>
          </div>
        )}

        {/* CTA */}
        <div className="dest-cta">
          <div className="dest-cta-icon">🚀</div>
          <h2>Can't Find Your Dream Destination?</h2>
          <p>Plan a custom trip to anywhere in the world with our trip planner</p>
          <button className="dest-cta-btn" onClick={() => navigate('/plan-trip')}>
            🗺️ Plan a Custom Trip
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Destinations;
