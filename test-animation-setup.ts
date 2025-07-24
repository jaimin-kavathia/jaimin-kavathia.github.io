/**
 * Comprehensive animation testing setup
 * Run this script to test animations across browsers and devices
 */

import { runComprehensiveTests, logTestResults, generateTestReport } from './src/utils/testRunner';
import { runAccessibilityAudit, generateAccessibilityReport } from './src/utils/accessibility';
import { runAnimationTests } from './src/utils/crossBrowserTest';
import { animationPresets, validateAnimationTiming, generateTimingRecommendations } from './src/utils/animationTiming';

/**
 * Main test runner function
 */
async function runAllTests() {
  console.log('🚀 Starting comprehensive animation test suite...\n');
  
  try {
    // 1. Run cross-browser compatibility tests
    console.log('📱 Running cross-browser compatibility tests...');
    const compatibilityResults = await runAnimationTests();
    
    console.log('✅ Browser:', compatibilityResults.compatibility.browser.name, compatibilityResults.compatibility.browser.version);
    console.log('✅ Platform:', compatibilityResults.compatibility.browser.platform);
    console.log('✅ Mobile:', compatibilityResults.compatibility.browser.mobile ? 'Yes' : 'No');
    console.log('✅ Animation Support:', Object.entries(compatibilityResults.compatibility.support)
      .filter(([, supported]) => supported)
      .map(([feature]) => feature)
      .join(', '));
    
    if (compatibilityResults.compatibility.recommendations.length > 0) {
      console.log('⚠️  Recommendations:');
      compatibilityResults.compatibility.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
    
    console.log(`✅ Performance: ${compatibilityResults.performance.fps.toFixed(1)} FPS, ${compatibilityResults.performance.frameDrops} frame drops\n`);
    
    // 2. Run comprehensive performance tests
    console.log('⚡ Running performance tests...');
    const performanceResults = await runComprehensiveTests();
    logTestResults(performanceResults);
    
    // 3. Run accessibility audit
    console.log('\n♿ Running accessibility audit...');
    const accessibilityResults = runAccessibilityAudit();
    console.log(`✅ Accessibility Score: ${accessibilityResults.overallScore}%`);
    console.log(`✅ Reduced Motion: ${accessibilityResults.reducedMotion ? 'Enabled' : 'Disabled'}`);
    console.log(`✅ Screen Reader Elements: ${accessibilityResults.screenReaderTests.filter(t => t.isAccessible).length}/${accessibilityResults.screenReaderTests.length} accessible`);
    console.log(`✅ Keyboard Issues: ${accessibilityResults.keyboardTests.length} found`);
    console.log(`✅ Color Contrast: ${accessibilityResults.contrastTests.filter(t => t.passesAA).length}/${accessibilityResults.contrastTests.length} passing AA`);
    
    if (accessibilityResults.recommendations.length > 0) {
      console.log('⚠️  Accessibility Recommendations:');
      accessibilityResults.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
    
    // 4. Validate animation timing presets
    console.log('\n⏱️  Validating animation timing presets...');
    let timingIssues = 0;
    
    Object.entries(animationPresets).forEach(([name, preset]) => {
      const issues = validateAnimationTiming(preset.timing);
      const recommendations = generateTimingRecommendations(preset.timing, name);
      
      if (issues.length > 0 || recommendations.length > 0) {
        console.log(`⚠️  ${name}:`);
        issues.forEach(issue => console.log(`   ❌ ${issue}`));
        recommendations.forEach(rec => console.log(`   💡 ${rec}`));
        timingIssues++;
      }
    });
    
    if (timingIssues === 0) {
      console.log('✅ All animation timing presets are valid');
    }
    
    // 5. Generate comprehensive report
    console.log('\n📊 Generating comprehensive report...');
    
    const performanceReport = generateTestReport(performanceResults);
    const accessibilityReport = generateAccessibilityReport(accessibilityResults);
    
    const fullReport = `
# Comprehensive Animation Test Report

Generated on: ${new Date().toLocaleString()}
Browser: ${compatibilityResults.compatibility.browser.name} ${compatibilityResults.compatibility.browser.version}
Platform: ${compatibilityResults.compatibility.browser.platform}
Mobile: ${compatibilityResults.compatibility.browser.mobile ? 'Yes' : 'No'}

## Summary Scores
- **Performance Score:** ${performanceResults.overallScore}%
- **Accessibility Score:** ${accessibilityResults.overallScore}%
- **Animation Timing:** ${timingIssues === 0 ? '✅ Valid' : `⚠️ ${timingIssues} issues found`}

## Browser Compatibility
${compatibilityResults.compatibility.recommendations.length > 0 ? 
  '### Recommendations\n' + compatibilityResults.compatibility.recommendations.map(r => `- ${r}`).join('\n') : 
  '✅ No compatibility issues found'}

${performanceReport}

${accessibilityReport}

## Animation Timing Analysis
${timingIssues > 0 ? `Found ${timingIssues} timing issues in presets. Check console for details.` : '✅ All animation timing presets are optimized'}

## Overall Assessment
${getOverallAssessment(performanceResults.overallScore, accessibilityResults.overallScore, timingIssues)}
`;
    
    // Save report to console and potentially to file
    console.log('\n📋 Full Report:');
    console.log(fullReport);
    
    // Test specific components if they exist
    await testSpecificComponents();
    
    console.log('\n🎉 Animation testing complete!');
    
    return {
      performance: performanceResults,
      accessibility: accessibilityResults,
      compatibility: compatibilityResults,
      timingIssues,
      report: fullReport
    };
    
  } catch (error) {
    console.error('❌ Error running tests:', error);
    throw error;
  }
}

/**
 * Test specific animation components
 */
async function testSpecificComponents() {
  console.log('\n🧩 Testing specific animation components...');
  
  const componentsToTest = [
    'ScrollReveal',
    'AnimatedCounter',
    'ParticleBackground',
    'StaggerContainer',
    'PageTransition'
  ];
  
  for (const component of componentsToTest) {
    try {
      // Check if component exists in DOM
      const elements = document.querySelectorAll(`[data-component="${component}"], .${component.toLowerCase()}`);
      
      if (elements.length > 0) {
        console.log(`✅ ${component}: ${elements.length} instances found`);
        
        // Test each instance
        elements.forEach((element, index) => {
          const htmlElement = element as HTMLElement;
          
          // Check for required attributes
          const hasAriaLabel = htmlElement.getAttribute('aria-label');
          const hasRole = htmlElement.getAttribute('role');
          const hasDataAnimated = htmlElement.getAttribute('data-animated');
          
          if (!hasAriaLabel && !hasRole) {
            console.log(`   ⚠️  Instance ${index + 1}: Missing accessibility attributes`);
          }
          
          if (!hasDataAnimated) {
            console.log(`   💡 Instance ${index + 1}: Consider adding data-animated="true" for testing`);
          }
        });
      } else {
        console.log(`⚠️  ${component}: No instances found in DOM`);
      }
    } catch (error) {
      console.log(`❌ ${component}: Error testing component -`, error);
    }
  }
}

/**
 * Generate overall assessment
 */
function getOverallAssessment(performanceScore: number, accessibilityScore: number, timingIssues: number): string {
  const avgScore = (performanceScore + accessibilityScore) / 2;
  
  if (avgScore >= 90 && timingIssues === 0) {
    return '🎉 **Excellent!** Your animations are well-optimized, accessible, and performant.';
  } else if (avgScore >= 75 && timingIssues <= 2) {
    return '👍 **Good!** Your animations are solid with minor areas for improvement.';
  } else if (avgScore >= 60 && timingIssues <= 5) {
    return '⚠️  **Needs Attention** Your animations need optimization for better performance and accessibility.';
  } else {
    return '❌ **Critical Issues** Your animations have significant performance and accessibility problems that need immediate attention.';
  }
}

/**
 * Export for use in other contexts
 */
export { runAllTests };

// Auto-run if this script is executed directly
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllTests);
} else if (typeof window !== 'undefined') {
  // Run immediately if DOM is already loaded
  runAllTests();
}