import React, { useState, useEffect } from 'react';
import { tripAPI } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PlanTrip.css';

const PlanTrip = () => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    detailedDescription: '', // New field for more detailed description
    highlights: '', // New field for trip highlights
    startDate: '',
    endDate: '',
    budget: '',
    activities: '',
    status: 'planned'
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bestPhotoIndex, setBestPhotoIndex] = useState(0); // Track which image is the best photo
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const fetchTrip = async () => {
    try {
      const { data } = await tripAPI.getTripById(id);
      setFormData({
        title: data.title,
        destination: data.destination,
        description: data.description,
        detailedDescription: data.detailedDescription || '',
        highlights: data.highlights || '',
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate.split('T')[0],
        budget: data.budget,
        activities: data.activities ? data.activities.join(', ') : '',
        status: data.status
      });
      // Handle existing images
      if (data.images && data.images.length > 0) {
        setImagePreviews(data.images.map((img, index) => ({ 
          url: img, 
          isExisting: true,
          id: `existing-${index}`
        })));
        setBestPhotoIndex(data.bestPhotoIndex || 0);
      } else if (data.image) {
        setImagePreviews([{ url: data.image, isExisting: true, id: 'existing-0' }]);
        setBestPhotoIndex(0);
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tripData = {
        ...formData,
        budget: parseFloat(formData.budget),
        activities: formData.activities.split(',').map(a => a.trim()).filter(a => a),
        bestPhotoIndex: bestPhotoIndex // Include best photo index
      };
      
      // Handle image uploads
      if (selectedImages.length > 0) {
        const imageUrls = await Promise.all(
          selectedImages.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.readAsDataURL(file);
            });
          })
        );
        tripData.images = imageUrls;
        tripData.mainImage = imageUrls[bestPhotoIndex] || imageUrls[0]; // Set best photo as main image
      } else if (imagePreviews.length > 0) {
        const existingImages = imagePreviews.filter(img => img.isExisting).map(img => img.url);
        tripData.images = existingImages;
        tripData.mainImage = existingImages[bestPhotoIndex] || existingImages[0];
      }
      
      if (isEditing) {
        await tripAPI.updateTrip(id, tripData);
      } else {
        await tripAPI.createTrip(tripData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Error saving trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      return;
    }
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      alert('Please select only image files (JPEG, PNG, WebP)');
      return;
    }
    
    // Limit to 5 images for better selection
    if (validFiles.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }
    
    // Clear previous object URLs to prevent memory leaks
    imagePreviews.forEach(preview => {
      if (!preview.isExisting) {
        URL.revokeObjectURL(preview.url);
      }
    });
    
    setSelectedImages(validFiles);
    
    // Create preview URLs
    const previews = validFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
      id: `new-${index}-${Date.now()}`
    }));
    setImagePreviews(previews);
    setBestPhotoIndex(0); // Reset best photo to first image
  };

  const setBestPhoto = (index) => {
    setBestPhotoIndex(index);
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    
    setImagePreviews(newPreviews);
    setSelectedImages(newSelectedImages);
    
    // Clean up object URLs to prevent memory leaks
    if (imageToRemove && !imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      imagePreviews.forEach(preview => {
        if (!preview.isExisting) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="plan-trip">
      <Navbar />
      <div className="plan-trip-container">
        <div className="plan-trip-header">
          <h1 className="plan-trip-title">
            {isEditing ? 'Edit Trip' : 'Plan New Trip'}
          </h1>
          <p className="plan-trip-subtitle">
            {isEditing ? 'Update your travel plans' : 'Create your perfect travel itinerary'}
          </p>
          
          {/* Link to Advanced Trip Form */}
          {!isEditing && (
            <div className="advanced-form-link">
              <p className="link-description">
                Need more detailed planning? Try our comprehensive trip package creator:
              </p>
              <button 
                type="button" 
                onClick={() => navigate('/admin/trips/new')}
                className="btn-advanced"
              >
                🚀 Create Advanced Trip Package
              </button>
              <span className="link-help">
                Includes itinerary planning, pricing options, accommodation details, and more!
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Trip Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="Enter a memorable title for your trip"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <input
                  type="text"
                  name="destination"
                  className="form-input"
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Brief overview of your trip (2-3 sentences)"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
                <span className="form-help">Keep it concise - this will appear on trip cards</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  name="detailedDescription"
                  className="form-textarea"
                  placeholder="Tell the full story of your trip - what makes it special, what you'll experience, why others should visit..."
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  rows="5"
                />
                <span className="form-help">Share the complete experience and details</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">Trip Highlights</label>
                <textarea
                  name="highlights"
                  className="form-textarea"
                  placeholder="Key highlights: Best moments, must-see places, unique experiences..."
                  value={formData.highlights}
                  onChange={handleInputChange}
                  rows="3"
                />
                <span className="form-help">What are the top 3-5 things that made this trip amazing?</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Trip Details</h3>
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Budget (USD) *</label>
                <input
                  type="number"
                  name="budget"
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                />
                <span className="form-help">Enter your estimated budget in US dollars</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">Trip Photos & Best Photo Selection</label>
                <input
                  type="file"
                  name="images"
                  className="form-input"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{ padding: '8px' }}
                />
                <span className="form-help">📸 Upload up to 5 photos (JPEG, PNG, WebP). Select your best photo to feature on the trip card.</span>
                
                {/* Image Previews with Best Photo Selection */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>
                      Select Your Best Photo ({imagePreviews.length} photo{imagePreviews.length > 1 ? 's' : ''})
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                      gap: '16px',
                      marginTop: '12px'
                    }}>
                      {imagePreviews.map((preview, index) => (
                        <div key={preview.id || index} style={{ 
                          position: 'relative', 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          border: bestPhotoIndex === index ? '3px solid #4299e1' : '2px solid #e5e7eb',
                          boxShadow: bestPhotoIndex === index ? '0 4px 12px rgba(66, 153, 225, 0.3)' : 'none',
                          transition: 'all 0.3s ease'
                        }}>
                          <img 
                            src={preview.url} 
                            alt={`Preview ${index + 1}`} 
                            style={{
                              width: '100%',
                              height: '140px',
                              objectFit: 'cover',
                              display: 'block',
                              cursor: 'pointer'
                            }}
                            onClick={() => setBestPhoto(index)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            title="Click to set as best photo"
                          />
                          
                          {/* Best Photo Badge */}
                          {bestPhotoIndex === index && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '16px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                              ⭐ Best Photo
                            </div>
                          )}
                          
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Remove image"
                          >
                            ×
                          </button>
                          
                          {/* Photo Number */}
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {index + 1}
                          </div>
                          
                          {/* Click to Select Overlay */}
                          {bestPhotoIndex !== index && (
                            <div style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '8px',
                              background: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '500',
                              opacity: '0.8'
                            }}>
                              Click to select
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Best Photo Info */}
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#f0f9ff',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd'
                    }}>
                      <p style={{
                        margin: '0',
                        fontSize: '14px',
                        color: '#0369a1',
                        fontWeight: '500'
                      }}>
                        💡 <strong>Best Photo:</strong> Photo #{bestPhotoIndex + 1} will be featured on your trip card and shown first in galleries.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Activities & Status</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Activities</label>
                <input
                  type="text"
                  name="activities"
                  className="form-input"
                  placeholder="Hiking, Photography, Local cuisine, Museums"
                  value={formData.activities}
                  onChange={handleInputChange}
                />
                <span className="form-help">Separate multiple activities with commas</span>
              </div>
              
              <div className="form-group">
                <label className="form-label">Trip Status</label>
                <div className="status-options">
                  <div className="status-option">
                    <input
                      type="radio"
                      id="planned"
                      name="status"
                      value="planned"
                      className="status-radio"
                      checked={formData.status === 'planned'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="planned" className="status-label">Planned</label>
                  </div>
                  <div className="status-option">
                    <input
                      type="radio"
                      id="ongoing"
                      name="status"
                      value="ongoing"
                      className="status-radio"
                      checked={formData.status === 'ongoing'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="ongoing" className="status-label">Ongoing</label>
                  </div>
                  <div className="status-option">
                    <input
                      type="radio"
                      id="completed"
                      name="status"
                      value="completed"
                      className="status-radio"
                      checked={formData.status === 'completed'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="completed" className="status-label">Completed</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Trip' : 'Create Trip')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;
