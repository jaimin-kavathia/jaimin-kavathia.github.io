/**
 * Animation timing and choreography optimization utilities
 */

export interface AnimationTiming {
  duration: number;
  delay: number;
  easing: string;
  stagger?: number;
}

export interface AnimationPreset {
  name: string;
  description: string;
  timing: AnimationTiming;
  variants?: Record<string, AnimationTiming>;
}

/**
 * Predefined animation presets for consistent timing
 */
export const animationPresets: Record<string, AnimationPreset> = {
  // Micro-interactions (fast, immediate feedback)
  hover: {
    name: 'Hover Effect',
    description: 'Quick hover state changes',
    timing: { duration: 150, delay: 0, easing: 'ease-out' }
  },
  
  focus: {
    name: 'Focus State',
    description: 'Focus ring and state changes',
    timing: { duration: 200, delay: 0, easing: 'ease-out' }
  },
  
  click: {
    name: 'Click Feedback',
    description: 'Button press and click feedback',
    timing: { duration: 100, delay: 0, easing: 'ease-in-out' }
  },
  
  // UI transitions (medium speed, smooth)
  modal: {
    name: 'Modal Transition',
    description: 'Modal open/close animations',
    timing: { duration: 300, delay: 0, easing: 'ease-out' },
    variants: {
      backdrop: { duration: 250, delay: 0, easing: 'ease-out' },
      content: { duration: 300, delay: 50, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    }
  },
  
  dropdown: {
    name: 'Dropdown Menu',
    description: 'Dropdown menu animations',
    timing: { duration: 200, delay: 0, easing: 'ease-out' }
  },
  
  tooltip: {
    name: 'Tooltip',
    description: 'Tooltip show/hide animations',
    timing: { duration: 150, delay: 100, easing: 'ease-out' }
  },
  
  // Page transitions (slower, more dramatic)
  pageLoad: {
    name: 'Page Load',
    description: 'Initial page load animations',
    timing: { duration: 800, delay: 0, easing: 'ease-out' },
    variants: {
      hero: { duration: 1000, delay: 200, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
      content: { duration: 600, delay: 400, easing: 'ease-out', stagger: 100 }
    }
  },
  
  sectionReveal: {
    name: 'Section Reveal',
    description: 'Section entrance animations',
    timing: { duration: 600, delay: 0, easing: 'ease-out', stagger: 150 }
  },
  
  navigation: {
    name: 'Navigation',
    description: 'Navigation transitions',
    timing: { duration: 400, delay: 0, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
  },
  
  // Specialized animations
  typewriter: {
    name: 'Typewriter Effect',
    description: 'Text typing animations',
    timing: { duration: 50, delay: 0, easing: 'steps(1, end)' }
  },
  
  counter: {
    name: 'Number Counter',
    description: 'Animated number counting',
    timing: { duration: 2000, delay: 0, easing: 'ease-out' }
  },
  
  skillBar: {
    name: 'Skill Bar Fill',
    description: 'Progress bar filling animation',
    timing: { duration: 1200, delay: 0, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', stagger: 150 }
  },
  
  parallax: {
    name: 'Parallax Scroll',
    description: 'Parallax scrolling effects',
    timing: { duration: 0, delay: 0, easing: 'linear' }
  },
  
  // Background animations
  particle: {
    name: 'Particle Animation',
    description: 'Background particle movements',
    timing: { duration: 8000, delay: 0, easing: 'linear' }
  },
  
  float: {
    name: 'Floating Elements',
    description: 'Gentle floating animations',
    timing: { duration: 4000, delay: 0, easing: 'ease-in-out' }
  }
};

/**
 * Device-specific timing adjustments
 */
export const getDeviceOptimizedTiming = (preset: AnimationPreset, deviceType?: 'mobile' | 'tablet' | 'desktop'): AnimationTiming => {
  const baseTiming = preset.timing;
  
  // Auto-detect device if not specified
  if (!deviceType) {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  }
  
  // Apply device-specific optimizations
  switch (deviceType) {
    case 'mobile':
      return {
        ...baseTiming,
        duration: Math.max(100, baseTiming.duration * 0.8), // 20% faster on mobile
        delay: baseTiming.delay * 0.7 // Reduce delays on mobile
      };
    
    case 'tablet':
      return {
        ...baseTiming,
        duration: baseTiming.duration * 0.9, // 10% faster on tablet
        delay: baseTiming.delay * 0.85
      };
    
    case 'desktop':
    default:
      return baseTiming;
  }
};

/**
 * Performance-based timing adjustments
 */
export const getPerformanceOptimizedTiming = (
  preset: AnimationPreset, 
  performanceLevel: 'high' | 'medium' | 'low'
): AnimationTiming => {
  const baseTiming = preset.timing;
  
  switch (performanceLevel) {
    case 'low':
      return {
        ...baseTiming,
        duration: Math.max(50, baseTiming.duration * 0.5), // Much faster
        delay: baseTiming.delay * 0.5,
        stagger: baseTiming.stagger ? baseTiming.stagger * 0.5 : undefined
      };
    
    case 'medium':
      return {
        ...baseTiming,
        duration: baseTiming.duration * 0.75, // Somewhat faster
        delay: baseTiming.delay * 0.75,
        stagger: baseTiming.stagger ? baseTiming.stagger * 0.75 : undefined
      };
    
    case 'high':
    default:
      return baseTiming;
  }
};

/**
 * Reduced motion timing (instant or very fast)
 */
export const getReducedMotionTiming = (preset: AnimationPreset): AnimationTiming => {
  return {
    duration: 1, // Nearly instant
    delay: 0,
    easing: 'linear',
    stagger: 0
  };
};

/**
 * Generate CSS custom properties for timing
 */
export const generateTimingCSS = (presets: Record<string, AnimationPreset>): string => {
  let css = ':root {\n';
  
  Object.entries(presets).forEach(([key, preset]) => {
    const timing = preset.timing;
    css += `  --animation-${key}-duration: ${timing.duration}ms;\n`;
    css += `  --animation-${key}-delay: ${timing.delay}ms;\n`;
    css += `  --animation-${key}-easing: ${timing.easing};\n`;
    
    if (timing.stagger) {
      css += `  --animation-${key}-stagger: ${timing.stagger}ms;\n`;
    }
    
    // Add variants if they exist
    if (preset.variants) {
      Object.entries(preset.variants).forEach(([variantKey, variantTiming]) => {
        css += `  --animation-${key}-${variantKey}-duration: ${variantTiming.duration}ms;\n`;
        css += `  --animation-${key}-${variantKey}-delay: ${variantTiming.delay}ms;\n`;
        css += `  --animation-${key}-${variantKey}-easing: ${variantTiming.easing};\n`;
        
        if (variantTiming.stagger) {
          css += `  --animation-${key}-${variantKey}-stagger: ${variantTiming.stagger}ms;\n`;
        }
      });
    }
  });
  
  css += '}\n\n';
  
  // Add reduced motion overrides
  css += '@media (prefers-reduced-motion: reduce) {\n';
  css += '  :root {\n';
  
  Object.keys(presets).forEach(key => {
    css += `    --animation-${key}-duration: 1ms;\n`;
    css += `    --animation-${key}-delay: 0ms;\n`;
    css += `    --animation-${key}-stagger: 0ms;\n`;
  });
  
  css += '  }\n';
  css += '}\n';
  
  return css;
};

/**
 * Animation choreography utilities
 */
export interface ChoreographyStep {
  element: string | HTMLElement;
  animation: string;
  timing: AnimationTiming;
  trigger?: 'immediate' | 'scroll' | 'hover' | 'click' | 'delay';
}

export class AnimationChoreographer {
  private steps: ChoreographyStep[] = [];
  private timeline: number[] = [];
  
  addStep(step: ChoreographyStep): this {
    this.steps.push(step);
    this.calculateTimeline();
    return this;
  }
  
  private calculateTimeline(): void {
    this.timeline = this.steps.map((step, index) => {
      const previousSteps = this.steps.slice(0, index);
      const baseDelay = previousSteps.reduce((total, prevStep) => {
        return total + prevStep.timing.delay + (prevStep.timing.stagger || 0);
      }, 0);
      
      return baseDelay + step.timing.delay;
    });
  }
  
  getTotalDuration(): number {
    return this.steps.reduce((total, step, index) => {
      const startTime = this.timeline[index];
      const endTime = startTime + step.timing.duration;
      return Math.max(total, endTime);
    }, 0);
  }
  
  getStepAtTime(time: number): ChoreographyStep | null {
    const stepIndex = this.timeline.findIndex((startTime, index) => {
      const step = this.steps[index];
      const endTime = startTime + step.timing.duration;
      return time >= startTime && time <= endTime;
    });
    
    return stepIndex >= 0 ? this.steps[stepIndex] : null;
  }
  
  optimize(performanceLevel: 'high' | 'medium' | 'low'): this {
    this.steps = this.steps.map(step => ({
      ...step,
      timing: getPerformanceOptimizedTiming({ timing: step.timing } as AnimationPreset, performanceLevel)
    }));
    
    this.calculateTimeline();
    return this;
  }
  
  export(): ChoreographyStep[] {
    return [...this.steps];
  }
}

/**
 * Timing validation utilities
 */
export const validateAnimationTiming = (timing: AnimationTiming): string[] => {
  const issues: string[] = [];
  
  // Check duration
  if (timing.duration < 0) {
    issues.push('Duration cannot be negative');
  } else if (timing.duration > 5000) {
    issues.push('Duration over 5 seconds may feel too slow');
  } else if (timing.duration < 50 && timing.duration > 1) {
    issues.push('Duration under 50ms may not be noticeable');
  }
  
  // Check delay
  if (timing.delay < 0) {
    issues.push('Delay cannot be negative');
  } else if (timing.delay > 2000) {
    issues.push('Delay over 2 seconds may feel unresponsive');
  }
  
  // Check stagger
  if (timing.stagger && timing.stagger < 0) {
    issues.push('Stagger cannot be negative');
  } else if (timing.stagger && timing.stagger > 500) {
    issues.push('Stagger over 500ms may feel too slow');
  }
  
  // Check easing
  const validEasings = [
    'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',
    'steps(', 'cubic-bezier('
  ];
  
  const hasValidEasing = validEasings.some(easing => timing.easing.includes(easing));
  if (!hasValidEasing) {
    issues.push('Invalid easing function');
  }
  
  return issues;
};

/**
 * Generate timing recommendations
 */
export const generateTimingRecommendations = (timing: AnimationTiming, context: string): string[] => {
  const recommendations: string[] = [];
  
  // Context-specific recommendations
  if (context.includes('hover') && timing.duration > 200) {
    recommendations.push('Hover effects should be under 200ms for responsiveness');
  }
  
  if (context.includes('click') && timing.duration > 150) {
    recommendations.push('Click feedback should be under 150ms for immediate response');
  }
  
  if (context.includes('modal') && timing.duration < 250) {
    recommendations.push('Modal transitions should be at least 250ms for smooth appearance');
  }
  
  if (context.includes('page') && timing.duration < 500) {
    recommendations.push('Page transitions should be at least 500ms for dramatic effect');
  }
  
  // General recommendations
  if (timing.delay > timing.duration) {
    recommendations.push('Delay is longer than duration - consider reducing delay');
  }
  
  if (timing.stagger && timing.stagger > timing.duration / 2) {
    recommendations.push('Stagger is too long relative to duration');
  }
  
  return recommendations;
};

/**
 * Export optimized timing for different contexts
 */
export const exportOptimizedTimings = (): Record<string, AnimationTiming> => {
  const optimizedTimings: Record<string, AnimationTiming> = {};
  
  Object.entries(animationPresets).forEach(([key, preset]) => {
    optimizedTimings[key] = getDeviceOptimizedTiming(preset);
  });
  
  return optimizedTimings;
};