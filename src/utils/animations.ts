/**
 * Animation utilities for the portfolio website
 * Provides staggered animations and smooth scroll behavior
 */

// Animation timing constants
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
} as const;

export const ANIMATION_DELAY = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
} as const;

// Easing functions for smooth animations
export const EASING = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Creates staggered animation delays for multiple elements
 * @param index - The index of the element in the sequence
 * @param baseDelay - Base delay in milliseconds
 * @param increment - Delay increment between elements
 * @returns Animation delay in milliseconds
 */
export const getStaggerDelay = (
  index: number,
  baseDelay: number = 0,
  increment: number = 100
): number => {
  return baseDelay + (index * increment);
};

/**
 * Creates CSS animation styles for fade-in with stagger
 * @param index - Element index for stagger calculation
 * @param duration - Animation duration in milliseconds
 * @param baseDelay - Base delay before animation starts
 * @returns CSS style object
 */
export const createFadeInAnimation = (
  index: number = 0,
  duration: number = ANIMATION_DURATION.normal,
  baseDelay: number = 0
) => ({
  opacity: 0,
  transform: 'translateY(20px)',
  animation: `fadeInUp ${duration}ms ${EASING.easeOut} ${getStaggerDelay(index, baseDelay)}ms forwards`,
});

/**
 * Creates CSS animation styles for slide-in from left with stagger
 * @param index - Element index for stagger calculation
 * @param duration - Animation duration in milliseconds
 * @param baseDelay - Base delay before animation starts
 * @returns CSS style object
 */
export const createSlideInLeftAnimation = (
  index: number = 0,
  duration: number = ANIMATION_DURATION.normal,
  baseDelay: number = 0
) => ({
  opacity: 0,
  transform: 'translateX(-30px)',
  animation: `slideInLeft ${duration}ms ${EASING.easeOut} ${getStaggerDelay(index, baseDelay)}ms forwards`,
});

/**
 * Creates CSS animation styles for slide-in from right with stagger
 * @param index - Element index for stagger calculation
 * @param duration - Animation duration in milliseconds
 * @param baseDelay - Base delay before animation starts
 * @returns CSS style object
 */
export const createSlideInRightAnimation = (
  index: number = 0,
  duration: number = ANIMATION_DURATION.normal,
  baseDelay: number = 0
) => ({
  opacity: 0,
  transform: 'translateX(30px)',
  animation: `slideInRight ${duration}ms ${EASING.easeOut} ${getStaggerDelay(index, baseDelay)}ms forwards`,
});

/**
 * Creates CSS animation styles for scale-in with stagger
 * @param index - Element index for stagger calculation
 * @param duration - Animation duration in milliseconds
 * @param baseDelay - Base delay before animation starts
 * @returns CSS style object
 */
export const createScaleInAnimation = (
  index: number = 0,
  duration: number = ANIMATION_DURATION.normal,
  baseDelay: number = 0
) => ({
  opacity: 0,
  transform: 'scale(0.8)',
  animation: `scaleIn ${duration}ms ${EASING.bounce} ${getStaggerDelay(index, baseDelay)}ms forwards`,
});

/**
 * Smooth scroll to element with custom options
 * @param elementId - ID of the target element
 * @param offset - Offset from the top in pixels (useful for fixed headers)
 * @param duration - Scroll duration in milliseconds
 */
export const smoothScrollToElement = (
  elementId: string,
  offset: number = 0,
  duration: number = 800
): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID "${elementId}" not found`);
    return;
  }

  const targetPosition = element.offsetTop - offset;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function for smooth scroll
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + (distance * ease));

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Easing function for smooth scroll animation
 * @param t - Progress value between 0 and 1
 * @returns Eased value
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

/**
 * Smooth scroll to top of page
 * @param duration - Scroll duration in milliseconds
 */
export const smoothScrollToTop = (duration: number = 800): void => {
  const startPosition = window.scrollY;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = easeInOutCubic(progress);
    window.scrollTo(0, startPosition * (1 - ease));

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Creates a debounced version of a function
 * Useful for scroll and resize event handlers
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Creates a throttled version of a function
 * Useful for scroll event handlers that need regular updates
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Checks if user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Creates animation styles that respect user's motion preferences
 * @param animationStyles - Animation styles to apply
 * @param fallbackStyles - Fallback styles for reduced motion
 * @returns Appropriate styles based on user preference
 */
export const createAccessibleAnimation = (
  animationStyles: React.CSSProperties,
  fallbackStyles: React.CSSProperties = {}
): React.CSSProperties => {
  if (prefersReducedMotion()) {
    return {
      ...fallbackStyles,
      opacity: 1,
      transform: 'none',
    };
  }
  return animationStyles;
};

/**
 * Animation class names for Tailwind CSS animations
 * These can be used with intersection observer for scroll-triggered animations
 */
export const ANIMATION_CLASSES = {
  fadeInUp: 'animate-fade-in-up',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  spin: 'animate-spin',
} as const;

/**
 * Creates a staggered animation class with CSS custom properties
 * @param index - Element index for stagger calculation
 * @param animationType - Type of animation to apply
 * @param baseDelay - Base delay in milliseconds
 * @param increment - Delay increment between elements
 * @returns CSS class string with custom properties
 */
export const createStaggeredAnimationClass = (
  index: number,
  animationType: keyof typeof ANIMATION_CLASSES,
  baseDelay: number = 0,
  increment: number = 100
): string => {
  const delay = getStaggerDelay(index, baseDelay, increment);
  return `${ANIMATION_CLASSES[animationType]} [animation-delay:${delay}ms]`;
};

/**
 * Utility to create intersection observer options for animations
 * @param threshold - Intersection threshold (0-1)
 * @param rootMargin - Root margin for early/late triggering
 * @returns IntersectionObserver options
 */
export const createIntersectionObserverOptions = (
  threshold: number = 0.1,
  rootMargin: string = '0px 0px -50px 0px'
): IntersectionObserverInit => ({
  threshold,
  rootMargin,
});

/**
 * Utility function to add animation classes when element enters viewport
 * @param entries - IntersectionObserver entries
 * @param animationClass - CSS class to add for animation
 */
export const handleIntersectionAnimation = (
  entries: IntersectionObserverEntry[],
  animationClass: string = 'animate-fade-in-up'
): void => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add(animationClass);
      // Optionally unobserve after animation to improve performance
      // observer.unobserve(entry.target);
    }
  });
};