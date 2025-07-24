/**
 * Mobile optimization utilities for portfolio website
 * Handles device-specific optimizations and mobile-first enhancements
 */

export interface MobileOptimizationResult {
  test: string;
  applied: boolean;
  message: string;
  details?: any;
}

/**
 * Applies mobile-specific optimizations
 */
export const applyMobileOptimizations = (): MobileOptimizationResult[] => {
  const results: MobileOptimizationResult[] = [];
  
  try {
    // Optimize touch interactions
    const touchOptimization = optimizeTouchInteractions();
    results.push(touchOptimization);
    
    // Optimize viewport handling
    const viewportOptimization = optimizeViewport();
    results.push(viewportOptimization);
    
    // Optimize performance for mobile
    const performanceOptimization = optimizeMobilePerformance();
    results.push(performanceOptimization);
    
    // Optimize animations for mobile
    const animationOptimization = optimizeMobileAnimations();
    results.push(animationOptimization);
    
  } catch (error) {
    results.push({
      test: 'Mobile Optimization',
      applied: false,
      message: `Error applying mobile optimizations: ${error}`,
      details: { error }
    });
  }
  
  return results;
};

/**
 * Optimizes touch interactions for mobile devices
 */
const optimizeTouchInteractions = (): MobileOptimizationResult => {
  try {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      return {
        test: 'Touch Interaction Optimization',
        applied: false,
        message: 'Not a touch device, skipping touch optimizations'
      };
    }
    
    // Add touch-friendly classes to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');
    let optimizedElements = 0;
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      
      // Ensure minimum touch target size (44x44px)
      if (rect.width < 44 || rect.height < 44) {
        element.classList.add('touch-target-optimized');
        optimizedElements++;
      }
      
      // Add touch feedback
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
    
    // Add CSS for touch optimizations
    const touchStyles = document.createElement('style');
    touchStyles.textContent = `
      .touch-target-optimized {
        min-width: 44px !important;
        min-height: 44px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .touch-active {
        opacity: 0.7 !important;
        transform: scale(0.95) !important;
        transition: all 0.1s ease !important;
      }
      
      @media (hover: none) and (pointer: coarse) {
        button:hover, a:hover {
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(touchStyles);
    
    return {
      test: 'Touch Interaction Optimization',
      applied: true,
      message: `Optimized ${optimizedElements} touch targets and added touch feedback`,
      details: { optimizedElements, totalElements: interactiveElements.length }
    };
    
  } catch (error) {
    return {
      test: 'Touch Interaction Optimization',
      applied: false,
      message: `Error optimizing touch interactions: ${error}`,
      details: { error }
    };
  }
};

/**
 * Optimizes viewport handling for mobile devices
 */
const optimizeViewport = (): MobileOptimizationResult => {
  try {
    // Check if viewport meta tag exists and is properly configured
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set optimal viewport configuration
    const optimalViewport = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    viewportMeta.content = optimalViewport;
    
    // Prevent horizontal scrolling
    const preventHorizontalScroll = document.createElement('style');
    preventHorizontalScroll.textContent = `
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
      
      img, video, iframe {
        max-width: 100% !important;
        height: auto !important;
      }
    `;
    document.head.appendChild(preventHorizontalScroll);
    
    return {
      test: 'Viewport Optimization',
      applied: true,
      message: 'Viewport meta tag optimized and horizontal scroll prevented',
      details: { viewportContent: optimalViewport }
    };
    
  } catch (error) {
    return {
      test: 'Viewport Optimization',
      applied: false,
      message: `Error optimizing viewport: ${error}`,
      details: { error }
    };
  }
};

/**
 * Optimizes performance specifically for mobile devices
 */
const optimizeMobilePerformance = (): MobileOptimizationResult => {
  try {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      return {
        test: 'Mobile Performance Optimization',
        applied: false,
        message: 'Not on mobile device, skipping mobile-specific optimizations'
      };
    }
    
    let optimizations = 0;
    
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
        optimizations++;
      }
    });
    
    // Reduce animation complexity on mobile
    const mobileAnimationStyles = document.createElement('style');
    mobileAnimationStyles.textContent = `
      @media (max-width: 768px) {
        * {
          animation-duration: 0.3s !important;
          transition-duration: 0.3s !important;
        }
        
        .animate-pulse {
          animation-duration: 2s !important;
        }
        
        /* Reduce blur effects on mobile for better performance */
        .backdrop-blur-md {
          backdrop-filter: blur(8px) !important;
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px) !important;
        }
      }
    `;
    document.head.appendChild(mobileAnimationStyles);
    
    // Optimize font loading for mobile
    const fontOptimization = document.createElement('style');
    fontOptimization.textContent = `
      @media (max-width: 768px) {
        body {
          font-display: swap;
        }
      }
    `;
    document.head.appendChild(fontOptimization);
    
    return {
      test: 'Mobile Performance Optimization',
      applied: true,
      message: `Applied mobile performance optimizations: ${optimizations} images lazy loaded, animations optimized`,
      details: { lazyImages: optimizations }
    };
    
  } catch (error) {
    return {
      test: 'Mobile Performance Optimization',
      applied: false,
      message: `Error optimizing mobile performance: ${error}`,
      details: { error }
    };
  }
};

/**
 * Optimizes animations for mobile devices
 */
const optimizeMobileAnimations = (): MobileOptimizationResult => {
  try {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      const reducedMotionStyles = document.createElement('style');
      reducedMotionStyles.textContent = `
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `;
      document.head.appendChild(reducedMotionStyles);
      
      return {
        test: 'Mobile Animation Optimization',
        applied: true,
        message: 'Reduced motion preferences detected and applied',
        details: { reducedMotion: true }
      };
    }
    
    // Optimize animations for mobile performance
    const mobileAnimationOptimization = document.createElement('style');
    mobileAnimationOptimization.textContent = `
      @media (max-width: 768px) {
        /* Use transform and opacity for better performance */
        .animate-fadeInUp {
          transform: translateY(20px);
          opacity: 0;
          animation: mobileSlideUp 0.6s ease-out forwards;
        }
        
        @keyframes mobileSlideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        /* Optimize scroll-triggered animations */
        .intersection-animate {
          will-change: transform, opacity;
        }
        
        /* Reduce complex animations on mobile */
        .complex-animation {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(mobileAnimationOptimization);
    
    return {
      test: 'Mobile Animation Optimization',
      applied: true,
      message: 'Mobile animation optimizations applied for better performance',
      details: { reducedMotion: false, optimized: true }
    };
    
  } catch (error) {
    return {
      test: 'Mobile Animation Optimization',
      applied: false,
      message: `Error optimizing mobile animations: ${error}`,
      details: { error }
    };
  }
};

/**
 * Tests mobile-specific functionality
 */
export const testMobileFunctionality = (): MobileOptimizationResult[] => {
  const results: MobileOptimizationResult[] = [];
  
  try {
    const isMobile = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Test mobile navigation
    if (isMobile) {
      const mobileMenu = document.querySelector('[data-mobile-menu], .mobile-menu, button[aria-expanded]');
      results.push({
        test: 'Mobile Navigation Test',
        applied: !!mobileMenu,
        message: mobileMenu ? 'Mobile navigation found' : 'Mobile navigation not found'
      });
    }
    
    // Test touch targets
    if (isTouchDevice) {
      const interactiveElements = document.querySelectorAll('button, a, input, textarea');
      let adequateTouchTargets = 0;
      
      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width >= 44 && rect.height >= 44) {
          adequateTouchTargets++;
        }
      });
      
      const touchTargetRatio = adequateTouchTargets / interactiveElements.length;
      results.push({
        test: 'Touch Target Size Test',
        applied: touchTargetRatio >= 0.9,
        message: `${Math.round(touchTargetRatio * 100)}% of touch targets meet minimum size requirements`,
        details: { adequate: adequateTouchTargets, total: interactiveElements.length }
      });
    }
    
    // Test responsive images
    const images = document.querySelectorAll('img');
    let responsiveImages = 0;
    
    images.forEach(img => {
      const styles = window.getComputedStyle(img);
      if (styles.maxWidth === '100%' || img.hasAttribute('loading')) {
        responsiveImages++;
      }
    });
    
    const responsiveImageRatio = responsiveImages / images.length;
    results.push({
      test: 'Responsive Images Test',
      applied: responsiveImageRatio >= 0.8,
      message: `${Math.round(responsiveImageRatio * 100)}% of images are responsive`,
      details: { responsive: responsiveImages, total: images.length }
    });
    
    // Test form usability on mobile
    if (isMobile) {
      const form = document.querySelector('form');
      if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        let mobileOptimizedInputs = 0;
        
        inputs.forEach(input => {
          const styles = window.getComputedStyle(input);
          const fontSize = parseFloat(styles.fontSize);
          if (fontSize >= 16) { // Prevents zoom on iOS
            mobileOptimizedInputs++;
          }
        });
        
        const inputOptimizationRatio = mobileOptimizedInputs / inputs.length;
        results.push({
          test: 'Mobile Form Optimization Test',
          applied: inputOptimizationRatio >= 0.9,
          message: `${Math.round(inputOptimizationRatio * 100)}% of form inputs are mobile-optimized`,
          details: { optimized: mobileOptimizedInputs, total: inputs.length }
        });
      }
    }
    
  } catch (error) {
    results.push({
      test: 'Mobile Functionality Tests',
      applied: false,
      message: `Error testing mobile functionality: ${error}`,
      details: { error }
    });
  }
  
  return results;
};

/**
 * Runs comprehensive mobile optimization
 */
export const runMobileOptimization = (): {
  optimizations: MobileOptimizationResult[];
  tests: MobileOptimizationResult[];
  summary: {
    totalOptimizations: number;
    appliedOptimizations: number;
    totalTests: number;
    passedTests: number;
    overallSuccess: boolean;
  };
} => {
  const optimizations = applyMobileOptimizations();
  const tests = testMobileFunctionality();
  
  const appliedOptimizations = optimizations.filter(opt => opt.applied).length;
  const passedTests = tests.filter(test => test.applied).length;
  
  return {
    optimizations,
    tests,
    summary: {
      totalOptimizations: optimizations.length,
      appliedOptimizations,
      totalTests: tests.length,
      passedTests,
      overallSuccess: appliedOptimizations >= optimizations.length * 0.8 && passedTests >= tests.length * 0.8
    }
  };
};

/**
 * Logs mobile optimization results
 */
export const logMobileOptimizationResults = (results: ReturnType<typeof runMobileOptimization>): void => {
  console.group('📱 Mobile Optimization Results');
  
  console.group('🔧 Applied Optimizations');
  results.optimizations.forEach(opt => {
    const icon = opt.applied ? '✅' : '❌';
    console.log(`${icon} ${opt.test}: ${opt.message}`);
    if (opt.details) {
      console.log('   Details:', opt.details);
    }
  });
  console.groupEnd();
  
  console.group('🧪 Mobile Tests');
  results.tests.forEach(test => {
    const icon = test.applied ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
    if (test.details) {
      console.log('   Details:', test.details);
    }
  });
  console.groupEnd();
  
  console.group('📊 Summary');
  console.log(`Optimizations Applied: ${results.summary.appliedOptimizations}/${results.summary.totalOptimizations}`);
  console.log(`Tests Passed: ${results.summary.passedTests}/${results.summary.totalTests}`);
  console.log(`Overall Success: ${results.summary.overallSuccess ? 'Yes' : 'No'}`);
  console.groupEnd();
  
  console.groupEnd();
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).mobileOptimization = {
    runMobileOptimization,
    logMobileOptimizationResults,
    applyMobileOptimizations,
    testMobileFunctionality
  };
}