import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GuideDetail from '../components/GuideDetail';
import './TravelGuides.css';

const guides = [
  {
    id: 1,
    title: 'Himalaya Adventure Trek - Complete Guide',
    category: 'Adventure',
    emoji: '🏔️',
    readTime: '18 min read',
    image: 'http://localhost:5000/images/himalaya/him2.jpeg',
    galleryImages: [
      'http://localhost:5000/images/himalaya/him2.jpeg',
      'http://localhost:5000/images/himalaya/hampta.jpeg',
      'http://localhost:5000/images/himalaya/valley.jpg',
      'http://localhost:5000/images/himalaya/triund.jpeg',
      'http://localhost:5000/images/himalaya/him3.jpg'
    ],
    excerpt: 'Your complete guide to the 7-day Himalaya Adventure Trek from Manali to Chandratal Lake. Includes Hampta Pass crossing, camping tips, and essential preparation.',
    tags: ['Himalaya', 'Hampta Pass', 'Chandratal'],
    difficulty: 'Intermediate',
    season: 'Apr-Jun, Sep-Nov',
    content: {
      introduction: 'The Himalaya Adventure Trek is a spectacular 7-day journey through the majestic Himalayas, featuring the famous Hampta Pass crossing and the pristine Chandratal Lake. This comprehensive guide covers everything you need to know for this incredible adventure from Manali.',
      sections: [
        {
          title: 'Trek Itinerary & Highlights',
          content: 'Day 1: Arrival in Manali, Day 2: Trek to Hampta Pass Base Camp, Day 3: Cross Hampta Pass (4270m) to Shea Goru, Day 4: Trek to Chatru, Day 5: Visit Chandratal Lake, Day 6: Return to Manali via Rohtang Pass, Day 7: Departure. Experience diverse landscapes from lush valleys to barren high-altitude deserts.'
        },
        {
          title: 'Essential Gear & Packing',
          content: 'Sturdy trekking boots, layered clothing system, waterproof jacket and pants, sleeping bag rated to -10°C, trekking poles, headlamp, sunglasses, sunscreen SPF 50+, personal first aid kit, and water purification tablets. All camping equipment provided by tour operator.'
        },
        {
          title: 'Preparation & Fitness',
          content: 'Start training 6-8 weeks before the trek. Focus on cardio exercises, leg strengthening, and practice hiking with a loaded backpack. Medical fitness certificate required. Previous trekking experience recommended but not mandatory.'
        },
        {
          title: 'Safety & Altitude Tips',
          content: 'Hampta Pass at 4270m requires proper acclimatization. Ascend gradually, stay hydrated, avoid alcohol, and recognize altitude sickness symptoms. Professional guides accompany all groups. Emergency evacuation procedures in place.'
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Ladakh High Altitude Adventure Guide',
    category: 'Adventure',
    emoji: '🏜️',
    readTime: '16 min read',
    image: 'http://localhost:5000/images/himalaya/valley.jpg',
    galleryImages: [
      'http://localhost:5000/images/himalaya/valley.jpg',
      'http://localhost:5000/images/himalaya/him4.jpeg',
      'http://localhost:5000/images/himalaya/kedar.png',
      'http://localhost:5000/images/himalaya/bhamhatal.jpeg',
      'http://localhost:5000/images/himalaya/him3.jpg'
    ],
    excerpt: 'Discover the mystical land of Ladakh with high-altitude lakes, ancient monasteries, and dramatic landscapes. Complete guide to planning your Ladakh adventure.',
    tags: ['Ladakh', 'High Altitude', 'Monasteries'],
    difficulty: 'Advanced',
    season: 'May-Sep',
    content: {
      introduction: 'Ladakh, known as the "Land of High Passes," offers some of India\'s most spectacular high-altitude adventures. From pristine lakes like Pangong Tso to ancient monasteries and challenging mountain passes, this guide covers everything for your Ladakh expedition.',
      sections: [
        {
          title: 'Must-Visit Destinations',
          content: 'Pangong Tso Lake (14,270 ft), Nubra Valley via Khardung La Pass (18,380 ft), Tso Moriri Lake, Hemis and Thiksey Monasteries, Magnetic Hill, Leh Palace, and Zanskar Valley. Each location offers unique landscapes and cultural experiences.'
        },
        {
          title: 'High Altitude Preparation',
          content: 'Acclimatization is crucial at 11,000+ ft elevation. Arrive in Leh 2-3 days before activities, avoid alcohol and smoking, drink plenty of water, and rest on arrival day. Diamox medication may help but consult a doctor first.'
        },
        {
          title: 'Best Time & Weather',
          content: 'May to September is the ideal season when roads are accessible. June-August offers warmest weather but also crowds. May and September provide clear skies with fewer tourists. Winter (Oct-Apr) sees road closures and extreme cold.'
        },
        {
          title: 'Cultural Etiquette & Permits',
          content: 'Respect local Buddhist culture, dress modestly at monasteries, ask permission before photographing people, and support local communities. Inner Line Permits required for certain areas. Carry multiple ID proofs and passport-size photos.'
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Rajasthan Royal Heritage Trail',
    category: 'Cultural',
    emoji: '🏛️',
    readTime: '12 min read',
    image: 'http://localhost:5000/images/rajasthan/rajasthan1.jpeg',
    galleryImages: [
      'http://localhost:5000/images/rajasthan/rajasthan1.jpeg',
      'http://localhost:5000/images/rajasthan/h71soQPJS_ZzkQ9GduAHl4Go_e7gUqPKZ_-UfjpCoWrH1Wu8zpILpQ1m9UgTVLElKaLVCHxbHJtI9_O7_hs1x2Vj4QWUJJSllgWNJ6kBJHM.jpeg',
      'http://localhost:5000/images/rajasthan/-zgcUxh4KMeyquudTNwFqaJ7SIxIa6eW7PutoEOk2jZuL-nFeMwxWoHgp9e6kJi7LrLMmtDtAK1Eaw6QdTZIvSXidZYu8nRvKQ1NrmBvi0w.jpeg',
      'http://localhost:5000/images/rajasthan/kc997oKX_Rfk8Xlbg21RfRlKF0m3DjmiYfDY0Iq2lAQQdjuND3yVLTEtHp7hv100dxzWq_8_BvYHvZy3HpVfSB3sCP2_AswPnnGv5XIlEM8.jpeg',
      'http://localhost:5000/images/rajasthan/mJhhnB4vUqAFJ2OYJRHS3LlL391K-PVwZVcpVSqYHQMxrZzhIBHVBcBsTxWuoTD4jymZBSv_1UG95Su0f3T3Roq9516gFbgr6BaYKeM7fq4.jpeg'
    ],
    excerpt: 'Explore the royal palaces, majestic forts, and vibrant culture of Rajasthan. From Jaipur\'s Pink City to Udaipur\'s lakes - your complete cultural journey.',
    tags: ['Rajasthan', 'Heritage', 'Culture'],
    difficulty: 'Easy',
    season: 'Oct-Mar',
    content: {
      introduction: 'Rajasthan, the Land of Kings, is a treasure trove of magnificent palaces, imposing forts, and rich cultural heritage. This guide will help you navigate through the royal splendor including Hawa Mahal, Amber Fort, Mehrangarh Fort, and the romantic lakes of Udaipur.',
      sections: [
        {
          title: 'Must-Visit Palaces & Forts',
          content: 'Hawa Mahal and Amber Fort in Jaipur, Mehrangarh Fort in Jodhpur, Jaisalmer Fort in the golden city, and City Palace in Udaipur. Each tells a unique story of Rajput valor and architectural brilliance with intricate carvings and stunning views.'
        },
        {
          title: 'Cultural Experiences',
          content: 'Witness traditional folk dances, enjoy puppet shows, shop for handicrafts in local bazaars, experience camel safaris in Thar Desert, and stay in heritage hotels. Don\'t miss the cultural programs and traditional Rajasthani cuisine.'
        },
        {
          title: 'Best Time to Visit',
          content: 'October to March offers pleasant weather with temperatures ranging from 10-25°C. Avoid summer months (April-June) as temperatures can soar above 45°C. Winter evenings can be cool, so pack accordingly.'
        },
        {
          title: 'Local Cuisine & Shopping',
          content: 'Try Dal Baati Churma, Laal Maas, Gatte ki Sabzi, and sweet treats like Ghewar and Malpua. Shop for textiles, jewelry, handicrafts, and miniature paintings in local markets. Bargaining is expected and part of the experience.'
        }
      ]
    }
  }
];

const categories = ['All', 'Adventure', 'Cultural'];

const TravelGuides = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [imageTransitioning, setImageTransitioning] = useState({});

  const filtered = guides.filter(guide => {
    const matchesCategory = activeCategory === 'All' || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const nextImage = (guideId, e) => {
    e.stopPropagation();
    const guide = guides.find(g => g.id === guideId);
    const images = guide.galleryImages || [guide.image];
    setImageTransitioning(prev => ({ ...prev, [guideId]: true }));
    setTimeout(() => {
      setCurrentImageIndex(prev => ({ ...prev, [guideId]: ((prev[guideId] || 0) + 1) % images.length }));
      setTimeout(() => setImageTransitioning(prev => ({ ...prev, [guideId]: false })), 50);
    }, 250);
  };

  const prevImage = (guideId, e) => {
    e.stopPropagation();
    const guide = guides.find(g => g.id === guideId);
    const images = guide.galleryImages || [guide.image];
    setImageTransitioning(prev => ({ ...prev, [guideId]: true }));
    setTimeout(() => {
      setCurrentImageIndex(prev => ({ ...prev, [guideId]: (prev[guideId] || 0) === 0 ? images.length - 1 : (prev[guideId] || 0) - 1 }));
      setTimeout(() => setImageTransitioning(prev => ({ ...prev, [guideId]: false })), 50);
    }, 250);
  };

  const getCurrentImage = (guide) => {
    const images = guide.galleryImages || [guide.image];
    return images[currentImageIndex[guide.id] || 0];
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#28a745';
      case 'Intermediate': return '#ffc107';
      case 'Advanced': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="tg-page">
      <Navbar />

      {/* Hero Section */}
      <div className="tg-hero">
        <div className="tg-hero-bg"></div>
        <div className="tg-hero-overlay"></div>
        <div className="tg-hero-content">
          <div className="tg-hero-badge">
            <span className="tg-hero-icon">📚</span>
            <span>Expert Travel Guides</span>
          </div>
          <h1>Your Journey Starts Here</h1>
          <p>Discover insider tips, hidden gems, and expert advice for unforgettable adventures around the world</p>
          <div className="tg-hero-stats">
            <div className="tg-stat">
              <span className="tg-stat-number">{guides.length}</span>
              <span className="tg-stat-label">Expert Guides</span>
            </div>
            <div className="tg-stat">
              <span className="tg-stat-number">{categories.length - 1}</span>
              <span className="tg-stat-label">Categories</span>
            </div>
            <div className="tg-stat">
              <span className="tg-stat-number">3</span>
              <span className="tg-stat-label">Destinations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tg-container">
        {/* Search and Filter Section */}
        <div className="tg-controls">
          <div className="tg-search-section">
            <h2 className="tg-section-title">🔍 Find Your Perfect Guide</h2>
            <div className="tg-search-bar">
              <input
                type="text"
                placeholder="Search guides, destinations, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tg-search-input"
              />
              <button className="tg-search-btn">🔍</button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="tg-filters-section">
            <h3 className="tg-filter-title">Filter by Category</h3>
            <div className="tg-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tg-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'All' ? '🌍' : 
                   cat === 'Adventure' ? '🏔️' :
                   cat === 'Cultural' ? '🏛️' : '🌍'}
                  <span>{cat}</span>
                  <span className="tg-filter-count">({cat === 'All' ? guides.length : guides.filter(g => g.category === cat).length})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="tg-results-header">
          <h3>📖 {filtered.length} Guide{filtered.length !== 1 ? 's' : ''} Found</h3>
          {searchTerm && (
            <p className="tg-search-info">Showing results for "<strong>{searchTerm}</strong>"</p>
          )}
        </div>

        {/* Guides Grid */}
        {filtered.length === 0 ? (
          <div className="tg-empty-state">
            <div className="tg-empty-icon">🔍</div>
            <h3>No guides found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="tg-reset-btn" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>
              🔄 Reset Filters
            </button>
          </div>
        ) : (
          <div className="tg-grid">
            {filtered.map(guide => (
              <div key={guide.id} className="tg-card">
                <div className="tg-card-header">
                  <div className="tg-card-img-wrap">
                    <img 
                      src={getCurrentImage(guide)} 
                      alt={guide.title} 
                      className={`tg-card-img ${imageTransitioning[guide.id] ? 'fade-out' : 'fade-in'}`}
                      onError={(e) => { e.target.src = guide.image; }}
                    />
                    {guide.galleryImages && guide.galleryImages.length > 1 && (
                      <>
                        <button className="tg-carousel-btn tg-carousel-prev" onClick={(e) => prevImage(guide.id, e)}>‹</button>
                        <button className="tg-carousel-btn tg-carousel-next" onClick={(e) => nextImage(guide.id, e)}>›</button>
                        <div className="tg-carousel-dots">
                          {guide.galleryImages.map((_, i) => (
                            <button 
                              key={i} 
                              className={`tg-carousel-dot ${(currentImageIndex[guide.id] || 0) === i ? 'active' : ''}`}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setCurrentImageIndex(prev => ({ ...prev, [guide.id]: i })); 
                              }}
                            />
                          ))}
                        </div>
                        <div className="tg-image-counter">
                          {(currentImageIndex[guide.id] || 0) + 1} / {guide.galleryImages.length}
                        </div>
                      </>
                    )}
                    <div className="tg-card-overlay-badges">
                      <span className="tg-card-category">{guide.emoji} {guide.category}</span>
                      <span 
                        className="tg-difficulty-badge" 
                        style={{ backgroundColor: getDifficultyColor(guide.difficulty) }}
                      >
                        {guide.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="tg-card-body">
                  <div className="tg-card-meta">
                    <span className="tg-read-time">⏱️ {guide.readTime}</span>
                    <span className="tg-season">🗓️ {guide.season}</span>
                  </div>
                  
                  <h3 className="tg-card-title">{guide.title}</h3>
                  <p className="tg-card-excerpt">{guide.excerpt}</p>
                  
                  <div className="tg-card-tags">
                    {guide.tags.map(tag => (
                      <span key={tag} className="tg-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="tg-card-footer">
                    <button className="tg-read-btn" onClick={() => setSelectedGuide(guide)}>
                      <span>📖</span>
                      Read Complete Guide
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured CTA Section */}
        <div className="tg-cta">
          <div className="tg-cta-content">
            <div className="tg-cta-icon">✈️</div>
            <h2>Ready to Turn Knowledge into Adventure?</h2>
            <p>Browse our curated trip packages and start planning your next unforgettable journey</p>
            <div className="tg-cta-stats">
              <div className="tg-cta-stat">
                <span className="tg-cta-stat-number">100+</span>
                <span className="tg-cta-stat-label">Happy Travelers</span>
              </div>
              <div className="tg-cta-stat">
                <span className="tg-cta-stat-number">3</span>
                <span className="tg-cta-stat-label">Featured Destinations</span>
              </div>
              <div className="tg-cta-stat">
                <span className="tg-cta-stat-number">4.8★</span>
                <span className="tg-cta-stat-label">Average Rating</span>
              </div>
            </div>
            <div className="tg-cta-btns">
              <button className="tg-cta-primary" onClick={() => navigate('/featured')}>
                <span>🌟</span>
                Explore Featured Trips
              </button>
              <button className="tg-cta-secondary" onClick={() => navigate('/plan-trip')}>
                <span>🗺️</span>
                Plan Custom Trip
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {selectedGuide && <GuideDetail guide={selectedGuide} onClose={() => setSelectedGuide(null)} />}
      <Footer />
    </div>
  );
};

export default TravelGuides;
