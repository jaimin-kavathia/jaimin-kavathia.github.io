# Animation Guide - Portfolio Website Phase 2

## Overview

This guide provides comprehensive documentation for the animation system implemented in the portfolio website. It covers best practices, usage patterns, and implementation details for creating smooth, accessible, and performant animations.

## Table of Contents

1. [Animation Philosophy](#animation-philosophy)
2. [Core Components](#core-components)
3. [Timing and Easing](#timing-and-easing)
4. [Performance Guidelines](#performance-guidelines)
5. [Accessibility](#accessibility)
6. [Cross-Browser Support](#cross-browser-support)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)

## Animation Philosophy

### Design Principles

1. **Purpose-Driven**: Every animation should serve a purpose (feedback, guidance, delight)
2. **Performance-First**: Maintain 60fps and respect device capabilities
3. **Accessibility-Aware**: Support reduced motion preferences and screen readers
4. **Consistent**: Use standardized timing and easing across the site
5. **Responsive**: Adapt to different screen sizes and device types

### Animation Hierarchy

- **Micro-interactions** (0-200ms): Immediate feedback for user actions
- **UI Transitions** (200-600ms): Component state changes and navigation
- **Content Animations** (600-1200ms): Section reveals and content entrance
- **Hero Animations** (1200ms+): Dramatic page load and hero section effects
- **Background Animations** (Continuous): Ambient effects and particle systems

## Core Components

### ScrollReveal

Reveals content as it enters the viewport with configurable animations.

```tsx
import { ScrollReveal } from '@/components/animations/ScrollReveal';

<ScrollReveal animation="slideUp" stagger={0.1}>
  <div>Content to reveal</div>
</ScrollReveal>
```

**Props:**
- `animation`: 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'fade' | 'scale'
- `stagger`: Delay between child animations (seconds)
- `threshold`: Intersection threshold (0-1)
- `once`: Whether to animate only once

### AnimatedCounter

Smoothly animates numbers from 0 to target value.

```tsx
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';

<AnimatedCounter 
  end={95} 
  duration={2000}
  suffix="%" 
  easing="skillCounter"
/>
```

**Props:**
- `end`: Target number
- `start`: Starting number (default: 0)
- `duration`: Animation duration in milliseconds
- `suffix`: Text to append (%, +, etc.)
- `easing`: Easing function name

### StaggerContainer

Coordinates animations for multiple child elements.

```tsx
import { StaggerContainer } from '@/components/animations/StaggerContainer';

<StaggerContainer stagger={0.1} animation="slideUp">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerContainer>
```

**Props:**
- `stagger`: Delay between child animations
- `animation`: Animation type for children
- `direction`: 'normal' | 'reverse'

### ParticleBackground

Creates animated background particle systems.

```tsx
import { ParticleBackground } from '@/components/animations/ParticleBackground';

<ParticleBackground 
  particleCount={50}
  speed={0.5}
  color="#3b82f6"
  shape="circle"
/>
```

**Props:**
- `particleCount`: Number of particles (responsive)
- `speed`: Animation speed multiplier
- `color`: Particle color
- `shape`: 'circle' | 'square' | 'triangle'

### PageTransition

Handles page and section transitions.

```tsx
import { PageTransition } from '@/components/animations/PageTransition';

<PageTransition type="fade" duration={0.5}>
  <YourPageContent />
</PageTransition>
```

**Props:**
- `type`: 'fade' | 'slide' | 'scale'
- `duration`: Transition duration
- `direction`: For slide transitions

## Timing and Easing

### Timing Presets

Use predefined timing presets for consistency:

```tsx
import { timingUtils } from '@/utils/easingFunctions';

const preset = timingUtils.getPreset('quickHover');
// { duration: 0.15, easing: [0.25, 0.46, 0.45, 0.94], description: '...' }
```

**Available Presets:**

#### Micro-interactions
- `instantFeedback`: 100ms - Immediate visual feedback
- `quickHover`: 150ms - Quick hover state change
- `buttonPress`: 100ms - Button press feedback
- `focusTransition`: 200ms - Focus state transition

#### UI Transitions
- `modalAppear`: 300ms - Modal/dialog appearance
- `menuSlide`: 300ms - Mobile menu slide animation
- `tabSwitch`: 250ms - Tab switching animation
- `tooltipShow`: 200ms - Tooltip appearance

#### Content Animations
- `sectionReveal`: 800ms - Section content reveal
- `skillBarFill`: 1200ms - Skill bar progressive fill
- `projectCardEntrance`: 600ms - Project card entrance
- `counterAnimation`: 2000ms - Number counting animation

#### Hero Animations
- `heroTitleReveal`: 1500ms - Hero title dramatic reveal
- `heroSubtitleReveal`: 1000ms - Hero subtitle entrance
- `heroCTAReveal`: 800ms - Hero CTA button entrance

### Custom Easing Functions

Portfolio-specific easing functions for different contexts:

```tsx
import { portfolioEasing } from '@/utils/easingFunctions';

// For skill bars
const skillBarEasing = portfolioEasing.skillBar; // [0.34, 1.56, 0.64, 1]

// For button hovers
const buttonHoverEasing = portfolioEasing.buttonHover; // [0.25, 0.46, 0.45, 0.94]
```

### Responsive Timing

Adjust timing based on device capabilities:

```tsx
import { calculateTiming } from '@/utils/easingFunctions';

const baseDuration = 0.5;
const mobileDuration = calculateTiming.forDevice(baseDuration, 'mobile'); // 0.4s
const performanceDuration = calculateTiming.forPerformance(baseDuration, 'low'); // 0.25s
```

## Performance Guidelines

### GPU Acceleration

Use transform and opacity properties for smooth animations:

```css
/* Good - GPU accelerated */
.animated-element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* Avoid - causes layout/paint */
.slow-element {
  left: 100px;
  background-color: red;
}
```

### Will-Change Property

Use `will-change` sparingly and clean up after animations:

```tsx
// Before animation
element.style.willChange = 'transform, opacity';

// After animation
element.style.willChange = 'auto';
```

### Performance Monitoring

Use the built-in performance monitor:

```tsx
import { PerformanceMonitor } from '@/components/animations/PerformanceMonitor';

<PerformanceMonitor>
  <YourAnimatedContent />
</PerformanceMonitor>
```

### Animation Quality Levels

Automatically adjust animation complexity based on device:

```tsx
import { timingUtils } from '@/utils/easingFunctions';

const quality = timingUtils.getQuality('standard');
// { enableParticles: false, enableParallax: true, maxAnimationDuration: 1.0 }
```

## Accessibility

### Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Announcements

Announce animation states to screen readers:

```tsx
import { announceToScreenReader } from '@/utils/accessibility';

// Announce when animation completes
announceToScreenReader('Skill bars loaded', 'polite');
```

### Keyboard Navigation

Ensure animations don't interfere with keyboard navigation:

```tsx
import { enhanceKeyboardNavigation } from '@/utils/accessibility';

// Enhance element with keyboard support
enhanceKeyboardNavigation(element, {
  announceOnFocus: true,
  provideFeedback: true,
  respectReducedMotion: true
});
```

### Focus Management

Maintain proper focus during animations:

```tsx
import { manageFocusForNavigation } from '@/utils/accessibility';

// Manage focus after smooth scroll
manageFocusForNavigation('target-section', 500);
```

## Cross-Browser Support

### CSS Prefixes

Use cross-browser compatible properties:

```css
.cross-browser-animation {
  /* Standard */
  transform: translateZ(0);
  transition: transform 0.3s ease;
  
  /* Webkit */
  -webkit-transform: translateZ(0);
  -webkit-transition: -webkit-transform 0.3s ease;
  
  /* Mozilla */
  -moz-transform: translateZ(0);
  -moz-transition: -moz-transform 0.3s ease;
}
```

### Feature Detection

Check for animation support:

```tsx
import { checkAnimationSupport } from '@/utils/crossBrowserTest';

const support = checkAnimationSupport();
if (support.framerMotion) {
  // Use advanced animations
} else {
  // Fallback to CSS animations
}
```

### Browser-Specific Optimizations

Apply browser-specific fixes:

```css
/* Safari-specific fixes */
@media not all and (min-resolution:.001dpcm) {
  @supports (-webkit-appearance:none) {
    .safari-fix {
      -webkit-transform: translateZ(0);
      -webkit-backface-visibility: hidden;
    }
  }
}

/* Firefox optimizations */
@-moz-document url-prefix() {
  .firefox-optimized {
    /* Use transform instead of clip-path */
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
}
```

## Usage Examples

### Hero Section Animation

```tsx
import { motion } from 'framer-motion';
import { timingUtils } from '@/utils/easingFunctions';

const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timingUtils.getPreset('heroTitleReveal').duration,
      ease: timingUtils.getEasing('heroTitle'),
      staggerChildren: 0.2
    }
  }
};

export const AnimatedHero = () => (
  <motion.section
    variants={heroVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.h1 variants={heroVariants}>
      Your Name
    </motion.h1>
    <motion.p variants={heroVariants}>
      Your Title
    </motion.p>
    <motion.button variants={heroVariants}>
      Get In Touch
    </motion.button>
  </motion.section>
);
```

### Skill Bar Animation

```tsx
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export const SkillBar = ({ skill, percentage }) => (
  <ScrollReveal animation="slideUp">
    <div className="skill-item">
      <div className="skill-header">
        <span>{skill}</span>
        <AnimatedCounter 
          end={percentage} 
          suffix="%" 
          duration={1200}
          easing="skillCounter"
        />
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{
            duration: 1.2,
            ease: timingUtils.getEasing('skillBar'),
            delay: 0.2
          }}
        />
      </div>
    </div>
  </ScrollReveal>
);
```

### Project Card Hover

```tsx
import { motion } from 'framer-motion';

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    scale: 1.05,
    y: -10,
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.15,
      ease: timingUtils.getEasing('projectHover')
    }
  }
};

export const ProjectCard = ({ project }) => (
  <motion.div
    variants={cardVariants}
    initial="rest"
    whileHover="hover"
    className="project-card"
  >
    {/* Project content */}
  </motion.div>
);
```

### Staggered List Animation

```tsx
import { StaggerContainer } from '@/components/animations/StaggerContainer';

export const AnimatedList = ({ items }) => (
  <StaggerContainer stagger={0.1} animation="slideUp">
    {items.map((item, index) => (
      <div key={index} className="list-item">
        {item.content}
      </div>
    ))}
  </StaggerContainer>
);
```

## Troubleshooting

### Common Issues

#### Animations Not Running
1. Check if `prefers-reduced-motion` is enabled
2. Verify Framer Motion is properly installed
3. Ensure elements are in viewport for scroll-triggered animations

#### Poor Performance
1. Use `transform` and `opacity` instead of layout properties
2. Add `will-change` before animations, remove after
3. Reduce particle count on mobile devices
4. Check for memory leaks in long-running animations

#### Accessibility Issues
1. Ensure all interactive elements have proper ARIA labels
2. Test with keyboard navigation
3. Verify screen reader announcements work
4. Check color contrast ratios

#### Cross-Browser Issues
1. Add vendor prefixes for older browsers
2. Test backdrop-filter support (Safari)
3. Use transform instead of clip-path (Firefox)
4. Avoid complex filters on mobile

### Testing Tools

Use the built-in testing utilities:

```tsx
import { runAllTests } from '@/test-animation-setup';

// Run comprehensive animation tests
runAllTests().then(results => {
  console.log('Performance Score:', results.performance.overallScore);
  console.log('Accessibility Score:', results.accessibility.overallScore);
});
```

### Performance Monitoring

Monitor animation performance in development:

```tsx
import { AnimationPerformanceMonitor } from '@/utils/crossBrowserTest';

const monitor = new AnimationPerformanceMonitor();
monitor.start();

// Run your animations

const metrics = monitor.stop();
console.log('FPS:', metrics.fps);
console.log('Frame Drops:', metrics.frameDrops);
```

## Best Practices Summary

1. **Use consistent timing** - Stick to predefined presets
2. **Optimize for performance** - Use GPU-accelerated properties
3. **Respect accessibility** - Support reduced motion preferences
4. **Test across browsers** - Ensure cross-browser compatibility
5. **Monitor performance** - Keep animations at 60fps
6. **Provide fallbacks** - Have CSS-only alternatives
7. **Clean up resources** - Remove event listeners and timers
8. **Use semantic HTML** - Ensure proper accessibility structure
9. **Test with real devices** - Don't rely only on browser dev tools
10. **Document your animations** - Keep this guide updated

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [WCAG Animation Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [CSS Easing Functions](https://easings.net/)
- [Animation Performance Guide](https://web.dev/animations-guide/)

---

*This guide is maintained as part of the portfolio website Phase 2 implementation. For questions or updates, please refer to the project documentation.*