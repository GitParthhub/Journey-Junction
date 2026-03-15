import React, { useState, useEffect } from 'react';
import './PaymentCompletionPopup.css';

const PaymentCompletionPopup = ({ 
  isVisible, 
  tripData, 
  paymentData, 
  userData, 
  onClose, 
  onViewBill 
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [transferringData, setTransferringData] = useState(false);
  const [dataTransferred, setDataTransferred] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      transferDataToAdmin();
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isVisible]);

  const transferDataToAdmin = async () => {
    setTransferringData(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const adminNotificationData = {
        type: 'payment_completed',
        timestamp: new Date().toISOString(),
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email
        },
        trip: {
          id: tripData.tripId,
          title: tripData.tripTitle,
          destination: tripData.destination,
          startDate: tripData.preferredStartDate,
          endDate: tripData.preferredEndDate,
          image: tripData.image
        },
        payment: {
          method: paymentData.method,
          transactionId: paymentData.transactionId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          paidAt: paymentData.paidAt
        }
      };
      
      console.log('Data transferred to admin:', adminNotificationData);
      setDataTransferred(true);
    } catch (error) {
      console.error('Error transferring data to admin:', error);
    } finally {
      setTransferringData(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="payment-popup-overlay">
      <div className="payment-popup-container">
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className={`confetti confetti-${i % 6}`}></div>
            ))}
          </div>
        )}

        <div className="popup-header">
          <div className="success-icon">
            {paymentData.meetingScheduled ? (
              <div className="meeting-icon">
                <div className="calendar-icon">
                  <div className="calendar-header"></div>
                  <div className="calendar-body">
                    <div className="calendar-date">📅</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="checkmark">
                <div className="checkmark-circle"></div>
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            )}
          </div>
          <h2 className="success-title">
            {paymentData.meetingScheduled ? 'Meeting Scheduled! 📅' : 'Payment Successful! 🎉'}
          </h2>
          <p className="success-subtitle">
            {paymentData.meetingScheduled ? 'Your office visit appointment is confirmed' : 'Your booking has been confirmed'}
          </p>
        </div>

        <div className="popup-content">
          <div className="payment-summary">
            <div className="summary-row">
              <span className="label">Transaction ID:</span>
              <span className="value transaction-id">{paymentData.transactionId}</span>
            </div>
            <div className="summary-row">
              <span className="label">Amount Paid:</span>
              <span className="value amount">{paymentData.currency} {paymentData.amount}</span>
            </div>
            <div className="summary-row">
              <span className="label">Payment Method:</span>
              <span className="value method">{paymentData.method.toUpperCase()}</span>
            </div>
            <div className="summary-row">
              <span className="label">Date & Time:</span>
              <span className="value datetime">
                {formatDate(paymentData.paidAt)} at {formatTime(paymentData.paidAt)}
              </span>
            </div>
          </div>

          {/* Payment-specific success message */}
          {paymentData.successMessage && (
            <div className="payment-success-message">
              <div className="success-message-icon">✅</div>
              <p>{paymentData.successMessage}</p>
            </div>
          )}

          {/* Meeting Details for Office Visits */}
          {paymentData.meetingScheduled && paymentData.visitDetails && (
            <div className="meeting-details-section">
              <h3>📅 Meeting Details</h3>
              <div className="meeting-card">
                <div className="meeting-info">
                  <div className="meeting-row">
                    <span className="meeting-label">📅 Date:</span>
                    <span className="meeting-value">{paymentData.visitDetails.date}</span>
                  </div>
                  <div className="meeting-row">
                    <span className="meeting-label">🕒 Time:</span>
                    <span className="meeting-value">{paymentData.visitDetails.time}</span>
                  </div>
                  <div className="meeting-row">
                    <span className="meeting-label">👤 Name:</span>
                    <span className="meeting-value">{paymentData.visitDetails.fullName}</span>
                  </div>
                  <div className="meeting-row">
                    <span className="meeting-label">📞 Phone:</span>
                    <span className="meeting-value">{paymentData.visitDetails.phoneNumber}</span>
                  </div>
                  <div className="meeting-row">
                    <span className="meeting-label">📧 Email:</span>
                    <span className="meeting-value">{paymentData.visitDetails.email}</span>
                  </div>
                  {paymentData.visitDetails.notes && (
                    <div className="meeting-row">
                      <span className="meeting-label">📝 Notes:</span>
                      <span className="meeting-value">{paymentData.visitDetails.notes}</span>
                    </div>
                  )}
                </div>
                <div className="office-address">
                  <h4>🏢 Office Address</h4>
                  <p><strong>Journey Junction Head Office</strong></p>
                  <p>123 Travel Street, Tourism District</p>
                  <p>Mumbai, Maharashtra 400001</p>
                  <p>📞 +91 98765 43210</p>
                </div>
              </div>
            </div>
          )}

          <div className="trip-summary">
            <h3>Trip Details</h3>
            <div className="trip-card">
              {tripData.image && (
                <div className="trip-image">
                  <img src={tripData.image} alt={tripData.tripTitle} />
                </div>
              )}
              <div className="trip-info">
                <h4>{tripData.tripTitle}</h4>
                <p className="destination">📍 {tripData.destination}</p>
                <div className="trip-dates">
                  <span>🗓️ {formatDate(tripData.preferredStartDate)} - {formatDate(tripData.preferredEndDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="data-transfer-status">
            <div className="transfer-header">
              <h3>Admin Notification</h3>
              {transferringData && (
                <div className="transfer-loading">
                  <div className="spinner"></div>
                  <span>Notifying admin...</span>
                </div>
              )}
              {dataTransferred && (
                <div className="transfer-success">
                  <span className="check-icon">✅</span>
                  <span>Admin notified successfully</span>
                </div>
              )}
            </div>
            <p className="transfer-description">
              Your payment details and booking information have been automatically sent to our admin team for processing.
            </p>
          </div>

          <div className="user-info-section">
            <h3>Booking Confirmation Sent To:</h3>
            <div className="user-details">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Customer ID:</strong> {userData.id}</p>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>📧 You'll receive a confirmation email shortly</li>
              <li>📱 Our team will contact you within 24 hours</li>
              <li>📋 Trip itinerary will be shared 48 hours before departure</li>
              <li>🎒 Pack your bags and get ready for an amazing adventure!</li>
            </ul>
          </div>
        </div>

        <div className="popup-actions">
          <button className="btn-view-bill" onClick={onViewBill}>
            📄 View Invoice
          </button>
<button className="btn-close-popup" onClick={onClose}>
            ✨ Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompletionPopup;