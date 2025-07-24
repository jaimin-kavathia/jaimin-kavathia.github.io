import { useCallback, useEffect, useState } from 'react';

interface ScrollToSectionOptions {
  behavior?: ScrollBehavior;
  offset?: number;
}

interface UseScrollToSectionReturn {
  scrollToSection: (sectionId: string, options?: ScrollToSectionOptions) => void;
  activeSection: string;
  isScrolling: boolean;
}

/**
 * Custom hook for smooth scrolling to sections and tracking active section
 * Used for navigation and smooth page transitions
 */
export const useScrollToSection = (): UseScrollToSectionReturn => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);

  /**
   * Scrolls to a specific section with smooth animation
   */
  const scrollToSection = useCallback((
    sectionId: string,
    options: ScrollToSectionOptions = {}
  ) => {
    const {
      behavior = 'smooth',
      offset = 0,
    } = options;

    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

    setIsScrolling(true);

    // Calculate the target position with offset
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const targetPosition = elementPosition - offset;

    // Use native smooth scrolling if supported, otherwise fallback to manual implementation
    if (behavior === 'smooth' && 'scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Set scrolling to false after animation completes (approximate timing)
      setTimeout(() => setIsScrolling(false), 1000);
    } else {
      // Fallback smooth scroll implementation
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800; // 800ms animation
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smooth animation
        const easeInOutCubic = (t: number): number => {
          return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const easedProgress = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setIsScrolling(false);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }, []);

  /**
   * Track the currently active section based on scroll position
   */
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return; // Don't update active section while programmatically scrolling

      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      let currentActiveSection = '';

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const sectionTop = element.offsetTop;
        const sectionHeight = element.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentActiveSection = element.id;
        }
      });

      // If we're at the top of the page, set the first section as active
      if (window.scrollY < 100 && sections.length > 0) {
        currentActiveSection = (sections[0] as HTMLElement).id;
      }

      // If we're at the bottom of the page, set the last section as active
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (sections.length > 0) {
          currentActiveSection = (sections[sections.length - 1] as HTMLElement).id;
        }
      }

      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Set initial active section
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [activeSection, isScrolling]);

  return {
    scrollToSection,
    activeSection,
    isScrolling,
  };
};

/**
 * Hook for handling hash-based navigation
 * Automatically scrolls to section when URL hash changes
 */
export const useHashNavigation = () => {
  const { scrollToSection } = useScrollToSection();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#' character
      if (hash) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          scrollToSection(hash, { offset: 80 }); // Account for fixed header
        }, 100);
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [scrollToSection]);
};