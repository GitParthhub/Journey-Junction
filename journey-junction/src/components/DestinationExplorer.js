import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DestinationExplorer.css';

const DestinationExplorer = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const navigate = useNavigate();

  // Sample destinations data
  const sampleDestinations = [
    {
      _id: "dest_001",
      name: "Santorini, Greece",
      country: "Greece",
      region: "Mediterranean",
      description: "A stunning Greek island known for its white-washed buildings, blue-domed churches, and breathtaking sunsets.",
      highlights: ["Iconic blue-domed churches", "Spectacular sunset views", "Volcanic beaches", "Traditional Greek cuisine"],
      images: {
        hero: 'http://localhost:5000/images/santroni/cover.jpeg',
        gallery: [
          'http://localhost:5000/images/santroni/cover.jpeg',
          'http://localhost:5000/images/santroni/1.jpeg',
          'http://localhost:5000/images/santroni/2.jpeg',
          'http://localhost:5000/images/santroni/3.jpeg',
          'http://localhost:5000/images/santroni/4.jpeg',
          'http://localhost:5000/images/santroni/5.jpeg'
        ]
      },
      bestTimeToVisit: {
        months: ["April", "May", "September", "October"],
        season: "Spring & Fall"
      },
      budgetEstimate: {
        budget: { min: 80000, max: 120000 },
        standard: { min: 120000, max: 200000 },
        luxury: { min: 200000, max: 350000 },
        currency: "INR"
      },
      statistics: {
        popularity: 9.2,
        safetyRating: 9.5,
        averageStay: 5.2,
        totalReviews: 1847
      },
      tags: ["Romantic", "Photography", "Luxury", "Island", "Sunset"],
      featured: true,
      trending: true
    },
    {
      _id: "dest_002",
      name: "Bali, Indonesia",
      country: "Indonesia",
      region: "Southeast Asia",
      description: "Tropical paradise with ancient temples, lush rice terraces, and pristine beaches.",
      highlights: ["Ancient temples", "Rice terraces", "Beach resorts", "Cultural experiences"],
      images: {
        hero: 'http://localhost:5000/images/bali/bali.webp',
        gallery: [
          'http://localhost:5000/images/bali/bali.webp',
          'http://localhost:5000/images/bali/bali-2.jpg',
          'http://localhost:5000/images/bali/bali-3.jpg',
          'http://localhost:5000/images/bali/ubud-bali.jpg',
          'http://localhost:5000/images/bali/kutabeach.jpeg',
          'http://localhost:5000/images/bali/uluwatutemple.jpeg',
          'http://localhost:5000/images/bali/nusapenida.jpeg'
        ]
      },
      bestTimeToVisit: {
        months: ["April", "May", "June", "July", "August", "September"],
        season: "Dry Season"
      },
      budgetEstimate: {
        budget: { min: 50000, max: 80000 },
        standard: { min: 80000, max: 150000 },
        luxury: { min: 150000, max: 300000 },
        currency: "INR"
      },
      statistics: {
        popularity: 9.5,
        safetyRating: 8.8,
        averageStay: 7.5,
        totalReviews: 2341
      },
      tags: ["Adventure", "Cultural", "Beach", "Spiritual", "Nature"],
      featured: true,
      trending: false
    },
    {
      _id: "dest_003",
      name: "Manali, India",
      country: "India",
      region: "Himalayas",
      description: "Hill station in the Himalayas offering adventure sports, scenic beauty, and mountain culture.",
      highlights: ["Mountain trekking", "Adventure sports", "Snow activities", "Local culture"],
      images: {
        hero: 'http://localhost:5000/images/himalaya/him2.jpeg',
        gallery: [
          'http://localhost:5000/images/himalaya/him2.jpeg',
          'http://localhost:5000/images/himalaya/him3.jpg',
          'http://localhost:5000/images/himalaya/him4.jpeg',
          'http://localhost:5000/images/himalaya/hampta.jpeg',
          'http://localhost:5000/images/himalaya/triund.jpeg',
          'http://localhost:5000/images/himalaya/valley.jpg',
          'http://localhost:5000/images/himalaya/bhamhatal.jpeg'
        ]
      },
      bestTimeToVisit: {
        months: ["March", "April", "May", "June", "October", "November"],
        season: "Spring & Autumn"
      },
      budgetEstimate: {
        budget: { min: 25000, max: 40000 },
        standard: { min: 40000, max: 80000 },
        luxury: { min: 80000, max: 150000 },
        currency: "INR"
      },
      statistics: {
        popularity: 8.7,
        safetyRating: 9.0,
        averageStay: 4.5,
        totalReviews: 1256
      },
      tags: ["Adventure", "Mountains", "Trekking", "Snow", "Budget-friendly"],
      featured: false,
      trending: true
    }
  ];

  useEffect(() => {
    setDestinations(sampleDestinations);
  }, []);

  const formatCurrency = (amount, currency = 'INR') => {
    if (currency === 'INR') {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const openDestinationModal = (destination) => {
    setSelectedDestination(destination);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDestination(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedDestination) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedDestination.images.gallery.length
      );
    }
  };

  const prevImage = () => {
    if (selectedDestination) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedDestination.images.gallery.length - 1 : prev - 1
      );
    }
  };

  const filteredDestinations = destinations.filter(dest => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'featured') return dest.featured;
    if (filterCategory === 'trending') return dest.trending;
    return dest.tags.some(tag => tag.toLowerCase().includes(filterCategory.toLowerCase()));
  });

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.statistics.popularity - a.statistics.popularity;
      case 'budget':
        return a.budgetEstimate.budget.min - b.budgetEstimate.budget.min;
      case 'reviews':
        return b.statistics.totalReviews - a.statistics.totalReviews;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="destination-explorer">
      <div className="explorer-header">
        <h1>🌍 Destination Explorer</h1>
        <p>Discover amazing destinations around the world</p>
      </div>

      <div className="explorer-controls">
        <div className="filter-controls">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Destinations</option>
            <option value="featured">Featured</option>
            <option value="trending">Trending</option>
            <option value="adventure">Adventure</option>
            <option value="romantic">Romantic</option>
            <option value="beach">Beach</option>
            <option value="mountains">Mountains</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="popularity">Most Popular</option>
            <option value="budget">Budget Friendly</option>
            <option value="reviews">Most Reviewed</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="destinations-grid">
        {sortedDestinations.map((destination) => (
          <div key={destination._id} className="destination-card">
            <div className="destination-image-container">
              <img 
                src={destination.images.hero} 
                alt={destination.name}
                className="destination-image"
                onError={(e) => {
                  e.target.src = '/images/background.jpg';
                }}
              />
              <div className="destination-badges">
                {destination.featured && <span className="badge featured">⭐ Featured</span>}
                {destination.trending && <span className="badge trending">🔥 Trending</span>}
              </div>
              <div className="destination-overlay">
                <button 
                  className="explore-btn"
                  onClick={() => openDestinationModal(destination)}
                >
                  🔍 Explore
                </button>
              </div>
            </div>

            <div className="destination-content">
              <div className="destination-header">
                <h3 className="destination-name">{destination.name}</h3>
                <div className="destination-rating">
                  <span className="rating-stars">⭐</span>
                  <span className="rating-value">{destination.statistics.popularity}</span>
                  <span className="rating-reviews">({destination.statistics.totalReviews})</span>
                </div>
              </div>

              <p className="destination-description">{destination.description}</p>

              <div className="destination-highlights">
                {destination.highlights.slice(0, 3).map((highlight, index) => (
                  <span key={index} className="highlight-tag">{highlight}</span>
                ))}
              </div>

              <div className="destination-info">
                <div className="info-item">
                  <span className="info-icon">🗓️</span>
                  <span className="info-text">{destination.bestTimeToVisit.season}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <span className="info-text">
                    {formatCurrency(destination.budgetEstimate.budget.min)} - {formatCurrency(destination.budgetEstimate.budget.max)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <span className="info-text">{destination.statistics.averageStay} days avg</span>
                </div>
              </div>

              <div className="destination-tags">
                {destination.tags.slice(0, 4).map((tag, index) => (
                  <span key={index} className="destination-tag">{tag}</span>
                ))}
              </div>

              <div className="destination-actions">
                <button 
                  className="btn-primary"
                  onClick={() => openDestinationModal(destination)}
                >
                  View Details
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/plan-trip', { state: { destination: destination.name } })}
                >
                  Plan Trip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Destination Details Modal */}
      {showModal && selectedDestination && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content destination-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDestination.name}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="destination-gallery">
                <div className="gallery-main">
                  <img 
                    src={selectedDestination.images.gallery[currentImageIndex]} 
                    alt={selectedDestination.name}
                    className="gallery-image"
                  />
                  <button className="gallery-nav prev" onClick={prevImage}>‹</button>
                  <button className="gallery-nav next" onClick={nextImage}>›</button>
                  <div className="gallery-counter">
                    {currentImageIndex + 1} / {selectedDestination.images.gallery.length}
                  </div>
                </div>
                <div className="gallery-thumbnails">
                  {selectedDestination.images.gallery.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`${selectedDestination.name} ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="destination-details">
                <div className="details-section">
                  <h3>🌟 Highlights</h3>
                  <div className="highlights-grid">
                    {selectedDestination.highlights.map((highlight, index) => (
                      <div key={index} className="highlight-item">
                        <span className="highlight-bullet">•</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h3>📅 Best Time to Visit</h3>
                  <p><strong>Season:</strong> {selectedDestination.bestTimeToVisit.season}</p>
                  <p><strong>Months:</strong> {selectedDestination.bestTimeToVisit.months.join(', ')}</p>
                </div>

                <div className="details-section">
                  <h3>💰 Budget Estimates (7 days)</h3>
                  <div className="budget-grid">
                    <div className="budget-item">
                      <span className="budget-type">Budget</span>
                      <span className="budget-range">
                        {formatCurrency(selectedDestination.budgetEstimate.budget.min)} - {formatCurrency(selectedDestination.budgetEstimate.budget.max)}
                      </span>
                    </div>
                    <div className="budget-item">
                      <span className="budget-type">Standard</span>
                      <span className="budget-range">
                        {formatCurrency(selectedDestination.budgetEstimate.standard.min)} - {formatCurrency(selectedDestination.budgetEstimate.standard.max)}
                      </span>
                    </div>
                    <div className="budget-item">
                      <span className="budget-type">Luxury</span>
                      <span className="budget-range">
                        {formatCurrency(selectedDestination.budgetEstimate.luxury.min)} - {formatCurrency(selectedDestination.budgetEstimate.luxury.max)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>📊 Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Popularity</span>
                      <span className="stat-value">{selectedDestination.statistics.popularity}/10</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Safety Rating</span>
                      <span className="stat-value">{selectedDestination.statistics.safetyRating}/10</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Avg Stay</span>
                      <span className="stat-value">{selectedDestination.statistics.averageStay} days</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Reviews</span>
                      <span className="stat-value">{selectedDestination.statistics.totalReviews}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-primary-large"
                    onClick={() => {
                      closeModal();
                      navigate('/plan-trip', { state: { destination: selectedDestination.name } });
                    }}
                  >
                    🗺️ Plan Your Trip
                  </button>
                  <button 
                    className="btn-secondary-large"
                    onClick={() => {
                      closeModal();
                      navigate('/featured');
                    }}
                  >
                    🌟 View Featured Trips
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationExplorer;