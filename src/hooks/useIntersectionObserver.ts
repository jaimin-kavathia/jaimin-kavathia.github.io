import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

interface SectionVisibility {
  home: boolean;
  about: boolean;
  skills: boolean;
  projects: boolean;
  achievements: boolean;
  contact: boolean;
}

interface UseSectionVisibilityReturn {
  isVisible: SectionVisibility;
}

/**
 * Custom hook for intersection observer functionality
 * Used for triggering scroll animations when elements come into view
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseSectionVisibilityReturn => {
  const {
    threshold = 0.3,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState<SectionVisibility>({
    home: false,
    about: false,
    skills: false,
    projects: false,
    achievements: false,
    contact: false,
  });

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'achievements', 'contact'];
    const observers: IntersectionObserver[] = [];

    // Set home section as visible by default since it's always loaded
    setIsVisible(prev => ({ ...prev, home: true }));

    const observeSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(prev => ({
            ...prev,
            [sectionId]: entry.isIntersecting
          }));

          // If triggerOnce is true, stop observing after first intersection
          if (entry.isIntersecting && triggerOnce) {
            observer.unobserve(element);
          }
        },
        {
          threshold,
          root,
          rootMargin,
        }
      );

      observer.observe(element);
      return observer;
    };

    // Initial observation
    sections.forEach((sectionId) => {
      const observer = observeSection(sectionId);
      if (observer) observers.push(observer);
    });

    // Set up a mutation observer to watch for new sections being added
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check if the added element or its children contain any of our sections
            sections.forEach((sectionId) => {
              const section = element.id === sectionId ? element : element.querySelector(`#${sectionId}`);
              if (section && !observers.find(obs => obs === observeSection(sectionId))) {
                const observer = observeSection(sectionId);
                if (observer) observers.push(observer);
              }
            });
          }
        });
      });
    });

    // Start observing the document for changes
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
      mutationObserver.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return { isVisible };
};

/**
 * Hook for multiple elements intersection observation
 * Useful for staggered animations across multiple elements
 */
export const useMultipleIntersectionObserver = (
  elementsCount: number,
  options: UseIntersectionObserverOptions = {}
) => {
  const [intersections, setIntersections] = useState<boolean[]>(
    new Array(elementsCount).fill(false)
  );
  const refs = useRef<(HTMLElement | null)[]>(new Array(elementsCount).fill(null));

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIntersections(prev => {
            const newIntersections = [...prev];
            newIntersections[index] = entry.isIntersecting;
            return newIntersections;
          });

          if (entry.isIntersecting && triggerOnce) {
            observer.unobserve(element);
          }
        },
        {
          threshold,
          root,
          rootMargin,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  const setRef = (index: number) => (element: HTMLElement | null) => {
    refs.current[index] = element;
  };

  return { intersections, setRef };
};