import { useState, useRef, useEffect, useCallback } from 'react';
import { shouldLoadHighQuality, prefersReducedMotion } from '../../utils/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  lowQualitySrc?: string;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  aspectRatio?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  lowQualitySrc,
  sizes,
  srcSet,
  onLoad,
  onError,
  priority = false,
  aspectRatio,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const loadImage = useCallback(() => {
    if (hasError) return;

    const highQuality = shouldLoadHighQuality();
    const imageSrc = highQuality ? src : (lowQualitySrc || src);
    
    // Preload the image
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(imageSrc);
      handleLoad();
    };
    img.onerror = handleError;
    
    if (srcSet) img.srcset = srcSet;
    if (sizes) img.sizes = sizes;
    img.src = imageSrc;
  }, [src, lowQualitySrc, srcSet, sizes, hasError, handleLoad, handleError]);

  useEffect(() => {
    if (priority) {
      loadImage();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loadImage]);

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      loadImage();
    }
  }, [isInView, isLoaded, hasError, loadImage]);

  const reducedMotion = prefersReducedMotion();
  const transitionClass = reducedMotion 
    ? '' 
    : 'transition-opacity duration-300 ease-in-out';

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover ${transitionClass} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        srcSet={srcSet}
      />
      
      {!isLoaded && !hasError && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${
            reducedMotion ? '' : 'animate-pulse'
          }`}
          aria-hidden="true"
        />
      )}
      
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
          role="img"
          aria-label={`Failed to load image: ${alt}`}
        >
          <div className="text-center">
            <svg 
              className="w-8 h-8 mx-auto mb-2 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;