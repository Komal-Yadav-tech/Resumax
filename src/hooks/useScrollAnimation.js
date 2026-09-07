import { useEffect } from 'react';

/**
 * useScrollAnimation - High-performance IntersectionObserver hook
 * automatically adds .is-revealed class to elements as they scroll into view.
 */
export const useScrollAnimation = (dependency) => {
  useEffect(() => {
    // Select all elements designed to be animated on scroll
    const selector = `
      [data-reveal],
      .reveal,
      .reveal-up,
      .reveal-left,
      .reveal-right,
      .reveal-scale,
      .feature-card,
      .dashboard-grid > div,
      .template-card,
      .ats-card,
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
          // Once animated, we can unobserve to save CPU cycles
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // triggers slightly before full view
      threshold: 0.1
    };

    let observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        // Automatically add cascade delay for sibling elements if not explicitly set
        if (!el.style.getPropertyValue('--reveal-delay') && el.parentElement?.classList.contains('dashboard-grid')) {
          el.style.setProperty('--reveal-delay', `${index * 120}ms`);
        }
        observer.observe(el);
      });
    };

    // Initial pass with microtask delay for React DOM render
    const timer = setTimeout(observeElements, 60);

    // Mutation observer to handle dynamically loaded elements
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
