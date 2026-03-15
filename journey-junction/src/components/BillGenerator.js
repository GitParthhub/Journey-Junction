import React, { useRef, useEffect, useState } from 'react';
import './BillGenerator.css';

const BRAND = {
  primary: '#00798C',
  primaryDark: '#005f73',
  secondary: '#30638E',
  gold: '#EDAE49',
  goldLight: '#FFD700',
  gradientHeader: 'linear-gradient(135deg, #00798C 0%, #30638E 100%)',
  gradientMeta: '#005f73',
};

const BillGenerator = ({ tripData, paymentData, userData, onClose }) => {
  const billRef = useRef(null);
  const [logoBase64, setLogoBase64] = useState('');

  // Convert logo to base64 so it works in the downloaded/printed window
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL('image/jpeg'));
    };
    img.src = '/images/logo.jpeg';
  }, []);

  const billNumber = `JJ-${Date.now().toString().slice(-8)}-${Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase()}`;
  const currentDate = new Date();
  const baseAmount = parseFloat(tripData.basePrice) || 0;
  const taxAmount = parseFloat((baseAmount * 0.18).toFixed(2));
  const totalAmount = parseFloat((baseAmount + taxAmount).toFixed(2));

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatCurrency = (amount) => {
    const cur = tripData.currency || 'INR';
    if (cur === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    if (cur === 'USD') return `$${amount.toLocaleString('en-US')}`;
    if (cur === 'EUR') return `€${amount.toLocaleString()}`;
    if (cur === 'GBP') return `£${amount.toLocaleString()}`;
    return `${cur} ${amount.toLocaleString()}`;
  };

  const getMethodLabel = (method) => {
    const map = {
      card: '💳 Credit / Debit Card',
      qr: '📱 UPI / QR Code',
      emi: '📊 EMI',
      office: '🏢 Office Visit',
    };
    return map[method] || method?.toUpperCase();
  };

  const getDownloadStyles = () => `
    @page { margin: 0; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 210mm; background: #fff; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; }
    .inv-wrap { width: 100%; background: #fff; }

    .inv-header {
      background: linear-gradient(135deg, #00798C 0%, #30638E 100%);
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .inv-logo-row { display: flex; align-items: center; gap: 16px; }
    .inv-logo-img {
      width: 64px; height: 64px; border-radius: 14px;
      object-fit: cover; border: 3px solid #EDAE49;
      box-shadow: 0 4px 14px rgba(237,174,73,0.45);
    }
    .inv-brand-name {
      font-size: 26px; font-weight: 800; color: #EDAE49;
      letter-spacing: -0.5px;
    }
    .inv-brand-tag { font-size: 12px; color: rgba(255,255,255,0.75); font-style: italic; margin-top: 3px; }
    .inv-title-block { text-align: right; }
    .inv-title {
      font-size: 36px; font-weight: 900; color: #fff;
      letter-spacing: 5px; opacity: 0.95;
    }
    .inv-number { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 6px; font-family: monospace; }

    .inv-meta {
      background: #005f73;
      padding: 10px 40px;
      display: flex; gap: 32px; flex-wrap: wrap;
      border-bottom: 3px solid #EDAE49;
    }
    .inv-meta-item { font-size: 12px; color: rgba(255,255,255,0.78); }
    .inv-meta-item strong { color: #EDAE49; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }

    .inv-body { padding: 30px 40px; }

    .inv-parties { display: flex; gap: 20px; margin-bottom: 24px; }
    .inv-party { flex: 1; background: #f8fafb; border-radius: 10px; padding: 18px; border-top: 3px solid #EDAE49; }
    .inv-party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00798C; margin-bottom: 10px; }
    .inv-party h4 { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
    .inv-party p { font-size: 13px; color: #555; margin: 3px 0; line-height: 1.5; }

    .inv-trip-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 24px; display: flex; }
    .inv-trip-img { width: 180px; flex-shrink: 0; object-fit: cover; }
    .inv-trip-info { padding: 20px; flex: 1; }
    .inv-trip-info h3 { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
    .inv-trip-dest { display: inline-block; background: #00798C; color: #fff; font-size: 12px; padding: 3px 12px; border-radius: 20px; margin-bottom: 14px; }
    .inv-trip-dates { display: flex; gap: 28px; }
    .inv-date-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; display: block; margin-bottom: 3px; }
    .inv-date-item span { font-size: 14px; font-weight: 600; color: #1a1a2e; }

    .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .inv-table thead tr { background: linear-gradient(135deg, #00798C, #30638E); }
    .inv-table th { color: #fff; padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; }
    .inv-table th:last-child, .inv-table td:last-child { text-align: right; }
    .inv-table td { padding: 14px 16px; font-size: 14px; color: #333; border-bottom: 1px solid #f0f0f0; }
    .inv-table tbody tr:nth-child(even) { background: #f8fafb; }
    .inv-table td strong { color: #1a1a2e; }
    .inv-table td small { color: #888; font-size: 12px; }

    .inv-totals { margin-left: auto; width: 280px; margin-bottom: 24px; }
    .inv-total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #555; border-bottom: 1px solid #f0f0f0; }
    .inv-total-row.grand { border-top: 2px solid #EDAE49; border-bottom: none; padding-top: 12px; margin-top: 4px; font-size: 18px; font-weight: 800; color: #00798C; }

    .inv-payment-box {
      background: linear-gradient(135deg, #fdf6e3 0%, #fef3c7 100%);
      border: 1px solid #f6d860;
      border-left: 4px solid #EDAE49;
      border-radius: 10px; padding: 20px; margin-bottom: 24px;
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
    }
    .inv-payment-box h4 { font-size: 13px; font-weight: 700; color: #30638E; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .inv-payment-box p { font-size: 13px; color: #444; margin: 4px 0; }
    .inv-status-badge { background: linear-gradient(135deg, #EDAE49, #d97706); color: #fff; padding: 10px 22px; border-radius: 24px; font-size: 13px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }

    .inv-terms { background: #f8fafb; border-radius: 10px; padding: 20px; margin-bottom: 0; }
    .inv-terms h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #00798C; margin-bottom: 12px; }
    .inv-terms ol { padding-left: 18px; }
    .inv-terms li { font-size: 12px; color: #666; margin: 5px 0; line-height: 1.55; }

    .inv-footer {
      background: linear-gradient(135deg, #00798C 0%, #30638E 100%);
      padding: 28px 40px; text-align: center; color: #fff;
      border-top: 3px solid #EDAE49;
    }
    .inv-footer-icons { font-size: 26px; margin-bottom: 10px; }
    .inv-footer h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #EDAE49; }
    .inv-footer p { font-size: 13px; color: rgba(255,255,255,0.85); margin: 4px 0; }
    .inv-footer-divider { width: 60px; height: 3px; background: #EDAE49; border-radius: 2px; margin: 14px auto; }
    .inv-footer-contact { font-size: 12px; color: rgba(255,255,255,0.7) !important; }
    .inv-header, .inv-meta, .inv-footer, .inv-table thead tr, .inv-status-badge {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  `;

  const buildInvoiceHTML = (logoSrc) => `
    <div class="inv-wrap">
      <div class="inv-header">
        <div class="inv-logo-row">
          <img src="${logoSrc}" alt="Journey Junction" class="inv-logo-img" />
          <div>
            <div class="inv-brand-name">Journey Junction</div>
            <div class="inv-brand-tag">Explore • Dream • Discover</div>
          </div>
        </div>
        <div class="inv-title-block">
          <div class="inv-title">INVOICE</div>
          <div class="inv-number">#${billNumber}</div>
        </div>
      </div>

      <div class="inv-meta">
        <div class="inv-meta-item"><strong>Issue Date</strong>${formatDate(currentDate)}</div>
        <div class="inv-meta-item"><strong>Issue Time</strong>${formatTime(currentDate)}</div>
        <div class="inv-meta-item"><strong>Status</strong>✅ PAID</div>
        <div class="inv-meta-item"><strong>Transaction</strong>${paymentData.transactionId}</div>
      </div>

      <div class="inv-body">
        <div class="inv-parties">
          <div class="inv-party">
            <div class="inv-party-label">Bill From</div>
            <h4>Journey Junction</h4>
            <p>📍 123 Travel Street, Tourism District</p>
            <p>Mumbai, Maharashtra 400001</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ info@journeyjunction.com</p>
            <p>🌐 www.journeyjunction.com</p>
          </div>
          <div class="inv-party">
            <div class="inv-party-label">Bill To</div>
            <h4>${userData.name}</h4>
            <p>✉️ ${userData.email}</p>
            <p>🆔 Customer ID: ${userData.id?.toString().slice(-8).toUpperCase()}</p>
            <p>📅 Booking Date: ${formatDate(currentDate)}</p>
          </div>
        </div>

        <div class="inv-trip-card">
          ${tripData.image ? `<img src="${tripData.image}" alt="${tripData.tripTitle}" class="inv-trip-img" />` : ''}
          <div class="inv-trip-info">
            <h3>${tripData.tripTitle}</h3>
            <span class="inv-trip-dest">📍 ${tripData.destination}</span>
            <div class="inv-trip-dates">
              <div class="inv-date-item">
                <label>Departure</label>
                <span>${formatDate(tripData.preferredStartDate)}</span>
              </div>
              <div class="inv-date-item">
                <label>Return</label>
                <span>${formatDate(tripData.preferredEndDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <table class="inv-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Travelers</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${tripData.tripTitle}</strong><br /><small>Trip package to ${tripData.destination}</small></td>
              <td>1 Person</td>
              <td>${formatCurrency(baseAmount)}</td>
              <td>${formatCurrency(baseAmount)}</td>
            </tr>
          </tbody>
        </table>

        <div class="inv-totals">
          <div class="inv-total-row"><span>Subtotal</span><span>${formatCurrency(baseAmount)}</span></div>
          <div class="inv-total-row"><span>GST (18%)</span><span>${formatCurrency(taxAmount)}</span></div>
          <div class="inv-total-row grand"><span>Total</span><span>${formatCurrency(totalAmount)}</span></div>
        </div>

        <div class="inv-payment-box">
          <div>
            <h4>Payment Information</h4>
            <p><strong>Method:</strong> ${getMethodLabel(paymentData.method)}</p>
            <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
            <p><strong>Paid On:</strong> ${formatDate(paymentData.paidAt)} at ${formatTime(paymentData.paidAt)}</p>
          </div>
          <div class="inv-status-badge">✅ PAID</div>
        </div>

        <div class="inv-terms">
          <h4>Terms &amp; Conditions</h4>
          <ol>
            <li>This invoice is computer generated and does not require a physical signature.</li>
            <li>Payment once made is non-refundable after booking confirmation, except in cases of trip cancellation by Journey Junction.</li>
            <li>Cancellations more than 30 days before departure qualify for a 50% refund.</li>
            <li>Cancellations within 15 days of departure are non-refundable.</li>
            <li>Trip dates and itinerary are subject to change due to weather, natural events, or force majeure.</li>
            <li>All travelers must carry a valid government-issued photo ID throughout the trip.</li>
            <li>Journey Junction is not responsible for loss of personal belongings during the trip.</li>
            <li>Travel insurance is strongly recommended and is the sole responsibility of the traveler.</li>
            <li>Any medical conditions must be disclosed at the time of booking.</li>
            <li>For disputes, contact us within 7 days of trip completion at legal@journeyjunction.com</li>
          </ol>
        </div>
      </div>

      <div class="inv-footer">
        <div class="inv-footer-icons">🌍 ✈️ 🎒</div>
        <h3>Thank You for Choosing Journey Junction!</h3>
        <p>Your adventure is officially confirmed. Pack your bags and get ready for an unforgettable journey!</p>
        <div class="inv-footer-divider"></div>
        <p class="inv-footer-contact">
          📞 +91 98765 43210 &nbsp;|&nbsp; ✉️ support@journeyjunction.com &nbsp;|&nbsp; 🌐 www.journeyjunction.com
        </p>
      </div>
    </div>
  `;

  const handleDownload = () => {
    const logoSrc = logoBase64 || '/images/logo.jpeg';
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Journey Junction — Invoice ${billNumber}</title>
  <style>${getDownloadStyles()}</style>
</head>
<body>${buildInvoiceHTML(logoSrc)}</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 500);
  };

  return (
    <div className="bill-overlay">
      <div className="bill-modal">
        <div className="bill-scroll">
          <div className="inv-wrap" ref={billRef}>

            {/* HEADER */}
            <div className="inv-header">
              <div className="inv-logo-row">
                <img src="/images/logo.jpeg" alt="Journey Junction" className="inv-logo-img" />
                <div>
                  <div className="inv-brand-name">Journey Junction</div>
                  <div className="inv-brand-tag">Explore • Dream • Discover</div>
                </div>
              </div>
              <div className="inv-title-block">
                <div className="inv-title">INVOICE</div>
                <div className="inv-number">#{billNumber}</div>
              </div>
            </div>

            {/* META BAR */}
            <div className="inv-meta">
              <div className="inv-meta-item"><strong>Issue Date</strong>{formatDate(currentDate)}</div>
              <div className="inv-meta-item"><strong>Issue Time</strong>{formatTime(currentDate)}</div>
              <div className="inv-meta-item"><strong>Status</strong>✅ PAID</div>
              <div className="inv-meta-item"><strong>Transaction</strong>{paymentData.transactionId}</div>
            </div>

            {/* BODY */}
            <div className="inv-body">

              {/* PARTIES */}
              <div className="inv-parties">
                <div className="inv-party">
                  <div className="inv-party-label">Bill From</div>
                  <h4>Journey Junction</h4>
                  <p>📍 123 Travel Street, Tourism District</p>
                  <p>Mumbai, Maharashtra 400001</p>
                  <p>📞 +91 98765 43210</p>
                  <p>✉️ info@journeyjunction.com</p>
                  <p>🌐 www.journeyjunction.com</p>
                </div>
                <div className="inv-party">
                  <div className="inv-party-label">Bill To</div>
                  <h4>{userData.name}</h4>
                  <p>✉️ {userData.email}</p>
                  <p>🆔 Customer ID: {userData.id?.toString().slice(-8).toUpperCase()}</p>
                  <p>📅 Booking Date: {formatDate(currentDate)}</p>
                </div>
              </div>

              {/* TRIP CARD */}
              <div className="inv-trip-card">
                {tripData.image && (
                  <img src={tripData.image} alt={tripData.tripTitle} className="inv-trip-img" />
                )}
                <div className="inv-trip-info">
                  <h3>{tripData.tripTitle}</h3>
                  <span className="inv-trip-dest">📍 {tripData.destination}</span>
                  <div className="inv-trip-dates">
                    <div className="inv-date-item">
                      <label>Departure</label>
                      <span>{formatDate(tripData.preferredStartDate)}</span>
                    </div>
                    <div className="inv-date-item">
                      <label>Return</label>
                      <span>{formatDate(tripData.preferredEndDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Travelers</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{tripData.tripTitle}</strong><br />
                      <small>Trip package to {tripData.destination}</small>
                    </td>
                    <td>1 Person</td>
                    <td>{formatCurrency(baseAmount)}</td>
                    <td>{formatCurrency(baseAmount)}</td>
                  </tr>
                </tbody>
              </table>

              {/* TOTALS */}
              <div className="inv-totals">
                <div className="inv-total-row"><span>Subtotal</span><span>{formatCurrency(baseAmount)}</span></div>
                <div className="inv-total-row"><span>GST (18%)</span><span>{formatCurrency(taxAmount)}</span></div>
                <div className="inv-total-row grand"><span>Total</span><span>{formatCurrency(totalAmount)}</span></div>
              </div>

              {/* PAYMENT BOX */}
              <div className="inv-payment-box">
                <div>
                  <h4>Payment Information</h4>
                  <p><strong>Method:</strong> {getMethodLabel(paymentData.method)}</p>
                  <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
                  <p><strong>Paid On:</strong> {formatDate(paymentData.paidAt)} at {formatTime(paymentData.paidAt)}</p>
                </div>
                <div className="inv-status-badge">✅ PAID</div>
              </div>

              {/* TERMS */}
              <div className="inv-terms">
                <h4>Terms &amp; Conditions</h4>
                <ol>
                  <li>This invoice is computer generated and does not require a physical signature.</li>
                  <li>Payment once made is non-refundable after booking confirmation, except in cases of trip cancellation by Journey Junction.</li>
                  <li>Cancellations more than 30 days before departure qualify for a 50% refund.</li>
                  <li>Cancellations within 15 days of departure are non-refundable.</li>
                  <li>Trip dates and itinerary are subject to change due to weather, natural events, or force majeure.</li>
                  <li>All travelers must carry a valid government-issued photo ID throughout the trip.</li>
                  <li>Journey Junction is not responsible for loss of personal belongings during the trip.</li>
                  <li>Travel insurance is strongly recommended and is the sole responsibility of the traveler.</li>
                  <li>Any medical conditions must be disclosed at the time of booking.</li>
                  <li>For disputes, contact us within 7 days of trip completion at legal@journeyjunction.com</li>
                </ol>
              </div>
            </div>

            {/* FOOTER */}
            <div className="inv-footer">
              <div className="inv-footer-icons">🌍 ✈️ 🎒</div>
              <h3>Thank You for Choosing Journey Junction!</h3>
              <p>Your adventure is officially confirmed. Pack your bags and get ready for an unforgettable journey!</p>
              <div className="inv-footer-divider"></div>
              <p className="inv-footer-contact">
                📞 +91 98765 43210 &nbsp;|&nbsp; ✉️ support@journeyjunction.com &nbsp;|&nbsp; 🌐 www.journeyjunction.com
              </p>
            </div>

          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bill-actions">
          <button className="btn-print" onClick={handleDownload}>🖨️ Print</button>
          <button className="btn-download" onClick={handleDownload}>📥 Download PDF</button>
          <button className="btn-close" onClick={onClose}>✖️ Close</button>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;
