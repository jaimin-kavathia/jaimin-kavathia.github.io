/**
 * Tests for performance utilities
 */

import { 
  PerformanceMonitor, 
  performanceMonitor,
  IntersectionManager,
  intersectionManager,
  GPUAcceleration,
  MemoryManager,
  AnimationPerformance
} from '../performance';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn();
const mockCancelAnimationFrame = jest.fn();

beforeEach(() => {
  // Reset mocks
  mockRequestAnimationFrame.mockClear();
  mockCancelAnimationFrame.mockClear();

  // Mock global functions
  Object.defineProperty(global, 'requestAnimationFrame', {
    value: mockRequestAnimationFrame.mockImplementation((callback) => {
      setTimeout(callback, 16); // Simulate 60fps
      return 1;
    }),
    writable: true
  });

  Object.defineProperty(global, 'cancelAnimationFrame', {
    value: mockCancelAnimationFrame,
    writable: true
  });

  // Mock performance.now
  Object.defineProperty(global.performance, 'now', {
    value: jest.fn().mockReturnValue(Date.now()),
    writable: true
  });

  // Mock console methods
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  it('should start monitoring', () => {
    monitor.startMonitoring();
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('should stop monitoring', () => {
    monitor.startMonitoring();
    monitor.stopMonitoring();
    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it('should calculate FPS', (done) => {
    const callback = jest.fn();
    monitor.onFPSUpdate(callback);
    monitor.startMonitoring();

    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      monitor.stopMonitoring();
      done();
    }, 100);
  });

  it('should detect good performance', () => {
    // Mock high FPS
    (monitor as any).fps = 60;
    expect(monitor.isPerformanceGood()).toBe(true);

    // Mock low FPS
    (monitor as any).fps = 20;
    expect(monitor.isPerformanceGood()).toBe(false);
  });
});

describe('IntersectionManager', () => {
  let manager: IntersectionManager;
  let mockObserver: jest.Mocked<IntersectionObserver>;

  beforeEach(() => {
    manager = new IntersectionManager();
    
    mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    } as any;

    // Mock IntersectionObserver
    Object.defineProperty(global, 'IntersectionObserver', {
      value: jest.fn().mockImplementation(() => mockObserver),
      writable: true
    });
  });

  it('should create and cache observers', () => {
    const callback = jest.fn();
    const observer1 = manager.getObserver('test', callback);
    const observer2 = manager.getObserver('test', callback);

    expect(observer1).toBe(observer2);
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);
  });

  it('should observe elements', () => {
    const callback = jest.fn();
    const element = document.createElement('div');
    
    manager.getObserver('test', callback);
    manager.observe(element, 'test');

    expect(mockObserver.observe).toHaveBeenCalledWith(element);
  });

  it('should unobserve elements', () => {
    const callback = jest.fn();
    const element = document.createElement('div');
    
    manager.getObserver('test', callback);
    manager.observe(element, 'test');
    manager.unobserve(element, 'test');

    expect(mockObserver.unobserve).toHaveBeenCalledWith(element);
  });

  it('should cleanup all observers', () => {
    const callback = jest.fn();
    manager.getObserver('test1', callback);
    manager.getObserver('test2', callback);
    
    manager.cleanup();

    expect(mockObserver.disconnect).toHaveBeenCalledTimes(2);
  });
});

describe('GPUAcceleration', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it('should enable GPU acceleration', () => {
    GPUAcceleration.enable(element);

    expect(element.style.willChange).toBe('transform, opacity');
    expect(element.style.transform).toContain('translateZ(0)');
  });

  it('should disable GPU acceleration', () => {
    GPUAcceleration.enable(element);
    GPUAcceleration.disable(element);

    expect(element.style.willChange).toBe('auto');
  });

  it('should enable for animation duration', (done) => {
    GPUAcceleration.enableForAnimation(element, 100);

    expect(element.style.willChange).toBe('transform, opacity');

    setTimeout(() => {
      expect(element.style.willChange).toBe('auto');
      done();
    }, 150);
  });
});

describe('MemoryManager', () => {
  it('should register and run cleanup functions', () => {
    const cleanup1 = jest.fn();
    const cleanup2 = jest.fn();

    MemoryManager.registerCleanup(cleanup1);
    MemoryManager.registerCleanup(cleanup2);
    MemoryManager.cleanup();

    expect(cleanup1).toHaveBeenCalled();
    expect(cleanup2).toHaveBeenCalled();
  });

  it('should handle cleanup errors gracefully', () => {
    const errorCleanup = jest.fn().mockImplementation(() => {
      throw new Error('Cleanup error');
    });
    const normalCleanup = jest.fn();

    MemoryManager.registerCleanup(errorCleanup);
    MemoryManager.registerCleanup(normalCleanup);
    
    expect(() => MemoryManager.cleanup()).not.toThrow();
    expect(normalCleanup).toHaveBeenCalled();
  });

  it('should debounce function calls', (done) => {
    const mockFn = jest.fn();
    const debouncedFn = MemoryManager.debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });

  it('should throttle function calls', () => {
    const mockFn = jest.fn();
    const throttledFn = MemoryManager.throttle(mockFn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('AnimationPerformance', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockReturnValue({
        matches: false
      }),
      writable: true
    });

    // Mock navigator properties
    Object.defineProperty(navigator, 'deviceMemory', {
      value: 8,
      writable: true
    });

    Object.defineProperty(navigator, 'connection', {
      value: {
        effectiveType: '4g'
      },
      writable: true
    });
  });

  it('should detect smooth animation capability', () => {
    // Mock high-end device
    Object.defineProperty(window, 'innerWidth', {
      value: 1920,
      writable: true
    });

    expect(AnimationPerformance.canHandleSmoothAnimations()).toBe(true);
  });

  it('should detect reduced motion preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockReturnValue({
        matches: true
      }),
      writable: true
    });

    expect(AnimationPerformance.canHandleSmoothAnimations()).toBe(false);
  });

  it('should provide optimal settings for high-end devices', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1920,
      writable: true
    });

    const settings = AnimationPerformance.getOptimalSettings();

    expect(settings.complexity).toBe('high');
    expect(settings.particleCount).toBe(50);
    expect(settings.duration.normal).toBe(0.6);
  });

  it('should provide optimal settings for mobile devices', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
      writable: true
    });

    const settings = AnimationPerformance.getOptimalSettings();

    expect(settings.complexity).toBe('medium');
    expect(settings.particleCount).toBe(20);
    expect(settings.duration.normal).toBe(0.4);
  });

  it('should optimize variants for performance', () => {
    const variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6 }
      }
    };

    const optimized = AnimationPerformance.optimizeForPerformance(variants);

    expect(optimized).toBeDefined();
    expect(optimized.visible.transition.duration).toBeLessThanOrEqual(0.6);
  });
});