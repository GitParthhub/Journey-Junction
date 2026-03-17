import React from 'react';
import './TripDetailsModal.css';

const TripDetailsModal = ({ trip, isOpen, onClose, userRole }) => {
  if (!isOpen || !trip) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'INR') => {
    if (!amount) return 'TBD';
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    if (currency === 'USD') return `$${amount.toLocaleString('en-US')}`;
    if (currency === 'EUR') return `€${amount.toLocaleString('en-EU')}`;
    if (currency === 'GBP') return `£${amount.toLocaleString('en-GB')}`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getDuration = () => {
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    if (trip.duration?.days) {
      return `${trip.duration.days} days / ${trip.duration.nights || ''} nights`;
    }
    return 'Flexible';
  };

  const getImages = () => {
    if (trip.images && trip.images.length > 0) return trip.images;
    if (trip.image) return [trip.image];
    return ['/images/bali.webp'];
  };

  const images = getImages();

  return (
    <div className="trip-modal-overlay" onClick={onClose}>
      <div className="trip-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="trip-modal-close" onClick={onClose}>×</button>

        {/* Modal Header with Image */}
        <div className="trip-modal-header">
          <img 
            src={images[0]} 
            alt={trip.title}
            className="trip-modal-image"
            onError={(e) => e.target.src = '/images/bali.webp'}
          />
          <div className="trip-modal-header-overlay">
            <h2 className="trip-modal-title">{trip.title}</h2>
            {trip.isFeatured && <span className="trip-modal-featured">⭐ Featured</span>}
          </div>
        </div>

        {/* Modal Body */}
        <div className="trip-modal-body">
          {/* Section 1: Basic Info */}
          <div className="trip-modal-section">
            <h3 className="trip-modal-section-title">📍 Location & Description</h3>
            <div className="trip-modal-grid">
              <div className="trip-modal-item">
                <span className="trip-modal-label">Destination</span>
                <span className="trip-modal-value">
                  {trip.destinationCity && trip.destinationCountry 
                    ? `${trip.destinationCity}, ${trip.destinationCountry}` 
                    : trip.destination || 'Not specified'}
                </span>
              </div>
              {trip.category && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Category</span>
                  <span className="trip-modal-value">{trip.category}</span>
                </div>
              )}
            </div>
            {(trip.description || trip.detailedDescription || trip.shortDescription) && (
              <div className="trip-modal-description">
                <p>{trip.description || trip.detailedDescription || trip.shortDescription}</p>
              </div>
            )}
          </div>

          {/* Section 2: Travel Dates */}
          <div className="trip-modal-section">
            <h3 className="trip-modal-section-title">📅 Travel Dates</h3>
            <div className="trip-modal-grid">
              <div className="trip-modal-item">
                <span className="trip-modal-label">Start Date</span>
                <span className="trip-modal-value">{formatDate(trip.startDate)}</span>
              </div>
              <div className="trip-modal-item">
                <span className="trip-modal-label">End Date</span>
                <span className="trip-modal-value">{formatDate(trip.endDate)}</span>
              </div>
              <div className="trip-modal-item">
                <span className="trip-modal-label">Duration</span>
                <span className="trip-modal-value">{getDuration()}</span>
              </div>
              <div className="trip-modal-item">
                <span className="trip-modal-label">Status</span>
                <span className={`trip-modal-status ${trip.status || 'planned'}`}>
                  {(trip.status || 'Planned').charAt(0).toUpperCase() + (trip.status || 'planned').slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Budget & Pricing */}
          <div className="trip-modal-section">
            <h3 className="trip-modal-section-title">💰 Budget & Pricing</h3>
            <div className="trip-modal-grid">
              <div className="trip-modal-item">
                <span className="trip-modal-label">Budget</span>
                <span className="trip-modal-value trip-modal-budget">
                  {formatCurrency(trip.customBudget || trip.budget || trip.basePrice, trip.preferredCurrency || trip.currency)}
                </span>
              </div>
              {trip.budgetRange && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Budget Range</span>
                  <span className="trip-modal-value">{trip.budgetRange}</span>
                </div>
              )}
              {trip.basePrice && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Base Price</span>
                  <span className="trip-modal-value">{formatCurrency(trip.basePrice, trip.currency)}</span>
                </div>
              )}
              {trip.discountPrice && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Discount Price</span>
                  <span className="trip-modal-value">{formatCurrency(trip.discountPrice, trip.currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Travelers & Group */}
          <div className="trip-modal-section">
            <h3 className="trip-modal-section-title">👥 Group Information</h3>
            <div className="trip-modal-grid">
              {trip.numberOfTravelers && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Number of Travelers</span>
                  <span className="trip-modal-value">{trip.numberOfTravelers}</span>
                </div>
              )}
              {trip.groupSizeLimit && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Group Size Limit</span>
                  <span className="trip-modal-value">{trip.groupSizeLimit}</span>
                </div>
              )}
              {trip.minimumTravelers && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Minimum Travelers</span>
                  <span className="trip-modal-value">{trip.minimumTravelers}</span>
                </div>
              )}
              {trip.totalSeats && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Total Seats</span>
                  <span className="trip-modal-value">{trip.totalSeats}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Activities */}
          {(trip.activities?.length > 0 || trip.selectedActivities?.length > 0) && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">🎯 Activities</h3>
              <div className="trip-modal-activities">
                {(trip.activities || trip.selectedActivities || []).map((activity, idx) => (
                  <span key={idx} className="trip-modal-activity-tag">{activity}</span>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Accommodation */}
          {trip.accommodation && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">🏨 Accommodation</h3>
              <div className="trip-modal-grid">
                {trip.accommodation.hotelName && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Hotel Name</span>
                    <span className="trip-modal-value">{trip.accommodation.hotelName}</span>
                  </div>
                )}
                {trip.accommodation.roomType && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Room Type</span>
                    <span className="trip-modal-value">{trip.accommodation.roomType}</span>
                  </div>
                )}
                {trip.accommodation.hotelRating && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Rating</span>
                    <span className="trip-modal-value">{'⭐'.repeat(trip.accommodation.hotelRating)}</span>
                  </div>
                )}
                {trip.accommodation.location && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Location</span>
                    <span className="trip-modal-value">{trip.accommodation.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 7: Included Services */}
          {trip.includedServices && Object.values(trip.includedServices).some(Boolean) && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">✅ Included Services</h3>
              <div className="trip-modal-services">
                {Object.entries(trip.includedServices).map(([key, value]) => 
                  value && (
                    <span key={key} className="trip-modal-service-tag">
                      ✓ {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Section 8: Traveler Details */}
          {(trip.fullName || trip.email || trip.mobileNumber) && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">👤 Traveler Details</h3>
              <div className="trip-modal-grid">
                {trip.fullName && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Full Name</span>
                    <span className="trip-modal-value">{trip.fullName}</span>
                  </div>
                )}
                {trip.email && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Email</span>
                    <span className="trip-modal-value">{trip.email}</span>
                  </div>
                )}
                {trip.mobileNumber && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Mobile</span>
                    <span className="trip-modal-value">{trip.mobileNumber}</span>
                  </div>
                )}
                {trip.ageGroup && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Age Group</span>
                    <span className="trip-modal-value">{trip.ageGroup}</span>
                  </div>
                )}
                {trip.nationality && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Nationality</span>
                    <span className="trip-modal-value">{trip.nationality}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 9: Itinerary */}
          {trip.itinerary?.length > 0 && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">📋 Itinerary</h3>
              <div className="trip-modal-itinerary">
                {trip.itinerary.map((day, idx) => (
                  <div key={idx} className="trip-modal-itinerary-day">
                    <div className="trip-modal-itinerary-header">
                      <span className="trip-modal-day-number">Day {day.dayNumber || idx + 1}</span>
                      <span className="trip-modal-day-title">{day.dayTitle}</span>
                    </div>
                    {day.dayDescription && (
                      <p className="trip-modal-day-description">{day.dayDescription}</p>
                    )}
                    {day.activitiesIncluded && (
                      <p className="trip-modal-day-activities"><strong>Activities:</strong> {day.activitiesIncluded}</p>
                    )}
                    {day.mealsIncluded && (
                      <p className="trip-modal-day-meals"><strong>Meals:</strong> {day.mealsIncluded}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 10: Special Requests */}
          {(trip.dietaryRequirements || trip.accessibilityNeeds || trip.specialNotes) && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">📝 Special Requests</h3>
              <div className="trip-modal-grid">
                {trip.dietaryRequirements && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Dietary Requirements</span>
                    <span className="trip-modal-value">{trip.dietaryRequirements}</span>
                  </div>
                )}
                {trip.accessibilityNeeds && (
                  <div className="trip-modal-item">
                    <span className="trip-modal-label">Accessibility Needs</span>
                    <span className="trip-modal-value">{trip.accessibilityNeeds}</span>
                  </div>
                )}
              </div>
              {trip.specialNotes && (
                <div className="trip-modal-notes">
                  <p><strong>Special Notes:</strong> {trip.specialNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Section 11: Admin Only - Applicants */}
          {userRole === 'admin' && trip.applicants?.length > 0 && (
            <div className="trip-modal-section">
              <h3 className="trip-modal-section-title">📊 Applicants ({trip.applicants.length})</h3>
              <div className="trip-modal-applicants">
                {trip.applicants.map((applicant, idx) => (
                  <div key={idx} className="trip-modal-applicant-card">
                    <div className="trip-modal-applicant-header">
                      <span className="trip-modal-applicant-name">
                        {applicant.userId?.name || 'Unknown User'}
                      </span>
                      <span className={`trip-modal-applicant-status ${applicant.status}`}>
                        {applicant.status}
                      </span>
                    </div>
                    <div className="trip-modal-applicant-details">
                      <p><strong>Email:</strong> {applicant.userId?.email}</p>
                      {applicant.preferredStartDate && (
                        <p><strong>Preferred Dates:</strong> {formatDate(applicant.preferredStartDate)} to {formatDate(applicant.preferredEndDate)}</p>
                      )}
                      {applicant.message && (
                        <p><strong>Message:</strong> {applicant.message}</p>
                      )}
                      {applicant.paymentDetails?.amount && (
                        <p><strong>Payment:</strong> {formatCurrency(applicant.paymentDetails.amount, applicant.paymentDetails.currency)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 12: Meta Information */}
          <div className="trip-modal-section">
            <h3 className="trip-modal-section-title">ℹ️ Trip Information</h3>
            <div className="trip-modal-grid">
              {trip.tripId && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Trip ID</span>
                  <span className="trip-modal-value trip-modal-code">{trip.tripId}</span>
                </div>
              )}
              <div className="trip-modal-item">
                <span className="trip-modal-label">Created</span>
                <span className="trip-modal-value">{formatDate(trip.createdAt)}</span>
              </div>
              {trip.userId?.name && (
                <div className="trip-modal-item">
                  <span className="trip-modal-label">Organizer</span>
                  <span className="trip-modal-value">{trip.userId.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="trip-modal-footer">
          <button className="trip-modal-btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;
