/**
 * ErrorState Component
 * Provides animated error states and feedback with accessibility support
 * Requirements: 2.1, 2.4, 1.3, 1.4
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useReducedMotion, useAnimationDuration } from '../../hooks/useReducedMotion';

interface ErrorStateProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  isVisible,
  title = 'Something went wrong',
  message = 'Please try again later',
  type = 'error',
  onRetry,
  onDismiss,
  autoHide = false,
  autoHideDelay = 5000,
  className = ''
}) => {
  const [shouldShow, setShouldShow] = useState(isVisible);
  const prefersReducedMotion = useReducedMotion();
  const duration = useAnimationDuration(0.5);

  useEffect(() => {
    setShouldShow(isVisible);
    
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        setShouldShow(false);
        onDismiss?.();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay, onDismiss]);

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-200',
          icon: '⚠️',
          accent: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-200',
          icon: '⚠️',
          accent: 'bg-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-200',
          icon: 'ℹ️',
          accent: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-200',
          icon: '⚠️',
          accent: 'bg-red-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.9,
      y: prefersReducedMotion ? 0 : 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: "easeOut",
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
      y: prefersReducedMotion ? 0 : -10,
      transition: {
        duration: duration * 0.7,
        ease: "easeIn"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: duration * 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { 
      scale: prefersReducedMotion ? 1 : 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Shake animation for error emphasis (only if motion is enabled)
  const shakeVariants: Variants = prefersReducedMotion ? {} : {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        <motion.div
          className={`fixed top-4 right-4 z-50 max-w-md ${className}`}
          variants={containerVariants}
          initial="hidden"
          animate={["visible", !prefersReducedMotion && type === 'error' ? "shake" : ""]}
          exit="exit"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <motion.div
            className={`backdrop-blur-md ${typeStyles.bg} ${typeStyles.border} border rounded-xl p-4 shadow-2xl`}
            variants={shakeVariants}
          >
            {/* Progress bar for auto-hide */}
            {autoHide && !prefersReducedMotion && (
              <motion.div
                className={`absolute top-0 left-0 h-1 ${typeStyles.accent} rounded-t-xl`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: autoHideDelay / 1000, ease: "linear" }}
              />
            )}

            <div className="flex items-start space-x-3">
              {/* Icon */}
              <motion.div
                variants={itemVariants}
                className="flex-shrink-0 text-xl"
                role="img"
                aria-label={`${type} icon`}
              >
                {typeStyles.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  variants={itemVariants}
                  className={`text-sm font-semibold ${typeStyles.text} mb-1`}
                >
                  {title}
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  className={`text-sm ${typeStyles.text} opacity-80`}
                >
                  {message}
                </motion.p>

                {/* Action buttons */}
                {(onRetry || onDismiss) && (
                  <motion.div
                    variants={itemVariants}
                    className="flex space-x-2 mt-3"
                  >
                    {onRetry && (
                      <motion.button
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={onRetry}
                        className={`px-3 py-1 text-xs font-medium ${typeStyles.text} bg-white/10 hover:bg-white/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50`}
                        aria-label="Retry action"
                      >
                        Retry
                      </motion.button>
                    )}
                    {onDismiss && (
                      <motion.button
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          setShouldShow(false);
                          onDismiss();
                        }}
                        className={`px-3 py-1 text-xs font-medium ${typeStyles.text} bg-white/5 hover:bg-white/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50`}
                        aria-label="Dismiss notification"
                      >
                        Dismiss
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Close button */}
              {onDismiss && (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                  onClick={() => {
                    setShouldShow(false);
                    onDismiss();
                  }}
                  className={`flex-shrink-0 ${typeStyles.text} hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded`}
                  aria-label="Close notification"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorState;