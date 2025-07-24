/**
 * Comprehensive test runner for animation performance and compatibility
 */

import { 
  runAnimationTests, 
  AnimationPerformanceMonitor,
  testAnimationPerformance,
  type PerformanceMetrics 
} from './crossBrowserTest';

export interface TestResult {
  testName: string;
  passed: boolean;
  metrics?: PerformanceMetrics;
  error?: string;
  recommendations: string[];
}

export interface TestSuite {
  name: string;
  results: TestResult[];
  overallScore: number;
  summary: string;
}

/**
 * Test animation performance for specific components
 */
export const testComponentPerformance = async (
  componentName: string,
  testFunction: () => void,
  expectedFps: number = 55
): Promise<TestResult> => {
  try {
    const metrics = await testAnimationPerformance(testFunction, 3000);
    const passed = metrics.fps >= expectedFps && metrics.frameDrops < 5;
    
    const recommendations: string[] = [];
    if (metrics.fps < expectedFps) {
      recommendations.push(`FPS below target (${metrics.fps} < ${expectedFps})`);
      recommendations.push('Consider reducing animation complexity');
    }
    
    if (metrics.frameDrops > 5) {
      recommendations.push(`Too many frame drops (${metrics.frameDrops})`);
      recommendations.push('Optimize animation timing and GPU usage');
    }
    
    if (metrics.memoryUsage > 50) {
      recommendations.push(`High memory usage (${metrics.memoryUsage.toFixed(2)}MB)`);
      recommendations.push('Check for memory leaks in animations');
    }
    
    return {
      testName: `${componentName} Performance`,
      passed,
      metrics,
      recommendations
    };
  } catch (error) {
    return {
      testName: `${componentName} Performance`,
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      recommendations: ['Fix component errors before testing performance']
    };
  }
};

/**
 * Test scroll-based animations
 */
export const testScrollAnimations = async (): Promise<TestResult> => {
  const recommendations: string[] = [];
  let passed = true;
  
  try {
    // Test scroll performance
    const scrollTest = () => {
      // Simulate scroll events
      for (let i = 0; i < 100; i++) {
        window.dispatchEvent(new Event('scroll'));
      }
    };
    
    const metrics = await testAnimationPerformance(scrollTest, 2000);
    
    if (metrics.fps < 50) {
      passed = false;
      recommendations.push('Scroll animations causing performance issues');
      recommendations.push('Consider debouncing scroll events');
    }
    
    // Test intersection observer
    if (!('IntersectionObserver' in window)) {
      passed = false;
      recommendations.push('IntersectionObserver not supported');
      recommendations.push('Add polyfill for older browsers');
    }
    
    return {
      testName: 'Scroll Animations',
      passed,
      metrics,
      recommendations
    };
  } catch (error) {
    return {
      testName: 'Scroll Animations',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      recommendations: ['Fix scroll animation implementation']
    };
  }
};

/**
 * Test mobile performance
 */
export const testMobilePerformance = async (): Promise<TestResult> => {
  const recommendations: string[] = [];
  let passed = true;
  
  try {
    // Simulate mobile conditions
    const mobileTest = () => {
      // Create multiple animated elements
      const elements: HTMLElement[] = [];
      for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
          position: absolute;
          width: 50px;
          height: 50px;
          background: #3b82f6;
          transform: translateX(${i * 10}px);
          transition: transform 0.5s ease;
        `;
        document.body.appendChild(el);
        elements.push(el);
      }
      
      // Animate them
      setTimeout(() => {
        elements.forEach((el, i) => {
          el.style.transform = `translateX(${i * 20}px) scale(1.2)`;
        });
      }, 100);
      
      // Cleanup
      setTimeout(() => {
        elements.forEach(el => document.body.removeChild(el));
      }, 1000);
    };
    
    const metrics = await testAnimationPerformance(mobileTest, 2000);
    
    // Mobile should maintain at least 45fps
    if (metrics.fps < 45) {
      passed = false;
      recommendations.push(`Mobile FPS too low (${metrics.fps})`);
      recommendations.push('Reduce animation complexity for mobile');
    }
    
    if (metrics.memoryUsage > 30) {
      passed = false;
      recommendations.push(`High mobile memory usage (${metrics.memoryUsage.toFixed(2)}MB)`);
      recommendations.push('Optimize memory usage for mobile devices');
    }
    
    return {
      testName: 'Mobile Performance',
      passed,
      metrics,
      recommendations
    };
  } catch (error) {
    return {
      testName: 'Mobile Performance',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      recommendations: ['Fix mobile animation implementation']
    };
  }
};

/**
 * Test accessibility compliance
 */
export const testAccessibilityCompliance = async (): Promise<TestResult> => {
  const recommendations: string[] = [];
  let passed = true;
  
  try {
    // Test reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Test focus management
    const focusTest = () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      button.focus();
      
      const hasFocus = document.activeElement === button;
      document.body.removeChild(button);
      return hasFocus;
    };
    
    const focusWorks = focusTest();
    if (!focusWorks) {
      passed = false;
      recommendations.push('Focus management not working properly');
    }
    
    // Test keyboard navigation
    const keyboardTest = () => {
      const elements = document.querySelectorAll('[tabindex], button, a, input, select, textarea');
      return elements.length > 0;
    };
    
    const hasKeyboardElements = keyboardTest();
    if (!hasKeyboardElements) {
      recommendations.push('Add keyboard navigation support');
    }
    
    // Test ARIA labels
    const ariaTest = () => {
      const animatedElements = document.querySelectorAll('[data-animated="true"]');
      let hasAriaLabels = true;
      
      animatedElements.forEach(el => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          hasAriaLabels = false;
        }
      });
      
      return hasAriaLabels;
    };
    
    const hasAriaLabels = ariaTest();
    if (!hasAriaLabels) {
      recommendations.push('Add ARIA labels to animated elements');
    }
    
    if (reducedMotion) {
      recommendations.push('User prefers reduced motion - ensure animations are disabled');
    }
    
    return {
      testName: 'Accessibility Compliance',
      passed,
      recommendations
    };
  } catch (error) {
    return {
      testName: 'Accessibility Compliance',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      recommendations: ['Fix accessibility implementation']
    };
  }
};

/**
 * Run comprehensive test suite
 */
export const runComprehensiveTests = async (): Promise<TestSuite> => {
  const results: TestResult[] = [];
  
  console.log('🧪 Starting comprehensive animation tests...');
  
  // Run all tests
  const tests = [
    testScrollAnimations(),
    testMobilePerformance(),
    testAccessibilityCompliance(),
  ];
  
  const testResults = await Promise.all(tests);
  results.push(...testResults);
  
  // Calculate overall score
  const passedTests = results.filter(r => r.passed).length;
  const overallScore = Math.round((passedTests / results.length) * 100);
  
  // Generate summary
  let summary = `${passedTests}/${results.length} tests passed (${overallScore}%)`;
  
  if (overallScore >= 90) {
    summary += ' - Excellent performance! 🎉';
  } else if (overallScore >= 70) {
    summary += ' - Good performance with room for improvement 👍';
  } else if (overallScore >= 50) {
    summary += ' - Performance needs attention ⚠️';
  } else {
    summary += ' - Critical performance issues detected ❌';
  }
  
  return {
    name: 'Animation Performance & Compatibility Suite',
    results,
    overallScore,
    summary
  };
};

/**
 * Generate detailed test report
 */
export const generateTestReport = (testSuite: TestSuite): string => {
  let report = `# Animation Test Report\n\n`;
  report += `**Suite:** ${testSuite.name}\n`;
  report += `**Overall Score:** ${testSuite.overallScore}%\n`;
  report += `**Summary:** ${testSuite.summary}\n\n`;
  
  report += `## Test Results\n\n`;
  
  testSuite.results.forEach((result, index) => {
    report += `### ${index + 1}. ${result.testName}\n`;
    report += `**Status:** ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    
    if (result.metrics) {
      report += `**Performance Metrics:**\n`;
      report += `- FPS: ${result.metrics.fps.toFixed(1)}\n`;
      report += `- Frame Drops: ${result.metrics.frameDrops}\n`;
      report += `- Memory Usage: ${result.metrics.memoryUsage.toFixed(2)}MB\n`;
      report += `- Duration: ${result.metrics.animationDuration.toFixed(0)}ms\n`;
    }
    
    if (result.error) {
      report += `**Error:** ${result.error}\n`;
    }
    
    if (result.recommendations.length > 0) {
      report += `**Recommendations:**\n`;
      result.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
    }
    
    report += `\n`;
  });
  
  report += `## Browser Compatibility\n\n`;
  report += `This report was generated on ${new Date().toLocaleString()}\n`;
  report += `User Agent: ${navigator.userAgent}\n`;
  
  return report;
};

/**
 * Export test results to console with formatting
 */
export const logTestResults = (testSuite: TestSuite): void => {
  console.group('🧪 Animation Test Results');
  console.log(`Suite: ${testSuite.name}`);
  console.log(`Overall Score: ${testSuite.overallScore}%`);
  console.log(`Summary: ${testSuite.summary}`);
  
  testSuite.results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.group(`${status} ${result.testName}`);
    
    if (result.metrics) {
      console.log(`FPS: ${result.metrics.fps.toFixed(1)}`);
      console.log(`Frame Drops: ${result.metrics.frameDrops}`);
      console.log(`Memory: ${result.metrics.memoryUsage.toFixed(2)}MB`);
    }
    
    if (result.error) {
      console.error(`Error: ${result.error}`);
    }
    
    if (result.recommendations.length > 0) {
      console.log('Recommendations:');
      result.recommendations.forEach(rec => console.log(`- ${rec}`));
    }
    
    console.groupEnd();
  });
  
  console.groupEnd();
};