/**
 * Tests for AnimationOptimizer component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimationOptimizer, { 
  withAnimationOptimization, 
  usePerformanceAwareVariants,
  useSmartIntersection,
  PerformanceStaggerContainer
} from '../AnimationOptimizer';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

// Mock the hooks
jest.mock('../../../hooks/useReducedMotion');
jest.mock('../../../utils/performance');
jest.mock('../../../utils/accessibility');

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('AnimationOptimizer', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
    
    // Mock performance monitor
    jest.doMock('../../../utils/performance', () => ({
      performanceMonitor: {
        startMonitoring: jest.fn(),
        stopMonitoring: jest.fn(),
        onFPSUpdate: jest.fn().mockReturnValue(jest.fn()),
        getCurrentFPS: jest.fn().mockReturnValue(60)
      },
      GPUAcceleration: {
        enable: jest.fn(),
        disable: jest.fn()
      }
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children normally when animations are enabled', () => {
    render(
      <AnimationOptimizer>
        <div data-testid="test-content">Test Content</div>
      </AnimationOptimizer>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should provide alternative feedback when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <AnimationOptimizer>
        <div data-testid="test-content">Test Content</div>
      </AnimationOptimizer>
    );

    const container = screen.getByTestId('test-content').parentElement;
    expect(container).toHaveClass('transition-colors');
  });

  it('should render fallback component when provided and reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);
    
    const FallbackComponent = () => <div data-testid="fallback">Fallback Content</div>;

    render(
      <AnimationOptimizer fallbackComponent={FallbackComponent}>
        <div data-testid="test-content">Test Content</div>
      </AnimationOptimizer>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <AnimationOptimizer className="custom-class">
        <div data-testid="test-content">Test Content</div>
      </AnimationOptimizer>
    );

    const container = screen.getByTestId('test-content').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});

describe('withAnimationOptimization', () => {
  it('should wrap component with AnimationOptimizer', () => {
    const TestComponent = ({ text }: { text: string }) => (
      <div data-testid="wrapped-component">{text}</div>
    );

    const OptimizedComponent = withAnimationOptimization(TestComponent);

    render(<OptimizedComponent text="Test Text" />);

    expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('should set correct displayName', () => {
    const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;
    TestComponent.displayName = 'TestComponent';

    const OptimizedComponent = withAnimationOptimization(TestComponent);

    expect(OptimizedComponent.displayName).toBe('withAnimationOptimization(TestComponent)');
  });
});

describe('PerformanceStaggerContainer', () => {
  it('should render children without animation when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <PerformanceStaggerContainer>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </PerformanceStaggerContainer>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <PerformanceStaggerContainer className="stagger-container">
        <div data-testid="child">Child</div>
      </PerformanceStaggerContainer>
    );

    const container = screen.getByTestId('child').parentElement;
    expect(container).toHaveClass('stagger-container');
  });

  it('should render with motion.div when animations are enabled', () => {
    mockUseReducedMotion.mockReturnValue(false);

    render(
      <PerformanceStaggerContainer>
        <div data-testid="child">Child</div>
      </PerformanceStaggerContainer>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

// Integration test for useSmartIntersection hook
describe('useSmartIntersection', () => {
  it('should provide intersection observer functionality', () => {
    let hookResult: any;

    const TestComponent = () => {
      hookResult = useSmartIntersection();
      return <div ref={hookResult.elementRef} data-testid="observed-element">Test</div>;
    };

    render(<TestComponent />);

    expect(hookResult.isIntersecting).toBe(false);
    expect(hookResult.hasIntersected).toBe(false);
    expect(hookResult.elementRef).toBeDefined();
  });
});

// Integration test for usePerformanceAwareVariants hook
describe('usePerformanceAwareVariants', () => {
  it('should return optimized variants based on performance settings', () => {
    let hookResult: any;

    const variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const TestComponent = () => {
      hookResult = usePerformanceAwareVariants(variants);
      return <div data-testid="test">Test</div>;
    };

    render(<TestComponent />);

    expect(hookResult).toBeDefined();
    expect(hookResult.hidden).toBeDefined();
    expect(hookResult.visible).toBeDefined();
  });

  it('should return reduced motion variants when preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);
    
    let hookResult: any;

    const variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const TestComponent = () => {
      hookResult = usePerformanceAwareVariants(variants);
      return <div data-testid="test">Test</div>;
    };

    render(<TestComponent />);

    expect(hookResult.visible.transition.duration).toBe(0.01);
    expect(hookResult.visible.transition.ease).toBe('linear');
  });
});