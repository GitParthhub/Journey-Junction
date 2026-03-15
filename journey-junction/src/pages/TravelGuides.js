import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GuideDetail from '../components/GuideDetail';
import './TravelGuides.css';

const guides = [
  {
    id: 1,
    title: 'The Ultimate Backpacking Guide to Southeast Asia',
    category: 'Backpacking',
    emoji: '🎒',
    readTime: '12 min read',
    image: '/images/bali.webp',
    excerpt: 'Everything you need to know about travelling through Thailand, Vietnam, Cambodia, and Indonesia on a budget — from visa tips to hidden gems.',
    tags: ['Budget Travel', 'Asia', 'Backpacking'],
  },
  {
    id: 2,
    title: 'How to Plan the Perfect Beach Vacation',
    category: 'Beach',
    emoji: '🏖️',
    readTime: '8 min read',
    image: '/images/bali-2.jpg',
    excerpt: 'From choosing the right season to packing essentials, this guide covers everything for a stress-free beach holiday.',
    tags: ['Beach', 'Relaxation', 'Planning'],
  },
  {
    id: 3,
    title: 'Mountain Trekking for Beginners',
    category: 'Adventure',
    emoji: '🏔️',
    readTime: '10 min read',
    image: '/images/background.jpg',
    excerpt: 'Ready to hit the trails? Learn about gear, fitness prep, altitude sickness, and the best beginner-friendly treks around the world.',
    tags: ['Trekking', 'Adventure', 'Fitness'],
  },
  {
    id: 4,
    title: 'Solo Travel Safety Tips for Every Destination',
    category: 'Solo Travel',
    emoji: '🧭',
    readTime: '9 min read',
    image: '/images/ubud-bali.jpg',
    excerpt: 'Travelling alone is one of the most rewarding experiences. Stay safe, stay smart, and make the most of every solo adventure.',
    tags: ['Solo', 'Safety', 'Tips'],
  },
  {
    id: 5,
    title: 'A Foodie\'s Guide to Street Food Around the World',
    category: 'Food & Culture',
    emoji: '🍜',
    readTime: '7 min read',
    image: '/images/bali-3.jpg',
    excerpt: 'Discover the best street food markets, must-try dishes, and how to eat safely while travelling internationally.',
    tags: ['Food', 'Culture', 'Street Food'],
  },
  {
    id: 6,
    title: 'Luxury Travel on a Mid-Range Budget',
    category: 'Luxury',
    emoji: '✨',
    readTime: '11 min read',
    image: '/images/login-background.jpg',
    excerpt: 'You don\'t need to spend a fortune to travel in style. Discover hacks, upgrades, and destinations that offer luxury for less.',
    tags: ['Luxury', 'Budget Hacks', 'Tips'],
  },
];

const categories = ['All', 'Backpacking', 'Beach', 'Adventure', 'Solo Travel', 'Food & Culture', 'Luxury'];

const TravelGuides = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState(null);

  const filtered = activeCategory === 'All'
    ? guides
    : guides.filter(g => g.category === activeCategory);

  return (
    <div className="tg-page">
      <Navbar />

      {/* Hero */}
      <div className="tg-hero" style={{ backgroundImage: "url('/images/bali.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="tg-hero-overlay" />
        <div className="tg-hero-content">
          <div className="tg-hero-icon">📖</div>
          <h1>Travel Guides</h1>
          <p>Expert tips, destination deep-dives, and everything you need to travel smarter</p>
        </div>
      </div>

      <div className="tg-container">

        {/* Category Filter */}
        <div className="tg-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`tg-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="tg-grid">
          {filtered.map(guide => (
            <div key={guide.id} className="tg-card">
              <div className="tg-card-img-wrap">
                <img src={guide.image} alt={guide.title} className="tg-card-img" />
                <span className="tg-card-category">{guide.emoji} {guide.category}</span>
              </div>
              <div className="tg-card-body">
                <div className="tg-card-meta">
                  <span className="tg-read-time">⏱ {guide.readTime}</span>
                </div>
                <h3 className="tg-card-title">{guide.title}</h3>
                <p className="tg-card-excerpt">{guide.excerpt}</p>
                <div className="tg-card-tags">
                  {guide.tags.map(tag => (
                    <span key={tag} className="tg-tag">{tag}</span>
                  ))}
                </div>
                <button className="tg-read-btn" onClick={() => setSelectedGuide(guide)}>
                  Read Guide →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="tg-cta">
          <div className="tg-cta-icon">✈️</div>
          <h2>Ready to Start Your Journey?</h2>
          <p>Browse our featured trips and find your next adventure</p>
          <div className="tg-cta-btns">
            <button className="tg-cta-primary" onClick={() => navigate('/featured')}>
              🌟 Browse Featured Trips
            </button>
            <button className="tg-cta-secondary" onClick={() => navigate('/plan-trip')}>
              🗺️ Plan Your Trip
            </button>
          </div>
        </div>

      </div>
      {selectedGuide && <GuideDetail guide={selectedGuide} onClose={() => setSelectedGuide(null)} />}
      <Footer />
    </div>
  );
};

export default TravelGuides;
