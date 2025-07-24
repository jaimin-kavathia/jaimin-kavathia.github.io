/**
 * Animation variants for Framer Motion components
 * Provides consistent animation configurations across the application
 */

import { Variants } from 'framer-motion';

// Basic entrance animations
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "backOut" 
    }
  }
};

export const rotateIn: Variants = {
  hidden: { 
    opacity: 0, 
    rotate: -180 
  },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
};

// Stagger container variants
export const staggerContainer: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerFast: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerSlow: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

// Hover and interaction variants
export const hoverScale: Variants = {
  rest: { 
    scale: 1 
  },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2, 
      ease: "easeOut" 
    }
  }
};

export const hoverGlow: Variants = {
  rest: { 
    boxShadow: "0 0 0 rgba(59, 130, 246, 0)" 
  },
  hover: { 
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
    transition: { 
      duration: 0.3 
    }
  }
};

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3 
    }
  }
};

// Text and gradient variants
export const gradientTextVariants: Variants = {
  hidden: { 
    backgroundPosition: "200% 0" 
  },
  visible: { 
    backgroundPosition: "-200% 0",
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Loading and skeleton variants
export const pulseAnimation: Variants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const shimmerAnimation: Variants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};