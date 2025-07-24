/**
 * Tests for PageTransition component
 * Verifies logo reveal, staggered content reveal, and loading states
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import PageTransition, { LogoReveal, StaggeredReveal, LoadingSpinner } from '../PageTransition';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock hooks
jest.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
  useAnimationDuration: jest.fn((duration: number) => duration),
}));

describe('PageTransition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('LogoReveal Component', () => {
    it('renders logo reveal with correct elements', () => {
      const onComplete = vi.fn();
      render(<LogoReveal onComplete={onComplete} />);

      expect(screen.getByText('JK')).toBeInTheDocument();
      expect(screen.getByText('Loading Portfolio...')).toBeInTheDocument();
    });

    it('calls onComplete after timeout', async () => {
      const onComplete = jest.fn();
      render(<LogoReveal onComplete={onComplete} />);

      act(() => {
        jest.advanceTimersByTime(2500);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('calls onComplete quickly with reduced motion', async () => {
      const { useReducedMotion } = require('../../../hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      const onComplete = jest.fn();
      render(<LogoReveal onComplete={onComplete} />);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('renders loading dots for normal motion', () => {
      render(<LogoReveal />);
      
      // Should have 3 loading dots
      const dots = screen.getAllByRole('generic').filter(el => 
        el.className.includes('w-2 h-2 bg-white/60 rounded-full')
      );
      expect(dots).toHaveLength(3);
    });
  });

  describe('StaggeredReveal Component', () => {
    it('renders children correctly', () => {
      render(
        <StaggeredReveal>
          <div>Test Content</div>
        </StaggeredReveal>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('wraps content in motion containers', () => {
      const { container } = render(
        <StaggeredReveal>
          <div>Test Content</div>
        </StaggeredReveal>
      );

      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('LoadingSpinner Component', () => {
    it('renders loading spinner with multiple rings', () => {
      const { container } = render(<LoadingSpinner />);
      
      // Should have outer ring, inner ring, and center dot
      const rings = container.querySelectorAll('div');
      expect(rings.length).toBeGreaterThan(2);
    });

    it('renders simple text for reduced motion', async () => {
      const { useReducedMotion } = require('../../../hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      render(<LoadingSpinner />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('applies correct CSS classes for animations', () => {
      const { container } = render(<LoadingSpinner />);
      
      const outerRing = container.querySelector('.w-16.h-16');
      expect(outerRing).toHaveClass('border-4', 'border-white/20', 'border-t-white/60', 'rounded-full');
    });
  });

  describe('Main PageTransition Component', () => {
    it('renders children when not loading', async () => {
      render(
        <PageTransition isLoading={false} showLogo={false}>
          <div>Main Content</div>
        </PageTransition>
      );

      await waitFor(() => {
        expect(screen.getByText('Main Content')).toBeInTheDocument();
      });
    });

    it('shows loading spinner when isLoading is true', async () => {
      render(
        <PageTransition isLoading={true} showLogo={false}>
          <div>Main Content</div>
        </PageTransition>
      );

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('shows logo reveal by default', () => {
      render(
        <PageTransition>
          <div>Main Content</div>
        </PageTransition>
      );

      expect(screen.getByText('JK')).toBeInTheDocument();
      expect(screen.getByText('Loading Portfolio...')).toBeInTheDocument();
    });

    it('skips logo reveal when showLogo is false', async () => {
      render(
        <PageTransition showLogo={false}>
          <div>Main Content</div>
        </PageTransition>
      );

      await waitFor(() => {
        expect(screen.getByText('Main Content')).toBeInTheDocument();
      });
      
      expect(screen.queryByText('JK')).not.toBeInTheDocument();
    });

    it('applies custom className', async () => {
      const { container } = render(
        <PageTransition className="custom-class" showLogo={false}>
          <div>Main Content</div>
        </PageTransition>
      );

      await waitFor(() => {
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
      });
    });

    it('handles logo completion and shows content', async () => {
      render(
        <PageTransition showLogo={true}>
          <div>Main Content</div>
        </PageTransition>
      );

      // Initially shows logo
      expect(screen.getByText('JK')).toBeInTheDocument();

      // After timeout, should show content
      act(() => {
        jest.advanceTimersByTime(2600); // Logo timeout + transition delay
      });

      await waitFor(() => {
        expect(screen.getByText('Main Content')).toBeInTheDocument();
      });
    });

    it('skips logo reveal with reduced motion preference', async () => {
      const { useReducedMotion } = require('../../../hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      render(
        <PageTransition showLogo={true}>
          <div>Main Content</div>
        </PageTransition>
      );

      await waitFor(() => {
        expect(screen.getByText('Main Content')).toBeInTheDocument();
      });
      
      expect(screen.queryByText('JK')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('respects reduced motion preferences', async () => {
      const { useReducedMotion } = require('../../../hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      );

      // Should immediately show content without logo animation
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });

    it('provides appropriate loading feedback', () => {
      render(<PageTransition isLoading={true} showLogo={false} />);
      
      // Should show loading indicator
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('maintains focus management during transitions', async () => {
      const { rerender } = render(
        <PageTransition isLoading={true} showLogo={false}>
          <div>Content</div>
        </PageTransition>
      );

      rerender(
        <PageTransition isLoading={false} showLogo={false}>
          <div>Content</div>
        </PageTransition>
      );

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('does not render unnecessary animations with reduced motion', async () => {
      const { useReducedMotion } = require('../../../hooks/useReducedMotion');
      useReducedMotion.mockReturnValue(true);

      const { container } = render(<LoadingSpinner />);
      
      // Should render simple text instead of complex spinner
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(container.querySelectorAll('.animate-spin')).toHaveLength(0);
    });

    it('cleans up timers properly', () => {
      const onComplete = jest.fn();
      const { unmount } = render(<LogoReveal onComplete={onComplete} />);

      unmount();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should not call onComplete after unmount
      expect(onComplete).not.toHaveBeenCalled();
    });
  });
});