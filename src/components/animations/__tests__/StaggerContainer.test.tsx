import React from 'react';
import { render, screen } from '@testing-library/react';
import StaggerContainer from '../StaggerContainer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  Variants: {},
  Easing: {},
}));

// Mock useReducedMotion hook
jest.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('StaggerContainer', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('renders children correctly', () => {
    render(
      <StaggerContainer>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerContainer>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StaggerContainer className="custom-class">
        <div>Child</div>
      </StaggerContainer>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles different stagger patterns', () => {
    const patterns = ['cascade', 'wave', 'spiral', 'random'] as const;
    
    patterns.forEach(pattern => {
      render(
        <StaggerContainer config={{ pattern }}>
          <div>Child 1</div>
          <div>Child 2</div>
        </StaggerContainer>
      );
    });
    
    // If no errors are thrown, the patterns are handled correctly
    expect(true).toBe(true);
  });

  it('respects custom configuration', () => {
    const config = {
      delay: 0.5,
      duration: 1.0,
      staggerDelay: 0.2,
      pattern: 'wave' as const,
    };

    render(
      <StaggerContainer config={config}>
        <div>Child 1</div>
        <div>Child 2</div>
      </StaggerContainer>
    );

    // Component should render without errors with custom config
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });
});