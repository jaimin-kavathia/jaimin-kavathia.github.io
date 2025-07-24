import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useDeviceOptimizedAnimation } from '../../hooks/useReducedMotion';
import { performanceMonitor, GPUAcceleration, AnimationPerformance } from '../../utils/performance';
import { announceAnimationState, provideAlternativeFeedback } from '../../utils/accessibility';

interface AnimationOptimizerProps {
  children: React.ReactNode;
  enablePerformanceMonitoring?: boolean;
  fallbackComponent?: React.ComponentType;
  className?: string;
}

/**
 * Animation optimizer component that automatically adjusts animations
 * based on device capabilities and user preferences
 */
const AnimationOptimizer: React.FC<AnimationOptimizerProps> = ({
  children,
  enablePerformanceMonitoring = false,
  fallbackComponent: FallbackComponent,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();
  const deviceSettings = useDeviceOptimizedAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [performanceIssue, setPerformanceIssue] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    if (!enablePerformanceMonitoring) return;

    // Start monitoring performance
    performanceMonitor.startMonitoring();

    const cleanup = performanceMonitor.onFPSUpdate((fps) => {
      if (fps < 30 && !performanceIssue) {
        setPerformanceIssue(true);
        announceAnimationState('paused', 'due to performance issues');
        console.warn('Performance issue detected, optimizing animations');
      } else if (fps >= 50 && performanceIssue) {
        setPerformanceIssue(false);
        announceAnimationState('started', 'performance restored');
      }
    });

    return () => {
      cleanup();
      performanceMonitor.stopMonitoring();
    };
  }, [enablePerformanceMonitoring, performanceIssue]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Apply GPU acceleration if animations are enabled
    if (deviceSettings.shouldAnimate && !performanceIssue) {
      GPUAcceleration.enable(container);
      setIsOptimized(true);
    } else {
      GPUAcceleration.disable(container);
      setIsOptimized(false);
    }

    return () => {
      GPUAcceleration.disable(container);
    };
  }, [deviceSettings.shouldAnimate, performanceIssue]);

  // Announce optimization state changes
  useEffect(() => {
    if (prefersReducedMotion) {
      announceAnimationState('disabled');
    } else if (performanceIssue) {
      announceAnimationState('paused', 'performance optimization');
    } else if (isOptimized) {
      announceAnimationState('started', 'optimized for device');
    }
  }, [prefersReducedMotion, performanceIssue, isOptimized]);

  // If reduced motion is preferred or performance issues, show fallback
  if (prefersReducedMotion || performanceIssue) {
    if (FallbackComponent) {
      return (
        <div ref={containerRef} className={className}>
          <FallbackComponent />
        </div>
      );
    }

    // Provide static version with alternative feedback
    return (
      <div 
        ref={containerRef} 
        className={`${className} transition-colors duration-200`}
        onMouseEnter={(e) => {
          if (prefersReducedMotion) {
            provideAlternativeFeedback(e.currentTarget, 'hover');
          }
        }}
        onFocus={(e) => {
          if (prefersReducedMotion) {
            provideAlternativeFeedback(e.currentTarget, 'focus');
          }
        }}
      >
        {children}
      </div>
    );
  }

  // Render optimized animations
  return (
    <motion.div
      ref={containerRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: deviceSettings.duration.fast,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationOptimizer;

/**
 * Higher-order component for animation optimization
 */
export const withAnimationOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    enablePerformanceMonitoring?: boolean;
    fallbackComponent?: React.ComponentType<P>;
  } = {}
) => {
  const OptimizedComponent: React.FC<P> = (props) => {
    return (
      <AnimationOptimizer
        enablePerformanceMonitoring={options.enablePerformanceMonitoring}
        fallbackComponent={options.fallbackComponent}
      >
        <Component {...props} />
      </AnimationOptimizer>
    );
  };

  OptimizedComponent.displayName = `withAnimationOptimization(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
};

/**
 * Performance-aware animation variants hook
 */
export const usePerformanceAwareVariants = <T extends Record<string, any>>(
  variants: T,
  fallbackVariants?: Partial<T>
): T => {
  const prefersReducedMotion = useReducedMotion();
  const deviceSettings = useDeviceOptimizedAnimation();
  const [currentVariants, setCurrentVariants] = useState(variants);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Use opacity-only variants for reduced motion
      const reducedVariants = Object.keys(variants).reduce((acc, key) => {
        acc[key] = {
          opacity: variants[key].opacity ?? 1,
          transition: { duration: 0.01, ease: 'linear' }
        };
        return acc;
      }, {} as any);
      
      setCurrentVariants({ ...reducedVariants, ...fallbackVariants } as T);
    } else {
      // Use performance-optimized variants
      const optimized = AnimationPerformance.optimizeForPerformance(variants, fallbackVariants);
      setCurrentVariants(optimized);
    }
  }, [prefersReducedMotion, deviceSettings, variants, fallbackVariants]);

  return currentVariants;
};

/**
 * Smart intersection observer hook for animations
 */
export const useSmartIntersection = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Use optimized intersection observer settings
    const optimizedOptions = {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    };

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      optimizedOptions
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options, hasIntersected]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  };
};

/**
 * Performance-aware stagger container
 */
export const PerformanceStaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay }) => {
  const deviceSettings = useDeviceOptimizedAnimation();
  const prefersReducedMotion = useReducedMotion();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay ?? deviceSettings.stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: deviceSettings.duration.normal,
        ease: 'easeOut'
      }
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};