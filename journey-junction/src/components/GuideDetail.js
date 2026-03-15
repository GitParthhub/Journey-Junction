import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import './GuideDetail.css';

const guideContent = {
  1: {
    intro: 'Southeast Asia is one of the most rewarding regions for budget backpackers. With stunning landscapes, rich cultures, and incredibly affordable costs, it\'s the perfect starting point for any adventure traveller.',
    sections: [
      {
        heading: '🗺️ Countries to Cover',
        body: 'The classic Southeast Asia route covers Thailand → Vietnam → Cambodia → Laos → Indonesia. You can do it in 4–8 weeks depending on your pace. Start in Bangkok, end in Bali for the perfect loop.'
      },
      {
        heading: '💰 Budget Breakdown',
        body: 'Expect to spend ₹1,500–₹2,500/day covering accommodation (hostels/guesthouses), local food, transport, and entry fees. Street food meals cost ₹80–₹200. Overnight buses and trains save on accommodation costs.'
      },
      {
        heading: '📋 Visa Tips',
        body: 'Thailand, Indonesia, and Cambodia offer visa-on-arrival for Indian passport holders. Vietnam requires an e-visa (apply online, takes 3 business days). Always carry passport-size photos and USD cash for border crossings.'
      },
      {
        heading: '🎒 Packing Essentials',
        body: 'Pack light — 40L backpack max. Essentials: quick-dry clothes, flip-flops, rain poncho, universal adapter, power bank, mosquito repellent, and a small first-aid kit. Laundry services are cheap everywhere.'
      },
      {
        heading: '🌟 Hidden Gems',
        body: 'Skip the crowds at Pai (Thailand), Kampot (Cambodia), Phong Nha caves (Vietnam), and Nusa Penida (Indonesia). These lesser-known spots offer authentic experiences at a fraction of the cost of tourist hotspots.'
      }
    ]
  },
  2: {
    intro: 'A perfect beach vacation doesn\'t happen by accident — it takes smart planning. From picking the right destination to packing the right gear, this guide covers everything you need for a stress-free coastal escape.',
    sections: [
      {
        heading: '📅 Choosing the Right Season',
        body: 'Research the monsoon calendar before booking. Bali is best April–October. Maldives shines November–April. Goa peaks November–February. Booking off-season can save 40–60% but check weather patterns carefully.'
      },
      {
        heading: '🏨 Accommodation Tips',
        body: 'Beachfront resorts are premium-priced. Consider staying 500m inland — you get the same beach access at 30–50% lower cost. Look for properties with free beach shuttle or walking distance to the shore.'
      },
      {
        heading: '🧴 Packing for the Beach',
        body: 'Must-haves: reef-safe sunscreen (SPF 50+), rash guard, waterproof phone pouch, dry bag, beach towel, snorkel set (renting is expensive), and a good book. Pack light, breathable clothing — cotton and linen work best.'
      },
      {
        heading: '🐠 Water Activities',
        body: 'Book snorkelling and diving through your hotel or local operators — avoid tourist traps near the beach. Early morning sessions have calmer water and better visibility. Always check operator safety certifications.'
      },
      {
        heading: '🍹 Food & Dining',
        body: 'Beachside restaurants charge a premium. Walk one street back for local eateries with fresh seafood at half the price. Try the local catch of the day — it\'s always fresher and cheaper than imported options.'
      }
    ]
  },
  3: {
    intro: 'Mountain trekking is one of the most transformative travel experiences — but it demands preparation. This beginner\'s guide will get you trail-ready with the right gear, fitness plan, and safety knowledge.',
    sections: [
      {
        heading: '🥾 Essential Gear',
        body: 'Invest in proper trekking boots (broken in before the trek), moisture-wicking base layers, a fleece mid-layer, waterproof jacket, trekking poles, and a 30–40L daypack. Never compromise on footwear — blisters can end a trek.'
      },
      {
        heading: '💪 Fitness Preparation',
        body: 'Start training 8–12 weeks before your trek. Focus on cardio (stair climbing, cycling), leg strength (squats, lunges), and core stability. Do practice hikes with your loaded pack on weekends to simulate trail conditions.'
      },
      {
        heading: '🏔️ Altitude Sickness',
        body: 'Above 2,500m, ascend slowly — no more than 300–500m per day. Symptoms: headache, nausea, dizziness. Treatment: descend immediately, rest, hydrate. Diamox (acetazolamide) can help — consult a doctor before your trek.'
      },
      {
        heading: '🌍 Best Beginner Treks',
        body: 'India: Triund (Himachal), Kedarkantha (Uttarakhand), Chopta-Tungnath. International: Annapurna Base Camp (Nepal), Langtang Valley, Everest Base Camp (with acclimatisation days). All have well-marked trails and teahouses.'
      },
      {
        heading: '🧭 Safety Rules',
        body: 'Never trek alone on remote trails. Hire a local guide for unfamiliar terrain. Share your itinerary with someone at home. Carry a basic first-aid kit, emergency whistle, headlamp, and enough food for an extra day. Download offline maps.'
      }
    ]
  },
  4: {
    intro: 'Solo travel is liberating, empowering, and deeply personal. But safety is non-negotiable. These tips will help you travel confidently and smartly, no matter where in the world you\'re headed.',
    sections: [
      {
        heading: '📱 Digital Safety',
        body: 'Share your real-time location with a trusted contact using Google Maps or WhatsApp. Keep digital copies of all documents (passport, visa, insurance) in Google Drive. Use a VPN on public Wi-Fi. Enable two-factor authentication on all accounts.'
      },
      {
        heading: '🏨 Accommodation Safety',
        body: 'Book your first night in advance — arriving in a new city without accommodation is risky. Choose hostels with 24/7 reception and lockers. Read recent reviews specifically mentioning safety. Avoid ground-floor rooms in budget hotels.'
      },
      {
        heading: '🚕 Transport Safety',
        body: 'Use only official taxis or ride-hailing apps (Grab, Uber, Ola). Never get into an unmarked vehicle. Share your ride details with someone. On overnight buses/trains, keep your bag close and valuables in a money belt.'
      },
      {
        heading: '👥 Meeting People',
        body: 'Hostels are the best place to meet fellow travellers. Join free walking tours to meet people and learn the city. Be cautious about sharing your accommodation details with strangers. Trust your instincts — if something feels off, leave.'
      },
      {
        heading: '🆘 Emergency Preparedness',
        body: 'Save local emergency numbers, your country\'s embassy number, and your travel insurance helpline. Carry a small amount of local cash always. Know the nearest hospital to your accommodation. Travel insurance is non-negotiable for solo travel.'
      }
    ]
  },
  5: {
    intro: 'Street food is the soul of a destination. It\'s where locals eat, where flavours are most authentic, and where your travel budget stretches furthest. Here\'s how to eat your way around the world safely and deliciously.',
    sections: [
      {
        heading: '🌏 Best Street Food Cities',
        body: 'Bangkok (pad thai, mango sticky rice), Hanoi (pho, banh mi), Mumbai (vada pav, pav bhaji), Istanbul (simit, doner), Mexico City (tacos, elotes), Marrakech (tagine, msemen). Each city has a distinct street food identity worth exploring.'
      },
      {
        heading: '🔍 How to Find the Best Stalls',
        body: 'Look for stalls with long queues of locals — that\'s always a good sign. Avoid stalls near major tourist attractions (overpriced, lower quality). Ask your hotel staff or hostel reception for their personal recommendations.'
      },
      {
        heading: '🦠 Eating Safely',
        body: 'Stick to freshly cooked, hot food. Avoid raw salads and unpeeled fruits in high-risk areas. Drink bottled or filtered water. Watch the vendor\'s hygiene — clean hands, covered food, fresh ingredients. Carry oral rehydration salts just in case.'
      },
      {
        heading: '📸 Food Markets to Visit',
        body: 'Chatuchak Weekend Market (Bangkok), Ben Thanh Market (Ho Chi Minh City), Crawford Market (Mumbai), Grand Bazaar (Istanbul), Mercado de San Juan (Mexico City). Arrive early for the freshest options and smaller crowds.'
      },
      {
        heading: '💬 Ordering Tips',
        body: 'Learn 5–10 food words in the local language — vendors appreciate the effort and you\'ll get better service. Use Google Translate\'s camera feature to read menus. Point and smile works universally. Always ask about spice levels before ordering.'
      }
    ]
  },
  6: {
    intro: 'Luxury travel doesn\'t have to mean emptying your savings. With the right strategies, you can experience five-star hotels, business class upgrades, and exclusive experiences without paying full price.',
    sections: [
      {
        heading: '✈️ Flight Upgrades',
        body: 'Book business class on budget long-haul carriers (AirAsia X, Scoot, IndiGo). Use credit card reward points for upgrades. Check in early and politely ask for upgrades at the counter — airlines often upgrade loyal customers on underbooked flights.'
      },
      {
        heading: '🏨 Hotel Hacks',
        body: 'Book directly with hotels for best rates and free upgrades. Use last-minute apps (HotelTonight) for 5-star deals. Travel during shoulder season (just before/after peak) for 40–60% discounts. Join hotel loyalty programs — even free tiers get perks.'
      },
      {
        heading: '🌍 Luxury Destinations on a Budget',
        body: 'Bali (5-star villas from ₹4,000/night), Georgia (Tbilisi has stunning boutique hotels under ₹3,000), Portugal (Lisbon is Europe\'s most affordable luxury destination), Sri Lanka (colonial-era hotels at mid-range prices).'
      },
      {
        heading: '🍽️ Fine Dining for Less',
        body: 'Visit Michelin-starred restaurants at lunch — same kitchen, same quality, 40–60% cheaper than dinner. Look for set menus and tasting menus at lunch. Many top restaurants offer bar seating without reservations at lower prices.'
      },
      {
        heading: '🎭 Exclusive Experiences',
        body: 'Private tours, cooking classes with local chefs, sunrise temple visits, and yacht charters can be surprisingly affordable when booked locally. Avoid booking through hotel concierge — go directly to operators for 30–50% savings.'
      }
    ]
  }
};

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

  const content = guideContent[guide.id];

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
              {avgRating && <span>⭐ {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>}
            </div>
            <div className="gd-tags">
              {guide.tags.map(t => <span key={t} className="gd-tag">{t}</span>)}
            </div>
          </div>
        </div>

        <div className="gd-body">
          {/* Intro */}
          <p className="gd-intro">{content.intro}</p>

          {/* Sections */}
          {content.sections.map((sec, i) => (
            <div key={i} className="gd-section">
              <h3 className="gd-section-heading">{sec.heading}</h3>
              <p className="gd-section-body">{sec.body}</p>
            </div>
          ))}

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
