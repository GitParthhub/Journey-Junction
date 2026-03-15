import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { contactAPI } from '../services/api';
import './InfoPages.css';

const contactInfo = [
  { icon: '📧', title: 'Email Support', lines: ['support@journeyjunction.com', 'Response within 24 hours'] },
  { icon: '📞', title: 'Phone Support', lines: ['+91 98765 43210', 'Mon–Fri, 9 AM – 6 PM IST'] },
  { icon: '💬', title: 'Live Chat', lines: ['Available on Dashboard', 'Avg. response: 5 minutes'] },
  { icon: '📍', title: 'Office', lines: ['12 Explorer Lane, Banjara Hills', 'Hyderabad, Telangana 500034'] },
];

const ContactUs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactAPI.sendMessage({
        type: 'general',
        priority: 'medium',
        title: `📬 Contact Us: ${form.subject}`,
        message: `From: ${form.name} (${form.email})\n\n${form.message}`,
        customer: {
          name: form.name,
          email: form.email,
        },
      });
      setSubmitted(true);
      setForm({ name: user?.name || '', email: '', subject: '', message: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-page">
      <Navbar />
      <div className="info-hero">
        <div>
          <div className="info-hero-icon">📬</div>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you — reach out anytime</p>
        </div>
      </div>

      <div className="info-container">
        <div className="contact-grid">
          <div className="contact-form-wrap">
            <h2>Send us a Message</h2>
            {submitted && (
              <div className="form-success">
                ✅ Message sent! Our team has been notified and will get back to you within 24 hours.
              </div>
            )}
            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #f87171', borderRadius: '10px', padding: '14px 18px', color: '#b91c1c', fontSize: '14px', marginBottom: '16px' }}>
                ⚠️ {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} required>
                  <option value="">Select a topic</option>
                  <option>Trip Planning Help</option>
                  <option>Account Issue</option>
                  <option>Payment Query</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue or question..." required />
              </div>
              <button type="submit" className="contact-submit-btn" disabled={loading || submitted}>
                {loading ? 'Sending...' : submitted ? '✅ Message Sent' : 'Send Message ✈️'}
              </button>
            </form>
          </div>

          <div className="contact-info-wrap">
            {contactInfo.map((c, i) => (
              <div className="contact-info-card" key={i}>
                <div className="contact-info-icon">{c.icon}</div>
                <div className="contact-info-text">
                  <h4>{c.title}</h4>
                  {c.lines.map((l, j) => <p key={j}>{l}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
