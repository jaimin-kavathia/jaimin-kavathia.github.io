/**
 * PageTransition Component
 * Handles initial page load animations, section transitions, and loading states
 * Requirements: 2.1, 2.2, 2.4, 1.2
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useReducedMotion, useAnimationDuration } from '../../hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  showLogo?: boolean;
  className?: string;
}

interface LogoRevealProps {
  onComplete?: () => void;
}

// Logo reveal animation component
const LogoReveal: React.FC<LogoRevealProps> = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const duration = useAnimationDuration(0.6);

  const logoVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      rotate: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: duration,
        ease: "easeOut",
        delay: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      transition: {
        duration: duration * 0.5,
        ease: "easeIn"
      }
    }
  };

  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration * 0.8,
        ease: "easeOut",
        delay: duration * 0.6
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: duration * 0.3,
        ease: "easeIn"
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, prefersReducedMotion ? 50 : 1000);

    return () => clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      initial="visible"
      animate="visible"
      exit="exit"
    >
      <div className="text-center">
        {/* Logo/Icon */}
        <motion.div
          variants={logoVariants}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-bold text-white">JK</span>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          variants={textVariants}
          className="text-gray-700 text-lg font-medium"
        >
          Loading Portfolio...
        </motion.div>

        {/* Loading indicator */}
        {!prefersReducedMotion && (
          <motion.div
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-600 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Staggered content reveal component
const StaggeredReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const duration = useAnimationDuration(0.6);

  const containerVariants: Variants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: duration,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={itemVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

// Main PageTransition component
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isLoading = false,
  showLogo = true,
  className = ""
}) => {
  const [showLogoReveal, setShowLogoReveal] = useState(showLogo);
  const [contentReady, setContentReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip logo reveal if reduced motion is preferred
    if (prefersReducedMotion) {
      setShowLogoReveal(false);
      setContentReady(true);
    }
  }, [prefersReducedMotion]);

  const handleLogoComplete = () => {
    setShowLogoReveal(false);
    setTimeout(() => {
      setContentReady(true);
    }, 100);
  };

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: useAnimationDuration(0.8),
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: useAnimationDuration(0.5),
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLogoReveal && (
          <LogoReveal key="logo" onComplete={handleLogoComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {contentReady && (
          <motion.div
            key="content"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={className}
          >
            {isLoading ? (
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <StaggeredReveal>
                {children}
              </StaggeredReveal>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Loading spinner component
const LoadingSpinner: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-2 w-8 h-8 border-2 border-gray-200 border-b-purple-600 rounded-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute inset-6 w-4 h-4 bg-blue-600 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default PageTransition;
export { LogoReveal, StaggeredReveal, LoadingSpinner };