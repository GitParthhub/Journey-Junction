import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EditTrip.css';

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    destinationCountry: '',
    destinationCity: '',
    tripType: '',
    numberOfTravelers: '',
    startDate: '',
    endDate: '',
    flexibleDates: 'no',
    fullName: '',
    email: '',
    mobileNumber: '',
    ageGroup: '',
    nationality: '',
    passportAvailable: 'no',
    emergencyContactName: '',
    emergencyContactNumber: '',
    budgetRange: '',
    customBudget: '',
    preferredCurrency: 'INR',
    budgetType: '',
    hotelCategory: '',
    roomType: '',
    bedPreference: '',
    mealPlan: '',
    internationalFlightRequired: 'no',
    preferredDepartureCity: '',
    preferredAirline: '',
    localTransportType: '',
    selectedActivities: [],
    specialActivitiesRequested: '',
    numberOfDestinations: '',
    mustVisitPlaces: '',
    dailyActivityLevel: '',
    dietaryRequirements: '',
    accessibilityNeeds: '',
    celebrationType: '',
    specialNotes: '',
    passportCopy: null,
    idProof: null,
    visaDocument: null,
    paymentMethod: '',
    advancePaymentAmount: '',
    billingAddress: ''
  });

  const tripTypes = ['Adventure', 'Honeymoon', 'Family', 'Solo', 'Group', 'Cultural'];
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];
  const budgetRanges = ['₹50k – ₹1L', '₹1L – ₹2L', '₹2L – ₹5L', 'Custom'];
  const currencies = ['INR', 'USD', 'EUR', 'GBP'];
  const budgetTypes = ['Economy', 'Standard', 'Luxury'];
  const hotelCategories = ['3 Star', '4 Star', '5 Star', 'Resort', 'Homestay'];
  const roomTypes = ['Single', 'Double', 'Family'];
  const bedPreferences = ['Twin Bed', 'King Bed'];
  const mealPlans = ['Breakfast Only', 'Half Board', 'Full Board'];
  const localTransportTypes = ['Private Car', 'Rental Bike', 'Public Transport', 'Tour Bus'];
  const activityOptions = ['Sightseeing Tours', 'Adventure Sports', 'Hiking / Trekking', 'Beach Activities', 'Cultural Tours', 'Shopping', 'Food & Wine Experience', 'Photography Tours'];
  const dailyActivityLevels = ['Relaxed', 'Moderate', 'Busy'];
  const celebrationTypes = ['Birthday', 'Anniversary', 'Honeymoon', 'None'];
  const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const { data } = await tripAPI.getTripById(id);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching trip:', error);
      setErrorMessage('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivityChange = (activity) => {
    setFormData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activity)
        ? prev.selectedActivities.filter(a => a !== activity)
        : [...prev.selectedActivities, activity]
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [name]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return duration > 0 ? duration : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const updatedData = {
        ...formData,
        tripDuration: calculateDuration(),
        customBudget: formData.budgetRange === 'Custom' ? parseFloat(formData.customBudget) : null,
        advancePaymentAmount: parseFloat(formData.advancePaymentAmount) || 0,
        numberOfTravelers: parseInt(formData.numberOfTravelers) || 1,
        numberOfDestinations: parseInt(formData.numberOfDestinations) || 1
      };

      await tripAPI.updateTrip(id, updatedData);

      // Create notification for admin about the update
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            type: 'trip_request',
            priority: 'medium',
            title: `Trip Updated by ${user.name}`,
            message: `${user.name} has updated their trip plan for "${formData.title}". Please review the changes.`,
            customer: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: formData.mobileNumber
            },
            trip: {
              id: id,
              title: formData.title,
              destination: `${formData.destinationCity}, ${formData.destinationCountry}`,
              startDate: formData.startDate,
              endDate: formData.endDate,
              numberOfTravelers: formData.numberOfTravelers,
              budgetRange: formData.budgetRange === 'Custom' ? `₹${formData.customBudget}` : formData.budgetRange,
              tripType: formData.tripType
            }
          })
        });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }

      setSuccessMessage('✅ Trip updated successfully! Admin has been notified of your changes.');
      setTimeout(() => {
        navigate(`/trip/${id}/details`);
      }, 2000);
    } catch (error) {
      console.error('Error updating trip:', error);
      setErrorMessage(error.response?.data?.message || 'Error updating trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-trip">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-trip">
      <Navbar />
      
      <div className="edit-trip-container">
        {successMessage && (
          <div className="success-banner">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-banner">
            ❌ {errorMessage}
          </div>
        )}

        <div className="edit-trip-header">
          <button onClick={() => navigate(-1)} className="btn-back-header">
            ← Back
          </button>
          <div>
            <h1>✏️ Edit Your Trip</h1>
            <p>Update your trip details and we'll notify the admin team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-trip-form">
          
          {/* 1. Basic Trip Information */}
          <div className="form-section">
            <h2>1️⃣ Basic Trip Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Trip Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Vacation in Bali"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="destinationCountry">Destination Country *</label>
                <input
                  type="text"
                  id="destinationCountry"
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleInputChange}
                  placeholder="e.g., Indonesia"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destinationCity">Destination City *</label>
                <input
                  type="text"
                  id="destinationCity"
                  name="destinationCity"
                  value={formData.destinationCity}
                  onChange={handleInputChange}
                  placeholder="e.g., Bali"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tripType">Trip Type *</label>
                <select
                  id="tripType"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Trip Type</option>
                  {tripTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="numberOfTravelers">Number of Travelers *</label>
                <input
                  type="number"
                  id="numberOfTravelers"
                  name="numberOfTravelers"
                  value={formData.numberOfTravelers}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Travel Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Travel End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Trip Duration (Auto Calculate)</label>
                <input
                  type="text"
                  value={calculateDuration() ? `${calculateDuration()} days` : 'Select dates'}
                  readOnly
                  className="readonly-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="flexibleDates">Flexible Dates</label>
                <select
                  id="flexibleDates"
                  name="flexibleDates"
                  value={formData.flexibleDates}
                  onChange={handleInputChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Traveler Details */}
          <div className="form-section">
            <h2>2️⃣ Traveler Details</h2>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="+91 1234567890"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ageGroup">Age Group *</label>
                <select
                  id="ageGroup"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Age Group</option>
                  {ageGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="nationality">Nationality *</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="e.g., Indian"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="passportAvailable">Passport Available *</label>
              <select
                id="passportAvailable"
                name="passportAvailable"
                value={formData.passportAvailable}
                onChange={handleInputChange}
                required
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Emergency contact person"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContactNumber">Emergency Contact Number</label>
                <input
                  type="tel"
                  id="emergencyContactNumber"
                  name="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={handleInputChange}
                  placeholder="+91 1234567890"
                />
              </div>
            </div>
          </div>

          {/* 3. Budget Preferences */}
          <div className="form-section">
            <h2>3️⃣ Budget Preferences</h2>
            
            <div className="form-group">
              <label htmlFor="budgetRange">Total Budget Range *</label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Budget Range</option>
                {budgetRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {formData.budgetRange === 'Custom' && (
              <div className="form-group">
                <label htmlFor="customBudget">Custom Budget Amount *</label>
                <input
                  type="number"
                  id="customBudget"
                  name="customBudget"
                  value={formData.customBudget}
                  onChange={handleInputChange}
                  placeholder="Enter your budget"
                  min="0"
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredCurrency">Preferred Currency *</label>
                <select
                  id="preferredCurrency"
                  name="preferredCurrency"
                  value={formData.preferredCurrency}
                  onChange={handleInputChange}
                  required
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budgetType">Budget Type *</label>
                <select
                  id="budgetType"
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Budget Type</option>
                  {budgetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Accommodation Preferences */}
          <div className="form-section">
            <h2>4️⃣ Accommodation Preferences</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hotelCategory">Hotel Category *</label>
                <select
                  id="hotelCategory"
                  name="hotelCategory"
                  value={formData.hotelCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Hotel Category</option>
                  {hotelCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Room Type *</label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedPreference">Bed Preference</label>
                <select
                  id="bedPreference"
                  name="bedPreference"
                  value={formData.bedPreference}
                  onChange={handleInputChange}
                >
                  <option value="">Select Bed Preference</option>
                  {bedPreferences.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mealPlan">Meal Plan *</label>
                <select
                  id="mealPlan"
                  name="mealPlan"
                  value={formData.mealPlan}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Meal Plan</option>
                  {mealPlans.map(plan => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 5. Transportation Preferences */}
          <div className="form-section">
            <h2>5️⃣ Transportation Preferences</h2>
            
            <div className="form-group">
              <label htmlFor="internationalFlightRequired">International Flight Required *</label>
              <select
                id="internationalFlightRequired"
                name="internationalFlightRequired"
                value={formData.internationalFlightRequired}
                onChange={handleInputChange}
                required
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {formData.internationalFlightRequired === 'yes' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDepartureCity">Preferred Departure City</label>
                  <input
                    type="text"
                    id="preferredDepartureCity"
                    name="preferredDepartureCity"
                    value={formData.preferredDepartureCity}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preferredAirline">Preferred Airline (Optional)</label>
                  <input
                    type="text"
                    id="preferredAirline"
                    name="preferredAirline"
                    value={formData.preferredAirline}
                    onChange={handleInputChange}
                    placeholder="e.g., Air India"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="localTransportType">Local Transport Type *</label>
              <select
                id="localTransportType"
                name="localTransportType"
                value={formData.localTransportType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Transport Type</option>
                {localTransportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Activities & Experiences */}
          <div className="form-section">
            <h2>6️⃣ Activities & Experiences</h2>
            
            <div className="form-group">
              <label>Select Activities (Check all that apply)</label>
              <div className="checkbox-grid">
                {activityOptions.map(activity => (
                  <div key={activity} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={activity}
                      checked={formData.selectedActivities.includes(activity)}
                      onChange={() => handleActivityChange(activity)}
                    />
                    <label htmlFor={activity}>{activity}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialActivitiesRequested">Special Activities Requested</label>
              <textarea
                id="specialActivitiesRequested"
                name="specialActivitiesRequested"
                value={formData.specialActivitiesRequested}
                onChange={handleInputChange}
                placeholder="Any specific activities or experiences you'd like to include..."
                rows="3"
              />
            </div>
          </div>

          {/* 7. Itinerary Preferences */}
          <div className="form-section">
            <h2>7️⃣ Itinerary Preferences</h2>
            
            <div className="form-group">
              <label htmlFor="numberOfDestinations">Number of Destinations</label>
              <input
                type="number"
                id="numberOfDestinations"
                name="numberOfDestinations"
                value={formData.numberOfDestinations}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mustVisitPlaces">Must Visit Places</label>
              <textarea
                id="mustVisitPlaces"
                name="mustVisitPlaces"
                value={formData.mustVisitPlaces}
                onChange={handleInputChange}
                placeholder="List the places you definitely want to visit..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dailyActivityLevel">Preferred Daily Activity Level *</label>
              <select
                id="dailyActivityLevel"
                name="dailyActivityLevel"
                value={formData.dailyActivityLevel}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Activity Level</option>
                {dailyActivityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 8. Special Requests */}
          <div className="form-section">
            <h2>8️⃣ Special Requests</h2>
            
            <div className="form-group">
              <label htmlFor="dietaryRequirements">Dietary Requirements</label>
              <input
                type="text"
                id="dietaryRequirements"
                name="dietaryRequirements"
                value={formData.dietaryRequirements}
                onChange={handleInputChange}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accessibilityNeeds">Accessibility Needs</label>
              <input
                type="text"
                id="accessibilityNeeds"
                name="accessibilityNeeds"
                value={formData.accessibilityNeeds}
                onChange={handleInputChange}
                placeholder="Any special accessibility requirements..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="celebrationType">Celebration Type</label>
              <select
                id="celebrationType"
                name="celebrationType"
                value={formData.celebrationType}
                onChange={handleInputChange}
              >
                <option value="">Select Celebration Type</option>
                {celebrationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="specialNotes">Special Notes / Requests</label>
              <textarea
                id="specialNotes"
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleInputChange}
                placeholder="Any other special requests or information we should know..."
                rows="4"
              />
            </div>
          </div>

          {/* 9. Document Upload */}
          <div className="form-section">
            <h2>9️⃣ Document Upload</h2>
            <p className="section-description">Optional but useful.</p>
            
            <div className="form-group">
              <label htmlFor="passportCopy">Passport Copy Upload</label>
              <input
                type="file"
                id="passportCopy"
                name="passportCopy"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {formData.passportCopy && <span className="file-uploaded">✓ File uploaded</span>}
            </div>

            <div className="form-group">
              <label htmlFor="idProof">ID Proof Upload</label>
              <input
                type="file"
                id="idProof"
                name="idProof"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {formData.idProof && <span className="file-uploaded">✓ File uploaded</span>}
            </div>

            <div className="form-group">
              <label htmlFor="visaDocument">Visa Document Upload</label>
              <input
                type="file"
                id="visaDocument"
                name="visaDocument"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {formData.visaDocument && <span className="file-uploaded">✓ File uploaded</span>}
            </div>
          </div>

          {/* 10. Payment Information */}
          <div className="form-section">
            <h2>🔟 Payment Information</h2>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="advancePaymentAmount">Advance Payment Amount</label>
              <input
                type="number"
                id="advancePaymentAmount"
                name="advancePaymentAmount"
                value={formData.advancePaymentAmount}
                onChange={handleInputChange}
                placeholder="Enter advance payment amount"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="billingAddress">Billing Address</label>
              <textarea
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                placeholder="Enter your billing address..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/trip/${id}`)} 
              className="btn-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={saving}
            >
              {saving ? 'Updating Trip...' : 'Update Trip'}
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditTrip;
