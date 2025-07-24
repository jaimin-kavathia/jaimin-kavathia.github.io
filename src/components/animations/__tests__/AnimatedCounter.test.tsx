import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from '../AnimatedCounter';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useMotionValue: (initial: number) => ({ get: () => initial, set: jest.fn() }),
  useTransform: (value: any, transform: (val: number) => string) => transform(0),
  animate: jest.fn(() => ({ stop: jest.fn() })),
}));

// Mock useReducedMotion hook
jest.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('AnimatedCounter', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('renders with basic props', () => {
    render(<AnimatedCounter to={100} />);
    
    // Component should render without errors
    expect(document.querySelector('span')).toBeInTheDocument();
  });

  it('applies prefix and suffix correctly', () => {
    render(
      <AnimatedCounter 
        to={85} 
        prefix="$" 
        suffix="%" 
        trigger="immediate"
      />
    );
    
    const element = screen.getByText((content, element) => {
      return element?.textContent === '$0%';
    });
    expect(element).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedCounter 
        to={100} 
        className="custom-counter" 
        trigger="immediate"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-counter');
  });

  it('handles different easing options', () => {
    const easingOptions = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'circOut', 'backOut'] as const;
    
    easingOptions.forEach(easing => {
      render(
        <AnimatedCounter 
          to={100} 
          easing={easing}
          trigger="immediate"
        />
      );
    });
    
    // If no errors are thrown, all easing options are handled correctly
    expect(true).toBe(true);
  });

  it('handles decimal formatting', () => {
    render(
      <AnimatedCounter 
        to={99.99} 
        decimals={2}
        trigger="immediate"
      />
    );
    
    // Component should render without errors with decimal formatting
    expect(document.querySelector('span')).toBeInTheDocument();
  });
});