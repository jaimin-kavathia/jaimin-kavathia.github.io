/**
 * Micro-interactions and hover effects for enhanced user experience
 */

import { motion, Variants } from 'framer-motion';
import { timingUtils } from './easingFunctions';

// Button interaction variants
export const buttonVariants: Record<string, Variants> = {
  // Primary button with lift effect
  primaryButton: {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
      transition: {
        duration: timingUtils.getPreset('quickHover').duration,
        ease: timingUtils.getEasing('buttonHover'),
      },
    },
    tap: {
      scale: 0.98,
      y: 0,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: timingUtils.getPreset('buttonPress').duration,
        ease: timingUtils.getEasing('buttonPress'),
      },
    },
  },

  // Secondary button with subtle glow
  secondaryButton: {
    rest: {
      scale: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    hover: {
      scale: 1.01,
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.99,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      transition: {
        duration: 0.1,
        ease: 'easeInOut',
      },
    },
  },

  // Icon button with rotation
  iconButton: {
    rest: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.95,
      rotate: -5,
      transition: {
        duration: 0.1,
        ease: 'easeInOut',
      },
    },
  },

  // Ghost button with fill effect
  ghostButton: {
    rest: {
      backgroundColor: 'transparent',
      color: 'rgba(59, 130, 246, 1)',
      borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    hover: {
      backgroundColor: 'rgba(59, 130, 246, 1)',
      color: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(59, 130, 246, 1)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: 'easeInOut',
      },
    },
  },
};

// Card interaction variants
export const cardVariants: Record<string, Variants> = {
  // Project card with 3D tilt
  projectCard: {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.03,
      rotateX: 5,
      rotateY: 5,
      z: 50,
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: 0.3,
        ease: timingUtils.getEasing('projectCard'),
      },
    },
  },

  // Skill card with glow effect
  skillCard: {
    rest: {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    hover: {
      scale: 1.02,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },

  // Service card with lift and shadow
  serviceCard: {
    rest: {
      y: 0,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      y: -8,
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },
};

// Navigation interaction variants
export const navigationVariants: Record<string, Variants> = {
  // Navigation link with underline
  navLink: {
    rest: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    hover: {
      color: 'rgba(59, 130, 246, 1)',
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  },

  // Navigation underline indicator
  navUnderline: {
    rest: {
      scaleX: 0,
      opacity: 0,
    },
    hover: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },

  // Mobile menu item
  mobileMenuItem: {
    closed: {
      x: -20,
      opacity: 0,
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },
};

// Input interaction variants
export const inputVariants: Record<string, Variants> = {
  // Text input with focus effect
  textInput: {
    rest: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
    },
    focus: {
      borderColor: 'rgba(59, 130, 246, 1)',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
    error: {
      borderColor: 'rgba(239, 68, 68, 1)',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)',
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  },

  // Input label float effect
  inputLabel: {
    rest: {
      y: 0,
      scale: 1,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    focus: {
      y: -20,
      scale: 0.85,
      color: 'rgba(59, 130, 246, 1)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },
};

// Icon interaction variants
export const iconVariants: Record<string, Variants> = {
  // Social media icon
  socialIcon: {
    rest: {
      scale: 1,
      rotate: 0,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      color: 'rgba(59, 130, 246, 1)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },

  // Arrow icon with bounce
  arrowIcon: {
    rest: {
      x: 0,
    },
    hover: {
      x: 5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },

  // Loading spinner
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  },

  // Pulse effect
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
};

// Text interaction variants
export const textVariants: Record<string, Variants> = {
  // Typewriter effect
  typewriter: {
    hidden: {
      width: 0,
    },
    visible: {
      width: 'auto',
      transition: {
        duration: 2,
        ease: 'steps(20, end)',
      },
    },
  },

  // Text highlight effect
  highlight: {
    rest: {
      backgroundColor: 'transparent',
    },
    hover: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  },

  // Text reveal effect
  textReveal: {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  },
};

// Utility functions for micro-interactions
export const microInteractionUtils = {
  // Create ripple effect
  createRipple: (event: React.MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  },

  // Add hover sound effect (if enabled)
  playHoverSound: (soundType: 'click' | 'hover' | 'success' | 'error' = 'hover') => {
    // Only play if user hasn't disabled sounds
    if (localStorage.getItem('soundsEnabled') === 'false') return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequencies = {
      hover: 800,
      click: 1000,
      success: 1200,
      error: 400,
    };

    oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  },

  // Add haptic feedback (mobile)
  addHapticFeedback: (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
      };
      navigator.vibrate(patterns[intensity]);
    }
  },

  // Smooth focus transition
  smoothFocus: (element: HTMLElement, options: { outline?: boolean; scale?: boolean } = {}) => {
    const { outline = true, scale = false } = options;

    element.style.transition = 'all 0.2s ease-out';

    if (outline) {
      element.style.outline = '2px solid #3b82f6';
      element.style.outlineOffset = '2px';
    }

    if (scale) {
      element.style.transform = 'scale(1.02)';
    }

    // Remove effects on blur
    const handleBlur = () => {
      element.style.outline = 'none';
      element.style.transform = 'scale(1)';
      element.removeEventListener('blur', handleBlur);
    };

    element.addEventListener('blur', handleBlur);
  },

  // Animate number counting
  animateNumber: (
    element: HTMLElement,
    start: number,
    end: number,
    duration: number = 2000,
    easing: (t: number) => number = (t) => t
  ) => {
    const startTime = performance.now();
    const difference = end - start;

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = start + difference * easedProgress;

      element.textContent = Math.round(currentValue).toString();

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  },

  // Create floating label effect
  createFloatingLabel: (input: HTMLInputElement, label: HTMLElement) => {
    const handleFocus = () => {
      label.style.transform = 'translateY(-20px) scale(0.85)';
      label.style.color = '#3b82f6';
    };

    const handleBlur = () => {
      if (!input.value) {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = 'rgba(255, 255, 255, 0.6)';
      }
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    // Initial state
    if (input.value) {
      handleFocus();
    }

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  },
};

// CSS-in-JS styles for micro-interactions
export const microInteractionStyles = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -8px, 0);
    }
    70% {
      transform: translate3d(0, -4px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-2px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(2px);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }

  /* Utility classes for micro-interactions */
  .micro-bounce:hover {
    animation: bounce 0.6s ease-in-out;
  }

  .micro-pulse {
    animation: pulse 2s infinite;
  }

  .micro-glow:hover {
    animation: glow 1s ease-in-out infinite;
  }

  .micro-shake {
    animation: shake 0.5s ease-in-out;
  }

  /* Reduced motion alternatives */
  @media (prefers-reduced-motion: reduce) {
    .micro-bounce:hover,
    .micro-pulse,
    .micro-glow:hover,
    .micro-shake {
      animation: none;
    }

    .micro-bounce:hover {
      transform: scale(1.02);
    }

    .micro-glow:hover {
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
  }
`;

// Export all variants and utilities
export {
  buttonVariants,
  cardVariants,
  navigationVariants,
  inputVariants,
  iconVariants,
  textVariants,
  microInteractionUtils,
  microInteractionStyles,
};