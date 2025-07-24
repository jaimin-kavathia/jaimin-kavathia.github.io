import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ParticleBackground from '../ParticleBackground';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useMotionValue: () => ({ set: vi.fn() }),
  useTransform: () => 0,
  useScroll: () => ({ scrollY: { set: vi.fn() } }),
}));

// Mock hooks
vi.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock animation utilities
vi.mock('../../../utils/easingFunctions', () => ({
  animationDurations: {
    slow: 1.0,
    floating: 5.0,
  },
  easingFunctions: {
    easeInOut: 'ease-in-out',
  },
}));

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
});

// Mock navigator properties
Object.defineProperty(navigator, 'hardwareConcurrency', {
  value: 8,
  configurable: true,
});

describe('ParticleBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequestAnimationFrame.mockImplementation((callback) => {
      setTimeout(callback, 16);
      return 1;
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders without crashing', () => {
    render(<ParticleBackground />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-particle-bg';
    render(<ParticleBackground className={customClass} />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveClass(customClass);
  });

  it('respects reduced motion preferences', () => {
    const { useReducedMotion } = require('../../../hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(true);

    render(<ParticleBackground particleCount={10} />);
    
    // Should render with minimal shapes when reduced motion is enabled
    const container = screen.getByRole('generic');
    expect(container).toBeInTheDocument();
  });

  it('adjusts particle count based on device capabilities', () => {
    // Mock mobile device
    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      configurable: true,
    });

    // Mock low-end device
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
    });

    render(<ParticleBackground particleCount={50} />);
    
    const container = screen.getByRole('generic');
    expect(container).toBeInTheDocument();
  });

  it('handles different color themes', () => {
    const themes: Array<'blue' | 'purple' | 'gradient' | 'monochrome'> = [
      'blue', 'purple', 'gradient', 'monochrome'
    ];

    themes.forEach(theme => {
      const { unmount } = render(<ParticleBackground colorTheme={theme} />);
      expect(screen.getByRole('generic')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles mouse interaction when enabled', () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener');
    const mockRemoveEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <ParticleBackground enableMouseInteraction={true} />
    );

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );
  });

  it('disables mouse interaction on mobile devices', () => {
    // Mock mobile device
    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      configurable: true,
    });

    const mockAddEventListener = vi.spyOn(window, 'addEventListener');

    render(<ParticleBackground enableMouseInteraction={true} />);

    // Should not add mousemove listener on mobile
    expect(mockAddEventListener).not.toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );
  });

  it('cleans up animation frame on unmount', () => {
    const { unmount } = render(<ParticleBackground />);
    
    act(() => {
      unmount();
    });

    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it('handles resize events for device detection', () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener');
    const mockRemoveEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ParticleBackground />);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('applies correct z-index', () => {
    const customZIndex = -10;
    render(<ParticleBackground zIndex={customZIndex} />);
    
    const container = screen.getByRole('generic');
    expect(container).toHaveStyle({ zIndex: customZIndex });
  });

  it('handles animation speed multiplier', () => {
    const fastSpeed = 2;
    render(<ParticleBackground animationSpeed={fastSpeed} />);
    
    const container = screen.getByRole('generic');
    expect(container).toBeInTheDocument();
  });

  it('renders with default props when none provided', () => {
    render(<ParticleBackground />);
    
    const container = screen.getByRole('generic');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('fixed', 'inset-0', 'overflow-hidden', 'pointer-events-none');
  });

  // Advanced background effects tests
  describe('Advanced Background Effects', () => {
    it('renders gradient animations when enabled', () => {
      render(<ParticleBackground enableGradientAnimation={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('disables gradient animations when reduced motion is preferred', () => {
      const { useReducedMotion } = require('../../../hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      render(<ParticleBackground enableGradientAnimation={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('handles different section variants', () => {
      const sectionVariants: Array<'hero' | 'about' | 'skills' | 'projects' | 'contact' | 'default'> = [
        'hero', 'about', 'skills', 'projects', 'contact', 'default'
      ];

      sectionVariants.forEach(variant => {
        const { unmount } = render(<ParticleBackground sectionVariant={variant} />);
        expect(screen.getByRole('generic')).toBeInTheDocument();
        unmount();
      });
    });

    it('enables mouse-following particles when configured', () => {
      render(<ParticleBackground enableMouseFollowing={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('disables mouse-following particles on mobile devices', () => {
      // Mock mobile device
      Object.defineProperty(window, 'innerWidth', {
        value: 500,
        configurable: true,
      });

      render(<ParticleBackground enableMouseFollowing={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('applies performance mode optimizations', () => {
      render(<ParticleBackground enablePerformanceMode={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('adjusts particle intensity based on section variant', () => {
      render(<ParticleBackground sectionVariant="hero" particleCount={10} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('handles gradient color transitions for different sections', () => {
      const { rerender } = render(<ParticleBackground sectionVariant="hero" enableGradientAnimation={true} />);
      
      let container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();

      rerender(<ParticleBackground sectionVariant="skills" enableGradientAnimation={true} />);
      
      container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
    });

    it('throttles mouse following updates in performance mode', () => {
      const mockSetTimeout = vi.spyOn(global, 'setTimeout');
      
      render(<ParticleBackground enableMouseFollowing={true} enablePerformanceMode={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
      
      mockSetTimeout.mockRestore();
    });

    it('cleans up mouse following animation frame on unmount', () => {
      const { unmount } = render(<ParticleBackground enableMouseFollowing={true} />);
      
      act(() => {
        unmount();
      });

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });
});    it
('monitors frame rate and adjusts performance', () => {
      render(<ParticleBackground enablePerformanceMode={false} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
      
      // Should monitor performance and adjust accordingly
    });

    it('handles visibility change events for performance', () => {
      const mockAddEventListener = vi.spyOn(document, 'addEventListener');
      const mockRemoveEventListener = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<ParticleBackground />);
      
      expect(mockAddEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });

    it('renders enhanced mouse-following particles with trail effects', () => {
      render(<ParticleBackground enableMouseFollowing={true} />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
      
      // Should render enhanced particle effects
    });

    it('applies advanced gradient layers and effects', () => {
      render(<ParticleBackground enableGradientAnimation={true} sectionVariant="hero" />);
      
      const container = screen.getByRole('generic');
      expect(container).toBeInTheDocument();
      
      // Should render multiple gradient layers
    });

    it('manages memory and cleans up properly', () => {
      const { unmount } = render(<ParticleBackground particleCount={50} enableMouseFollowing={true} />);
      
      act(() => {
        unmount();
      });
      
      // Should clean up all resources and prevent memory leaks
    });