/**
 * Hook for managing smooth section transitions
 * Provides optimized scrolling and section navigation
 * Requirements: 2.1, 2.4, 1.3, 1.4
 */

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface SectionTransitionOptions {
  duration?: number;
  easing?: string;
  offset?: number;
  mobileOptimization?: boolean;
}

interface UseSectionTransitionsReturn {
  scrollToSection: (sectionId: string, options?: SectionTransitionOptions) => void;
  isScrolling: boolean;
  currentSection: string | null;
  progress: number;
}

export const useSectionTransitions = (): UseSectionTransitionsReturn => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Detect mobile for performance optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Custom easing function for smooth scrolling
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  // Smooth scroll implementation
  const smoothScrollTo = useCallback((
    targetY: number,
    duration: number = 800,
    easing: (t: number) => number = easeInOutCubic
  ) => {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const startTime = performance.now();

      // Optimize duration for mobile
      const optimizedDuration = isMobile ? duration * 0.7 : duration;

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / optimizedDuration, 1);
        const easedProgress = easing(progress);
        
        const currentY = startY + (distance * easedProgress);
        window.scrollTo(0, currentY);
        
        setProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setProgress(0);
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }, [prefersReducedMotion, isMobile]);

  // Main scroll to section function
  const scrollToSection = useCallback(async (
    sectionId: string,
    options: SectionTransitionOptions = {}
  ) => {
    console.log(`Scrolling to section: ${sectionId}`);
    const {
      duration = 800,
      offset = 80,
      mobileOptimization = true
    } = options;

    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }
    console.log(`Found element for ${sectionId}:`, element);

    setIsScrolling(true);

    try {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(0, elementTop - offset);

      // Apply mobile optimization
      const optimizedDuration = mobileOptimization && isMobile ? duration * 0.6 : duration;

      await smoothScrollTo(targetY, optimizedDuration);
      
      // Update current section
      setCurrentSection(sectionId);

      // Focus management for accessibility
      if (element.hasAttribute('tabindex') || element.tagName === 'MAIN') {
        element.focus();
      } else {
        // Add temporary tabindex for focus
        element.setAttribute('tabindex', '-1');
        element.focus();
        element.addEventListener('blur', () => {
          element.removeAttribute('tabindex');
        }, { once: true });
      }

    } catch (error) {
      console.error('Error during section transition:', error);
    } finally {
      setIsScrolling(false);
    }
  }, [smoothScrollTo, isMobile]);

  // Track current section based on scroll position
  useEffect(() => {
    const updateCurrentSection = () => {
      if (isScrolling) return; // Don't update during programmatic scrolling

      const sections = document.querySelectorAll('[id]');
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;

      let current = null;
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionHeight = rect.height;
        const sectionCenter = sectionTop + sectionHeight / 2;
        const viewportCenter = scrollY + windowHeight / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance && rect.height > 100) { // Ignore small sections
          minDistance = distance;
          current = section.id;
        }
      });

      if (current && current !== currentSection) {
        setCurrentSection(current);
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateCurrentSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCurrentSection(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling, currentSection]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const sections = Array.from(document.querySelectorAll('[id]'))
        .filter(el => el.getBoundingClientRect().height > 100)
        .map(el => el.id)
        .filter(Boolean);

      const currentIndex = currentSection ? sections.indexOf(currentSection) : -1;

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          if (currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1]);
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          if (currentIndex > 0) {
            scrollToSection(sections[currentIndex - 1]);
          }
          break;
        case 'Home':
          event.preventDefault();
          if (sections.length > 0) {
            scrollToSection(sections[0]);
          }
          break;
        case 'End':
          event.preventDefault();
          if (sections.length > 0) {
            scrollToSection(sections[sections.length - 1]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, scrollToSection]);

  return {
    scrollToSection,
    isScrolling,
    currentSection,
    progress
  };
};

export default useSectionTransitions;