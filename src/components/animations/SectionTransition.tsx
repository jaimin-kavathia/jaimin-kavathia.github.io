/**
 * SectionTransition Component
 * Handles smooth transitions between sections with custom animations
 * Requirements: 2.1, 2.4, 1.3, 1.4
 */

import React, { useRef } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';
import { useReducedMotion, useAnimationDuration } from '../../hooks/useReducedMotion';

interface SectionTransitionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animationType?: 'slide' | 'fade' | 'scale' | 'blur';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  optimizeForMobile?: boolean;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  id,
  className = '',
  animationType = 'slide',
  direction = 'up',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  optimizeForMobile = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: '0px 0px -100px 0px',
    amount: threshold
  });

  const prefersReducedMotion = useReducedMotion();
  const duration = useAnimationDuration(0.8);

  // Detect mobile for performance optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const shouldOptimize = optimizeForMobile && isMobile;

  // Create animation variants based on type and direction
  const createVariants = (): Variants => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } }
      };
    }

    const baseTransition: Transition = {
      duration: shouldOptimize ? duration * 0.7 : duration,
      ease: shouldOptimize ? "easeOut" : [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: shouldOptimize ? delay * 0.5 : delay
    };

    switch (animationType) {
      case 'slide':
        const slideDistance = shouldOptimize ? 30 : 60;
        return {
          hidden: {
            opacity: 0,
            y: direction === 'up' ? slideDistance : direction === 'down' ? -slideDistance : 0,
            x: direction === 'left' ? slideDistance : direction === 'right' ? -slideDistance : 0
          },
          visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: baseTransition
          }
        };

      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: baseTransition
          }
        };

      case 'scale':
        const scaleAmount = shouldOptimize ? 0.9 : 0.8;
        return {
          hidden: {
            opacity: 0,
            scale: scaleAmount
          },
          visible: {
            opacity: 1,
            scale: 1,
            transition: baseTransition
          }
        };

      case 'blur':
        return {
          hidden: {
            opacity: 0,
            filter: shouldOptimize ? 'blur(4px)' : 'blur(8px)'
          },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            transition: baseTransition
          }
        };

      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        };
    }
  };

  const variants = createVariants();

  // Performance optimization: reduce GPU usage on mobile
  const motionProps = shouldOptimize ? {
    style: { willChange: 'opacity, transform' }
  } : {};

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default SectionTransition;