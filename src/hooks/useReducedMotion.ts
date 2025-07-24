/**
 * Hook to detect user's reduced motion preference
 * Respects accessibility settings for motion-sensitive users
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook that detects if the user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if the browser supports the media query
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event handler for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook that provides animation-safe values based on reduced motion preference
 * @param normalValue - Value to use when animations are enabled
 * @param reducedValue - Value to use when reduced motion is preferred
 * @returns The appropriate value based on user preference
 */
export const useMotionValue = <T>(normalValue: T, reducedValue: T): T => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedValue : normalValue;
};

/**
 * Hook that provides animation duration based on reduced motion preference
 * @param duration - Normal animation duration in seconds
 * @returns Duration (0.01 for reduced motion, original for normal)
 */
export const useAnimationDuration = (duration: number): number => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0.01 : duration;
};

/**
 * Hook that provides transition configuration respecting reduced motion
 * @param transition - Normal transition configuration
 * @returns Transition config (instant for reduced motion, original for normal)
 */
export const useAnimationTransition = (transition: Record<string, unknown>): Record<string, unknown> => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return {
      duration: 0.01,
      ease: "linear"
    };
  }
  
  return transition;
};

/**
 * Hook that provides safe animation variants respecting reduced motion
 * @param normalVariants - Normal animation variants
 * @param reducedVariants - Optional reduced motion variants (defaults to opacity-only)
 * @returns Appropriate variants based on user preference
 */
export const useAccessibleVariants = <T extends Record<string, any>>(
  normalVariants: T,
  reducedVariants?: Partial<T>
): T => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    // Default reduced motion variants - only opacity changes
    const defaultReduced = Object.keys(normalVariants).reduce((acc, key) => {
      acc[key] = {
        opacity: normalVariants[key].opacity ?? 1,
        transition: { duration: 0.01, ease: "linear" }
      };
      return acc;
    }, {} as any);
    
    return { ...defaultReduced, ...reducedVariants } as T;
  }
  
  return normalVariants;
};

/**
 * Hook that provides alternative feedback when animations are disabled
 * @returns Function to trigger alternative feedback
 */
export const useAlternativeFeedback = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (element: HTMLElement | null, type: 'hover' | 'focus' | 'active' = 'hover') => {
    if (!prefersReducedMotion || !element) return;
    
    const feedbackClasses = {
      hover: 'bg-blue-100/20 border-blue-300/50 shadow-md',
      focus: 'ring-2 ring-blue-500 ring-offset-2',
      active: 'bg-blue-200/30 border-blue-400/60'
    };
    
    const originalClasses = element.className;
    element.className += ` ${feedbackClasses[type]}`;
    
    setTimeout(() => {
      element.className = originalClasses;
    }, 200);
  };
};

/**
 * Hook that provides animation-safe scroll behavior
 * @returns Scroll behavior value based on user preference
 */
export const useScrollBehavior = (): 'smooth' | 'auto' => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 'auto' : 'smooth';
};

/**
 * Hook that provides device-appropriate animation settings
 * @returns Object with device-optimized animation settings
 */
export const useDeviceOptimizedAnimation = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
      // Check for battery API to detect low power mode
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setIsLowPowerMode(battery.level < 0.2);
        });
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return {
    shouldAnimate: !prefersReducedMotion && !isLowPowerMode,
    reducedComplexity: isMobile || isLowPowerMode,
    duration: {
      fast: prefersReducedMotion ? 0.01 : (isMobile ? 0.15 : 0.2),
      normal: prefersReducedMotion ? 0.01 : (isMobile ? 0.3 : 0.5),
      slow: prefersReducedMotion ? 0.01 : (isMobile ? 0.5 : 0.8)
    },
    stagger: prefersReducedMotion ? 0 : (isMobile ? 0.05 : 0.1)
  };
};