/**
 * Accessibility utilities for better keyboard navigation and screen reader support
 */

/**
 * Manages focus for smooth scrolling navigation
 * @param targetId - The ID of the target element to focus
 * @param delay - Delay before focusing (to allow for smooth scroll completion)
 */
export const manageFocusForNavigation = (targetId: string, delay: number = 500): void => {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    // Set tabindex temporarily for focus
    targetElement.setAttribute('tabindex', '-1');
    
    setTimeout(() => {
      targetElement.focus();
      // Remove tabindex after focus to maintain natural tab order
      targetElement.removeAttribute('tabindex');
    }, delay);
  }
};

/**
 * Announces content changes to screen readers
 * @param message - The message to announce
 * @param priority - The priority level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after it's been read
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Checks if user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if user prefers high contrast
 * @returns boolean indicating if high contrast is preferred
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Traps focus within a container element (useful for modals)
 * @param container - The container element to trap focus within
 */
export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Generates a unique ID for accessibility purposes
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateAccessibleId = (prefix: string = 'accessible'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Enhanced accessibility utilities for reduced motion support
 */

/**
 * Provides alternative visual feedback when animations are disabled
 * @param element - The element to provide feedback for
 * @param feedbackType - Type of feedback to provide
 */
export const provideAlternativeFeedback = (
  element: HTMLElement,
  feedbackType: 'hover' | 'focus' | 'active' | 'success' | 'error' = 'hover'
): void => {
  const feedbackClasses = {
    hover: 'bg-blue-100/20 border-blue-300/50 shadow-md',
    focus: 'ring-2 ring-blue-500 ring-offset-2',
    active: 'bg-blue-200/30 border-blue-400/60',
    success: 'bg-green-100/20 border-green-300/50 text-green-200',
    error: 'bg-red-100/20 border-red-300/50 text-red-200'
  };

  const originalClasses = element.className;
  element.className += ` ${feedbackClasses[feedbackType]}`;
  
  // Remove feedback after a short delay
  setTimeout(() => {
    element.className = originalClasses;
  }, 200);
};

/**
 * Announces animation state changes to screen readers
 * @param state - The current animation state
 * @param context - Additional context about the animation
 */
export const announceAnimationState = (
  state: 'started' | 'completed' | 'paused' | 'disabled',
  context?: string
): void => {
  const messages = {
    started: `Animation started${context ? ` for ${context}` : ''}`,
    completed: `Animation completed${context ? ` for ${context}` : ''}`,
    paused: `Animation paused${context ? ` for ${context}` : ''}`,
    disabled: `Animations disabled - using instant visual feedback${context ? ` for ${context}` : ''}`
  };

  announceToScreenReader(messages[state], 'polite');
};

/**
 * Ensures keyboard navigation works properly with animations
 * @param element - The element to enhance
 * @param options - Configuration options
 */
export const enhanceKeyboardNavigation = (
  element: HTMLElement,
  options: {
    announceOnFocus?: boolean;
    provideFeedback?: boolean;
    respectReducedMotion?: boolean;
  } = {}
): void => {
  const { announceOnFocus = true, provideFeedback = true, respectReducedMotion = true } = options;

  element.addEventListener('focus', () => {
    if (announceOnFocus) {
      const label = element.getAttribute('aria-label') || element.textContent || 'Interactive element';
      announceToScreenReader(`Focused on ${label}`, 'polite');
    }

    if (provideFeedback) {
      if (respectReducedMotion && prefersReducedMotion()) {
        provideAlternativeFeedback(element, 'focus');
      }
    }
  });

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (provideFeedback) {
        if (respectReducedMotion && prefersReducedMotion()) {
          provideAlternativeFeedback(element, 'active');
        }
      }
    }
  });
};

/**
 * Creates a reduced motion stylesheet and injects it into the document
 */
export const injectReducedMotionStyles = (): void => {
  // Check if styles are already injected
  if (document.getElementById('reduced-motion-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'reduced-motion-styles';
  style.textContent = `
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Provide alternative feedback for interactive elements */
      button:hover,
      a:hover,
      [role="button"]:hover,
      [tabindex]:hover {
        background-color: rgba(59, 130, 246, 0.1) !important;
        border-color: rgba(59, 130, 246, 0.3) !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        transform: none !important;
      }
      
      button:focus,
      a:focus,
      [role="button"]:focus,
      [tabindex]:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
      }
      
      button:active,
      a:active,
      [role="button"]:active,
      [tabindex]:active {
        background-color: rgba(59, 130, 246, 0.2) !important;
        transform: none !important;
        scale: none !important;
      }
      
      /* Disable parallax and transform effects */
      [style*="transform"],
      [style*="translate"] {
        transform: none !important;
      }
    }
    
    /* Custom reduced motion classes */
    .animations-disabled * {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
    
    .motion-reduced * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    
    /* Enhanced focus indicators for better accessibility */
    .focus-enhanced:focus {
      outline: 3px solid #3b82f6;
      outline-offset: 2px;
      box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2);
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      button,
      a,
      [role="button"] {
        border: 2px solid currentColor;
      }
      
      button:focus,
      a:focus,
      [role="button"]:focus {
        outline: 3px solid;
        outline-offset: 2px;
      }
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Tests keyboard navigation and reports issues
 * @param container - Container to test within
 * @returns Array of accessibility issues found
 */
export const testKeyboardNavigation = (container: HTMLElement = document.body): string[] => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const issues: string[] = [];
  
  focusableElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    
    // Check for missing labels
    if (!htmlElement.getAttribute('aria-label') && 
        !htmlElement.getAttribute('aria-labelledby') && 
        !htmlElement.textContent?.trim() &&
        !htmlElement.getAttribute('title')) {
      issues.push(`Element ${index + 1} (${htmlElement.tagName.toLowerCase()}) lacks accessible label`);
    }
    
    // Check for proper focus indicators
    const computedStyle = window.getComputedStyle(htmlElement);
    if (!computedStyle.outline && !computedStyle.boxShadow && !htmlElement.classList.contains('focus-enhanced')) {
      issues.push(`Element ${index + 1} (${htmlElement.tagName.toLowerCase()}) lacks focus indicator`);
    }
    
    // Check for keyboard event handlers
    const hasClickHandler = htmlElement.onclick !== null;
    const hasKeyHandler = htmlElement.onkeydown !== null || htmlElement.onkeyup !== null;
    
    if (hasClickHandler && !hasKeyHandler && htmlElement.tagName.toLowerCase() !== 'button' && htmlElement.tagName.toLowerCase() !== 'a') {
      issues.push(`Element ${index + 1} (${htmlElement.tagName.toLowerCase()}) has click handler but no keyboard handler`);
    }
  });
  
  if (issues.length > 0) {
    console.warn('Keyboard navigation issues found:', issues);
  }
  
  return issues;
};

/**
 * Initializes accessibility enhancements for the entire application
 */
export const initializeAccessibilityEnhancements = (): void => {
  // Inject reduced motion styles
  injectReducedMotionStyles();
  
  // Add skip link to main content
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:no-underline';
  skipLink.setAttribute('tabindex', '0');
  
  // Insert skip link as first element
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add main content landmark if it doesn't exist
  if (!document.getElementById('main-content')) {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      main.id = 'main-content';
    }
  }
  
  // Announce reduced motion preference
  if (prefersReducedMotion()) {
    setTimeout(() => {
      announceAnimationState('disabled', 'page');
    }, 1000);
  }
  
  // Test keyboard navigation on load
  setTimeout(() => {
    const issues = testKeyboardNavigation();
    if (issues.length === 0) {
      console.log('✅ Keyboard navigation test passed');
    }
  }, 2000);
};/**

 * Screen reader testing utilities
 */
export interface ScreenReaderTest {
  element: HTMLElement;
  expectedText: string;
  hasAriaLabel: boolean;
  hasRole: boolean;
  isAccessible: boolean;
}

export const testScreenReaderCompatibility = (container: HTMLElement = document.body): ScreenReaderTest[] => {
  const results: ScreenReaderTest[] = [];
  const animatedElements = container.querySelectorAll('[data-animated="true"], .animated, [class*="animate"]');
  
  animatedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    const ariaLabel = htmlElement.getAttribute('aria-label');
    const ariaLabelledBy = htmlElement.getAttribute('aria-labelledby');
    const role = htmlElement.getAttribute('role');
    const textContent = htmlElement.textContent?.trim() || '';
    
    const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);
    const hasRole = !!role;
    const expectedText = ariaLabel || textContent || 'Animated element';
    
    // Check if element is accessible
    const isAccessible = hasAriaLabel || textContent.length > 0 || hasRole;
    
    results.push({
      element: htmlElement,
      expectedText,
      hasAriaLabel,
      hasRole,
      isAccessible
    });
  });
  
  return results;
};

/**
 * Color contrast testing
 */
export interface ColorContrastTest {
  element: HTMLElement;
  foregroundColor: string;
  backgroundColor: string;
  contrastRatio: number;
  passesAA: boolean;
  passesAAA: boolean;
}

export const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const testColorContrast = (container: HTMLElement = document.body): ColorContrastTest[] => {
  const results: ColorContrastTest[] = [];
  const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a');
  
  textElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    const styles = window.getComputedStyle(htmlElement);
    const foregroundColor = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    if (foregroundColor && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const contrastRatio = calculateContrastRatio(foregroundColor, backgroundColor);
      const passesAA = contrastRatio >= 4.5;
      const passesAAA = contrastRatio >= 7;
      
      results.push({
        element: htmlElement,
        foregroundColor,
        backgroundColor,
        contrastRatio,
        passesAA,
        passesAAA
      });
    }
  });
  
  return results;
};

/**
 * Comprehensive accessibility audit
 */
export interface AccessibilityAudit {
  reducedMotion: boolean;
  screenReaderTests: ScreenReaderTest[];
  keyboardTests: string[];
  contrastTests: ColorContrastTest[];
  overallScore: number;
  recommendations: string[];
}

export const runAccessibilityAudit = (container: HTMLElement = document.body): AccessibilityAudit => {
  const reducedMotion = prefersReducedMotion();
  const screenReaderTests = testScreenReaderCompatibility(container);
  const keyboardTests = testKeyboardNavigation(container);
  const contrastTests = testColorContrast(container);
  
  const recommendations: string[] = [];
  
  // Analyze screen reader results
  const inaccessibleScreenReaderElements = screenReaderTests.filter(test => !test.isAccessible);
  if (inaccessibleScreenReaderElements.length > 0) {
    recommendations.push(`${inaccessibleScreenReaderElements.length} animated elements lack proper ARIA labels`);
    recommendations.push('Add aria-label or aria-labelledby attributes to animated elements');
  }
  
  // Analyze keyboard navigation results
  if (keyboardTests.length > 0) {
    recommendations.push(`${keyboardTests.length} keyboard navigation issues found`);
    recommendations.push('Fix keyboard accessibility issues');
  }
  
  // Analyze color contrast results
  const failingContrastElements = contrastTests.filter(test => !test.passesAA);
  if (failingContrastElements.length > 0) {
    recommendations.push(`${failingContrastElements.length} elements fail color contrast requirements`);
    recommendations.push('Improve color contrast to meet WCAG AA standards (4.5:1 ratio)');
  }
  
  // Reduced motion recommendations
  if (reducedMotion) {
    recommendations.push('User prefers reduced motion - ensure animations can be disabled');
  }
  
  // Calculate overall score
  const totalIssues = inaccessibleScreenReaderElements.length + keyboardTests.length + failingContrastElements.length;
  const totalElements = screenReaderTests.length + contrastTests.length + 1; // +1 for keyboard test
  const overallScore = totalElements > 0 ? Math.max(0, Math.round(((totalElements - totalIssues) / totalElements) * 100)) : 100;
  
  return {
    reducedMotion,
    screenReaderTests,
    keyboardTests,
    contrastTests,
    overallScore,
    recommendations
  };
};

/**
 * Generate accessibility report
 */
export const generateAccessibilityReport = (audit: AccessibilityAudit): string => {
  let report = `# Accessibility Audit Report\n\n`;
  report += `**Overall Score:** ${audit.overallScore}%\n`;
  report += `**Reduced Motion Preference:** ${audit.reducedMotion ? 'Enabled' : 'Disabled'}\n\n`;
  
  report += `## Screen Reader Compatibility\n`;
  report += `**Total Elements:** ${audit.screenReaderTests.length}\n`;
  report += `**Accessible:** ${audit.screenReaderTests.filter(t => t.isAccessible).length}\n\n`;
  
  report += `## Keyboard Navigation\n`;
  report += `**Issues Found:** ${audit.keyboardTests.length}\n\n`;
  
  report += `## Color Contrast\n`;
  report += `**Total Elements:** ${audit.contrastTests.length}\n`;
  report += `**Passing AA:** ${audit.contrastTests.filter(t => t.passesAA).length}\n`;
  report += `**Passing AAA:** ${audit.contrastTests.filter(t => t.passesAAA).length}\n\n`;
  
  if (audit.recommendations.length > 0) {
    report += `## Recommendations\n`;
    audit.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  
  return report;
};