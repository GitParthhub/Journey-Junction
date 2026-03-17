import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import './GuideDetail.css';

const StarRating = ({ value, onChange, readonly }) => (
  <div className="gd-stars">
    {[1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`gd-star ${star <= value ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
        onClick={() => !readonly && onChange(star)}
      >★</span>
    ))}
  </div>
);

const GuideDetail = ({ guide, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(true);

  const content = guide.content;

  useEffect(() => {
    reviewAPI.getReviews(guide.id)
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [guide.id]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setSubmitMsg('Please select a star rating.');
    if (!comment.trim()) return setSubmitMsg('Please write a comment.');
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await reviewAPI.submitReview({ guideId: guide.id, guideTitle: guide.title, rating, comment });
      setSubmitMsg('✅ Review submitted successfully!');
      setRating(0);
      setComment('');
      // Refresh reviews
      const updated = await reviewAPI.getReviews(guide.id);
      setReviews(updated.data);
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || '❌ Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gd-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="gd-modal">
        {/* Header */}
        <div className="gd-header" style={{ backgroundImage: `url('${guide.image}')` }}>
          <div className="gd-header-overlay" />
          <button className="gd-close" onClick={onClose}>✕</button>
          <div className="gd-header-content">
            <span className="gd-category-badge">{guide.emoji} {guide.category}</span>
            <h1 className="gd-title">{guide.title}</h1>
            <div className="gd-meta">
              <span>⏱ {guide.readTime}</span>
              <span>🎯 {guide.difficulty}</span>
              <span>📅 {guide.season}</span>
              {avgRating && <span>⭐ {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>}
            </div>
            <div className="gd-tags">
              {guide.tags.map(t => <span key={t} className="gd-tag">{t}</span>)}
            </div>
          </div>
        </div>

        <div className="gd-body">
          {/* Intro */}
          <div className="gd-intro-section">
            <h2 className="gd-intro-title">📖 Guide Overview</h2>
            <p className="gd-intro">{content.introduction}</p>
          </div>

          {/* Sections */}
          <div className="gd-content-sections">
            <h2 className="gd-content-title">📝 Complete Guide</h2>
            {content.sections.map((sec, i) => (
              <div key={i} className="gd-section">
                <h3 className="gd-section-heading">{sec.title}</h3>
                <p className="gd-section-body">{sec.content}</p>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="gd-review-form-wrap">
            <h3 className="gd-reviews-title">✍️ Write a Review</h3>
            <form className="gd-review-form" onSubmit={handleSubmit}>
              <div className="gd-rating-row">
                <span className="gd-rating-label">Your Rating:</span>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <textarea
                className="gd-comment-input"
                placeholder="Share your thoughts about this guide..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <div className="gd-form-footer">
                {submitMsg && <span className={`gd-submit-msg ${submitMsg.startsWith('✅') ? 'success' : 'error'}`}>{submitMsg}</span>}
                <button className="gd-submit-btn" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : '📤 Submit Review'}
                </button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          <div className="gd-reviews-section">
            <h3 className="gd-reviews-title">
              💬 Reviews {reviews.length > 0 && <span className="gd-reviews-count">{reviews.length}</span>}
            </h3>
            {loadingReviews ? (
              <p className="gd-reviews-loading">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="gd-no-reviews">
                <span>🌟</span>
                <p>No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="gd-reviews-list">
                {reviews.map(r => (
                  <div key={r._id} className="gd-review-card">
                    <div className="gd-review-top">
                      <div className="gd-reviewer-avatar">{r.userName.charAt(0).toUpperCase()}</div>
                      <div className="gd-reviewer-info">
                        <span className="gd-reviewer-name">{r.userName}</span>
                        <span className="gd-review-date">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <StarRating value={r.rating} readonly />
                    </div>
                    <p className="gd-review-comment">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;