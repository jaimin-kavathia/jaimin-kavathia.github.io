/**
 * Cross-browser testing utilities for animation compatibility and performance
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  frameDrops: number;
  memoryUsage: number;
  animationDuration: number;
  timestamp: number;
}

export interface AnimationSupport {
  framerMotion: boolean;
  cssTransforms: boolean;
  cssAnimations: boolean;
  webAnimationsAPI: boolean;
  intersectionObserver: boolean;
  requestAnimationFrame: boolean;
}

/**
 * Detect browser information
 */
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  let name = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  
  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Gecko';
  }
  // Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'WebKit';
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  }
  
  const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  return {
    name,
    version,
    engine,
    platform,
    mobile
  };
};

/**
 * Check animation feature support
 */
export const checkAnimationSupport = (): AnimationSupport => {
  const testElement = document.createElement('div');
  
  return {
    framerMotion: typeof window !== 'undefined' && 'requestAnimationFrame' in window,
    cssTransforms: 'transform' in testElement.style || 'webkitTransform' in testElement.style,
    cssAnimations: 'animation' in testElement.style || 'webkitAnimation' in testElement.style,
    webAnimationsAPI: 'animate' in testElement,
    intersectionObserver: 'IntersectionObserver' in window,
    requestAnimationFrame: 'requestAnimationFrame' in window
  };
};

/**
 * Performance monitoring for animations
 */
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private frameDrops = 0;
  private isMonitoring = false;
  private animationId: number | null = null;
  private metrics: PerformanceMetrics[] = [];
  
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.frameDrops = 0;
    this.metrics = [];
    
    this.monitor();
  }
  
  stop(): PerformanceMetrics {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    const avgFps = this.metrics.reduce((sum, m) => sum + m.fps, 0) / this.metrics.length || 0;
    const totalFrameDrops = this.metrics.reduce((sum, m) => sum + m.frameDrops, 0);
    const avgMemory = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length || 0;
    
    return {
      fps: avgFps,
      frameDrops: totalFrameDrops,
      memoryUsage: avgMemory,
      animationDuration: performance.now() - this.lastTime,
      timestamp: Date.now()
    };
  }
  
  private monitor = (): void => {
    if (!this.isMonitoring) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    
    // Calculate FPS every second
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      
      // Detect frame drops (below 55fps is considered a drop)
      if (this.fps < 55) {
        this.frameDrops++;
      }
      
      // Get memory usage if available
      const memoryUsage = (performance as any).memory 
        ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 
        : 0;
      
      this.metrics.push({
        fps: this.fps,
        frameDrops: this.frameDrops,
        memoryUsage,
        animationDuration: currentTime - this.lastTime,
        timestamp: Date.now()
      });
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame(this.monitor);
  };
  
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

/**
 * Test animation performance across different scenarios
 */
export const testAnimationPerformance = async (
  animationCallback: () => void,
  duration: number = 5000
): Promise<PerformanceMetrics> => {
  const monitor = new AnimationPerformanceMonitor();
  
  monitor.start();
  animationCallback();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const metrics = monitor.stop();
      resolve(metrics);
    }, duration);
  });
};

/**
 * Generate browser compatibility report
 */
export const generateCompatibilityReport = (): {
  browser: BrowserInfo;
  support: AnimationSupport;
  recommendations: string[];
} => {
  const browser = detectBrowser();
  const support = checkAnimationSupport();
  const recommendations: string[] = [];
  
  // Generate recommendations based on browser and support
  if (!support.intersectionObserver) {
    recommendations.push('Consider using a polyfill for IntersectionObserver');
  }
  
  if (!support.webAnimationsAPI) {
    recommendations.push('Fallback to CSS animations for better compatibility');
  }
  
  if (browser.mobile) {
    recommendations.push('Reduce animation complexity for mobile devices');
    recommendations.push('Use transform3d for hardware acceleration');
  }
  
  if (browser.name === 'Safari' && parseInt(browser.version) < 14) {
    recommendations.push('Test backdrop-filter support carefully');
  }
  
  if (browser.name === 'Firefox') {
    recommendations.push('Test CSS clip-path animations');
  }
  
  return {
    browser,
    support,
    recommendations
  };
};

/**
 * Accessibility testing utilities
 */
export const testAccessibilityFeatures = (): {
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorContrast: boolean;
} => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Basic screen reader detection (not 100% accurate)
  const screenReader = !!(
    navigator.userAgent.includes('NVDA') ||
    navigator.userAgent.includes('JAWS') ||
    navigator.userAgent.includes('VoiceOver') ||
    window.speechSynthesis
  );
  
  // Test keyboard navigation support
  const keyboardNavigation = 'tabIndex' in document.createElement('div');
  
  // Test focus-visible support
  const focusVisible = CSS.supports('selector(:focus-visible)');
  
  // Basic color contrast check (simplified)
  const colorContrast = window.getComputedStyle(document.body).color !== 'rgb(0, 0, 0)';
  
  return {
    reducedMotion,
    screenReader,
    keyboardNavigation,
    focusVisible,
    colorContrast
  };
};

/**
 * Run comprehensive animation tests
 */
export const runAnimationTests = async (): Promise<{
  compatibility: ReturnType<typeof generateCompatibilityReport>;
  accessibility: ReturnType<typeof testAccessibilityFeatures>;
  performance: PerformanceMetrics;
}> => {
  const compatibility = generateCompatibilityReport();
  const accessibility = testAccessibilityFeatures();
  
  // Run a basic performance test
  const performance = await testAnimationPerformance(() => {
    // Simulate some animations
    const element = document.createElement('div');
    element.style.transform = 'translateX(100px)';
    element.style.transition = 'transform 0.3s ease';
    document.body.appendChild(element);
    
    setTimeout(() => {
      element.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      document.body.removeChild(element);
    }, 500);
  }, 2000);
  
  return {
    compatibility,
    accessibility,
    performance
  };
};