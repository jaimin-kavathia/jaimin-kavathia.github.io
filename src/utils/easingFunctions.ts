/**
 * Custom easing functions for animations
 * Provides smooth and natural motion curves
 */

// Cubic bezier easing functions
export const easingFunctions = {
  // Elastic easing for bouncy effects
  easeOutElastic: [0.34, 1.56, 0.64, 1] as const,
  
  // Back easing for overshoot effects
  easeOutBack: [0.34, 1.26, 0.64, 1] as const,
  easeInBack: [0.36, 0, 0.66, -0.56] as const,
  easeInOutBack: [0.68, -0.6, 0.32, 1.6] as const,
  
  // Cubic easing for smooth transitions
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,
  easeOutCubic: [0.33, 1, 0.68, 1] as const,
  easeInCubic: [0.32, 0, 0.67, 0] as const,
  
  // Quart easing for more dramatic curves
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  easeInQuart: [0.5, 0, 0.75, 0] as const,
  easeInOutQuart: [0.76, 0, 0.24, 1] as const,
  
  // Expo easing for sharp acceleration/deceleration
  easeOutExpo: [0.19, 1, 0.22, 1] as const,
  easeInExpo: [0.7, 0, 0.84, 0] as const,
  easeInOutExpo: [0.87, 0, 0.13, 1] as const,
  
  // Circ easing for circular motion feel
  easeOutCirc: [0, 0.55, 0.45, 1] as const,
  easeInCirc: [0.55, 0, 1, 0.45] as const,
  easeInOutCirc: [0.85, 0, 0.15, 1] as const,
  
  // Sine easing for gentle curves
  easeOutSine: [0.39, 0.575, 0.565, 1] as const,
  easeInSine: [0.12, 0, 0.39, 0] as const,
  easeInOutSine: [0.37, 0, 0.63, 1] as const,
};

// Animation duration constants - Optimized for faster UI
export const animationDurations = {
  // Fast interactions (hover, click feedback)
  fast: 0.1,
  quick: 0.15,
  
  // Medium transitions (section reveals, navigation)
  medium: 0.3,
  normal: 0.4,
  smooth: 0.5,
  
  // Slow entrances (page load, major transitions)
  slow: 0.6,
  dramatic: 0.8,
  epic: 1.0,
  
  // Background animations
  ambient: 2.0,
  floating: 3.0,
  infinite: 6.0,
} as const;

// Stagger timing constants - Reduced for faster UI
export const staggerTimings = {
  tight: 0.03,
  normal: 0.06,
  relaxed: 0.08,
  dramatic: 0.1,
  slow: 0.15,
} as const;

// Spring configurations for physics-based animations
export const springConfigs = {
  // Gentle spring for UI elements
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: "spring" as const,
    stiffness: 200,
    damping: 10,
    mass: 1,
  },
  
  // Snappy spring for quick responses
  snappy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  
  // Wobbly spring for attention-grabbing effects
  wobbly: {
    type: "spring" as const,
    stiffness: 180,
    damping: 8,
    mass: 1.2,
  },
  
  // Stiff spring for precise movements
  stiff: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.6,
  },
} as const;

// Enhanced easing functions for specific use cases
export const portfolioEasing = {
  // Hero section animations
  heroTitle: [0.25, 0.46, 0.45, 0.94] as const,
  heroSubtitle: [0.34, 1.56, 0.64, 1] as const,
  heroCTA: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Skills section animations
  skillBar: [0.34, 1.56, 0.64, 1] as const,
  skillCounter: [0.25, 0.46, 0.45, 0.94] as const,
  skillIcon: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Projects section animations
  projectCard: [0.25, 0.46, 0.45, 0.94] as const,
  projectHover: [0.68, -0.55, 0.265, 1.55] as const,
  projectModal: [0.16, 1, 0.3, 1] as const,
  
  // Navigation animations
  navLink: [0.25, 0.46, 0.45, 0.94] as const,
  navIndicator: [0.68, -0.55, 0.265, 1.55] as const,
  mobileMenu: [0.16, 1, 0.3, 1] as const,
  
  // Micro-interactions
  buttonHover: [0.25, 0.46, 0.45, 0.94] as const,
  buttonPress: [0.4, 0, 1, 1] as const,
  focusRing: [0.16, 1, 0.3, 1] as const,
  
  // Scroll-based animations
  scrollReveal: [0.215, 0.61, 0.355, 1] as const,
  parallax: [0.25, 0.46, 0.45, 0.94] as const,
  sectionTransition: [0.4, 0, 0.2, 1] as const,
  
  // Background animations
  particleFloat: [0.445, 0.05, 0.55, 0.95] as const,
  geometricShapes: [0.39, 0.575, 0.565, 1] as const,
  gradientShift: [0.4, 0, 0.6, 1] as const,
} as const;

// Timing presets for consistent animation choreography
export const timingPresets = {
  // Micro-interactions (0-200ms)
  instantFeedback: {
    duration: 0.1,
    easing: easingFunctions.easeOutQuart,
    description: 'Immediate visual feedback'
  },
  
  quickHover: {
    duration: 0.15,
    easing: portfolioEasing.buttonHover,
    description: 'Quick hover state change'
  },
  
  buttonPress: {
    duration: 0.1,
    easing: portfolioEasing.buttonPress,
    description: 'Button press feedback'
  },
  
  focusTransition: {
    duration: 0.2,
    easing: portfolioEasing.focusRing,
    description: 'Focus state transition'
  },
  
  // UI transitions (200-600ms)
  modalAppear: {
    duration: 0.3,
    easing: portfolioEasing.projectModal,
    description: 'Modal/dialog appearance'
  },
  
  menuSlide: {
    duration: 0.3,
    easing: portfolioEasing.mobileMenu,
    description: 'Mobile menu slide animation'
  },
  
  tabSwitch: {
    duration: 0.25,
    easing: easingFunctions.easeOutCubic,
    description: 'Tab switching animation'
  },
  
  tooltipShow: {
    duration: 0.2,
    easing: easingFunctions.easeOutBack,
    description: 'Tooltip appearance'
  },
  
  // Content animations (600-1200ms)
  sectionReveal: {
    duration: 0.8,
    easing: portfolioEasing.scrollReveal,
    stagger: staggerTimings.normal,
    description: 'Section content reveal'
  },
  
  skillBarFill: {
    duration: 1.2,
    easing: portfolioEasing.skillBar,
    stagger: staggerTimings.relaxed,
    description: 'Skill bar progressive fill'
  },
  
  projectCardEntrance: {
    duration: 0.6,
    easing: portfolioEasing.projectCard,
    stagger: staggerTimings.normal,
    description: 'Project card entrance animation'
  },
  
  counterAnimation: {
    duration: 2.0,
    easing: portfolioEasing.skillCounter,
    description: 'Number counting animation'
  },
  
  // Hero animations (1200ms+)
  heroTitleReveal: {
    duration: 1.5,
    easing: portfolioEasing.heroTitle,
    description: 'Hero title dramatic reveal'
  },
  
  heroSubtitleReveal: {
    duration: 1.0,
    easing: portfolioEasing.heroSubtitle,
    delay: 0.3,
    description: 'Hero subtitle entrance'
  },
  
  heroCTAReveal: {
    duration: 0.8,
    easing: portfolioEasing.heroCTA,
    delay: 0.8,
    description: 'Hero CTA button entrance'
  },
  
  // Background animations (continuous)
  particleFloat: {
    duration: 8.0,
    easing: portfolioEasing.particleFloat,
    description: 'Background particle floating'
  },
  
  geometricRotation: {
    duration: 12.0,
    easing: portfolioEasing.geometricShapes,
    description: 'Geometric shapes rotation'
  },
  
  gradientAnimation: {
    duration: 6.0,
    easing: portfolioEasing.gradientShift,
    description: 'Background gradient animation'
  },
} as const;

// Device-specific timing adjustments
export const deviceTimingMultipliers = {
  mobile: 0.8,    // 20% faster on mobile
  tablet: 0.9,    // 10% faster on tablet
  desktop: 1.0,   // Full duration on desktop
  highRefresh: 1.1, // 10% slower on high refresh displays
} as const;

// Performance-based timing adjustments
export const performanceTimingMultipliers = {
  low: 0.5,       // 50% faster for low-end devices
  medium: 0.75,   // 25% faster for medium performance
  high: 1.0,      // Full duration for high performance
} as const;

// Accessibility timing adjustments
export const accessibilityTimings = {
  reducedMotion: 0.001, // Nearly instant for reduced motion
  normalMotion: 1.0,    // Standard timing
  enhancedMotion: 1.2,  // Slightly slower for better visibility
} as const;

// Helper functions for timing calculations
export const calculateTiming = {
  // Get device-optimized duration
  forDevice: (baseDuration: number, device: keyof typeof deviceTimingMultipliers = 'desktop'): number => {
    return baseDuration * deviceTimingMultipliers[device];
  },
  
  // Get performance-optimized duration
  forPerformance: (baseDuration: number, performance: keyof typeof performanceTimingMultipliers = 'high'): number => {
    return Math.max(0.05, baseDuration * performanceTimingMultipliers[performance]);
  },
  
  // Get accessibility-optimized duration
  forAccessibility: (baseDuration: number, motionPreference: keyof typeof accessibilityTimings = 'normalMotion'): number => {
    return baseDuration * accessibilityTimings[motionPreference];
  },
  
  // Get staggered timing for multiple elements
  withStagger: (baseDuration: number, index: number, stagger: number = staggerTimings.normal): number => {
    return baseDuration + (index * stagger);
  },
  
  // Get responsive timing based on screen size
  responsive: (baseDuration: number, screenWidth: number): number => {
    if (screenWidth < 768) return calculateTiming.forDevice(baseDuration, 'mobile');
    if (screenWidth < 1024) return calculateTiming.forDevice(baseDuration, 'tablet');
    return baseDuration;
  },
} as const;

// Animation quality levels
export const animationQuality = {
  minimal: {
    enableParticles: false,
    enableParallax: false,
    enableComplexEasing: false,
    maxAnimationDuration: 0.3,
    description: 'Minimal animations for low-end devices'
  },
  
  standard: {
    enableParticles: false,
    enableParallax: true,
    enableComplexEasing: true,
    maxAnimationDuration: 1.0,
    description: 'Standard animations for most devices'
  },
  
  enhanced: {
    enableParticles: true,
    enableParallax: true,
    enableComplexEasing: true,
    maxAnimationDuration: 2.0,
    description: 'Full animations for high-end devices'
  },
} as const;

// Export utility functions
export const timingUtils = {
  // Get timing preset
  getPreset: (presetName: keyof typeof timingPresets) => timingPresets[presetName],
  
  // Get easing function
  getEasing: (easingName: keyof typeof easingFunctions | keyof typeof portfolioEasing) => {
    return (easingFunctions as any)[easingName] || (portfolioEasing as any)[easingName];
  },
  
  // Get duration
  getDuration: (durationName: keyof typeof animationDurations) => animationDurations[durationName],
  
  // Get stagger timing
  getStagger: (staggerName: keyof typeof staggerTimings) => staggerTimings[staggerName],
  
  // Get spring config
  getSpring: (springName: keyof typeof springConfigs) => springConfigs[springName],
  
  // Calculate optimized timing
  optimize: calculateTiming,
  
  // Get quality settings
  getQuality: (qualityLevel: keyof typeof animationQuality) => animationQuality[qualityLevel],
} as const;

// CSS custom properties generator
export const generateCSSTimingProperties = (): string => {
  let css = ':root {\n';
  
  // Add duration properties
  Object.entries(animationDurations).forEach(([name, value]) => {
    css += `  --duration-${name}: ${value}s;\n`;
  });
  
  // Add stagger properties
  Object.entries(staggerTimings).forEach(([name, value]) => {
    css += `  --stagger-${name}: ${value}s;\n`;
  });
  
  // Add easing properties
  Object.entries(easingFunctions).forEach(([name, value]) => {
    css += `  --easing-${name}: cubic-bezier(${value.join(', ')});\n`;
  });
  
  // Add portfolio-specific easing
  Object.entries(portfolioEasing).forEach(([name, value]) => {
    css += `  --easing-${name}: cubic-bezier(${value.join(', ')});\n`;
  });
  
  css += '}\n\n';
  
  // Add reduced motion overrides
  css += '@media (prefers-reduced-motion: reduce) {\n';
  css += '  :root {\n';
  
  Object.keys(animationDurations).forEach(name => {
    css += `    --duration-${name}: 0.001s;\n`;
  });
  
  Object.keys(staggerTimings).forEach(name => {
    css += `    --stagger-${name}: 0s;\n`;
  });
  
  css += '  }\n';
  css += '}\n';
  
  return css;
};

// Type exports
export type TimingPreset = keyof typeof timingPresets;
export type PortfolioEasing = keyof typeof portfolioEasing;
export type AnimationQuality = keyof typeof animationQuality;
export type DeviceType = keyof typeof deviceTimingMultipliers;
export type PerformanceLevel = keyof typeof performanceTimingMultipliers;