/**
 * Performance optimization utilities for animations and interactions
 */

/**
 * Performance monitoring and optimization utilities
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private isMonitoring = false;
  private callbacks: Array<(fps: number) => void> = [];
  private animationId: number | null = null;

  /**
   * Start monitoring frame rate
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    
    const monitor = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.callbacks.forEach(callback => callback(this.fps));
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      if (this.isMonitoring) {
        this.animationId = requestAnimationFrame(monitor);
      }
    };
    
    this.animationId = requestAnimationFrame(monitor);
  }

  /**
   * Stop monitoring frame rate
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fps;
  }

  /**
   * Add callback for FPS updates
   */
  onFPSUpdate(callback: (fps: number) => void): () => void {
    this.callbacks.push(callback);
    
    // Return cleanup function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Check if performance is good (>= 50 FPS)
   */
  isPerformanceGood(): boolean {
    return this.fps >= 50;
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Intersection Observer manager for performance optimization
 */
export class IntersectionManager {
  private observers = new Map<string, IntersectionObserver>();
  private elements = new Map<Element, Set<string>>();

  /**
   * Create or get an intersection observer
   */
  getObserver(
    key: string,
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });
      this.observers.set(key, observer);
    }
    
    return this.observers.get(key)!;
  }

  /**
   * Observe an element with a specific observer
   */
  observe(element: Element, observerKey: string): void {
    const observer = this.observers.get(observerKey);
    if (observer) {
      observer.observe(element);
      
      if (!this.elements.has(element)) {
        this.elements.set(element, new Set());
      }
      this.elements.get(element)!.add(observerKey);
    }
  }

  /**
   * Unobserve an element from a specific observer
   */
  unobserve(element: Element, observerKey: string): void {
    const observer = this.observers.get(observerKey);
    if (observer) {
      observer.unobserve(element);
      
      const elementObservers = this.elements.get(element);
      if (elementObservers) {
        elementObservers.delete(observerKey);
        if (elementObservers.size === 0) {
          this.elements.delete(element);
        }
      }
    }
  }

  /**
   * Cleanup all observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.elements.clear();
  }
}

/**
 * Global intersection manager instance
 */
export const intersectionManager = new IntersectionManager();

/**
 * GPU acceleration utilities
 */
export const GPUAcceleration = {
  /**
   * Apply GPU acceleration to an element
   */
  enable(element: HTMLElement): void {
    element.style.transform = element.style.transform || 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
  },

  /**
   * Remove GPU acceleration from an element
   */
  disable(element: HTMLElement): void {
    element.style.willChange = 'auto';
    if (element.style.transform === 'translateZ(0)') {
      element.style.transform = '';
    }
  },

  /**
   * Temporarily enable GPU acceleration for an animation
   */
  enableForAnimation(element: HTMLElement, duration: number = 1000): void {
    this.enable(element);
    setTimeout(() => this.disable(element), duration);
  }
};

/**
 * Memory management utilities
 */
export const MemoryManager = {
  /**
   * Cleanup function registry
   */
  cleanupFunctions: new Set<() => void>(),

  /**
   * Register a cleanup function
   */
  registerCleanup(cleanup: () => void): void {
    this.cleanupFunctions.add(cleanup);
  },

  /**
   * Unregister a cleanup function
   */
  unregisterCleanup(cleanup: () => void): void {
    this.cleanupFunctions.delete(cleanup);
  },

  /**
   * Run all cleanup functions
   */
  cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    });
    this.cleanupFunctions.clear();
  },

  /**
   * Debounce function for performance optimization
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    const debounced = (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
    
    // Register cleanup
    this.registerCleanup(() => clearTimeout(timeout));
    
    return debounced;
  },

  /**
   * Throttle function for performance optimization
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

/**
 * Animation performance utilities
 */
export const AnimationPerformance = {
  /**
   * Check if device supports smooth animations
   */
  canHandleSmoothAnimations(): boolean {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    
    // Check device capabilities
    const isMobile = window.innerWidth <= 768;
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    const hasSlowConnection = (navigator as any).connection && 
      ((navigator as any).connection.effectiveType === 'slow-2g' || 
       (navigator as any).connection.effectiveType === '2g');
    
    return !isMobile && !hasLowMemory && !hasSlowConnection;
  },

  /**
   * Get optimal animation settings based on device capabilities
   */
  getOptimalSettings(): {
    duration: { fast: number; normal: number; slow: number };
    stagger: number;
    complexity: 'low' | 'medium' | 'high';
    particleCount: number;
  } {
    const canHandle = this.canHandleSmoothAnimations();
    const isMobile = window.innerWidth <= 768;
    
    if (!canHandle) {
      return {
        duration: { fast: 0.01, normal: 0.01, slow: 0.01 },
        stagger: 0,
        complexity: 'low',
        particleCount: 0
      };
    }
    
    if (isMobile) {
      return {
        duration: { fast: 0.2, normal: 0.4, slow: 0.6 },
        stagger: 0.05,
        complexity: 'medium',
        particleCount: 20
      };
    }
    
    return {
      duration: { fast: 0.3, normal: 0.6, slow: 1.0 },
      stagger: 0.1,
      complexity: 'high',
      particleCount: 50
    };
  },

  /**
   * Optimize animation for current performance
   */
  optimizeForPerformance<T extends Record<string, any>>(
    variants: T,
    fallbackVariants?: Partial<T>
  ): T {
    const settings = this.getOptimalSettings();
    
    if (settings.complexity === 'low') {
      // Return simplified variants for low-end devices
      const simplified = Object.keys(variants).reduce((acc, key) => {
        acc[key] = {
          opacity: variants[key].opacity ?? 1,
          transition: { duration: 0.01, ease: 'linear' }
        };
        return acc;
      }, {} as any);
      
      return { ...simplified, ...fallbackVariants } as T;
    }
    
    // Adjust durations based on device capabilities
    const optimized = Object.keys(variants).reduce((acc, key) => {
      const variant = variants[key];
      if (variant.transition) {
        acc[key] = {
          ...variant,
          transition: {
            ...variant.transition,
            duration: variant.transition.duration * (settings.complexity === 'medium' ? 0.7 : 1)
          }
        };
      } else {
        acc[key] = variant;
      }
      return acc;
    }, {} as any);
    
    return optimized as T;
  }
};

/**
 * Initialize performance monitoring and optimization
 */
export const initializePerformanceOptimization = (): void => {
  // Start performance monitoring in development
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.startMonitoring();
    
    performanceMonitor.onFPSUpdate((fps) => {
      if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}fps`);
      }
    });
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.stopMonitoring();
    intersectionManager.cleanup();
    MemoryManager.cleanup();
  });
  
  // Monitor memory usage
  if ('memory' in performance) {
    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1048576;
      const totalMB = memory.totalJSHeapSize / 1048576;
      
      if (usedMB / totalMB > 0.8) {
        console.warn(`High memory usage: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB`);
      }
    };
    
    // Check memory every 30 seconds
    const memoryInterval = setInterval(checkMemory, 30000);
    MemoryManager.registerCleanup(() => clearInterval(memoryInterval));
  }
};

/**
 * Lazy loading utilities for performance
 */
export const LazyLoading = {
  /**
   * Create a lazy-loaded component wrapper
   */
  createLazyComponent<T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ): React.LazyExoticComponent<T> {
    const LazyComponent = React.lazy(importFn);
    
    if (fallback) {
      return React.lazy(async () => {
        try {
          return await importFn();
        } catch (error) {
          console.warn('Failed to load component, using fallback:', error);
          return { default: fallback as T };
        }
      });
    }
    
    return LazyComponent;
  },

  /**
   * Preload a component
   */
  preloadComponent(importFn: () => Promise<any>): void {
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      importFn().catch(error => {
        console.warn('Failed to preload component:', error);
      });
    }, 100);
  }
};

// Import React for lazy loading utilities
import React from 'react';