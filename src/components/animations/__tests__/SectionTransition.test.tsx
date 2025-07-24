/**
 * Tests for SectionTransition component
 * Verifies smooth section transitions and mobile optimization
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionTransition from '../SectionTransition';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  useInView: jest.fn(() => true),
}));

// Mock hooks
jest.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
  useAnimationDuration: jest.fn((duration: number) => duration),
}));

// Mock window.innerWidth for mobile detection
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

describe('SectionTransition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <SectionTransition>
        <div>Test Content</div>
      </SectionTransition>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className and id', () => {
    const { container } = render(
      <SectionTransition id="test-section" className="custom-class">
        <div>Content</div>
      </SectionTransition>
    );

    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass('custom-class');
    expect(section).toHaveAttribute('id', 'test-section');
  });

  it('handles different animation types', () => {
    const animationTypes = ['slide', 'fade', 'scale', 'blur'] as const;
    
    animationTypes.forEach(type => {
      render(
        <SectionTransition animationType={type}>
          <div>Content {type}</div>
        </SectionTransition>
      );
      
      expect(screen.getByText(`Content ${type}`)).toBeInTheDocument();
    });
  });

  it('handles different directions for slide animation', () => {
    const directions = ['up', 'down', 'left', 'right'] as const;
    
    directions.forEach(direction => {
      render(
        <SectionTransition animationType="slide" direction={direction}>
          <div>Content {direction}</div>
        </SectionTransition>
      );
      
      expect(screen.getByText(`Content ${direction}`)).toBeInTheDocument();
    });
  });

  it('optimizes for mobile when enabled', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      value: 600,
      writable: true,
    });

    render(
      <SectionTransition optimizeForMobile={true}>
        <div>Mobile Content</div>
      </SectionTransition>
    );

    expect(screen.getByText('Mobile Content')).toBeInTheDocument();
  });

  it('respects reduced motion preferences', async () => {
    const { useReducedMotion } = require('../../../hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(true);

    render(
      <SectionTransition>
        <div>Reduced Motion Content</div>
      </SectionTransition>
    );

    expect(screen.getByText('Reduced Motion Content')).toBeInTheDocument();
  });

  it('applies custom delay and threshold', () => {
    render(
      <SectionTransition delay={0.5} threshold={0.3}>
        <div>Delayed Content</div>
      </SectionTransition>
    );

    expect(screen.getByText('Delayed Content')).toBeInTheDocument();
  });

  it('handles triggerOnce prop', () => {
    render(
      <SectionTransition triggerOnce={false}>
        <div>Repeating Animation</div>
      </SectionTransition>
    );

    expect(screen.getByText('Repeating Animation')).toBeInTheDocument();
  });
});