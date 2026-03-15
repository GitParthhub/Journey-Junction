import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BillGenerator from '../components/BillGenerator';
import PaymentCompletionPopup from '../components/PaymentCompletionPopup';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  
  // Payment form states
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [emiForm, setEmiForm] = useState({
    tenure: '3',
    bankName: '',
    cardNumber: '',
    cardholderName: ''
  });
  
  const [officeForm, setOfficeForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  // Get trip data from navigation state
  const tripData = location.state?.tripData;

  useEffect(() => {
    if (!tripData) {
      navigate('/notifications');
    }
  }, [tripData, navigate]);

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your credit or debit card',
      processingTime: 'Instant',
      fees: 'No additional fees'
    },
    {
      id: 'qr',
      title: 'QR Code Payment',
      icon: '📱',
      description: 'Scan QR code with your mobile banking app',
      processingTime: 'Instant',
      fees: 'No additional fees'
    },
    {
      id: 'emi',
      title: 'EMI (Easy Monthly Installments)',
      icon: '📊',
      description: 'Pay in easy monthly installments',
      processingTime: '1-2 business days',
      fees: 'Interest charges apply'
    },
    {
      id: 'office',
      title: 'Pay at Office',
      icon: '🏢',
      description: 'Visit our office to make payment in person',
      processingTime: 'Same day',
      fees: 'No additional fees'
    }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setShowPaymentForm(true);
    
    // Set static QR code image for QR payment method
    if (methodId === 'qr') {
      setQrCodeData('/images/Qr.jpeg');
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      const paymentData = {
        tripId: tripData.tripId,
        applicantId: tripData.applicantId, // Include applicant ID
        paymentMethod: 'card',
        paymentDetails: {
          cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
          expiryDate: cardForm.expiryDate,
          cvv: cardForm.cvv,
          cardholderName: cardForm.cardholderName
        }
      };

      const { data } = await paymentAPI.processPayment(paymentData);
      
      if (data.success) {
        // Prepare completion data with card-specific message
        const completionInfo = {
          tripData: {
            ...tripData,
            preferredStartDate: tripData.preferredStartDate || new Date(),
            preferredEndDate: tripData.preferredEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          paymentData: {
            method: 'card',
            transactionId: data.transactionId,
            paidAt: new Date(),
            amount: tripData.basePrice,
            currency: tripData.currency,
            successMessage: `🎉 Payment Successful! Your card ending in ****${cardForm.cardNumber.slice(-4)} has been securely charged ${tripData.currency} ${tripData.basePrice}. Your booking is now confirmed and you'll receive a confirmation email shortly. Get ready for your amazing journey!`
          },
          userData: {
            name: user.name,
            email: user.email,
            id: user.id
          }
        };
        
        setCompletionData(completionInfo);
        setShowCompletionPopup(true);
      } else {
        alert(`Card Payment Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Card payment error:', error);
      console.error('Error response:', error.response?.data);
      alert(`Card Payment Failed: ${error.response?.data?.message || 'Unable to process card payment. Please check your card details and try again.'}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleQRPayment = async () => {
    setPaymentLoading(true);
    
    try {
      console.log('Trip data for payment:', tripData); // Debug log
      
      const paymentData = {
        tripId: tripData.tripId,
        applicantId: tripData.applicantId, // Include applicant ID
        paymentMethod: 'qr',
        paymentDetails: {
          qrScanned: true,
          timestamp: new Date().toISOString()
        }
      };

      console.log('Sending payment data:', paymentData); // Debug log

      const { data } = await paymentAPI.processPayment(paymentData);
      
      if (data.success) {
        // Prepare completion data with QR-specific message
        const completionInfo = {
          tripData: {
            ...tripData,
            preferredStartDate: tripData.preferredStartDate || new Date(),
            preferredEndDate: tripData.preferredEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          paymentData: {
            method: 'qr',
            transactionId: data.transactionId,
            paidAt: new Date(),
            amount: tripData.basePrice,
            currency: tripData.currency,
            successMessage: `🎉 UPI Payment Successful! Your payment of ${tripData.currency} ${tripData.basePrice} has been instantly processed through your UPI app. Your trip booking is confirmed! Our team will contact you within 24 hours with detailed itinerary and travel guidelines.`
          },
          userData: {
            name: user.name,
            email: user.email,
            id: user.id
          }
        };
        
        setCompletionData(completionInfo);
        setShowCompletionPopup(true);
      } else {
        alert(`QR Payment Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('QR payment error:', error);
      console.error('Error response:', error.response?.data);
      alert(`QR Payment Failed: ${error.response?.data?.message || 'Unable to process QR payment. Please ensure you have completed the UPI transaction and try again.'}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleEMISubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      const paymentData = {
        tripId: tripData.tripId,
        applicantId: tripData.applicantId, // Include applicant ID
        paymentMethod: 'emi',
        paymentDetails: {
          tenure: emiForm.tenure,
          bankName: emiForm.bankName,
          cardNumber: emiForm.cardNumber.replace(/\s/g, ''),
          cardholderName: emiForm.cardholderName
        }
      };

      const { data } = await paymentAPI.processPayment(paymentData);
      
      if (data.success) {
        // Calculate EMI amount for display
        const emiAmount = calculateEMI(tripData.basePrice, emiForm.tenure);
        
        // Prepare completion data with EMI-specific message
        const completionInfo = {
          tripData: {
            ...tripData,
            preferredStartDate: tripData.preferredStartDate || new Date(),
            preferredEndDate: tripData.preferredEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          paymentData: {
            method: 'emi',
            transactionId: data.transactionId,
            paidAt: new Date(),
            amount: tripData.basePrice,
            currency: tripData.currency,
            successMessage: `🎉 EMI Plan Activated! Your flexible payment plan is now active - pay just ${tripData.currency} ${emiAmount} per month for ${emiForm.tenure} months through ${emiForm.bankName}. Your trip is booked and your first EMI will be auto-debited next month. Pack your bags and start planning your adventure!`
          },
          userData: {
            name: user.name,
            email: user.email,
            id: user.id
          }
        };
        
        setCompletionData(completionInfo);
        setShowCompletionPopup(true);
      } else {
        alert(`EMI Setup Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('EMI payment error:', error);
      alert(`EMI Setup Failed: ${error.response?.data?.message || 'Unable to set up EMI payment. Please check your bank details and try again.'}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCompletionPopupClose = () => {
    setShowCompletionPopup(false);
    setCompletionData(null);
    navigate('/notifications');
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
    if (completionData) {
      // If we came from completion popup, go back to it
      setShowCompletionPopup(true);
    } else {
      navigate('/notifications');
    }
  };

  const handleOfficeSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    try {
      const paymentData = {
        tripId: tripData.tripId,
        applicantId: tripData.applicantId, // Include applicant ID
        paymentMethod: 'office',
        paymentDetails: {
          fullName: officeForm.fullName,
          phoneNumber: officeForm.phoneNumber,
          email: officeForm.email,
          preferredDate: officeForm.preferredDate,
          preferredTime: officeForm.preferredTime,
          notes: officeForm.notes
        }
      };

      const { data } = await paymentAPI.processPayment(paymentData);
      
      if (data.success) {
        // Format date and time for display
        const visitDate = new Date(officeForm.preferredDate).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const visitTime = officeForm.preferredTime;
        
        // Prepare completion data with office-specific message
        const completionInfo = {
          tripData: {
            ...tripData,
            preferredStartDate: tripData.preferredStartDate || new Date(),
            preferredEndDate: tripData.preferredEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          paymentData: {
            method: 'office',
            transactionId: data.transactionId,
            paidAt: new Date(),
            amount: tripData.basePrice,
            currency: tripData.currency,
            meetingScheduled: true,
            visitDetails: {
              date: visitDate,
              time: visitTime,
              fullName: officeForm.fullName,
              phoneNumber: officeForm.phoneNumber,
              email: officeForm.email,
              notes: officeForm.notes
            },
            successMessage: `🎉 Meeting Scheduled Successfully! Your appointment is confirmed for ${visitDate} at ${visitTime}. Please bring a valid ID and be ready to pay ${tripData.currency} ${tripData.basePrice}. Our travel experts will also help you with trip planning and answer any questions. We're excited to meet you in person!`
          },
          userData: {
            name: user.name,
            email: user.email,
            id: user.id
          }
        };
        
        // Send admin notification for meeting scheduling
        await sendAdminMeetingNotification({
          tripData,
          visitDetails: {
            date: visitDate,
            time: visitTime,
            fullName: officeForm.fullName,
            phoneNumber: officeForm.phoneNumber,
            email: officeForm.email,
            notes: officeForm.notes
          },
          userData: {
            name: user.name,
            email: user.email,
            id: user.id
          },
          transactionId: data.transactionId
        });
        
        setCompletionData(completionInfo);
        setShowCompletionPopup(true);
      } else {
        alert(`Office Visit Scheduling Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Office payment error:', error);
      alert(`Office Visit Scheduling Failed: ${error.response?.data?.message || 'Unable to schedule office visit. Please try again or contact us directly.'}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e, formType = 'card') => {
    const formatted = formatCardNumber(e.target.value);
    if (formType === 'card') {
      setCardForm(prev => ({ ...prev, cardNumber: formatted }));
    } else {
      setEmiForm(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardForm(prev => ({ ...prev, expiryDate: value }));
  };

  // Function to send admin notification for meeting scheduling
  const sendAdminMeetingNotification = async (meetingData) => {
    try {
      console.log('Sending admin notification for scheduled meeting:', meetingData);
      
      // In a real application, this would be an API call to notify admin
      // For now, we'll simulate the notification
      const adminNotification = {
        type: 'meeting_scheduled',
        timestamp: new Date().toISOString(),
        priority: 'high',
        customer: {
          id: meetingData.userData.id,
          name: meetingData.userData.name,
          email: meetingData.userData.email,
          phone: meetingData.visitDetails.phoneNumber
        },
        trip: {
          id: meetingData.tripData.tripId,
          title: meetingData.tripData.tripTitle,
          destination: meetingData.tripData.destination,
          amount: meetingData.tripData.basePrice,
          currency: meetingData.tripData.currency
        },
        meeting: {
          date: meetingData.visitDetails.date,
          time: meetingData.visitDetails.time,
          customerName: meetingData.visitDetails.fullName,
          notes: meetingData.visitDetails.notes || 'No additional notes',
          purpose: 'Trip payment and consultation'
        },
        transactionId: meetingData.transactionId,
        status: 'scheduled',
        message: `New office visit scheduled: ${meetingData.visitDetails.fullName} will visit on ${meetingData.visitDetails.date} at ${meetingData.visitDetails.time} for trip payment of ${meetingData.tripData.currency} ${meetingData.tripData.basePrice}`
      };
      
      // Store notification in localStorage for demo purposes
      // In production, this would be sent to admin dashboard via API
      const existingNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      existingNotifications.unshift(adminNotification);
      localStorage.setItem('adminNotifications', JSON.stringify(existingNotifications));
      
      console.log('Admin notification sent successfully:', adminNotification);
      
      // Show success message to user
      console.log('✅ Admin has been notified about your scheduled meeting');
      
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't fail the main process if notification fails
    }
  };

  const calculateEMI = (amount, tenure) => {
    const principal = parseFloat(amount);
    const months = parseInt(tenure);
    const rate = 0.12 / 12; // 12% annual interest rate
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return emi.toFixed(2);
  };

  if (!tripData) {
    return (
      <div className="payment-methods-page">
        <Navbar />
        <div className="payment-container">
          <div className="error-message">
            <h2>Payment data not found</h2>
            <p>Please go back to notifications and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-methods-page">
      <Navbar />
      
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate('/notifications')}>
            ← Back to Notifications
          </button>
          <h1>Choose Payment Method</h1>
          <p>Select your preferred payment method to complete your booking</p>
        </div>

        {/* Trip Summary */}
        <div className="trip-summary-card">
          {tripData.image && (
            <div className="trip-image-container">
              <img src={tripData.image} alt={tripData.tripTitle} className="trip-image" />
            </div>
          )}
          <div className="trip-info">
            <h3>{tripData.tripTitle}</h3>
            <p>📍 {tripData.destination}</p>
            <div className="price-display">
              <span className="amount">{tripData.currency} {tripData.basePrice}</span>
            </div>
          </div>
        </div>

        {!showPaymentForm ? (
          /* Payment Methods Selection */
          <div className="payment-methods-grid">
            <div className="payment-method-card" onClick={() => handleMethodSelect('card')}>
              <div className="method-icon card-icon">
                💳
              </div>
              <h3>Credit/Debit Card</h3>
              <p>Pay securely with your credit or debit card. Instant processing with bank-level security.</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Processing:</span>
                  <span className="value">Instant</span>
                </div>
                <div className="detail-item">
                  <span className="label">Security:</span>
                  <span className="value">256-bit SSL</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fee:</span>
                  <span className="value">2.5%</span>
                </div>
              </div>
              <button className="select-method-btn">Select Card Payment</button>
            </div>

            <div className="payment-method-card" onClick={() => handleMethodSelect('qr')}>
              <div className="method-icon qr-icon">
                📱
              </div>
              <h3>QR Code Payment</h3>
              <p>Scan QR code with your mobile banking app or digital wallet for quick payment.</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Processing:</span>
                  <span className="value">Instant</span>
                </div>
                <div className="detail-item">
                  <span className="label">Apps:</span>
                  <span className="value">All UPI Apps</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fee:</span>
                  <span className="value">Free</span>
                </div>
              </div>
              <button className="select-method-btn">Select QR Payment</button>
            </div>

            <div className="payment-method-card" onClick={() => handleMethodSelect('emi')}>
              <div className="method-icon emi-icon">
                📊
              </div>
              <h3>EMI Payment</h3>
              <p>Split your payment into easy monthly installments with flexible tenure options.</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Tenure:</span>
                  <span className="value">3-24 months</span>
                </div>
                <div className="detail-item">
                  <span className="label">Interest:</span>
                  <span className="value">12-18% p.a.</span>
                </div>
                <div className="detail-item">
                  <span className="label">Processing:</span>
                  <span className="value">2-3 days</span>
                </div>
              </div>
              <button className="select-method-btn">Select EMI Payment</button>
            </div>

            <div className="payment-method-card" onClick={() => handleMethodSelect('office')}>
              <div className="method-icon office-icon">
                🏢
              </div>
              <h3>Office Payment</h3>
              <p>Visit our office for cash payment or bank transfer. Schedule an appointment for convenience.</p>
              <div className="method-details">
                <div className="detail-item">
                  <span className="label">Hours:</span>
                  <span className="value">9 AM - 6 PM</span>
                </div>
                <div className="detail-item">
                  <span className="label">Methods:</span>
                  <span className="value">Cash/Transfer</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fee:</span>
                  <span className="value">Free</span>
                </div>
              </div>
              <button className="select-method-btn">Schedule Visit</button>
            </div>
          </div>
        ) : (
          /* Payment Forms */
          <div className="payment-form-container">
            <div className="form-header">
              <button 
                className="back-to-methods-btn"
                onClick={() => setShowPaymentForm(false)}
              >
                ← Choose Different Method
              </button>
              <h2>
                {paymentMethods.find(m => m.id === selectedMethod)?.icon} {' '}
                {paymentMethods.find(m => m.id === selectedMethod)?.title}
              </h2>
            </div>

            {/* Credit/Debit Card Form */}
            {selectedMethod === 'card' && (
              <form onSubmit={handleCardSubmit} className="payment-form">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardForm.cardholderName}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => handleCardNumberChange(e, 'card')}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={cardForm.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="pay-btn" disabled={paymentLoading}>
                  {paymentLoading ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Processing your secure payment...
                    </>
                  ) : (
                    <>
                      🔒 Pay Securely - {tripData.currency} {tripData.basePrice}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* QR Code Payment */}
            {selectedMethod === 'qr' && (
              <div className="qr-payment-container">
                <div className="qr-code-display">
                  <div className="qr-placeholder">
                    <div className="qr-icon">📱</div>
                    <h3>Scan QR Code to Pay</h3>
                    <p>Use any UPI app to scan and pay instantly</p>
                  </div>
                  <div className="qr-code">
                    <img src={qrCodeData} alt="UPI Payment QR Code" className="qr-image" />
                  </div>
                  <div className="payment-details">
                    <div className="detail-row">
                      <span className="label">Merchant:</span>
                      <span className="value">Journey Junction</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <span className="value">{tripData.currency} {tripData.basePrice}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Trip:</span>
                      <span className="value">{tripData.tripTitle}</span>
                    </div>
                  </div>
                </div>
                
                <div className="qr-instructions">
                  <h4>How to pay with UPI QR code:</h4>
                  <ol>
                    <li>Open any UPI app (PhonePe, Google Pay, Paytm, BHIM, etc.)</li>
                    <li>Tap on "Scan & Pay" or "QR Code" option</li>
                    <li>Point your camera at the QR code above</li>
                    <li>Verify merchant name: "Journey Junction"</li>
                    <li>Confirm payment amount: {tripData.currency} {tripData.basePrice}</li>
                    <li>Enter your UPI PIN to authorize payment</li>
                    <li>Wait for payment confirmation</li>
                    <li>Click "Payment Completed" below after successful transaction</li>
                  </ol>
                  <div className="upi-note">
                    <strong>Note:</strong> This QR code works with all UPI-enabled apps and will directly open your payment app when scanned.
                  </div>
                </div>

                <div className="qr-apps">
                  <h4>Supported Apps:</h4>
                  <div className="app-icons">
                    <div className="app-icon">💳 PhonePe</div>
                    <div className="app-icon">💰 Google Pay</div>
                    <div className="app-icon">💵 Paytm</div>
                    <div className="app-icon">🏦 BHIM</div>
                  </div>
                </div>

                <button 
                  className="pay-btn qr-pay-btn" 
                  onClick={handleQRPayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Confirming your UPI payment...
                    </>
                  ) : (
                    <>
                      ✅ I've Completed the UPI Payment
                    </>
                  )}
                </button>
              </div>
            )}

            {/* EMI Form */}
            {selectedMethod === 'emi' && (
              <form onSubmit={handleEMISubmit} className="payment-form">
                <div className="emi-calculator">
                  <h4>EMI Calculator</h4>
                  <div className="emi-options">
                    {['3', '6', '9', '12', '18', '24'].map(tenure => (
                      <div 
                        key={tenure}
                        className={`emi-option ${emiForm.tenure === tenure ? 'selected' : ''}`}
                        onClick={() => setEmiForm(prev => ({ ...prev, tenure }))}
                      >
                        <div className="tenure">{tenure} Months</div>
                        <div className="emi-amount">
                          {tripData.currency} {calculateEMI(tripData.basePrice, tenure)}/month
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <select
                    value={emiForm.bankName}
                    onChange={(e) => setEmiForm(prev => ({ ...prev, bankName: e.target.value }))}
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={emiForm.cardholderName}
                    onChange={(e) => setEmiForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={emiForm.cardNumber}
                    onChange={(e) => handleCardNumberChange(e, 'emi')}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <button type="submit" className="pay-btn" disabled={paymentLoading}>
                  {paymentLoading ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Setting up your EMI plan...
                    </>
                  ) : (
                    <>
                      💳 Setup EMI - {emiForm.tenure} months @ {tripData.currency} {calculateEMI(tripData.basePrice, emiForm.tenure)}/month
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Office Payment Form */}
            {selectedMethod === 'office' && (
              <form onSubmit={handleOfficeSubmit} className="payment-form">
                <div className="office-info">
                  <h4>Office Address</h4>
                  <div className="address-card">
                    <p><strong>Journey Junction Head Office</strong></p>
                    <p>123 Travel Street, Tourism District</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>📞 +91 98765 43210</p>
                    <p>🕒 Mon-Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={officeForm.fullName}
                    onChange={(e) => setOfficeForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={officeForm.phoneNumber}
                    onChange={(e) => setOfficeForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={officeForm.email}
                    onChange={(e) => setOfficeForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      value={officeForm.preferredDate}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select
                      value={officeForm.preferredTime}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    value={officeForm.notes}
                    onChange={(e) => setOfficeForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requirements or notes..."
                    rows="3"
                  />
                </div>

                <button type="submit" className="pay-btn" disabled={paymentLoading}>
                  {paymentLoading ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Scheduling your visit...
                    </>
                  ) : (
                    <>
                      🏢 Schedule My Office Visit
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      
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
    </div>
  );
};

export default PaymentMethods;