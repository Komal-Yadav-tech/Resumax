import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import brandLogo from '../assets/logo.png';

export const WelcomeScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const [isExiting, setIsExiting] = useState(false);

  const DISPLAY_DELAY_MS = 3000; // 3 seconds display
  const TRANSITION_DURATION_MS = 650; // 0.65 seconds smooth transition

  // Transition handler to Hero/Dashboard page
  const triggerTransition = () => {
    setIsExiting(true);
    setTimeout(() => {
      const destination = user ? 'dashboard' : 'login';
      if (onNavigate) onNavigate(destination);
    }, TRANSITION_DURATION_MS);
  };

  // Auto-transition timer (3 seconds display + smooth 0.65s transition)
  useEffect(() => {
    const autoTimer = setTimeout(() => {
      triggerTransition();
    }, DISPLAY_DELAY_MS);

    return () => {
      clearTimeout(autoTimer);
    };
  }, [user]);

  return (
    <div 
      className={`welcome-screen-container welcome-minimal ${isExiting ? 'welcome-fade-out' : 'welcome-fade-in'}`}
      onClick={triggerTransition}
      title="Click anywhere to continue"
    >
      {/* Top-Left Corner Brand Logo Placeholder */}
      <div className="welcome-top-left-logo" onClick={(e) => e.stopPropagation()}>
        <img 
          src={brandLogo} 
          alt="Resumax Logo" 
          className="welcome-brand-logo-img" 
        />
      </div>

      {/* Background Animated Ambient Mesh consistent with site colors */}
      <div className="welcome-ambient-mesh">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      <div className="welcome-minimal-content">
        {/* Cursive / Handwriting-style Heading */}
        <h1 className="welcome-main-heading welcome-cursive-heading">
          Welcome to Resumax
        </h1>

        {/* Small lightweight animated icon just below the heading */}
        <div className="welcome-minimal-icon-wrapper">
          <div className="welcome-pulse-icon">
            <Sparkles size={22} className="welcome-sparkle-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};
