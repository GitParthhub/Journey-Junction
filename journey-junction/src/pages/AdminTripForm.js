import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminTripForm.css';

const AdminTripForm = () => {
  const [formData, setFormData] = useState({
    // Basic Trip Information
    title: '',
    tripId: '',
    destination: '',
    city: '',
    category: 'Adventure',
    shortDescription: '',
    detailedDescription: '',
    duration: { days: '', nights: '' },

    // Travel Details
    departureCity: '',
    arrivalDestination: '',
    availableDates: [],
    groupSizeLimit: '',
    minimumTravelers: '',

    // Pricing Information
    basePrice: '',
    childPrice: '',
    discountPrice: '',
    taxes: '',
    currency: 'USD',

    // Itinerary Section
    itinerary: [],

    // Places to Visit
    placesToVisit: [],

    // Included Services
    includedServices: {
      flights: false,
      hotelAccommodation: false,
      localTransport: false,
      tourGuide: false,
      entryTickets: false,
      meals: false,
      activities: false
    },

    // Excluded Services
    excludedServices: [
      'Personal expenses',
      'Travel insurance',
      'Visa charges',
      'Additional activities',
      'Shopping'
    ],

    // Activities Included
    activitiesIncluded: {
      adventure: false,
      cultural: false,
      sightseeing: false,
      waterSports: false,
      trekking: false
    },

    // Accommodation Details
    accommodation: {
      hotelName: '',
      hotelRating: '',
      roomType: '',
      location: ''
    },

    // Media / Gallery
    galleryImages: [],

    // Booking Settings
    totalSeats: '',
    bookingDeadline: '',
    status: 'Active',
    isFeatured: true
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const categories = ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Trekking'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'];

  useEffect(() => {
    if (!isEditing) {
      generateTripId();
    } else {
      fetchTrip();
    }
  }, [id, isEditing]);

  const generateTripId = () => {
    const id = 'TRIP' + Date.now().toString().slice(-6);
    setFormData(prev => ({ ...prev, tripId: id }));
  };

  const fetchTrip = async () => {
    try {
      const { data } = await adminAPI.getTripById(id);
      setFormData(data);
      
      // Only load images that are specifically uploaded for this trip (not default images)
      if (data.galleryImages && data.galleryImages.length > 0) {
        // Filter out default/placeholder images - only keep base64 or uploaded images
        const tripSpecificImages = data.galleryImages.filter(imageUrl => {
          // Keep images that are base64 encoded (uploaded images)
          if (imageUrl.startsWith('data:image/')) {
            return true;
          }
          // Skip default images from public/images or assets folders
          if (imageUrl.includes('/images/') || imageUrl.includes('/assets/') || 
              imageUrl.includes('default') || imageUrl.includes('placeholder')) {
            return false;
          }
          // Keep other uploaded images (URLs that don't seem to be defaults)
          return true;
        });
        
        if (tripSpecificImages.length > 0) {
          const previews = tripSpecificImages.map((url, index) => ({
            url: url,
            name: `Existing image ${index + 1}`,
            isExisting: true,
            id: `existing-${index}-${Date.now()}`
          }));
          setImagePreviews(previews);
        }
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addItineraryDay = () => {
    const newDay = {
      dayNumber: formData.itinerary.length + 1,
      dayTitle: '',
      dayDescription: '',
      activitiesIncluded: '',
      mealsIncluded: '',
      accommodationDetails: ''
    };
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay]
    }));
  };

  const updateItineraryDay = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index][field] = value;
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const removeItineraryDay = (index) => {
    const updatedItinerary = formData.itinerary.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const addPlace = () => {
    const newPlace = {
      placeName: '',
      shortDescription: '',
      image: ''
    };
    setFormData(prev => ({
      ...prev,
      placesToVisit: [...prev.placesToVisit, newPlace]
    }));
  };

  const updatePlace = (index, field, value) => {
    const updatedPlaces = [...formData.placesToVisit];
    updatedPlaces[index][field] = value;
    setFormData(prev => ({ ...prev, placesToVisit: updatedPlaces }));
  };

  const handlePlaceImageChange = (index, e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select only image files (JPEG, PNG, WebP)');
      return;
    }
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePlace(index, 'image', e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Reset the file input
    e.target.value = '';
  };

  const removePlaceImage = (index) => {
    updatePlace(index, 'image', '');
  };

  const removePlace = (index) => {
    const updatedPlaces = formData.placesToVisit.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, placesToVisit: updatedPlaces }));
  };

  const addAvailableDate = () => {
    const newDate = { startDate: '', endDate: '' };
    setFormData(prev => ({
      ...prev,
      availableDates: [...prev.availableDates, newDate]
    }));
  };

  const updateAvailableDate = (index, field, value) => {
    const updatedDates = [...formData.availableDates];
    updatedDates[index][field] = value;
    setFormData(prev => ({ ...prev, availableDates: updatedDates }));
  };

  const removeAvailableDate = (index) => {
    const updatedDates = formData.availableDates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, availableDates: updatedDates }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      return;
    }
    
    // Check if adding these files would exceed the limit
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 5) {
      alert(`You can only add ${5 - imagePreviews.length} more images. Total limit is 5 images.`);
      return;
    }
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      alert('Please select only image files (JPEG, PNG, WebP)');
      return;
    }
    
    // Add new files to existing selection
    const newSelectedImages = [...selectedImages, ...validFiles];
    setSelectedImages(newSelectedImages);
    
    // Create preview URLs for new files
    const newPreviews = validFiles.map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        url: url,
        name: file.name,
        isExisting: false,
        id: `new-${imagePreviews.length + index}-${Date.now()}`
      };
    });
    
    // Add new previews to existing ones
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Reset the file input
    e.target.value = '';
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Find the corresponding selected image and remove it
    const newSelectedImages = selectedImages.filter((_, i) => {
      // Match by checking if the preview at this index corresponds to this selected image
      return i !== index || imagePreviews[index].isExisting;
    });
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Validate required fields more thoroughly
      const requiredFieldsCheck = {
        'Trip Title': formData.title,
        'Destination': formData.destination,
        'Short Description': formData.shortDescription,
        'Detailed Description': formData.detailedDescription,
        'Departure City': formData.departureCity,
        'Arrival Destination': formData.arrivalDestination,
        'Base Price': formData.basePrice,
        'Group Size Limit': formData.groupSizeLimit,
        'Minimum Travelers': formData.minimumTravelers,
        'Total Seats': formData.totalSeats,
        'Duration Days': formData.duration.days,
        'Duration Nights': formData.duration.nights
      };
      
      const emptyFields = Object.entries(requiredFieldsCheck)
        .filter(([key, value]) => !value || value === '' || value === 0)
        .map(([key]) => key);
      
      if (emptyFields.length > 0) {
        alert(`Please fill in the following required fields:\n- ${emptyFields.join('\n- ')}`);
        setLoading(false);
        return;
      }

      const tripData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        childPrice: parseFloat(formData.childPrice) || 0,
        discountPrice: parseFloat(formData.discountPrice) || 0,
        taxes: parseFloat(formData.taxes) || 0,
        groupSizeLimit: parseInt(formData.groupSizeLimit) || 1,
        minimumTravelers: parseInt(formData.minimumTravelers) || 1,
        totalSeats: parseInt(formData.totalSeats) || 1,
        duration: {
          days: parseInt(formData.duration.days) || 1,
          nights: parseInt(formData.duration.nights) || 0
        },
        // Clean up places to visit - only include uploaded images, not default ones
        placesToVisit: formData.placesToVisit.map(place => ({
          placeName: place.placeName || '',
          shortDescription: place.shortDescription || '',
          image: place.image && place.image.startsWith('data:image/') ? place.image : ''
        }))
      };
      
      // Handle image uploads - only include trip-specific images
      const allImages = [];
      
      // Add newly uploaded images
      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target.result);
            };
            reader.readAsDataURL(file);
          });
          
          allImages.push(dataUrl);
        }
      }
      
      // Add existing trip-specific images (not default images)
      if (imagePreviews.length > 0) {
        const existingTripImages = imagePreviews
          .filter(img => img.isExisting)
          .map(img => img.url)
          .filter(url => {
            // Only keep base64 images or non-default images
            return url.startsWith('data:image/') || 
                   (!url.includes('/images/') && !url.includes('/assets/') && 
                    !url.includes('default') && !url.includes('placeholder'));
          });
        allImages.push(...existingTripImages);
      }
      
      // Only set gallery images if we have trip-specific images
      if (allImages.length > 0) {
        tripData.galleryImages = allImages;
        tripData.coverImage = allImages[0];
      } else {
        // No trip-specific images, don't set any images
        tripData.galleryImages = [];
        delete tripData.coverImage;
      }
      
      // Convert dates properly
      if (formData.bookingDeadline) {
        tripData.bookingDeadline = new Date(formData.bookingDeadline);
      }
      
      if (formData.availableDates && formData.availableDates.length > 0) {
        tripData.availableDates = formData.availableDates.map(dateRange => ({
          startDate: dateRange.startDate ? new Date(dateRange.startDate) : null,
          endDate: dateRange.endDate ? new Date(dateRange.endDate) : null
        })).filter(dateRange => dateRange.startDate && dateRange.endDate);
      }
      
      console.log('Submitting trip data:', tripData);
      
      if (isEditing) {
        await adminAPI.updateTrip(id, tripData);
      } else {
        await adminAPI.createTrip(tripData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error saving trip:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An unknown error occurred';
      
      alert(`Error saving trip: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-trip-form">
      <Navbar />
      
      <div className="form-container">
        {success && (
          <div className="success-banner">
            ✅ Trip {isEditing ? 'updated' : 'created'} successfully! Redirecting...
          </div>
        )}

        <div className="form-header">
          <h1>{isEditing ? 'Edit Trip Package' : 'Create New Trip Package'}</h1>
          <p>Complete trip package management system</p>
        </div>

        <form onSubmit={handleSubmit} className="trip-form">
          {/* Basic Trip Information */}
          <div className="form-section">
            <h2>1. Basic Trip Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Trip Title / Package Name *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Trip ID</label>
                <input
                  type="text"
                  name="tripId"
                  value={formData.tripId}
                  readOnly
                  className="readonly"
                />
              </div>
              
              <div className="form-group">
                <label>Destination / Country *</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>City / Region</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Trip Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group full-width">
                <label>Short Description *</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label>Detailed Description *</label>
                <textarea
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Duration - Days *</label>
                <input
                  type="number"
                  name="duration.days"
                  value={formData.duration.days}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Duration - Nights *</label>
                <input
                  type="number"
                  name="duration.nights"
                  value={formData.duration.nights}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="form-section">
            <h2>2. Travel Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Departure City *</label>
                <input
                  type="text"
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Arrival Destination *</label>
                <input
                  type="text"
                  name="arrivalDestination"
                  value={formData.arrivalDestination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Group Size Limit *</label>
                <input
                  type="number"
                  name="groupSizeLimit"
                  value={formData.groupSizeLimit}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Minimum Travelers Required *</label>
                <input
                  type="number"
                  name="minimumTravelers"
                  value={formData.minimumTravelers}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
            
            {/* Available Dates */}
            <div className="subsection">
              <h3>Available Dates</h3>
              <button type="button" onClick={addAvailableDate} className="btn-add">
                + Add Available Date Range
              </button>
              {formData.availableDates.map((dateRange, index) => (
                <div key={index} className="dynamic-item">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => updateAvailableDate(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => updateAvailableDate(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeAvailableDate(index)} className="btn-remove">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="form-section">
            <h2>3. Pricing Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Base Price per Person *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Child Price</label>
                <input
                  type="number"
                  name="childPrice"
                  value={formData.childPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Taxes / Additional Fees</label>
                <input
                  type="number"
                  name="taxes"
                  value={formData.taxes}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Currency Type *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="form-section">
            <h2>4. Itinerary Section</h2>
            {formData.itinerary.map((day, index) => (
              <div key={index} className="dynamic-item itinerary-day">
                <h4>Day {day.dayNumber}</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Day Title</label>
                    <input
                      type="text"
                      value={day.dayTitle}
                      onChange={(e) => updateItineraryDay(index, 'dayTitle', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Day Description</label>
                    <textarea
                      value={day.dayDescription}
                      onChange={(e) => updateItineraryDay(index, 'dayDescription', e.target.value)}
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Activities Included</label>
                    <input
                      type="text"
                      value={day.activitiesIncluded}
                      onChange={(e) => updateItineraryDay(index, 'activitiesIncluded', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Meals Included</label>
                    <input
                      type="text"
                      value={day.mealsIncluded}
                      onChange={(e) => updateItineraryDay(index, 'mealsIncluded', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Accommodation Details</label>
                    <textarea
                      value={day.accommodationDetails}
                      onChange={(e) => updateItineraryDay(index, 'accommodationDetails', e.target.value)}
                      rows="4"
                      placeholder="Enter detailed accommodation information (hotel name, room type, amenities, location, etc.)"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => removeItineraryDay(index)} className="btn-remove">
                  Remove Day
                </button>
              </div>
            ))}
            <div className="section-spacing">
              <button type="button" onClick={addItineraryDay} className="btn-add">
                + Add Day to Itinerary
              </button>
              {formData.itinerary.length === 0 && (
                <p className="empty-itinerary-message">
                  No itinerary days added yet. Click the button above to start building your day-by-day itinerary.
                </p>
              )}
            </div>
          </div>

          {/* Places to Visit */}
          <div className="form-section">
            <h2>5. Places to Visit</h2>
            {formData.placesToVisit.map((place, index) => (
              <div key={index} className="dynamic-item">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Place Name</label>
                    <input
                      type="text"
                      value={place.placeName}
                      onChange={(e) => updatePlace(index, 'placeName', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Short Description</label>
                    <textarea
                      value={place.shortDescription}
                      onChange={(e) => updatePlace(index, 'shortDescription', e.target.value)}
                      rows="2"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Place Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handlePlaceImageChange(index, e)}
                      className="form-input"
                      style={{ padding: '8px' }}
                    />
                    <span className="form-help">📸 Upload an image for this place (JPEG, PNG, WebP)</span>
                    
                    {/* Image Preview */}
                    {place.image && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ 
                          position: 'relative', 
                          display: 'inline-block',
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          border: '2px solid #e5e7eb'
                        }}>
                          <img 
                            src={place.image} 
                            alt={place.placeName || `Place ${index + 1}`}
                            style={{
                              width: '200px',
                              height: '120px',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removePlaceImage(index)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => removePlace(index)} className="btn-remove">
                  Remove Place
                </button>
              </div>
            ))}
            <div className="section-spacing">
              <button type="button" onClick={addPlace} className="btn-add">
                + Add Place to Visit
              </button>
              {formData.placesToVisit.length === 0 && (
                <p className="empty-itinerary-message">
                  No places added yet. Click the button above to start adding places to visit.
                </p>
              )}
            </div>
          </div>

          {/* Included Services */}
          <div className="form-section">
            <h2>6. Included Services</h2>
            <div className="checkbox-grid">
              {Object.entries(formData.includedServices).map(([key, value]) => (
                <div key={key} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`included-${key}`}
                    name={`includedServices.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={`included-${key}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Included */}
          <div className="form-section">
            <h2>7. Activities Included</h2>
            <div className="checkbox-grid">
              {Object.entries(formData.activitiesIncluded).map(([key, value]) => (
                <div key={key} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`activity-${key}`}
                    name={`activitiesIncluded.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={`activity-${key}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation Details */}
          <div className="form-section">
            <h2>8. Accommodation Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Hotel Name</label>
                <input
                  type="text"
                  name="accommodation.hotelName"
                  value={formData.accommodation.hotelName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Hotel Rating</label>
                <select
                  name="accommodation.hotelRating"
                  value={formData.accommodation.hotelRating}
                  onChange={handleInputChange}
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Star</option>
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Room Type</label>
                <input
                  type="text"
                  name="accommodation.roomType"
                  value={formData.accommodation.roomType}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="accommodation.location"
                  value={formData.accommodation.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Media / Gallery */}
          <div className="form-section">
            <h2>9. Media / Gallery</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Trip Gallery Images (Maximum 5 photos)</label>
                <input
                  type="file"
                  name="galleryImages"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="form-input"
                  style={{ padding: '8px' }}
                />
                <span className="form-help">📸 Upload up to 5 stunning photos (JPEG, PNG, WebP). First image will be the cover image. You can select multiple files at once or add them one by one.</span>
                
                {/* Add More Images Button */}
                {imagePreviews.length > 0 && imagePreviews.length < 5 && (
                  <div style={{ marginTop: '12px' }}>
                    <label 
                      htmlFor="additional-images"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      + Add More Images ({5 - imagePreviews.length} remaining)
                    </label>
                    <input
                      id="additional-images"
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Selected Images ({imagePreviews.length}/5):</h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                      gap: '12px'
                    }}>
                      {imagePreviews.map((preview, index) => (
                        <div key={preview.id || `preview-${index}`} style={{ 
                          position: 'relative', 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          border: '2px solid #e5e7eb'
                        }}>
                          <img 
                            src={preview.url} 
                            alt={`Preview ${index + 1}`} 
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            title="Remove image"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <div style={{
                              position: 'absolute',
                              bottom: '4px',
                              left: '4px',
                              background: 'rgba(16, 185, 129, 0.9)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              Cover
                            </div>
                          )}
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            fontSize: '9px'
                          }}>
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="form-section">
            <h2>10. Booking Settings</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Seats Available *</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Booking Deadline</label>
                <input
                  type="date"
                  name="bookingDeadline"
                  value={formData.bookingDeadline}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Trip Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="form-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="featured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="featured">Featured Trip</label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin')} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Trip Package' : 'Create Trip Package')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTripForm;