import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BillGenerator from '../components/BillGenerator';
import PaymentCompletionPopup from '../components/PaymentCompletionPopup';
import PaymentProcessor from '../components/PaymentProcessor';
import './PaymentIntegration.css';

const PaymentIntegration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tripData = location.state?.tripData;

  useEffect(() => {
    if (!tripData) {
      navigate('/dashboard');
    }
  }, [tripData, navigate]);

  const formatPrice = (amount, currency) => {
    if (!amount || amount === 0) return 'Price not set';
    const num = parseFloat(amount);
    if (currency === 'INR') return `₹${num.toLocaleString('en-IN')}`;
    if (currency === 'USD') return `$${num.toLocaleString('en-US')}`;
    if (currency === 'EUR') return `€${num.toLocaleString()}`;
    if (currency === 'GBP') return `£${num.toLocaleString()}`;
    return `${currency} ${num.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(tripData.preferredStartDate);
    const end = new Date(tripData.preferredEndDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} Days / ${days - 1} Nights`;
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowPaymentProcessor(true);
  };

  const handlePaymentProcessorSuccess = (paymentResult) => {
    setShowPaymentProcessor(false);
    
    const completionInfo = {
      tripData: {
        ...tripData,
        preferredStartDate: tripData.preferredStartDate || new Date(),
        preferredEndDate: tripData.preferredEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      paymentData: {
        method: selectedMethod,
        transactionId: paymentResult.transactionId,
        orderId: paymentResult.orderId,
        paidAt: new Date(paymentResult.timestamp),
        amount: tripData.basePrice,
        currency: tripData.currency,
        successMessage: `🎉 Payment Successful! Your payment of ${tripData.currency} ${tripData.basePrice} has been processed. Transaction ID: ${paymentResult.transactionId}. Your booking is confirmed!`
      },
      userData: {
        name: user.name,
        email: user.email,
        id: user.id
      }
    };
    
    setCompletionData(completionInfo);
    setShowCompletionPopup(true);
  };

  const handlePaymentProcessorCancel = () => {
    setShowPaymentProcessor(false);
    setSelectedMethod('');
  };

  const handleCompletionPopupClose = () => {
    setShowCompletionPopup(false);
    setCompletionData(null);
    navigate('/dashboard');
  };

  const handleViewBillFromPopup = () => {
    if (completionData) {
      setBillData(completionData);
      setShowBill(true);
      setShowCompletionPopup(false);
    }
  };

  const handleBillClose = () => {
    setShowBill(false);
    setBillData(null);
    navigate('/dashboard');
  };

  if (!tripData) {
    return (
      <div className="payment-integration-page">
        <Navbar />
        <div className="pi-error">
          <h2>Trip data not found</h2>
          <p>Please select a trip from your dashboard</p>
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-integration-page">
      <Navbar />
      
      <div className="pi-container">
        {/* Hero Section */}
        <div className="pi-hero">
          <div className="pi-hero-bg">
            {tripData.image && <img src={tripData.image} alt={tripData.tripTitle} />}
            <div className="pi-hero-overlay"></div>
          </div>
          <div className="pi-hero-content">
            <button className="pi-back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h1 className="pi-hero-title">{tripData.tripTitle}</h1>
            <div className="pi-hero-meta">
              <span className="pi-hero-meta-item">
                <span className="icon">📍</span>
                {tripData.destination}
              </span>
              <span className="pi-hero-meta-item">
                <span className="icon">📅</span>
                {formatDate(tripData.preferredStartDate)} - {formatDate(tripData.preferredEndDate)}
              </span>
              <span className="pi-hero-meta-item">
                <span className="icon">⏱️</span>
                {calculateDuration()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pi-main">
          {/* Left Column - Trip Details */}
          <div className="pi-left">
            {/* Tab Navigation */}
            <div className="pi-tabs">
              <button 
                className={`pi-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📋 Overview
              </button>
              <button 
                className={`pi-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                onClick={() => setActiveTab('itinerary')}
              >
                🗓️ Itinerary
              </button>
              <button 
                className={`pi-tab ${activeTab === 'inclusions' ? 'active' : ''}`}
                onClick={() => setActiveTab('inclusions')}
              >
                ✅ Inclusions
              </button>
              <button 
                className={`pi-tab ${activeTab === 'policies' ? 'active' : ''}`}
                onClick={() => setActiveTab('policies')}
              >
                📜 Policies
              </button>
            </div>

            {/* Tab Content */}
            <div className="pi-tab-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="pi-overview">
                  <h2 className="pi-section-title">Trip Overview</h2>
                  
                  <div className="pi-highlights">
                    <div className="pi-highlight-card">
                      <div className="pi-highlight-icon">🏨</div>
                      <div className="pi-highlight-text">
                        <h3>Premium Accommodation</h3>
                        <p>3-4 star hotels with breakfast included</p>
                      </div>
                    </div>
                    
                    <div className="pi-highlight-card">
                      <div className="pi-highlight-icon">🚗</div>
                      <div className="pi-highlight-text">
                        <h3>Private Transport</h3>
                        <p>AC vehicles with experienced drivers</p>
                      </div>
                    </div>
                    
                    <div className="pi-highlight-card">
                      <div className="pi-highlight-icon">🎯</div>
                      <div className="pi-highlight-text">
                        <h3>Guided Tours</h3>
                        <p>Expert local guides at all destinations</p>
                      </div>
                    </div>
                    
                    <div className="pi-highlight-card">
                      <div className="pi-highlight-icon">🍽️</div>
                      <div className="pi-highlight-text">
                        <h3>Delicious Meals</h3>
                        <p>Authentic local and international cuisine</p>
                      </div>
                    </div>
                    
                    <div className="pi-highlight-card">
                      <div className="pi-highlight-icon">📱</div>
                      <div className="pi-highlight-text">
                        <h3>24/7 Support</h3>
                        <p>Round-the-clock customer assistance</p>
                      </div>
                    </div>
                    
                    <div className="pi-highlight-card">
                      <div className="pi-highlight-icon">🎁</div>
                      <div className="pi-highlight-text">
                        <h3>Special Perks</h3>
                        <p>Welcome kit, souvenirs & surprises</p>
                      </div>
                    </div>
                  </div>

                  <div className="pi-description">
                    <h3>About This Trip</h3>
                    <p>
                      Embark on an unforgettable journey to {tripData.destination}! This carefully curated trip 
                      offers the perfect blend of adventure, relaxation, and cultural immersion. Experience the 
                      best attractions, savor local delicacies, and create memories that will last a lifetime.
                    </p>
                    <p>
                      Our expert team has designed this itinerary to ensure you get the most out of your vacation. 
                      From comfortable accommodations to exciting activities, every detail has been thoughtfully 
                      planned for your convenience and enjoyment.
                    </p>
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && (
                <div className="pi-itinerary">
                  <h2 className="pi-section-title">Day-by-Day Itinerary</h2>
                  
                  <div className="pi-timeline">
                    <div className="pi-timeline-item">
                      <div className="pi-timeline-marker">1</div>
                      <div className="pi-timeline-content">
                        <h3>Day 1 - Arrival & Welcome</h3>
                        <p>
                          Arrive at {tripData.destination}. Our representative will greet you at the airport 
                          and transfer you to your hotel. Check-in, freshen up, and enjoy a welcome dinner 
                          with orientation about the upcoming days.
                        </p>
                        <div className="pi-timeline-tags">
                          <span className="pi-tag">✈️ Airport Pickup</span>
                          <span className="pi-tag">🏨 Hotel Check-in</span>
                          <span className="pi-tag">🍽️ Welcome Dinner</span>
                        </div>
                      </div>
                    </div>

                    <div className="pi-timeline-item">
                      <div className="pi-timeline-marker">2</div>
                      <div className="pi-timeline-content">
                        <h3>Day 2 - City Exploration</h3>
                        <p>
                          After breakfast, embark on a guided city tour. Visit iconic landmarks, explore 
                          local markets, and immerse yourself in the culture. Lunch at a popular local 
                          restaurant. Evening cultural show and dinner.
                        </p>
                        <div className="pi-timeline-tags">
                          <span className="pi-tag">🏛️ Sightseeing</span>
                          <span className="pi-tag">🛍️ Shopping</span>
                          <span className="pi-tag">🎭 Cultural Show</span>
                        </div>
                      </div>
                    </div>

                    <div className="pi-timeline-item">
                      <div className="pi-timeline-marker">3</div>
                      <div className="pi-timeline-content">
                        <h3>Day 3 - Adventure & Activities</h3>
                        <p>
                          Experience thrilling outdoor activities and adventures. Nature walks, photography 
                          sessions, and local experiences. Enjoy authentic regional cuisine and interact 
                          with locals to understand their way of life.
                        </p>
                        <div className="pi-timeline-tags">
                          <span className="pi-tag">🏔️ Adventure</span>
                          <span className="pi-tag">📸 Photography</span>
                          <span className="pi-tag">🍜 Food Tasting</span>
                        </div>
                      </div>
                    </div>

                    <div className="pi-timeline-item">
                      <div className="pi-timeline-marker">4</div>
                      <div className="pi-timeline-content">
                        <h3>Final Day - Departure</h3>
                        <p>
                          Enjoy a leisurely breakfast. Last-minute shopping for souvenirs. Hotel checkout 
                          and transfer to airport. Depart with wonderful memories and new friendships.
                        </p>
                        <div className="pi-timeline-tags">
                          <span className="pi-tag">🛍️ Shopping</span>
                          <span className="pi-tag">✈️ Airport Drop</span>
                          <span className="pi-tag">👋 Farewell</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions Tab */}
              {activeTab === 'inclusions' && (
                <div className="pi-inclusions">
                  <div className="pi-inclusion-section">
                    <h2 className="pi-section-title included">✅ What's Included</h2>
                    <ul className="pi-inclusion-list">
                      <li>🏨 Accommodation in 3-4 star hotels (twin/double sharing)</li>
                      <li>🍳 Daily breakfast at the hotel</li>
                      <li>🚗 All transfers and sightseeing by private AC vehicle</li>
                      <li>🎯 Professional English-speaking guide</li>
                      <li>🎫 Entry fees to all monuments and attractions</li>
                      <li>🍽️ Welcome dinner and select meals as per itinerary</li>
                      <li>📱 24/7 customer support and assistance</li>
                      <li>🎁 Welcome kit with travel essentials</li>
                      <li>📋 Travel insurance coverage</li>
                      <li>📸 Complimentary group photography session</li>
                      <li>🗺️ Detailed itinerary and travel guide</li>
                      <li>💧 Bottled water during transfers</li>
                    </ul>
                  </div>

                  <div className="pi-inclusion-section">
                    <h2 className="pi-section-title excluded">❌ What's Not Included</h2>
                    <ul className="pi-inclusion-list">
                      <li>✈️ International/domestic flight tickets</li>
                      <li>🛂 Visa fees and passport charges</li>
                      <li>🍷 Alcoholic beverages and soft drinks</li>
                      <li>🛍️ Personal shopping and expenses</li>
                      <li>📞 International roaming and phone charges</li>
                      <li>💊 Personal medications and medical expenses</li>
                      <li>🎢 Optional activities not mentioned in itinerary</li>
                      <li>💰 Tips and gratuities for guides and drivers</li>
                      <li>🧳 Excess baggage charges</li>
                      <li>🏥 Medical insurance (recommended to purchase separately)</li>
                      <li>📷 Personal photography and videography services</li>
                      <li>🚕 Any services not mentioned in inclusions</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Policies Tab */}
              {activeTab === 'policies' && (
                <div className="pi-policies">
                  <div className="pi-policy-section">
                    <h3>📅 Booking Policy</h3>
                    <p>
                      • Book at least 15 days before departure for confirmed availability<br/>
                      • Instant confirmation upon successful payment<br/>
                      • Booking voucher will be sent via email within 24 hours<br/>
                      • Full payment required at the time of booking
                    </p>
                  </div>

                  <div className="pi-policy-section">
                    <h3>🔄 Cancellation Policy</h3>
                    <p>
                      • Free cancellation up to 15 days before departure (100% refund)<br/>
                      • 7-14 days before departure: 50% refund<br/>
                      • 3-6 days before departure: 25% refund<br/>
                      • Less than 3 days: No refund<br/>
                      • Refunds processed within 7-10 business days
                    </p>
                  </div>

                  <div className="pi-policy-section">
                    <h3>💳 Payment Policy</h3>
                    <p>
                      • Multiple payment options: Credit/Debit Card, UPI, Net Banking<br/>
                      • EMI options available on select credit cards<br/>
                      • Secure payment gateway with 256-bit SSL encryption<br/>
                      • Payment confirmation sent immediately via email and SMS
                    </p>
                  </div>

                  <div className="pi-policy-section">
                    <h3>📋 Terms & Conditions</h3>
                    <p>
                      • Valid passport required (minimum 6 months validity)<br/>
                      • Visa arrangements are traveler's responsibility<br/>
                      • Travel insurance highly recommended<br/>
                      • Itinerary subject to change due to weather or unforeseen circumstances<br/>
                      • Company not liable for delays, loss, or damage to personal belongings<br/>
                      • Travelers must follow local laws and customs
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Summary & Payment */}
          <div className="pi-right">
            <div className="pi-booking-card">
              <h2 className="pi-booking-title">Booking Summary</h2>
              
              <div className="pi-booking-details">
                <div className="pi-booking-row">
                  <span className="pi-booking-label">Trip Name:</span>
                  <span className="pi-booking-value">{tripData.tripTitle}</span>
                </div>
                <div className="pi-booking-row">
                  <span className="pi-booking-label">Destination:</span>
                  <span className="pi-booking-value">{tripData.destination}</span>
                </div>
                <div className="pi-booking-row">
                  <span className="pi-booking-label">Start Date:</span>
                  <span className="pi-booking-value">{formatDate(tripData.preferredStartDate)}</span>
                </div>
                <div className="pi-booking-row">
                  <span className="pi-booking-label">End Date:</span>
                  <span className="pi-booking-value">{formatDate(tripData.preferredEndDate)}</span>
                </div>
                <div className="pi-booking-row">
                  <span className="pi-booking-label">Duration:</span>
                  <span className="pi-booking-value">{calculateDuration()}</span>
                </div>
              </div>

              <div className="pi-price-breakdown">
                <h3>Price Breakdown</h3>
                <div className="pi-price-row">
                  <span>Base Price</span>
                  <span>{formatPrice(tripData.basePrice, tripData.currency)}</span>
                </div>
                <div className="pi-price-row">
                  <span>Service Fee</span>
                  <span>₹0</span>
                </div>
                <div className="pi-price-row">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="pi-price-total">
                  <span>Total Amount</span>
                  <span>{formatPrice(tripData.basePrice, tripData.currency)}</span>
                </div>
              </div>

              <div className="pi-payment-methods">
                <h3>Select Payment Method</h3>
                
                <button 
                  className="pi-payment-btn card"
                  onClick={() => handlePaymentMethodSelect('card')}
                >
                  <div className="pi-payment-icon">💳</div>
                  <div className="pi-payment-text">
                    <span className="pi-payment-name">Credit/Debit Card</span>
                    <span className="pi-payment-desc">Secure payment via card</span>
                  </div>
                  <div className="pi-payment-arrow">→</div>
                </button>

                <button 
                  className="pi-payment-btn upi"
                  onClick={() => handlePaymentMethodSelect('qr')}
                >
                  <div className="pi-payment-icon">📱</div>
                  <div className="pi-payment-text">
                    <span className="pi-payment-name">UPI / QR Code</span>
                    <span className="pi-payment-desc">Pay via UPI apps</span>
                  </div>
                  <div className="pi-payment-arrow">→</div>
                </button>

                <button 
                  className="pi-payment-btn emi"
                  onClick={() => handlePaymentMethodSelect('emi')}
                >
                  <div className="pi-payment-icon">📊</div>
                  <div className="pi-payment-text">
                    <span className="pi-payment-name">EMI Options</span>
                    <span className="pi-payment-desc">Pay in installments</span>
                  </div>
                  <div className="pi-payment-arrow">→</div>
                </button>

                <button 
                  className="pi-payment-btn office"
                  onClick={() => handlePaymentMethodSelect('office')}
                >
                  <div className="pi-payment-icon">🏢</div>
                  <div className="pi-payment-text">
                    <span className="pi-payment-name">Pay at Office</span>
                    <span className="pi-payment-desc">Visit our office</span>
                  </div>
                  <div className="pi-payment-arrow">→</div>
                </button>
              </div>

              <div className="pi-security-badges">
                <span className="pi-badge">🔒 Secure Payment</span>
                <span className="pi-badge">🛡️ SSL Encrypted</span>
                <span className="pi-badge">✅ Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processor Modal */}
      {showPaymentProcessor && (
        <PaymentProcessor
          isVisible={showPaymentProcessor}
          tripData={{
            ...tripData,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone || '+91 9876543210'
          }}
          paymentMethod={selectedMethod}
          onSuccess={handlePaymentProcessorSuccess}
          onCancel={handlePaymentProcessorCancel}
        />
      )}

      {/* Payment Completion Popup */}
      {showCompletionPopup && completionData && (
        <PaymentCompletionPopup
          isVisible={showCompletionPopup}
          tripData={completionData.tripData}
          paymentData={completionData.paymentData}
          userData={completionData.userData}
          onClose={handleCompletionPopupClose}
          onViewBill={handleViewBillFromPopup}
        />
      )}

      {/* Bill Generator Modal */}
      {showBill && billData && (
        <BillGenerator
          tripData={billData.tripData}
          paymentData={billData.paymentData}
          userData={billData.userData}
          onClose={handleBillClose}
        />
      )}

      <Footer />
    </div>
  );
};

export default PaymentIntegration;
