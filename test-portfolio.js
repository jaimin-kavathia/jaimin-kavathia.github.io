/**
 * Comprehensive Portfolio Testing Script
 * Run this script in the browser console to test all aspects of the portfolio
 */

(async function() {
  console.log('🚀 Starting Portfolio Comprehensive Testing...');
  console.log('📋 This will test cross-browser compatibility, mobile optimization, accessibility, and performance');
  
  try {
    // Import test modules dynamically
    const testRunner = await import('./src/utils/testRunner.js');
    const crossBrowserTest = await import('./src/utils/crossBrowserTest.js');
    const accessibilityTest = await import('./src/utils/accessibilityTest.js');
    const mobileOptimization = await import('./src/utils/mobileOptimization.js');
    
    console.log('✅ Test modules loaded successfully');
    
    // Run comprehensive tests
    console.log('\n🧪 Running comprehensive tests...');
    const results = testRunner.runComprehensiveTests();
    
    // Log detailed results
    testRunner.logComprehensiveResults(results);
    
    // Provide actionable feedback
    console.log('\n🎯 Generating actionable feedback...');
    testRunner.runTestsWithFeedback();
    
    // Additional device-specific tests
    console.log('\n📱 Running device-specific tests...');
    const deviceInfo = crossBrowserTest.getDeviceInfo();
    
    console.group('📊 Device Information');
    console.table(deviceInfo);
    console.groupEnd();
    
    // Test specific requirements
    console.log('\n✅ Testing Portfolio Requirements...');
    testPortfolioRequirements();
    
    // Final summary
    console.log('\n🎉 Testing Complete!');
    console.log(`Overall Pass Rate: ${results.overallSummary.overallPassRate}%`);
    
    if (results.overallSummary.overallPassRate >= 90) {
      console.log('🌟 Excellent! Your portfolio meets all requirements.');
    } else if (results.overallSummary.overallPassRate >= 80) {
      console.log('👍 Good! Minor improvements needed.');
    } else {
      console.log('⚠️ Needs improvement. Please address the issues above.');
    }
    
  } catch (error) {
    console.error('❌ Error running tests:', error);
    console.log('💡 Make sure you are running this on the portfolio website with all test files available.');
  }
})();

/**
 * Tests specific portfolio requirements
 */
function testPortfolioRequirements() {
  console.group('📋 Portfolio Requirements Testing');
  
  // Test Requirement 1: Professional background display
  testRequirement1();
  
  // Test Requirement 2: Technical skills display
  testRequirement2();
  
  // Test Requirement 3: Projects showcase
  testRequirement3();
  
  // Test Requirement 4: Contact functionality
  testRequirement4();
  
  // Test Requirement 5: Responsive design
  testRequirement5();
  
  // Test Requirement 6: Performance
  testRequirement6();
  
  console.groupEnd();
}

function testRequirement1() {
  console.group('1️⃣ Professional Background (Req 1.1, 1.2, 1.3)');
  
  const tests = [];
  
  // Test name display
  const nameElement = document.querySelector('h1, [role="heading"]');
  const nameText = nameElement?.textContent || '';
  tests.push({
    test: 'Name Display',
    passed: nameText.includes('Jaimin Kavathia'),
    message: nameText.includes('Jaimin Kavathia') ? 
      'Name correctly displayed' : 
      `Name not found or incorrect: "${nameText}"`
  });
  
  // Test title display
  const titleElements = document.querySelectorAll('h2, p, span');
  let titleFound = false;
  titleElements.forEach(el => {
    if (el.textContent?.includes('Flutter Developer')) {
      titleFound = true;
    }
  });
  tests.push({
    test: 'Title Display',
    passed: titleFound,
    message: titleFound ? 
      'Flutter Developer title found' : 
      'Flutter Developer title not found'
  });
  
  // Test experience display
  let experienceFound = false;
  titleElements.forEach(el => {
    if (el.textContent?.includes('4 Years') || el.textContent?.includes('4 years')) {
      experienceFound = true;
    }
  });
  tests.push({
    test: 'Experience Display',
    passed: experienceFound,
    message: experienceFound ? 
      '4 years experience mentioned' : 
      '4 years experience not found'
  });
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
  });
  
  console.groupEnd();
}

function testRequirement2() {
  console.group('2️⃣ Technical Skills (Req 2.1, 2.2, 2.3)');
  
  const tests = [];
  
  // Test skills section exists
  const skillsSection = document.getElementById('skills') || 
                       document.querySelector('[data-section="skills"]') ||
                       document.querySelector('section:has(h2:contains("Skills"))');
  tests.push({
    test: 'Skills Section Exists',
    passed: !!skillsSection,
    message: skillsSection ? 'Skills section found' : 'Skills section not found'
  });
  
  // Test Flutter skill prominence
  const allText = document.body.textContent || '';
  const flutterMentioned = allText.toLowerCase().includes('flutter');
  tests.push({
    test: 'Flutter Skill Prominence',
    passed: flutterMentioned,
    message: flutterMentioned ? 
      'Flutter mentioned in content' : 
      'Flutter not found in content'
  });
  
  // Test skill categories
  const dartMentioned = allText.toLowerCase().includes('dart');
  const mobileMentioned = allText.toLowerCase().includes('mobile');
  tests.push({
    test: 'Related Technologies',
    passed: dartMentioned && mobileMentioned,
    message: `Dart: ${dartMentioned}, Mobile: ${mobileMentioned}`
  });
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
  });
  
  console.groupEnd();
}

function testRequirement3() {
  console.group('3️⃣ Projects Showcase (Req 3.1, 3.2, 3.3, 3.4)');
  
  const tests = [];
  
  // Test projects section exists
  const projectsSection = document.getElementById('projects') || 
                         document.querySelector('[data-section="projects"]');
  tests.push({
    test: 'Projects Section Exists',
    passed: !!projectsSection,
    message: projectsSection ? 'Projects section found' : 'Projects section not found'
  });
  
  // Test project cards
  const projectCards = document.querySelectorAll('[data-project], .project-card, .project');
  tests.push({
    test: 'Project Cards Display',
    passed: projectCards.length > 0,
    message: `Found ${projectCards.length} project cards`
  });
  
  // Test project links
  const projectLinks = document.querySelectorAll('a[href*="github"], a[href*="demo"]');
  tests.push({
    test: 'Project Links',
    passed: projectLinks.length > 0,
    message: `Found ${projectLinks.length} project links`
  });
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
  });
  
  console.groupEnd();
}

function testRequirement4() {
  console.group('4️⃣ Contact Functionality (Req 4.1, 4.2, 4.3, 4.4)');
  
  const tests = [];
  
  // Test contact section exists
  const contactSection = document.getElementById('contact') || 
                        document.querySelector('[data-section="contact"]');
  tests.push({
    test: 'Contact Section Exists',
    passed: !!contactSection,
    message: contactSection ? 'Contact section found' : 'Contact section not found'
  });
  
  // Test contact form
  const contactForm = document.querySelector('form');
  tests.push({
    test: 'Contact Form Exists',
    passed: !!contactForm,
    message: contactForm ? 'Contact form found' : 'Contact form not found'
  });
  
  // Test social media links
  const socialLinks = document.querySelectorAll('a[href*="github"], a[href*="linkedin"]');
  tests.push({
    test: 'Social Media Links',
    passed: socialLinks.length >= 2,
    message: `Found ${socialLinks.length} social media links`
  });
  
  // Test contact methods
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  tests.push({
    test: 'Contact Methods',
    passed: emailLinks.length > 0 || contactForm,
    message: contactForm ? 'Contact form available' : 
             emailLinks.length > 0 ? 'Email link available' : 'No contact methods found'
  });
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
  });
  
  console.groupEnd();
}

function testRequirement5() {
  console.group('5️⃣ Responsive Design (Req 5.1, 5.2, 5.3, 5.4)');
  
  const tests = [];
  
  // Test viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const hasProperViewport = viewportMeta && 
    viewportMeta.getAttribute('content')?.includes('width=device-width');
  tests.push({
    test: 'Viewport Meta Tag',
    passed: !!hasProperViewport,
    message: hasProperViewport ? 
      'Proper viewport meta tag found' : 
      'Viewport meta tag missing or incorrect'
  });
  
  // Test responsive breakpoints
  const currentWidth = window.innerWidth;
  let responsiveLayout = true;
  
  if (currentWidth <= 768) {
    // Mobile test
    const mobileMenu = document.querySelector('[data-mobile-menu], .mobile-menu, button[aria-expanded]');
    if (!mobileMenu) responsiveLayout = false;
  }
  
  tests.push({
    test: 'Responsive Layout',
    passed: responsiveLayout,
    message: responsiveLayout ? 
      'Layout adapts to current screen size' : 
      'Layout issues detected for current screen size'
  });
  
  // Test horizontal scroll
  const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
  tests.push({
    test: 'No Horizontal Scroll',
    passed: !hasHorizontalScroll,
    message: hasHorizontalScroll ? 
      'Horizontal scrollbar detected' : 
      'No horizontal overflow'
  });
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
  });
  
  console.groupEnd();
}

function testRequirement6() {
  console.group('6️⃣ Performance (Req 6.1, 6.2, 6.3, 6.4)');
  
  const tests = [];
  
  // Test page load time
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation) {
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    tests.push({
      test: 'Page Load Time',
      passed: loadTime < 3000,
      message: `Page loaded in ${Math.round(loadTime)}ms (target: <3000ms)`
    });
  }
  
  // Test smooth scrolling
  const smoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
  tests.push({
    test: 'Smooth Scrolling Support',
    passed: smoothScrollSupported,
    message: smoothScrollSupported ? 
      'Smooth scrolling supported' : 
      'Smooth scrolling not supported'
  });
  
  // Test image optimization
  const images = document.querySelectorAll('img');
  let optimizedImages = 0;
  images.forEach(img => {
    if (img.hasAttribute('loading') || img.hasAttribute('data-src')) {
      optimizedImages++;
    }
  });
  const imageOptimizationRatio = images.length > 0 ? optimizedImages / images.length : 1;
  tests.push({
    test: 'Image Optimization',
    passed: imageOptimizationRatio >= 0.8,
    message: `${Math.round(imageOptimizationRatio * 100)}% of images are optimized`
  });
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.test}: ${test.message}`);
  });
  
  console.groupEnd();
}

// Make functions available globally for manual testing
window.testPortfolioRequirements = testPortfolioRequirements;
window.testRequirement1 = testRequirement1;
window.testRequirement2 = testRequirement2;
window.testRequirement3 = testRequirement3;
window.testRequirement4 = testRequirement4;
window.testRequirement5 = testRequirement5;
window.testRequirement6 = testRequirement6;

console.log('📋 Portfolio testing script loaded. Run the script or use individual test functions.');