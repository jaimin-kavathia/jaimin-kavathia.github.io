import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnimatedSkills from '../AnimatedSkills';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
}));

// Mock the useReducedMotion hook
vi.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Mock AnimatedCounter component
vi.mock('../../animations/AnimatedCounter', () => ({
  default: ({ to, suffix }: { to: number; suffix: string }) => (
    <span data-testid="animated-counter">{to}{suffix}</span>
  ),
}));

describe('AnimatedSkills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the skills section with proper heading', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
    expect(screen.getByText('Technologies and tools I use to bring ideas to life')).toBeInTheDocument();
  });

  it('renders skills grouped by categories', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    // Check for category headings
    expect(screen.getByText('Mobile Development')).toBeInTheDocument();
    expect(screen.getByText('Backend & APIs')).toBeInTheDocument();
    expect(screen.getByText('Design & UX')).toBeInTheDocument();
    expect(screen.getByText('Tools & DevOps')).toBeInTheDocument();
  });

  it('renders individual skills with proper structure', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    // Check for specific skills
    expect(screen.getByText('Flutter')).toBeInTheDocument();
    expect(screen.getByText('Dart')).toBeInTheDocument();
    expect(screen.getByText('Firebase Integration')).toBeInTheDocument();
  });

  it('displays animated counters for skill proficiency', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    const counters = screen.getAllByTestId('animated-counter');
    expect(counters.length).toBeGreaterThan(0);
    
    // Check that counters show percentage values
    expect(counters[0]).toHaveTextContent('%');
  });

  it('shows experience years for each skill', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    // Look for experience text patterns
    const experienceTexts = screen.getAllByText(/\d+ years? experience/);
    expect(experienceTexts.length).toBeGreaterThan(0);
  });

  it('applies high proficiency styling for skills >= 85%', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    // Flutter has 95% proficiency, should have special styling
    const flutterSkill = screen.getByText('Flutter').closest('article');
    expect(flutterSkill).toHaveClass('ring-1', 'ring-blue-400/30');
  });

  it('has proper accessibility attributes', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    // Check main section accessibility
    const mainSection = screen.getByRole('main');
    expect(mainSection).toHaveAttribute('aria-labelledby', 'skills-heading');
    
    // Check skills region
    const skillsRegion = screen.getByRole('region');
    expect(skillsRegion).toHaveAttribute('aria-label', 'Technical skills organized by category');
    
    // Check individual skill articles
    const skillArticles = screen.getAllByRole('article');
    skillArticles.forEach(article => {
      expect(article).toHaveAttribute('tabIndex', '0');
      expect(article).toHaveAttribute('aria-labelledby');
      expect(article).toHaveAttribute('aria-describedby');
    });
  });

  it('renders progress bars with correct ARIA attributes', () => {
    render(<AnimatedSkills isVisible={true} />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
    
    progressBars.forEach(progressBar => {
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-labelledby');
      expect(progressBar).toHaveAttribute('aria-describedby');
    });
  });

  it('handles visibility state correctly', () => {
    const { rerender } = render(<AnimatedSkills isVisible={false} />);
    
    // When not visible, counters should show 0
    let counters = screen.getAllByTestId('animated-counter');
    counters.forEach(counter => {
      expect(counter).toHaveTextContent('0%');
    });
    
    // When visible, counters should show actual values
    rerender(<AnimatedSkills isVisible={true} />);
    counters = screen.getAllByTestId('animated-counter');
    
    // At least some counters should show non-zero values
    const hasNonZeroCounter = counters.some(counter => 
      !counter.textContent?.startsWith('0%')
    );
    expect(hasNonZeroCounter).toBe(true);
  });
});