import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerSource, setTriggerSource] = useState(null); // 'download' | 'ats'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Triggers the feedback modal only if not previously shown in this session.
   * @param {('download'|'ats')} source 
   */
  const triggerFeedback = (source = 'general') => {
    if (typeof window === 'undefined') return;

    const alreadyShown = sessionStorage.getItem('resumax_feedback_shown');
    if (!alreadyShown) {
      sessionStorage.setItem('resumax_feedback_shown', 'true');
      setTriggerSource(source);
      setIsOpen(true);
    }
  };

  const dismissFeedback = () => {
    setIsOpen(false);
  };

  /**
   * Submits feedback to backend API and localStorage database.
   * @param {Object} feedbackData 
   * @param {number} feedbackData.rating 
   * @param {string} feedbackData.comment 
   */
  const submitFeedback = async ({ rating, comment = '' }) => {
    setIsSubmitting(true);
    const newReview = {
      id: `rev_${Date.now()}`,
      rating,
      comment: comment.trim(),
      userId: currentUser?.uid || 'guest_user',
      userEmail: currentUser?.email || 'anonymous',
      source: triggerSource || 'app',
      timestamp: new Date().toISOString()
    };

    // 1. Store in localStorage review store
    try {
      const existingReviews = JSON.parse(localStorage.getItem('resumax_reviews') || '[]');
      existingReviews.unshift(newReview);
      localStorage.setItem('resumax_reviews', JSON.stringify(existingReviews));
    } catch (e) {
      console.warn('Failed to save feedback locally:', e);
    }

    // 2. Post to backend API
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
    } catch (err) {
      console.warn('Backend feedback endpoint unavailable, saved locally:', err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
      }, 1600);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        isOpen,
        triggerSource,
        isSubmitting,
        isSubmitted,
        triggerFeedback,
        dismissFeedback,
        submitFeedback
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
