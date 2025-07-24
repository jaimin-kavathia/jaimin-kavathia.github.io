/**
 * Performance optimization hook for animations and interactions
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { 
  performanceMonitor, 
  GPUAcceleration, 
  AnimationPerformance,
  MemoryManager
} from '../utils/performance';

interface PerformanceSettings {
  enableAnimations: boolean;
  enableComplexAnimations: boolean;
  enableParticles: boolean;
  maxParticleCount: number;
  animationDuration: {
    fast: number;
    normal: number;
    slow: number;
  };
  staggerDelay: number;
  enableGPUAcceleration: boolean;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  isLowPerformance: boolean;
  deviceCapabilities: 'low' | 'medium' | 'high';
}

/**
 * Hook for comprehensive performance optimization
 */
export const usePerformanceOptimization = (options: {
  enableMonitoring?: boolean;
  adaptivePerformance?: boolean;
  memoryThreshold?: number;
} = {}) => {
  const {
    enableMonitoring = true,
    adaptivePerformance = true,
    memoryThreshold = 0.8
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings>(() => 
    getInitialPerformanceSettings()
  );
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false,
    deviceCapabilities: 'high'
  });
  
  const cleanupRef = useRef<(() => void)[]>([]);

  // Initialize performance settings based on device capabilities
  function getInitialPerformanceSettings(): PerformanceSettings {
    const canHandleAnimations = AnimationPerformance.canHandleSmoothAnimations();
    const optimalSettings = AnimationPerformance.getOptimalSettings();
    
    return {
      enableAnimations: canHandleAnimations && !prefersReducedMotion,
      enableComplexAnimations: canHandleAnimations && optimalSettings.complexity === 'high',
      enableParticles: canHandleAnimations && optimalSettings.particleCount > 0,
      maxParticleCount: optimalSettings.particleCount,
      animationDuration: optimalSettings.duration,
      staggerDelay: optimalSettings.stagger,
      enableGPUAcceleration: canHandleAnimations
    };
  }

  // Monitor performance metrics
  useEffect(() => {
    if (!enableMonitoring) return;

    performanceMonitor.startMonitoring();

    const fpsCleanup = performanceMonitor.onFPSUpdate((fps) => {
      setMetrics(prev => ({
        ...prev,
        fps,
        isLowPerformance: fps < 30
      }));

      // Adaptive performance adjustment
      if (adaptivePerformance) {
        if (fps < 30 && performanceSettings.enableComplexAnimations) {
          setPerformanceSettings(prev => ({
            ...prev,
            enableComplexAnimations: false,
            enableParticles: false,
            maxParticleCount: Math.max(10, prev.maxParticleCount / 2)
          }));
        } else if (fps > 50 && !performanceSettings.enableComplexAnimations) {
          const optimalSettings = AnimationPerformance.getOptimalSettings();
          setPerformanceSettings(prev => ({
            ...prev,
            enableComplexAnimations: optimalSettings.complexity === 'high',
            enableParticles: optimalSettings.particleCount > 0,
            maxParticleCount: optimalSettings.particleCount
          }));
        }
      }
    });

    cleanupRef.current.push(fpsCleanup);

    // Monitor memory usage if available
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1048576;
        const totalMB = memory.totalJSHeapSize / 1048576;
        const usage = usedMB / totalMB;

        setMetrics(prev => ({
          ...prev,
          memoryUsage: usage
        }));

        if (usage > memoryThreshold && adaptivePerformance) {
          setPerformanceSettings(prev => ({
            ...prev,
            enableComplexAnimations: false,
            enableParticles: false,
            maxParticleCount: Math.max(5, prev.maxParticleCount / 3)
          }));
        }
      };

      const memoryInterval = setInterval(checkMemory, 5000);
      cleanupRef.current.push(() => clearInterval(memoryInterval));
    }

    return () => {
      performanceMonitor.stopMonitoring();
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
    };
  }, [enableMonitoring, adaptivePerformance, memoryThreshold, performanceSettings.enableComplexAnimations]);

  // GPU acceleration management
  const enableGPUAcceleration = useCallback((element: HTMLElement) => {
    if (performanceSettings.enableGPUAcceleration && !prefersReducedMotion) {
      GPUAcceleration.enable(element);
      
      // Register cleanup
      const cleanup = () => GPUAcceleration.disable(element);
      MemoryManager.registerCleanup(cleanup);
      
      return cleanup;
    }
    return () => {};
  }, [performanceSettings.enableGPUAcceleration, prefersReducedMotion]);

  // Optimized animation variants
  const getOptimizedVariants = useCallback(<T extends Record<string, any>>(
    variants: T,
    fallbackVariants?: Partial<T>
  ): T => {
    if (prefersReducedMotion) {
      // Return opacity-only variants for reduced motion
      const reducedVariants = Object.keys(variants).reduce((acc, key) => {
        acc[key] = {
          opacity: variants[key].opacity ?? 1,
          transition: { duration: 0.01, ease: 'linear' }
        };
        return acc;
      }, {} as any);
      
      return { ...reducedVariants, ...fallbackVariants } as T;
    }

    if (!performanceSettings.enableAnimations) {
      return AnimationPerformance.optimizeForPerformance(variants, fallbackVariants);
    }

    // Adjust durations based on current performance settings
    const optimized = Object.keys(variants).reduce((acc, key) => {
      const variant = variants[key];
      if (variant.transition?.duration) {
        const durationMultiplier = performanceSettings.enableComplexAnimations ? 1 : 0.7;
        acc[key] = {
          ...variant,
          transition: {
            ...variant.transition,
            duration: variant.transition.duration * durationMultiplier
          }
        };
      } else {
        acc[key] = variant;
      }
      return acc;
    }, {} as any);

    return optimized as T;
  }, [prefersReducedMotion, performanceSettings]);

  // Performance-aware intersection observer
  const createOptimizedObserver = useCallback((
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    const optimizedOptions = {
      threshold: performanceSettings.enableComplexAnimations ? 0.1 : 0.3,
      rootMargin: performanceSettings.enableComplexAnimations ? '50px' : '100px',
      ...options
    };

    return new IntersectionObserver(callback, optimizedOptions);
  }, [performanceSettings.enableComplexAnimations]);

  // Debounced functions for performance
  const debouncedScrollHandler = useCallback(
    MemoryManager.debounce((handler: () => void) => handler(), 16),
    []
  );

  const throttledResizeHandler = useCallback(
    MemoryManager.throttle((handler: () => void) => handler(), 100),
    []
  );

  return {
    // Performance settings
    settings: performanceSettings,
    metrics,
    
    // Optimization functions
    enableGPUAcceleration,
    getOptimizedVariants,
    createOptimizedObserver,
    
    // Event handlers
    debouncedScrollHandler,
    throttledResizeHandler,
    
    // Manual controls
    updateSettings: setPerformanceSettings,
    
    // Utility functions
    shouldAnimate: performanceSettings.enableAnimations && !prefersReducedMotion,
    shouldUseComplexAnimations: performanceSettings.enableComplexAnimations && !prefersReducedMotion,
    shouldShowParticles: performanceSettings.enableParticles && !prefersReducedMotion
  };
};

/**
 * Hook for element-specific performance optimization
 */
export const useElementPerformanceOptimization = (elementRef: React.RefObject<HTMLElement>) => {
  const { enableGPUAcceleration, settings } = usePerformanceOptimization();
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (settings.enableGPUAcceleration && !isOptimized) {
      const cleanup = enableGPUAcceleration(element);
      setIsOptimized(true);
      
      return () => {
        cleanup();
        setIsOptimized(false);
      };
    }
  }, [elementRef, enableGPUAcceleration, settings.enableGPUAcceleration, isOptimized]);

  return {
    isOptimized,
    settings
  };
};

/**
 * Hook for animation frame management
 */
export const useAnimationFrame = (callback: (deltaTime: number) => void, enabled: boolean = true) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const { shouldAnimate } = usePerformanceOptimization({ enableMonitoring: false });

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    
    if (enabled && shouldAnimate) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [callback, enabled, shouldAnimate]);

  useEffect(() => {
    if (enabled && shouldAnimate) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, enabled, shouldAnimate]);

  const start = useCallback(() => {
    if (!requestRef.current && shouldAnimate) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate, shouldAnimate]);

  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  return { start, stop, isRunning: !!requestRef.current };
};