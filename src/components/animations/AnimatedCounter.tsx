import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  className?: string;
  onComplete?: () => void;
  trigger?: 'immediate' | 'scroll';
  threshold?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circOut' | 'backOut';
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = ',',
  className = '',
  onComplete,
  trigger = 'scroll',
  threshold = 0.3,
  easing = 'easeOut',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const counterRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(trigger === 'immediate');
  
  // Helper function to format numbers with separators
  const formatNumber = (value: number, decimals: number, separator: string): string => {
    const fixed = value.toFixed(decimals);
    const parts = fixed.split('.');
    
    // Add thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    return parts.join('.');
  };
  
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (latest) => {
    return formatNumber(latest, decimals, separator);
  });

  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (trigger === 'immediate') return;

    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
        }
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
  }, [trigger, threshold, hasAnimated]);

  // Animation logic
  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const easingFunctions = {
      linear: [0, 0, 1, 1],
      easeIn: [0.42, 0, 1, 1],
      easeOut: [0, 0, 0.58, 1],
      easeInOut: [0.42, 0, 0.58, 1],
      circOut: [0.075, 0.82, 0.165, 1],
      backOut: [0.175, 0.885, 0.32, 1.275],
    };

    const animationDuration = prefersReducedMotion ? 0.1 : duration;
    const animationDelay = prefersReducedMotion ? 0 : delay;

    const controls = animate(motionValue, to, {
      duration: animationDuration,
      delay: animationDelay,
      ease: easingFunctions[easing] as any,
      onComplete: () => {
        setHasAnimated(true);
        onComplete?.();
      },
    });

    return controls.stop;
  }, [isInView, hasAnimated, motionValue, to, duration, delay, easing, prefersReducedMotion, onComplete]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export default AnimatedCounter;