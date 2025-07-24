/**
 * Tests for ErrorState component
 * Verifies error animations, accessibility, and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ErrorState from '../ErrorState';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    h3: ({ children, className, ...props }: any) => (
      <h3 className={className} {...props}>
        {children}
      </h3>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
    button: ({ children, className, onClick, ...props }: any) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock hooks
jest.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
  useAnimationDuration: jest.fn((duration: number) => duration),
}));

describe('ErrorState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders when visible', () => {
    render(<ErrorState isVisible={true} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<ErrorState isVisible={false} />);
    
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(
      <ErrorState 
        isVisible={true}
        title="Custom Error"
        message="Custom error message"
      />
    );
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('handles different error types', () => {
    const types = ['error', 'warning', 'info'] as const;
    
    types.forEach(type => {
      const { rerender } = render(
        <ErrorState isVisible={true} type={type} title={`${type} message`} />
      );
      
      expect(screen.getByText(`${type} message`)).toBeInTheDocument();
      
      rerender(<ErrorState isVisible={false} />);
    });
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(
      <ErrorState 
        isVisible={true}
        onRetry={onRetry}
      />
    );
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <ErrorState 
        isVisible={true}
        onDismiss={onDismiss}
      />
    );
    
    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <ErrorState 
        isVisible={true}
        onDismiss={onDismiss}
      />
    );
    
    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-hides after specified delay', async () => {
    const onDismiss = jest.fn();
    render(
      <ErrorState 
        isVisible={true}
        autoHide={true}
        autoHideDelay={3000}
        onDismiss={onDismiss}
      />
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('has proper accessibility attributes', () => {
    render(<ErrorState isVisible={true} />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
    expect(errorContainer).toHaveAttribute('aria-atomic', 'true');
  });

  it('has proper button labels for accessibility', () => {
    render(
      <ErrorState 
        isVisible={true}
        onRetry={() => {}}
        onDismiss={() => {}}
      />
    );
    
    expect(screen.getByLabelText('Retry action')).toBeInTheDocument();
    expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ErrorState 
        isVisible={true}
        className="custom-error-class"
      />
    );
    
    expect(container.querySelector('.custom-error-class')).toBeInTheDocument();
  });

  it('respects reduced motion preferences', async () => {
    const { useReducedMotion } = require('../../../hooks/useReducedMotion');
    useReducedMotion.mockReturnValue(true);

    render(<ErrorState isVisible={true} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('cleans up auto-hide timer on unmount', () => {
    const onDismiss = jest.fn();
    const { unmount } = render(
      <ErrorState 
        isVisible={true}
        autoHide={true}
        autoHideDelay={3000}
        onDismiss={onDismiss}
      />
    );
    
    unmount();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('updates visibility when isVisible prop changes', async () => {
    const { rerender } = render(<ErrorState isVisible={false} />);
    
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    
    rerender(<ErrorState isVisible={true} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});