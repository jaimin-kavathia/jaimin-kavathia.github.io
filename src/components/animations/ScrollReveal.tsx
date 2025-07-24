import React, { useRef, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'slide' | 'fade' | 'scale' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  stagger = 0,
  threshold = 0.1,
  className = '',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { createOptimizedObserver, getOptimizedVariants, enableGPUAcceleration } = usePerformanceOptimization();

  useEffect(() => {
    const observer = createOptimizedObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
      // Enable GPU acceleration for the element
      enableGPUAcceleration(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, once, createOptimizedObserver, enableGPUAcceleration]);

  const getAnimationVariants = (): Variants => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    const baseTransition = {
      duration,
      ease: 'easeOut',
      delay,
    };

    switch (animation) {
      case 'slide':
        const slideDistance = 60;
        let x = 0, y = 0;
        
        switch (direction) {
          case 'up':
            y = slideDistance;
            break;
          case 'down':
            y = -slideDistance;
            break;
          case 'left':
            x = slideDistance;
            break;
          case 'right':
            x = -slideDistance;
            break;
        }

        return {
          hidden: { opacity: 0, x, y },
          visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: baseTransition,
          },
        };

      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { ...baseTransition, ease: 'backOut' },
          },
        };

      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -10, scale: 0.9 },
          visible: { 
            opacity: 1, 
            rotate: 0, 
            scale: 1,
            transition: baseTransition,
          },
        };

      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: baseTransition,
          },
        };
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const baseVariants = getAnimationVariants();
  const variants = getOptimizedVariants(baseVariants);

  // If stagger is enabled, wrap children in motion.div elements
  const renderChildren = () => {
    if (stagger > 0 && React.Children.count(children) > 1) {
      return React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={variants}>
          {child}
        </motion.div>
      ));
    }
    return children;
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={stagger > 0 ? containerVariants : variants}
    >
      {renderChildren()}
    </motion.div>
  );
};

export default ScrollReveal;