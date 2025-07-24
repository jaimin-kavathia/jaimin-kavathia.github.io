import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SectionBackgroundManager from '../SectionBackgroundManager';

// Mock the ParticleBackground component
vi.mock('../ParticleBackground', () => ({
  default: ({ sectionVariant, ...props }: any) => (
    <div data-testid="particle-background" data-section={sectionVariant} {...props} />
  ),
}));

// Mock the useIntersectionObserver hook
const mockUseIntersectionObserver = vi.fn();
vi.mock('../../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => mockUseIntersectionObserver(),
}));

describe('SectionBackgroundManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: false,
        about: false,
        skills: false,
        projects: false,
        contact: false,
      },
    });
  });

  it('renders nothing when disabled', () => {
    const { container } = render(<SectionBackgroundManager enabled={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders ParticleBackground when enabled', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: true,
        about: false,
        skills: false,
        projects: false,
        contact: false,
      },
    });

    render(<SectionBackgroundManager enabled={true} />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toBeInTheDocument();
    expect(background).toHaveAttribute('data-section', 'hero');
  });

  it('switches to hero section by default', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: false,
        about: false,
        skills: false,
        projects: false,
        contact: false,
      },
    });

    render(<SectionBackgroundManager />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'hero');
  });

  it('switches to about section when visible', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: false,
        about: true,
        skills: false,
        projects: false,
        contact: false,
      },
    });

    render(<SectionBackgroundManager />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'about');
  });

  it('switches to skills section when visible', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: false,
        about: false,
        skills: true,
        projects: false,
        contact: false,
      },
    });

    render(<SectionBackgroundManager />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'skills');
  });

  it('switches to projects section when visible', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: false,
        about: false,
        skills: false,
        projects: true,
        contact: false,
      },
    });

    render(<SectionBackgroundManager />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'projects');
  });

  it('switches to contact section when visible', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: false,
        about: false,
        skills: false,
        projects: false,
        contact: true,
      },
    });

    render(<SectionBackgroundManager />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'contact');
  });

  it('prioritizes contact section when multiple sections are visible', () => {
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: {
        home: true,
        about: true,
        skills: true,
        projects: true,
        contact: true,
      },
    });

    render(<SectionBackgroundManager />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'contact');
  });

  it('applies performance mode when enabled', () => {
    render(<SectionBackgroundManager performanceMode={true} />);
    
    const background = screen.getByTestId('particle-background');
    expect(background).toBeInTheDocument();
  });

  it('applies correct section-specific configurations', () => {
    // Test hero section configuration
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: { home: true, about: false, skills: false, projects: false, contact: false },
    });

    const { rerender } = render(<SectionBackgroundManager />);
    let background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'hero');

    // Test skills section configuration
    mockUseIntersectionObserver.mockReturnValue({
      isVisible: { home: false, about: false, skills: true, projects: false, contact: false },
    });

    rerender(<SectionBackgroundManager />);
    background = screen.getByTestId('particle-background');
    expect(background).toHaveAttribute('data-section', 'skills');
  });
});