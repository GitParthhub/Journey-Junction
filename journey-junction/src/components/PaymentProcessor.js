import React, { useState, useEffect } from 'react';
import './PaymentProcessor.css';

const PaymentProcessor = ({ 
  isVisible, 
  tripData, 
  paymentMethod, 
  onSuccess, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(1);
      generatePaymentDetails();
    }
  }, [isVisible, tripData]);

  const generatePaymentDetails = () => {
    const details = {
      orderId: `ORD${Date.now()}`,
      merchantId: 'JOURNEY_JUNCTION',
      amount: tripData.basePrice,
      currency: tripData.currency || 'INR',
      description: `Payment for ${tripData.tripTitle}`,
      customerName: tripData.customerName || 'Customer',
      customerEmail: tripData.customerEmail || 'customer@example.com',
      customerPhone: tripData.customerPhone || '+91 9876543210',
      timestamp: new Date().toISOString()
    };
    setPaymentDetails(details);
  };

  const formatPrice = (amount, currency) => {
    if (!amount || amount === 0) return 'Price not set';
    const num = parseFloat(amount);
    if (currency === 'INR') return `₹${num.toLocaleString('en-IN')}`;
    if (currency === 'USD') return `$${num.toLocaleString('en-US')}`;
    if (currency === 'EUR') return `€${num.toLocaleString()}`;
    if (currency === 'GBP') return `£${num.toLocaleString()}`;
    return `${currency} ${num.toLocaleString()}`;
  };

  const handleProceedToPayment = async () => {
    setCurrentStep(2);
    setProcessing(true);

    // Simulate payment gateway integration
    try {
      // Step 1: Initialize payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Process payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 3: Verify payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep(3);
      setProcessing(false);
      
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      // Call success callback with payment data
      setTimeout(() => {
        onSuccess({
          transactionId,
          orderId: paymentDetails.orderId,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          paymentMethod,
          timestamp: new Date().toISOString(),
          status: 'success'
        });
      }, 2000);
      
    } catch (error) {
      setProcessing(false);
      console.error('Payment processing error:', error);
    }
  };

  if (!isVisible || !paymentDetails) return null;

  return (
    <div className="payment-processor-overlay">
      <div className="payment-processor-container">
        
        {/* Step 1: Payment Details Review */}
        {currentStep === 1 && (
          <div className="payment-step">
            <div className="step-header">
              <h2>🔍 Review Payment Details</h2>
              <p>Please review your payment information before proceeding</p>
            </div>

            <div className="payment-summary-section">
              <div className="trip-summary">
                <h3>Trip Information</h3>
                <div className="trip-details">
                  {tripData.image && (
                    <div className="trip-image">
                      <img src={tripData.image} alt={tripData.tripTitle} />
                    </div>
                  )}
                  <div className="trip-info">
                    <h4>{tripData.tripTitle}</h4>
                    <p>📍 {tripData.destination}</p>
                    <p>🗓️ {new Date(tripData.preferredStartDate).toLocaleDateString()} - {new Date(tripData.preferredEndDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="payment-breakdown">
                <h3>Payment Breakdown</h3>
                <div className="breakdown-item">
                  <span>Trip Cost</span>
                  <span>{formatPrice(tripData.basePrice, tripData.currency)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Service Fee</span>
                  <span>₹0</span>
                </div>
                <div className="breakdown-item">
                  <span>Payment Gateway Fee</span>
                  <span>₹0</span>
                </div>
                <div className="breakdown-total">
                  <span>Total Amount</span>
                  <span>{formatPrice(tripData.basePrice, tripData.currency)}</span>
                </div>
              </div>

              <div className="order-details">
                <h3>Order Details</h3>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span>{paymentDetails.orderId}</span>
                </div>
                <div className="detail-row">
                  <span>Merchant:</span>
                  <span>Journey Junction</span>
                </div>
                <div className="detail-row">
                  <span>Payment Method:</span>
                  <span>{paymentMethod.toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span>Currency:</span>
                  <span>{paymentDetails.currency}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn-cancel" onClick={onCancel}>
                ❌ Cancel Payment
              </button>
              <button className="btn-proceed" onClick={handleProceedToPayment}>
                💳 Proceed to Payment Gateway
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Processing */}
        {currentStep === 2 && (
          <div className="payment-step processing-step">
            <div className="step-header">
              <h2>🔄 Processing Payment</h2>
              <p>Please wait while we process your payment securely</p>
            </div>

            <div className="processing-animation">
              <div className="payment-gateway-logo">
                <div className="gateway-icon">🏦</div>
                <h3>Secure Payment Gateway</h3>
              </div>
              
              <div className="processing-steps">
                <div className="process-step active">
                  <div className="step-icon">🔐</div>
                  <span>Encrypting payment data</span>
                  <div className="step-loader"></div>
                </div>
                <div className="process-step active">
                  <div className="step-icon">💳</div>
                  <span>Connecting to bank</span>
                  <div className="step-loader"></div>
                </div>
                <div className="process-step active">
                  <div className="step-icon">✅</div>
                  <span>Verifying transaction</span>
                  <div className="step-loader"></div>
                </div>
              </div>

              <div className="security-badges">
                <div className="badge">🔒 256-bit SSL</div>
                <div className="badge">🛡️ PCI DSS Compliant</div>
                <div className="badge">🏛️ Bank Grade Security</div>
              </div>
            </div>

            <div className="processing-info">
              <p><strong>Do not close this window or press back button</strong></p>
              <p>Your payment is being processed securely. This may take a few moments.</p>
            </div>
          </div>
        )}

        {/* Step 3: Payment Success */}
        {currentStep === 3 && (
          <div className="payment-step success-step">
            <div className="step-header">
              <div className="success-animation">
                <div className="checkmark-container">
                  <div className="checkmark">✅</div>
                </div>
              </div>
              <h2>🎉 Payment Successful!</h2>
              <p>Your payment has been processed successfully</p>
            </div>

            <div className="success-details">
              <div className="success-message">
                <h3>Transaction Completed</h3>
                <p>Your booking has been confirmed and you will receive a confirmation email shortly.</p>
              </div>

              <div className="transaction-summary">
                <div className="summary-row">
                  <span>Amount Paid:</span>
                  <span className="amount">{formatPrice(paymentDetails.amount, paymentDetails.currency)}</span>
                </div>
                <div className="summary-row">
                  <span>Order ID:</span>
                  <span>{paymentDetails.orderId}</span>
                </div>
                <div className="summary-row">
                  <span>Payment Method:</span>
                  <span>{paymentMethod.toUpperCase()}</span>
                </div>
                <div className="summary-row">
                  <span>Status:</span>
                  <span className="status-success">✅ Confirmed</span>
                </div>
              </div>
            </div>

            <div className="loading-completion">
              <div className="completion-spinner"></div>
              <p>Finalizing your booking...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessor;