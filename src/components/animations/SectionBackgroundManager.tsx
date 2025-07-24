import React, { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface SectionBackgroundManagerProps {
  /** Enable background animations globally */
  enabled?: boolean;
  /** Performance mode for lower-end devices */
  performanceMode?: boolean;
}

/**
 * Manages section-specific background animations based on scroll position
 * and viewport visibility. Automatically switches between different
 * background configurations as user scrolls through sections.
 */
const SectionBackgroundManager: React.FC<SectionBackgroundManagerProps> = ({
  enabled = true,
  performanceMode = false,
}) => {
  const { isVisible } = useIntersectionObserver();
  const [currentSection, setCurrentSection] = useState<string>('hero');

  // Determine current section based on visibility
  useEffect(() => {
    if (isVisible.contact) {
      setCurrentSection('contact');
    } else if (isVisible.projects) {
      setCurrentSection('projects');
    } else if (isVisible.skills) {
      setCurrentSection('skills');
    } else if (isVisible.about) {
      setCurrentSection('about');
    } else {
      setCurrentSection('hero');
    }
  }, [isVisible]);

  if (!enabled) {
    return null;
  }

  // Section-specific configurations
  const getSectionConfig = (section: string) => {
    const configs = {
      hero: {
        particleCount: 60,
        shapeCount: 10,
        enableMouseInteraction: true,
        enableParallax: true,
        enableGradientAnimation: true,
        enableMouseFollowing: true,
        colorTheme: 'gradient' as const,
        animationSpeed: 1.2,
      },
      about: {
        particleCount: 40,
        shapeCount: 6,
        enableMouseInteraction: true,
        enableParallax: true,
        enableGradientAnimation: true,
        enableMouseFollowing: false,
        colorTheme: 'blue' as const,
        animationSpeed: 0.8,
      },
      skills: {
        particleCount: 50,
        shapeCount: 8,
        enableMouseInteraction: true,
        enableParallax: true,
        enableGradientAnimation: true,
        enableMouseFollowing: true,
        colorTheme: 'gradient' as const,
        animationSpeed: 1.0,
      },
      projects: {
        particleCount: 45,
        shapeCount: 7,
        enableMouseInteraction: true,
        enableParallax: true,
        enableGradientAnimation: true,
        enableMouseFollowing: false,
        colorTheme: 'purple' as const,
        animationSpeed: 0.9,
      },
      contact: {
        particleCount: 35,
        shapeCount: 5,
        enableMouseInteraction: false,
        enableParallax: false,
        enableGradientAnimation: true,
        enableMouseFollowing: false,
        colorTheme: 'monochrome' as const,
        animationSpeed: 0.7,
      },
    };

    return configs[section as keyof typeof configs] || configs.hero;
  };

  const config = getSectionConfig(currentSection);

  return (
    <ParticleBackground
      {...config}
      sectionVariant={currentSection as any}
      enablePerformanceMode={performanceMode}
      className="transition-opacity duration-1000 ease-in-out"
      zIndex={-1}
    />
  );
};

export default SectionBackgroundManager;