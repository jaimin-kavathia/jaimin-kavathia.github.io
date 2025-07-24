/**
 * Comprehensive accessibility testing utilities
 * Tests WCAG compliance and accessibility best practices
 */

export interface AccessibilityTestResult {
  test: string;
  level: 'A' | 'AA' | 'AAA';
  passed: boolean;
  message: string;
  element?: Element;
  recommendation?: string;
}

/**
 * Tests color contrast ratios
 */
export const testColorContrast = (): AccessibilityTestResult[] => {
  const results: AccessibilityTestResult[] = [];
  
  // Helper function to convert RGB to relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  // Helper function to calculate contrast ratio
  const getContrastRatio = (color1: string, color2: string): number => {
    const parseColor = (color: string): [number, number, number] => {
      if (color.startsWith('rgb')) {
        const matches = color.match(/\d+/g);
        return matches ? [parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2])] : [0, 0, 0];
      }
      return [0, 0, 0]; // Default for complex colors
    };
    
    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);
    
    const lum1 = getLuminance(r1, g1, b1);
    const lum2 = getLuminance(r2, g2, b2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };
  
  try {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a, label');
    
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      const fontSize = parseFloat(styles.fontSize);
      const fontWeight = styles.fontWeight;
      
      // Skip elements with no visible text
      if (!element.textContent?.trim()) return;
      
      // Basic contrast check for elements with simple RGB colors
      if (color.startsWith('rgb') && backgroundColor.startsWith('rgb')) {
        const contrastRatio = getContrastRatio(color, backgroundColor);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
        
        const minRatio = isLargeText ? 3 : 4.5; // WCAG AA standards
        const passed = contrastRatio >= minRatio;
        
        results.push({
          test: `Color Contrast - Element ${index + 1}`,
          level: 'AA',
          passed,
          message: `Contrast ratio: ${contrastRatio.toFixed(2)}:1 (${isLargeText ? 'large' : 'normal'} text, min: ${minRatio}:1)`,
          element,
          recommendation: passed ? undefined : 'Increase color contrast to meet WCAG AA standards'
        });
      }
    });
    
  } catch (error) {
    results.push({
      test: 'Color Contrast Analysis',
      level: 'AA',
      passed: false,
      message: `Error analyzing color contrast: ${error}`,
      recommendation: 'Manual color contrast testing recommended'
    });
  }
  
  return results;
};

/**
 * Tests keyboard navigation
 */
export const testKeyboardNavigation = (): AccessibilityTestResult[] => {
  const results: AccessibilityTestResult[] = [];
  
  try {
    // Test focusable elements
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    results.push({
      test: 'Focusable Elements Present',
      level: 'A',
      passed: focusableElements.length > 0,
      message: `Found ${focusableElements.length} focusable elements`,
      recommendation: focusableElements.length === 0 ? 'Add focusable elements for keyboard navigation' : undefined
    });
    
    // Test skip link
    const skipLink = document.querySelector('a[href="#main-content"]');
    results.push({
      test: 'Skip to Main Content Link',
      level: 'A',
      passed: !!skipLink,
      message: skipLink ? 'Skip link found' : 'Skip link not found',
      element: skipLink || undefined,
      recommendation: !skipLink ? 'Add skip to main content link for keyboard users' : undefined
    });
    
    // Test focus indicators
    let elementsWithFocusStyles = 0;
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus');
      if (styles.outline !== 'none' || styles.boxShadow !== 'none') {
        elementsWithFocusStyles++;
      }
    });
    
    const focusStylesRatio = elementsWithFocusStyles / focusableElements.length;
    results.push({
      test: 'Focus Indicators',
      level: 'AA',
      passed: focusStylesRatio > 0.8, // At least 80% should have focus styles
      message: `${elementsWithFocusStyles}/${focusableElements.length} elements have focus indicators`,
      recommendation: focusStylesRatio <= 0.8 ? 'Add visible focus indicators to all interactive elements' : undefined
    });
    
    // Test tab order
    const tabbableElements = Array.from(focusableElements).filter(el => {
      const tabIndex = (el as HTMLElement).tabIndex;
      return tabIndex >= 0;
    });
    
    results.push({
      test: 'Tab Order',
      level: 'A',
      passed: tabbableElements.length > 0,
      message: `${tabbableElements.length} elements in tab order`,
      recommendation: tabbableElements.length === 0 ? 'Ensure interactive elements are in logical tab order' : undefined
    });
    
  } catch (error) {
    results.push({
      test: 'Keyboard Navigation Tests',
      level: 'A',
      passed: false,
      message: `Error testing keyboard navigation: ${error}`,
      recommendation: 'Manual keyboard navigation testing recommended'
    });
  }
  
  return results;
};

/**
 * Tests semantic HTML and ARIA usage
 */
export const testSemanticHTML = (): AccessibilityTestResult[] => {
  const results: AccessibilityTestResult[] = [];
  
  try {
    // Test landmark elements
    const landmarks = {
      main: document.querySelector('main'),
      nav: document.querySelector('nav'),
      header: document.querySelector('header'),
      footer: document.querySelector('footer')
    };
    
    Object.entries(landmarks).forEach(([landmark, element]) => {
      results.push({
        test: `${landmark.charAt(0).toUpperCase() + landmark.slice(1)} Landmark`,
        level: 'A',
        passed: !!element,
        message: element ? `${landmark} landmark found` : `${landmark} landmark not found`,
        element: element || undefined,
        recommendation: !element ? `Add <${landmark}> element for better page structure` : undefined
      });
    });
    
    // Test heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    
    const hasH1 = headingLevels.includes(1);
    const hasProperHierarchy = headingLevels.every((level, index) => {
      if (index === 0) return true;
      return level <= headingLevels[index - 1] + 1;
    });
    
    results.push({
      test: 'H1 Heading Present',
      level: 'A',
      passed: hasH1,
      message: hasH1 ? 'H1 heading found' : 'H1 heading not found',
      recommendation: !hasH1 ? 'Add H1 heading as main page title' : undefined
    });
    
    results.push({
      test: 'Heading Hierarchy',
      level: 'AA',
      passed: hasProperHierarchy,
      message: hasProperHierarchy ? 'Proper heading hierarchy' : 'Heading hierarchy issues found',
      recommendation: !hasProperHierarchy ? 'Ensure headings follow logical hierarchy (H1 > H2 > H3, etc.)' : undefined
    });
    
    // Test ARIA attributes
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
    const elementsWithAriaLabelledby = document.querySelectorAll('[aria-labelledby]');
    const elementsWithAriaDescribedby = document.querySelectorAll('[aria-describedby]');
    
    const totalAriaElements = elementsWithAriaLabel.length + elementsWithAriaLabelledby.length + elementsWithAriaDescribedby.length;
    
    results.push({
      test: 'ARIA Labels Usage',
      level: 'AA',
      passed: totalAriaElements > 0,
      message: `Found ${totalAriaElements} elements with ARIA labels`,
      recommendation: totalAriaElements === 0 ? 'Add ARIA labels to improve accessibility for screen readers' : undefined
    });
    
    // Test form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    let inputsWithLabels = 0;
    
    inputs.forEach(input => {
      const id = input.id;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
      
      if (associatedLabel || ariaLabel || ariaLabelledby) {
        inputsWithLabels++;
      }
    });
    
    results.push({
      test: 'Form Input Labels',
      level: 'A',
      passed: inputs.length === 0 || inputsWithLabels === inputs.length,
      message: `${inputsWithLabels}/${inputs.length} form inputs have labels`,
      recommendation: inputsWithLabels < inputs.length ? 'Ensure all form inputs have associated labels' : undefined
    });
    
    // Test image alt text
    const images = document.querySelectorAll('img');
    let imagesWithAlt = 0;
    
    images.forEach(img => {
      if (img.hasAttribute('alt')) {
        imagesWithAlt++;
      }
    });
    
    results.push({
      test: 'Image Alt Text',
      level: 'A',
      passed: images.length === 0 || imagesWithAlt === images.length,
      message: `${imagesWithAlt}/${images.length} images have alt text`,
      recommendation: imagesWithAlt < images.length ? 'Add alt text to all images' : undefined
    });
    
  } catch (error) {
    results.push({
      test: 'Semantic HTML Tests',
      level: 'A',
      passed: false,
      message: `Error testing semantic HTML: ${error}`,
      recommendation: 'Manual semantic HTML review recommended'
    });
  }
  
  return results;
};

/**
 * Tests screen reader compatibility
 */
export const testScreenReaderCompatibility = (): AccessibilityTestResult[] => {
  const results: AccessibilityTestResult[] = [];
  
  try {
    // Test live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    results.push({
      test: 'Live Regions',
      level: 'AA',
      passed: liveRegions.length > 0,
      message: `Found ${liveRegions.length} live regions`,
      recommendation: liveRegions.length === 0 ? 'Add aria-live regions for dynamic content updates' : undefined
    });
    
    // Test hidden content
    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    const srOnlyElements = document.querySelectorAll('.sr-only');
    
    results.push({
      test: 'Screen Reader Content Management',
      level: 'AA',
      passed: hiddenElements.length > 0 || srOnlyElements.length > 0,
      message: `Found ${hiddenElements.length} hidden elements and ${srOnlyElements.length} screen reader only elements`,
      recommendation: hiddenElements.length === 0 && srOnlyElements.length === 0 ? 
        'Consider adding screen reader specific content where helpful' : undefined
    });
    
    // Test role attributes
    const elementsWithRoles = document.querySelectorAll('[role]');
    results.push({
      test: 'ARIA Roles',
      level: 'AA',
      passed: elementsWithRoles.length > 0,
      message: `Found ${elementsWithRoles.length} elements with ARIA roles`,
      recommendation: elementsWithRoles.length === 0 ? 'Add ARIA roles to improve semantic meaning' : undefined
    });
    
    // Test button vs link usage
    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a[href]');
    const clickableElements = document.querySelectorAll('[onclick], .cursor-pointer');
    
    results.push({
      test: 'Interactive Element Semantics',
      level: 'A',
      passed: buttons.length > 0 && links.length > 0,
      message: `Found ${buttons.length} buttons, ${links.length} links, ${clickableElements.length} other clickable elements`,
      recommendation: buttons.length === 0 ? 'Use <button> elements for actions' : 
                     links.length === 0 ? 'Use <a> elements for navigation' : undefined
    });
    
  } catch (error) {
    results.push({
      test: 'Screen Reader Compatibility Tests',
      level: 'AA',
      passed: false,
      message: `Error testing screen reader compatibility: ${error}`,
      recommendation: 'Manual screen reader testing recommended'
    });
  }
  
  return results;
};

/**
 * Tests mobile accessibility
 */
export const testMobileAccessibility = (): AccessibilityTestResult[] => {
  const results: AccessibilityTestResult[] = [];
  
  try {
    // Test touch target sizes
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    let adequateTouchTargets = 0;
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // 44px minimum touch target size
      
      if (rect.width >= minSize && rect.height >= minSize) {
        adequateTouchTargets++;
      }
    });
    
    const touchTargetRatio = adequateTouchTargets / interactiveElements.length;
    results.push({
      test: 'Touch Target Sizes',
      level: 'AA',
      passed: touchTargetRatio > 0.8,
      message: `${adequateTouchTargets}/${interactiveElements.length} elements meet minimum touch target size (44px)`,
      recommendation: touchTargetRatio <= 0.8 ? 'Increase touch target sizes to at least 44x44px' : undefined
    });
    
    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const hasViewportMeta = !!viewportMeta;
    const viewportContent = viewportMeta?.getAttribute('content') || '';
    const hasProperViewport = viewportContent.includes('width=device-width') && 
                             viewportContent.includes('initial-scale=1');
    
    results.push({
      test: 'Viewport Meta Tag',
      level: 'A',
      passed: hasViewportMeta && hasProperViewport,
      message: hasViewportMeta ? 
        `Viewport meta tag found: ${viewportContent}` : 
        'Viewport meta tag not found',
      recommendation: !hasViewportMeta ? 'Add viewport meta tag for mobile responsiveness' :
                     !hasProperViewport ? 'Update viewport meta tag with proper width and scale' : undefined
    });
    
    // Test orientation support
    const supportsOrientationChange = 'onorientationchange' in window;
    results.push({
      test: 'Orientation Change Support',
      level: 'AA',
      passed: supportsOrientationChange,
      message: supportsOrientationChange ? 
        'Orientation change events supported' : 
        'Orientation change events not supported',
      recommendation: !supportsOrientationChange ? 'Test layout in both portrait and landscape orientations' : undefined
    });
    
  } catch (error) {
    results.push({
      test: 'Mobile Accessibility Tests',
      level: 'AA',
      passed: false,
      message: `Error testing mobile accessibility: ${error}`,
      recommendation: 'Manual mobile accessibility testing recommended'
    });
  }
  
  return results;
};

/**
 * Runs comprehensive accessibility tests
 */
export const runAccessibilityTests = (): {
  testResults: AccessibilityTestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    byLevel: {
      A: { passed: number; total: number };
      AA: { passed: number; total: number };
      AAA: { passed: number; total: number };
    };
  };
} => {
  const testResults: AccessibilityTestResult[] = [
    ...testColorContrast(),
    ...testKeyboardNavigation(),
    ...testSemanticHTML(),
    ...testScreenReaderCompatibility(),
    ...testMobileAccessibility()
  ];
  
  const passed = testResults.filter(result => result.passed).length;
  const failed = testResults.filter(result => !result.passed).length;
  const total = testResults.length;
  
  const byLevel = {
    A: { passed: 0, total: 0 },
    AA: { passed: 0, total: 0 },
    AAA: { passed: 0, total: 0 }
  };
  
  testResults.forEach(result => {
    byLevel[result.level].total++;
    if (result.passed) {
      byLevel[result.level].passed++;
    }
  });
  
  return {
    testResults,
    summary: {
      total,
      passed,
      failed,
      byLevel
    }
  };
};

/**
 * Logs accessibility test results
 */
export const logAccessibilityResults = (results: ReturnType<typeof runAccessibilityTests>): void => {
  console.group('♿ Accessibility Test Results');
  
  console.group('📊 Summary');
  console.log(`Total Tests: ${results.summary.total}`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`📈 Pass Rate: ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);
  console.groupEnd();
  
  console.group('📋 By WCAG Level');
  Object.entries(results.summary.byLevel).forEach(([level, stats]) => {
    const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
    console.log(`Level ${level}: ${stats.passed}/${stats.total} (${passRate}%)`);
  });
  console.groupEnd();
  
  console.group('📋 Detailed Results');
  results.testResults.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} [${result.level}] ${result.test}: ${result.message}`);
    if (result.recommendation) {
      console.log(`   💡 Recommendation: ${result.recommendation}`);
    }
  });
  console.groupEnd();
  
  console.groupEnd();
};