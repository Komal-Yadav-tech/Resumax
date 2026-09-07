import React, { useState } from 'react';
import { Star, X, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { useFeedback } from '../../context/FeedbackContext';
import logoImg from '../../assets/logo.png';

const RATING_LABELS = {
  1: 'Needs Improvement 😕',
  2: 'Fair 🙂',
  3: 'Good 👍',
  4: 'Great! 🌟',
  5: 'Exceptional! 🚀'
};

export const FeedbackModal = () => {
  const { isOpen, isSubmitting, isSubmitted, dismissFeedback, submitFeedback, triggerSource } =
    useFeedback();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      submitFeedback({ rating, comment });
    }
  };

  const activeDisplayRating = hoverRating || rating;

  return (
    <div className="feedback-modal-overlay" role="dialog" aria-modal="true">
      <div className="feedback-modal-card">
        {/* Close Button */}
        <button
          type="button"
          className="feedback-close-btn"
          onClick={dismissFeedback}
          aria-label="Close review popup"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="feedback-success-state">
            <CheckCircle2 size={54} color="var(--success)" className="feedback-success-icon" />
            <h3>Thank You for Your Feedback!</h3>
            <p>
              Your insights help us continuously improve Resumax and keep it 100% free for job
              seekers worldwide.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="feedback-header">
              <div className="feedback-badge">
                <img src={logoImg} alt="AI" style={{ width: 13, height: 13, borderRadius: 'var(--radius-sm)' }} />
                <span>
                  {triggerSource === 'download'
                    ? 'Resume Downloaded'
                    : triggerSource === 'ats'
                    ? 'ATS Scan Complete'
                    : 'Your Feedback'}
                </span>
              </div>
              <h2>How was your experience?</h2>
              <p>Rate your experience using Resumax to help us build a better career toolkit.</p>
            </div>

            {/* 5-Star Rating Selector */}
            <div className="star-rating-container">
              <div className="star-rating-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= activeDisplayRating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={32}
                      className="star-icon"
                      fill={star <= activeDisplayRating ? '#F59E0B' : 'transparent'}
                      color={star <= activeDisplayRating ? '#F59E0B' : 'var(--text-muted)'}
                    />
                  </button>
                ))}
              </div>
              <span className="star-rating-label">
                {activeDisplayRating > 0 ? RATING_LABELS[activeDisplayRating] : 'Select a rating'}
              </span>
            </div>

            {/* Optional Comment Box */}
            <div className="feedback-comment-wrapper">
              <label htmlFor="feedback-comment" className="feedback-label">
                Additional Comments (Optional)
              </label>
              <textarea
                id="feedback-comment"
                className="form-textarea feedback-textarea"
                rows={3}
                placeholder="What did you love or how can we improve?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
            </div>

            {/* Modal Actions */}
            <div className="feedback-modal-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={dismissFeedback}
                disabled={isSubmitting}
              >
                Maybe later
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
