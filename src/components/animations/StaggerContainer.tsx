import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants, Easing } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export type StaggerPattern = 'cascade' | 'wave' | 'spiral' | 'random';

export interface StaggerConfig {
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  pattern?: StaggerPattern;
  ease?: Easing | Easing[];
}

export interface StaggerContainerProps {
  children: React.ReactNode;
  config?: StaggerConfig;
  className?: string;
  animate?: boolean;
  once?: boolean;
  threshold?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  config = {},
  className = '',
  animate = true,
  once = true,
  threshold = 0.1,
}) => {
  const {
    delay = 0,
    duration = 0.6,
    staggerDelay = 0.1,
    pattern = 'cascade',
    ease = 'easeOut' as Easing,
  } = config;

  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Simple intersection observer implementation
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  // Determine if we should animate
  const shouldAnimate = animate && (once ? (isInView && !hasAnimated) : isInView);
  
  // Track if we've animated when using 'once'
  useEffect(() => {
    if (once && isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [once, isInView, hasAnimated]);

  const getStaggerDelay = (index: number, total: number): number => {
    if (prefersReducedMotion) return 0;

    switch (pattern) {
      case 'cascade':
        return index * staggerDelay;
      
      case 'wave':
        // Creates a wave pattern where middle elements animate first
        const middle = Math.floor(total / 2);
        const distance = Math.abs(index - middle);
        return distance * staggerDelay;
      
      case 'spiral':
        // Creates a spiral pattern from outside to inside
        const spiralIndex = index % 2 === 0 ? index / 2 : total - Math.ceil(index / 2);
        return spiralIndex * staggerDelay;
      
      case 'random':
        // Random delay within a range
        return Math.random() * staggerDelay * total;
      
      default:
        return index * staggerDelay;
    }
  };

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay,
        duration: 0.3,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration,
            ease,
          },
        },
      };

  const childrenArray = React.Children.toArray(children);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{
            delay: getStaggerDelay(index, childrenArray.length),
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerContainer;