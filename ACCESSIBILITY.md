# Accessibility Testing Guide

This document provides comprehensive guidance for testing and ensuring the portfolio website meets WCAG 2.1 AA accessibility standards.

## Quick Accessibility Check

### Automated Testing
Run the automated accessibility tests by opening the browser console and executing:

```javascript
// Run comprehensive accessibility tests
import('./src/utils/accessibilityTest.js').then(module => {
  const results = module.runAccessibilityTests();
  module.logAccessibilityResults(results);
});
```

## Manual Accessibility Testing

### 1. Keyboard Navigation Testing

#### Basic Keyboard Navigation
- **Tab Key**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward through interactive elements
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate within components (if applicable)
- **Escape**: Close modals or menus

#### Checklist
- [ ] All interactive elements are reachable via keyboard
- [ ] Tab order is logical and follows visual layout
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps (can always navigate away)
- [ ] Skip to main content link is available and functional
- [ ] Modal dialogs (if any) trap focus appropriately

#### Testing Steps
1. Use only the keyboard to navigate the entire site
2. Start from the top and tab through all elements
3. Verify each interactive element can be activated
4. Check that focus indicators are visible
5. Test the skip link functionality

### 2. Screen Reader Testing

#### Screen Reader Tools
- **NVDA** (Windows, Free): https://www.nvaccess.org/
- **JAWS** (Windows, Commercial): https://www.freedomscientific.com/
- **VoiceOver** (macOS, Built-in): Cmd + F5 to enable
- **Orca** (Linux, Free): Built into most distributions

#### Testing Checklist
- [ ] Page title is descriptive and unique
- [ ] Headings create a logical outline (H1 > H2 > H3)
- [ ] All images have appropriate alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Links have descriptive text

#### VoiceOver Testing (macOS)
1. Enable VoiceOver: `Cmd + F5`
2. Navigate with `Control + Option + Arrow Keys`
3. Use the rotor: `Control + Option + U`
4. Test form interaction: `Control + Option + Space`

### 3. Color and Contrast Testing

#### Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- **Browser Extensions**: axe DevTools, WAVE

#### Requirements
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text** (18pt+ or 14pt+ bold): 3:1 contrast ratio minimum
- **Non-text elements**: 3:1 contrast ratio for UI components

#### Testing Steps
1. Use automated tools to check all text elements
2. Manually verify color combinations
3. Test with different color vision simulations
4. Ensure information isn't conveyed by color alone

### 4. Mobile Accessibility Testing

#### Touch Target Testing
- **Minimum size**: 44x44 pixels (iOS) or 48x48 pixels (Android)
- **Spacing**: At least 8 pixels between targets
- **Placement**: Easy to reach with thumb

#### Testing Checklist
- [ ] Touch targets meet minimum size requirements
- [ ] Adequate spacing between interactive elements
- [ ] Gestures have alternatives (no gesture-only functionality)
- [ ] Orientation changes don't break functionality
- [ ] Zoom up to 200% doesn't break layout

### 5. Form Accessibility Testing

#### Form Requirements
- [ ] All inputs have associated labels
- [ ] Required fields are clearly marked
- [ ] Error messages are descriptive and helpful
- [ ] Success messages are announced
- [ ] Fieldsets group related inputs
- [ ] Instructions are provided before form fields

#### Testing the Contact Form
1. Navigate to the contact form using only keyboard
2. Verify each input has a proper label
3. Submit form with empty required fields
4. Check that error messages are announced by screen reader
5. Fill out form correctly and verify success message

### 6. Semantic HTML Testing

#### Landmark Elements
- [ ] `<header>` for site header
- [ ] `<nav>` for navigation
- [ ] `<main>` for main content
- [ ] `<section>` for content sections
- [ ] `<footer>` for site footer

#### Heading Structure
```
H1: Page Title (only one per page)
├── H2: Major Section
│   ├── H3: Subsection
│   └── H3: Subsection
├── H2: Major Section
│   └── H3: Subsection
└── H2: Major Section
```

#### Testing Steps
1. Use browser developer tools to inspect HTML structure
2. Verify proper use of semantic elements
3. Check heading hierarchy with screen reader
4. Ensure landmarks are properly implemented

## WCAG 2.1 AA Compliance Checklist

### Level A Requirements

#### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images have empty alt attributes
- [ ] Complex images have detailed descriptions

#### 1.3 Adaptable
- [ ] Content structure is preserved when CSS is disabled
- [ ] Reading order is logical
- [ ] Instructions don't rely solely on sensory characteristics

#### 1.4 Distinguishable
- [ ] Color is not the only way to convey information
- [ ] Audio content has controls

#### 2.1 Keyboard Accessible
- [ ] All functionality is available via keyboard
- [ ] No keyboard traps exist
- [ ] Keyboard shortcuts don't conflict

#### 2.4 Navigable
- [ ] Skip links are provided
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link purposes are clear from context

#### 3.1 Readable
- [ ] Page language is specified
- [ ] Language changes are marked

#### 3.2 Predictable
- [ ] Focus doesn't cause unexpected context changes
- [ ] Input doesn't cause unexpected context changes

#### 3.3 Input Assistance
- [ ] Error messages are provided
- [ ] Labels and instructions are provided

#### 4.1 Compatible
- [ ] HTML is valid
- [ ] Elements have complete start and end tags
- [ ] Elements are properly nested

### Level AA Requirements

#### 1.4 Distinguishable
- [ ] Text contrast ratio is at least 4.5:1
- [ ] Large text contrast ratio is at least 3:1
- [ ] Text can be resized up to 200% without loss of functionality

#### 2.4 Navigable
- [ ] Multiple ways to find pages exist
- [ ] Headings and labels are descriptive
- [ ] Focus indicators are visible

#### 3.1 Readable
- [ ] Unusual words are defined
- [ ] Abbreviations are defined

#### 3.2 Predictable
- [ ] Navigation is consistent
- [ ] Identification is consistent

#### 3.3 Input Assistance
- [ ] Error suggestions are provided
- [ ] Error prevention for important data

## Testing Tools and Resources

### Browser Extensions
- **axe DevTools**: Comprehensive accessibility testing
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Built-in Chrome accessibility audit
- **Accessibility Insights**: Microsoft's accessibility testing tool

### Online Tools
- **WebAIM WAVE**: https://wave.webaim.org/
- **axe-core**: https://www.deque.com/axe/
- **Pa11y**: Command-line accessibility testing tool
- **Accessibility Checker**: https://www.accessibilitychecker.org/

### Color Tools
- **Contrast Ratio**: https://contrast-ratio.com/
- **Colorblinding**: https://www.colorblinding.com/
- **Stark**: Design tool for color accessibility

## Common Issues and Solutions

### Issue: Low Color Contrast
**Solution**: Increase contrast between text and background colors
```css
/* Before */
color: #999999;
background: #ffffff;

/* After */
color: #666666;
background: #ffffff;
```

### Issue: Missing Alt Text
**Solution**: Add descriptive alt text to images
```html
<!-- Before -->
<img src="project.jpg">

<!-- After -->
<img src="project.jpg" alt="Flutter mobile app showing user dashboard">
```

### Issue: Unlabeled Form Inputs
**Solution**: Associate labels with form inputs
```html
<!-- Before -->
<input type="email" placeholder="Email">

<!-- After -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>
```

### Issue: Poor Focus Indicators
**Solution**: Add visible focus styles
```css
button:focus,
a:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}
```

### Issue: Inaccessible Navigation
**Solution**: Add proper ARIA labels and keyboard support
```html
<nav aria-label="Main navigation">
  <button aria-expanded="false" aria-controls="nav-menu">
    Menu
  </button>
  <ul id="nav-menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
  </ul>
</nav>
```

## Accessibility Statement Template

```markdown
# Accessibility Statement

This website is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Conformance Status
This website is partially conformant with WCAG 2.1 level AA. "Partially conformant" means that some parts of the content do not fully conform to the accessibility standard.

## Feedback
We welcome your feedback on the accessibility of this website. Please contact us if you encounter accessibility barriers:
- Email: [your-email@example.com]
- Phone: [your-phone-number]

## Technical Specifications
Accessibility of this website relies on the following technologies:
- HTML
- CSS
- JavaScript

## Assessment Approach
This website was assessed using:
- Automated testing tools
- Manual keyboard navigation testing
- Screen reader testing
- Color contrast analysis

Last updated: [Date]
```

## Testing Schedule

### During Development
- [ ] Run automated accessibility tests
- [ ] Test keyboard navigation
- [ ] Verify color contrast
- [ ] Check semantic HTML

### Before Release
- [ ] Complete manual accessibility audit
- [ ] Test with screen reader
- [ ] Verify WCAG 2.1 AA compliance
- [ ] Document any known issues

### Ongoing Maintenance
- [ ] Monthly automated testing
- [ ] Quarterly manual testing
- [ ] Annual comprehensive audit
- [ ] User feedback monitoring

## Success Criteria

### Minimum Acceptable
- [ ] No critical accessibility violations
- [ ] Basic keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader can navigate content

### Recommended Target
- [ ] WCAG 2.1 AA fully compliant
- [ ] Excellent screen reader experience
- [ ] Advanced keyboard shortcuts
- [ ] Accessibility statement published