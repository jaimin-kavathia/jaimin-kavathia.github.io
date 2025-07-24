import React, { Suspense, useState, useRef, useEffect } from 'react';
import { prefersReducedMotion } from '../utils/accessibility';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  priority?: boolean;
}

const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  fallback,
  threshold = 0.1,
  rootMargin = '100px 0px',
  priority = false
}) => {
  const [isInView, setIsInView] = useState(priority);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  const defaultFallback = (
    <div 
      className="flex items-center justify-center py-20"
      role="status"
      aria-label="Loading section content"
    >
      <div 
        className={`rounded-full h-12 w-12 border-b-2 border-white/30 ${
          reducedMotion ? '' : 'animate-spin'
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );

  useEffect(() => {
    if (priority) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [priority, threshold, rootMargin]);

  return (
    <div ref={sectionRef}>
      {isInView ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-screen py-20" aria-hidden="true" />
      )}
    </div>
  );
};

export default LazySection;