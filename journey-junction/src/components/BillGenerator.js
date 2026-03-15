import React from 'react';
import './BillGenerator.css';

const BillGenerator = ({ tripData, paymentData, userData, onClose }) => {
  const generateBillNumber = () => {
    return `JJ-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
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

  const calculateTax = (amount) => {
    return (amount * 0.18).toFixed(2); // 18% GST
  };

  const calculateTotal = (amount) => {
    const tax = parseFloat(calculateTax(amount));
    return (parseFloat(amount) + tax).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window with the bill content
    const printWindow = window.open('', '_blank');
    const billContent = document.querySelector('.bill-container').innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Journey Junction - Invoice</title>
          <style>
            ${document.querySelector('style').innerHTML}
            body { font-family: Arial, sans-serif; margin: 20px; }
            .bill-actions { display: none !important; }
          </style>
        </head>
        <body>
          <div class="bill-container">
            ${billContent}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const billNumber = generateBillNumber();
  const currentDate = new Date();
  const baseAmount = parseFloat(tripData.basePrice);
  const taxAmount = parseFloat(calculateTax(baseAmount));
  const totalAmount = parseFloat(calculateTotal(baseAmount));

  return (
    <div className="bill-overlay">
      <div className="bill-container">
        {/* Bill Header */}
        <div className="bill-header">
          <div className="company-info">
            <h1 className="company-name">Journey Junction</h1>
            <p className="company-tagline">Your Adventure Awaits</p>
            <div className="company-details">
              <p>📍 123 Travel Street, Tourism District</p>
              <p>📞 +91 98765 43210 | ✉️ info@journeyjunction.com</p>
              <p>🌐 www.journeyjunction.com</p>
            </div>
          </div>
          <div className="bill-info">
            <h2 className="bill-title">INVOICE</h2>
            <div className="bill-details">
              <p><strong>Bill No:</strong> {billNumber}</p>
              <p><strong>Date:</strong> {formatDate(currentDate)}</p>
              <p><strong>Time:</strong> {formatTime(currentDate)}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-section">
          <h3>Bill To:</h3>
          <div className="customer-info">
            <p><strong>{userData.name}</strong></p>
            <p>📧 {userData.email}</p>
            <p>🆔 Customer ID: {userData.id}</p>
          </div>
        </div>

        {/* Trip Information */}
        <div className="trip-section">
          <h3>Trip Details:</h3>
          <div className="trip-info-card">
            <div className="trip-header">
              <h4>{tripData.tripTitle}</h4>
              <span className="destination-badge">📍 {tripData.destination}</span>
            </div>
            {tripData.image && (
              <div className="trip-image-small">
                <img src={tripData.image} alt={tripData.tripTitle} />
              </div>
            )}
            <div className="trip-dates">
              <p><strong>Start Date:</strong> {formatDate(tripData.preferredStartDate)}</p>
              <p><strong>End Date:</strong> {formatDate(tripData.preferredEndDate)}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="payment-section">
          <h3>Payment Details:</h3>
          <div className="payment-info">
            <p><strong>Payment Method:</strong> {paymentData.method.toUpperCase()}</p>
            <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
            <p><strong>Payment Date:</strong> {formatDate(paymentData.paidAt)}</p>
            <p><strong>Status:</strong> <span className="status-paid">✅ PAID</span></p>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bill-summary">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{tripData.tripTitle}</strong>
                  <br />
                  <small>Trip to {tripData.destination}</small>
                </td>
                <td>1 Person</td>
                <td>{tripData.currency} {baseAmount.toFixed(2)}</td>
                <td>{tripData.currency} {baseAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="calculation-section">
            <div className="calc-row">
              <span>Subtotal:</span>
              <span>{tripData.currency} {baseAmount.toFixed(2)}</span>
            </div>
            <div className="calc-row">
              <span>GST (18%):</span>
              <span>{tripData.currency} {taxAmount.toFixed(2)}</span>
            </div>
            <div className="calc-row total-row">
              <span><strong>Total Amount:</strong></span>
              <span><strong>{tripData.currency} {totalAmount.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <h4>Terms & Conditions:</h4>
          <ul>
            <li>This invoice is computer generated and does not require signature.</li>
            <li>Payment is non-refundable after confirmation.</li>
            <li>Trip dates are subject to weather conditions and availability.</li>
            <li>Please carry a valid ID proof during the trip.</li>
            <li>For any queries, contact us at info@journeyjunction.com</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="bill-footer">
          <div className="thank-you">
            <h3>🎉 Thank You for Choosing Journey Junction!</h3>
            <p>We're excited to be part of your adventure. Have a wonderful trip!</p>
          </div>
          <div className="contact-footer">
            <p>For support: 📞 +91 98765 43210 | 📧 support@journeyjunction.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bill-actions">
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print Bill
          </button>
          <button className="btn-download" onClick={handleDownload}>
            📥 Download PDF
          </button>
          <button className="btn-close" onClick={onClose}>
            ✖️ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;