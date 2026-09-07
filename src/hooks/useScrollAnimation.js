import { useEffect } from 'react';

/**
 * useScrollAnimation - High-performance IntersectionObserver & Scroll-driven Animation Engine
 * Automatically applies 3D depth, stagger cascades, and viewport entrance physics.
 */
export const useScrollAnimation = (dependency) => {
  useEffect(() => {
    const selector = `
      [data-reveal],
      .reveal,
      .reveal-up,
      .reveal-left,
      .reveal-right,
      .reveal-scale,
      .showcase-section,
      .showcase-card,
      .feature-card,
      .dashboard-grid > div,
      .template-card,
      .ats-panel-card,
      .resumes-empty-card,
      .auth-card,
      .step-item,
      .admin-stat-card,
      .section-header
    `;

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Also trigger child element staggered reveals if showcase section
          const childReveals = entry.target.querySelectorAll('.showcase-content, .showcase-visual, .mockup-window, .showcase-features-list li');
          childReveals.forEach((child, i) => {
            child.classList.add('child-revealed');
          });
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: [0.1, 0.25]
    };

    let observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        observer.observe(el);
      });
    };

    const timer = setTimeout(observeElements, 50);

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [dependency]);
};
