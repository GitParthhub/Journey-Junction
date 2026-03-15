import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CompanyPages.css';

const categories = ['All', 'Destinations', 'Travel Tips', 'Food & Culture', 'Adventure', 'Budget Travel', 'Solo Travel'];

const posts = [
  { emoji: '🏯', category: 'Destinations', date: 'Jan 20, 2025', readTime: '8 min read', title: '10 Hidden Gems in Rajasthan You\'ve Never Heard Of', excerpt: 'Beyond Jaipur and Udaipur lies a Rajasthan few tourists ever see — ancient stepwells, forgotten forts, and villages where time stands still.' },
  { emoji: '🎒', category: 'Solo Travel', date: 'Jan 14, 2025', readTime: '6 min read', title: 'The Complete Guide to Solo Travel in India as a Woman', excerpt: 'Practical safety tips, the best solo-friendly destinations, and how to build confidence for your first solo adventure across India.' },
  { emoji: '💰', category: 'Budget Travel', date: 'Jan 8, 2025', readTime: '7 min read', title: 'How to Travel Southeast Asia for Under ₹1,500 a Day', excerpt: 'A real budget breakdown from Thailand to Vietnam — accommodation, food, transport, and activities without sacrificing the experience.' },
  { emoji: '🍜', category: 'Food & Culture', date: 'Dec 28, 2024', readTime: '5 min read', title: 'Street Food Trails: The Best Bites Across 10 Asian Cities', excerpt: 'From Bangkok\'s Pad Thai to Hanoi\'s Pho, we rank the most unforgettable street food experiences across Asia.' },
  { emoji: '🏔️', category: 'Adventure', date: 'Dec 20, 2024', readTime: '10 min read', title: 'Trekking the Himalayas: A First-Timer\'s Complete Guide', excerpt: 'Everything you need to know before your first Himalayan trek — fitness prep, gear list, permits, and the trails worth every step.' },
  { emoji: '🌅', category: 'Destinations', date: 'Dec 12, 2024', readTime: '6 min read', title: 'Bali Beyond the Tourist Trail: Where Locals Actually Go', excerpt: 'Skip the Kuta crowds. We spent 3 weeks finding the real Bali — rice terraces, hidden temples, and beaches with no selfie sticks in sight.' },
  { emoji: '📱', category: 'Travel Tips', date: 'Dec 5, 2024', readTime: '4 min read', title: '15 Apps Every Smart Traveler Should Have in 2025', excerpt: 'From offline maps to currency converters and language translators — the essential apps that make travel smoother and safer.' },
  { emoji: '🚂', category: 'Budget Travel', date: 'Nov 28, 2024', readTime: '8 min read', title: 'The Ultimate Indian Railways Travel Guide for Tourists', excerpt: 'How to book tickets, choose the right class, navigate stations, and make the most of India\'s incredible rail network.' },
  { emoji: '🤿', category: 'Adventure', date: 'Nov 20, 2024', readTime: '7 min read', title: 'Best Scuba Diving Spots in India: A Diver\'s Guide', excerpt: 'From the Andamans to Lakshadweep and Goa — ranking India\'s top dive sites by visibility, marine life, and accessibility.' },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);
  const [featured, ...rest] = filtered;

  return (
    <div className="company-page">
      <Navbar />

      <div className="company-hero">
        <div className="company-hero-badge">✍️ Stories & Guides</div>
        <div className="company-hero-icon">📖</div>
        <h1>Journey Junction Blog</h1>
        <p>Travel inspiration, destination guides, expert tips, and stories from the road — written by travelers, for travelers.</p>
      </div>

      <div className="company-container">

        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} style={{
              padding: '8px 20px', borderRadius: '24px', border: '2px solid',
              borderColor: activeCategory === c ? 'transparent' : '#e2e8f0',
              background: activeCategory === c ? 'linear-gradient(135deg,#00798C,#30638E)' : 'white',
              color: activeCategory === c ? 'white' : '#555',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
            }}>{c}</button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <>
            <div className="company-section-label">Featured Post</div>
            <div style={{
              background: 'linear-gradient(135deg,#003D5B,#00798C)',
              borderRadius: '20px',
              padding: '40px',
              color: 'white',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              alignItems: 'center',
              marginBottom: '48px',
              borderTop: '4px solid #EDAE49'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#EDAE49', marginBottom: '12px', textTransform: 'uppercase' }}>
                  {featured.category} · {featured.date} · {featured.readTime}
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '14px', lineHeight: 1.3 }}>{featured.title}</h2>
                <p style={{ fontSize: '15px', opacity: 0.88, lineHeight: 1.7, marginBottom: '22px' }}>{featured.excerpt}</p>
                <button style={{ padding: '12px 26px', background: '#EDAE49', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Read Article →
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '100px' }}>{featured.emoji}</div>
            </div>
          </>
        )}

        {/* Blog grid */}
        <div className="company-section-label">Latest Articles</div>
        <div className="company-section-title">From the Blog</div>
        <div className="company-divider"></div>
        <div className="blog-grid">
          {(rest.length > 0 ? rest : filtered).map((p, i) => (
            <div className="blog-card" key={i}>
              <div className="blog-card-thumb">
                <div className="blog-card-category">{p.category}</div>
                {p.emoji}
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">{p.date} · {p.readTime}</div>
                <div className="blog-card-title">{p.title}</div>
                <div className="blog-card-excerpt">{p.excerpt}</div>
                <button className="blog-read-btn">Read More →</button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="company-cta">
          <h2>Want to Write for Us?</h2>
          <p>We welcome guest contributors — travel writers, photographers, and adventurers with stories to share.</p>
          <div className="company-cta-btns">
            <Link to="/contact-us" className="company-cta-primary">Submit a Story</Link>
            <Link to="/travel-guides" className="company-cta-secondary">Browse Travel Guides</Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Blog;
