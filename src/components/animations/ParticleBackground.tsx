import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { usePerformanceOptimization, useAnimationFrame } from '../../hooks/usePerformanceOptimization';
import { animationDurations, easingFunctions } from '../../utils/easingFunctions';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'hexagon';
  rotationSpeed: number;
  rotation: number;
  parallaxStrength: number;
}

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  floatSpeed: number;
  floatRange: number;
  opacity: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon';
  parallaxStrength: number;
  delay: number;
}

interface ParticleBackgroundProps {
  /** Number of particles to render (will be adjusted based on device) */
  particleCount?: number;
  /** Number of floating shapes to render */
  shapeCount?: number;
  /** Enable mouse interaction effects */
  enableMouseInteraction?: boolean;
  /** Enable parallax scrolling effects */
  enableParallax?: boolean;
  /** Color theme for particles */
  colorTheme?: 'blue' | 'purple' | 'gradient' | 'monochrome';
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** CSS class name for the container */
  className?: string;
  /** Z-index for the background */
  zIndex?: number;
  /** Enable gradient background animations */
  enableGradientAnimation?: boolean;
  /** Enable mouse-following particle effects */
  enableMouseFollowing?: boolean;
  /** Section-specific animation variant */
  sectionVariant?: 'hero' | 'about' | 'skills' | 'projects' | 'contact' | 'default';
  /** Enable advanced performance optimizations */
  enablePerformanceMode?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  shapeCount = 8,
  enableMouseInteraction = true,
  enableParallax = true,
  colorTheme = 'gradient',
  animationSpeed = 1,
  className = '',
  zIndex = -1,
  enableGradientAnimation = true,
  enableMouseFollowing = true,
  sectionVariant = 'default',
  enablePerformanceMode = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { 
    settings, 
    shouldShowParticles, 
    shouldUseComplexAnimations,
    enableGPUAcceleration 
  } = usePerformanceOptimization({ 
    enableMonitoring: true,
    adaptivePerformance: true 
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Device and performance detection
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEnd: false,
    pixelRatio: 1,
  });

  // Mouse interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Scroll parallax
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);
  const parallaxOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  // Detect device capabilities and adjust particle count
  useEffect(() => {
    const detectDevice = () => {
      const isMobile = window.innerWidth <= 768;
      const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                       (navigator as any).deviceMemory <= 4 ||
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const pixelRatio = window.devicePixelRatio || 1;

      setDeviceInfo({ isMobile, isLowEnd, pixelRatio });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Adjust particle count based on device capabilities
  const adjustedParticleCount = useMemo(() => {
    if (prefersReducedMotion) return 0;
    
    let count = particleCount;
    if (deviceInfo.isMobile) count *= 0.5;
    if (deviceInfo.isLowEnd) count *= 0.3;
    
    return Math.max(Math.floor(count), 5);
  }, [particleCount, deviceInfo, prefersReducedMotion]);

  const adjustedShapeCount = useMemo(() => {
    if (prefersReducedMotion) return Math.min(shapeCount, 3);
    
    let count = shapeCount;
    if (deviceInfo.isMobile) count *= 0.7;
    if (deviceInfo.isLowEnd) count *= 0.5;
    
    return Math.max(Math.floor(count), 2);
  }, [shapeCount, deviceInfo, prefersReducedMotion]);

  // Section-specific configurations - updated for light theme
  const sectionConfig = useMemo(() => {
    const configs = {
      hero: {
        gradientColors: [
          'rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.15)',
          'rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.15), rgba(59, 130, 246, 0.15)'
        ],
        particleIntensity: 1.5,
        shapeIntensity: 1.2,
        animationSpeed: 1.2,
      },
      about: {
        gradientColors: [
          'rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)',
          'rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(34, 197, 94, 0.1)'
        ],
        particleIntensity: 0.8,
        shapeIntensity: 0.9,
        animationSpeed: 0.8,
      },
      skills: {
        gradientColors: [
          'rgba(249, 115, 22, 0.12), rgba(239, 68, 68, 0.12), rgba(236, 72, 153, 0.12)',
          'rgba(239, 68, 68, 0.12), rgba(236, 72, 153, 0.12), rgba(249, 115, 22, 0.12)'
        ],
        particleIntensity: 1.0,
        shapeIntensity: 1.1,
        animationSpeed: 1.0,
      },
      projects: {
        gradientColors: [
          'rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1)',
          'rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1)'
        ],
        particleIntensity: 1.2,
        shapeIntensity: 1.0,
        animationSpeed: 0.9,
      },
      contact: {
        gradientColors: [
          'rgba(139, 92, 246, 0.12), rgba(147, 51, 234, 0.12), rgba(99, 102, 241, 0.12)',
          'rgba(147, 51, 234, 0.12), rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12)'
        ],
        particleIntensity: 0.7,
        shapeIntensity: 0.8,
        animationSpeed: 0.7,
      },
      default: {
        gradientColors: [
          'rgba(156, 163, 175, 0.08), rgba(107, 114, 128, 0.08), rgba(75, 85, 99, 0.08)',
          'rgba(107, 114, 128, 0.08), rgba(75, 85, 99, 0.08), rgba(156, 163, 175, 0.08)'
        ],
        particleIntensity: 1.0,
        shapeIntensity: 1.0,
        animationSpeed: 1.0,
      },
    };
    return configs[sectionVariant];
  }, [sectionVariant]);

  // Color palettes based on theme - updated for light theme
  const colorPalettes = useMemo(() => {
    const palettes = {
      blue: ['rgba(59, 130, 246, 0.6)', 'rgba(147, 197, 253, 0.4)', 'rgba(191, 219, 254, 0.3)'],
      purple: ['rgba(147, 51, 234, 0.6)', 'rgba(196, 181, 253, 0.4)', 'rgba(221, 214, 254, 0.3)'],
      gradient: [
        'rgba(59, 130, 246, 0.6)', 
        'rgba(147, 51, 234, 0.5)', 
        'rgba(236, 72, 153, 0.5)',
        'rgba(147, 197, 253, 0.4)',
        'rgba(196, 181, 253, 0.4)'
      ],
      monochrome: ['rgba(107, 114, 128, 0.3)', 'rgba(156, 163, 175, 0.2)', 'rgba(209, 213, 219, 0.1)'],
    };
    return palettes[colorTheme];
  }, [colorTheme]);

  // Generate particles with physics properties
  const particles = useMemo(() => {
    const particleArray: Particle[] = [];
    
    for (let i = 0; i < adjustedParticleCount; i++) {
      const shapes: Particle['shape'][] = ['circle', 'square', 'triangle', 'hexagon'];
      
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: (Math.random() * 4 + 2) * sectionConfig.particleIntensity,
        speedX: (Math.random() - 0.5) * 0.5 * animationSpeed * sectionConfig.animationSpeed,
        speedY: (Math.random() - 0.5) * 0.3 * animationSpeed * sectionConfig.animationSpeed,
        opacity: (Math.random() * 0.5 + 0.1) * sectionConfig.particleIntensity,
        color: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotationSpeed: (Math.random() - 0.5) * 2 * animationSpeed * sectionConfig.animationSpeed,
        rotation: Math.random() * 360,
        parallaxStrength: Math.random() * 0.02 + 0.01,
      });
    }
    
    return particleArray;
  }, [adjustedParticleCount, colorPalettes, animationSpeed, sectionConfig]);

  // Generate floating shapes
  const floatingShapes = useMemo(() => {
    const shapeArray: FloatingShape[] = [];
    
    for (let i = 0; i < adjustedShapeCount; i++) {
      const shapes: FloatingShape['shape'][] = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
      
      shapeArray.push({
        id: i,
        x: Math.random() * 90 + 5, // Keep shapes within bounds
        y: Math.random() * 90 + 5,
        size: (Math.random() * 60 + 40) * sectionConfig.shapeIntensity,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5 * animationSpeed * sectionConfig.animationSpeed,
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRange: (Math.random() * 20 + 10) * sectionConfig.shapeIntensity,
        opacity: (Math.random() * 0.3 + 0.1) * sectionConfig.shapeIntensity,
        color: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        parallaxStrength: Math.random() * 0.03 + 0.015,
        delay: Math.random() * 5,
      });
    }
    
    return shapeArray;
  }, [adjustedShapeCount, colorPalettes, animationSpeed, sectionConfig]);

  // Mouse interaction handler
  useEffect(() => {
    if (!enableMouseInteraction || prefersReducedMotion || deviceInfo.isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (event.clientX - centerX) / (rect.width / 2);
      const y = (event.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableMouseInteraction, prefersReducedMotion, deviceInfo.isMobile, mouseX, mouseY]);

  // Mouse-following particles
  const [mouseFollowingParticles, setMouseFollowingParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enableMouseFollowing || prefersReducedMotion || deviceInfo.isMobile) return;

    const followingParticles: Particle[] = [];
    const particleCount = enablePerformanceMode ? 3 : 8;

    for (let i = 0; i < particleCount; i++) {
      followingParticles.push({
        id: `following-${i}`,
        x: 50,
        y: 50,
        size: Math.random() * 3 + 1,
        speedX: 0,
        speedY: 0,
        opacity: Math.random() * 0.4 + 0.1,
        color: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        shape: 'circle',
        rotationSpeed: 0,
        rotation: 0,
        parallaxStrength: 0.1 + i * 0.02,
      });
    }

    setMouseFollowingParticles(followingParticles);
  }, [enableMouseFollowing, prefersReducedMotion, deviceInfo.isMobile, enablePerformanceMode, colorPalettes]);

  // Performance optimization: throttle mouse following updates
  const [lastMouseUpdate, setLastMouseUpdate] = useState(0);
  const mouseUpdateThrottle = enablePerformanceMode ? 32 : 16; // 60fps or 30fps
  const mouseFollowingAnimationRef = useRef<number>();

  useEffect(() => {
    if (!enableMouseFollowing || mouseFollowingParticles.length === 0) return;

    const updateMouseFollowingParticles = () => {
      const now = performance.now();
      if (now - lastMouseUpdate < mouseUpdateThrottle) {
        mouseFollowingAnimationRef.current = requestAnimationFrame(updateMouseFollowingParticles);
        return;
      }

      setMouseFollowingParticles(prev => 
        prev.map((particle, index) => {
          const targetX = mouseX.get() * 50 + 50;
          const targetY = mouseY.get() * 25 + 50;
          
          // Enhanced easing with different speeds for each particle
          const easingFactor = 0.08 + (index * 0.015);
          const dampening = 0.95; // Add slight dampening for more natural movement
          
          return {
            ...particle,
            x: particle.x + (targetX - particle.x) * easingFactor * dampening,
            y: particle.y + (targetY - particle.y) * easingFactor * dampening,
          };
        })
      );

      setLastMouseUpdate(now);
      mouseFollowingAnimationRef.current = requestAnimationFrame(updateMouseFollowingParticles);
    };

    mouseFollowingAnimationRef.current = requestAnimationFrame(updateMouseFollowingParticles);

    return () => {
      if (mouseFollowingAnimationRef.current) {
        cancelAnimationFrame(mouseFollowingAnimationRef.current);
      }
    };
  }, [enableMouseFollowing, mouseFollowingParticles.length, mouseX, mouseY, mouseUpdateThrottle, enablePerformanceMode]);

  // Performance monitoring
  const [frameRate, setFrameRate] = useState(60);
  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());

  // Particle animation loop (for complex physics)
  const [particlePositions, setParticlePositions] = useState(particles);

  const animateParticles = useCallback(() => {
    if (prefersReducedMotion) return;

    const now = performance.now();
    const deltaTime = now - lastFrameTimeRef.current;
    
    // Performance monitoring
    frameTimeRef.current.push(deltaTime);
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
      const currentFPS = Math.round(1000 / avgFrameTime);
      setFrameRate(currentFPS);
    }
    
    lastFrameTimeRef.current = now;

    // Adaptive quality based on performance
    const performanceMultiplier = frameRate < 45 ? 0.5 : frameRate < 55 ? 0.8 : 1.0;

    setParticlePositions(prevParticles => 
      prevParticles.map(particle => {
        // Enhanced physics with boundary wrapping and performance scaling
        const speedMultiplier = performanceMultiplier * (enablePerformanceMode ? 0.7 : 1.0);
        
        return {
          ...particle,
          x: (particle.x + particle.speedX * speedMultiplier + 100) % 100,
          y: (particle.y + particle.speedY * speedMultiplier + 100) % 100,
          rotation: particle.rotation + particle.rotationSpeed * speedMultiplier,
        };
      })
    );

    animationFrameRef.current = requestAnimationFrame(animateParticles);
  }, [prefersReducedMotion, frameRate, enablePerformanceMode]);

  useEffect(() => {
    if (!prefersReducedMotion && adjustedParticleCount > 0) {
      animateParticles();
    }

    return () => {
      // Comprehensive cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mouseFollowingAnimationRef.current) {
        cancelAnimationFrame(mouseFollowingAnimationRef.current);
      }
      
      // Clear performance monitoring arrays
      frameTimeRef.current = [];
      
      // Reset particle positions to prevent memory leaks
      setParticlePositions([]);
      setMouseFollowingParticles([]);
    };
  }, [animateParticles, prefersReducedMotion, adjustedParticleCount]);

  // Memory management: cleanup on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animations when tab is not visible
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (mouseFollowingAnimationRef.current) {
          cancelAnimationFrame(mouseFollowingAnimationRef.current);
        }
      } else {
        // Resume animations when tab becomes visible
        if (!prefersReducedMotion && adjustedParticleCount > 0) {
          animateParticles();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [animateParticles, prefersReducedMotion, adjustedParticleCount]);

  // Shape component renderer
  const renderShape = (shape: string, size: number, className: string = '') => {
    const baseClass = `absolute ${className}`;
    
    switch (shape) {
      case 'circle':
        return <div className={`${baseClass} rounded-full`} />;
      case 'square':
        return <div className={baseClass} />;
      case 'triangle':
        return (
          <div 
            className={baseClass}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid currentColor`,
            }}
          />
        );
      case 'diamond':
        return (
          <div 
            className={`${baseClass} transform rotate-45`}
          />
        );
      case 'hexagon':
        return (
          <div 
            className={baseClass}
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        );
      default:
        return <div className={`${baseClass} rounded-full`} />;
    }
  };

  // Early return check - must be after all hooks
  if (prefersReducedMotion && adjustedShapeCount === 0) {
    return (
      <div
        className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ zIndex }}
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ 
        zIndex,
        y: enableParallax ? parallaxY : 0,
        opacity: enableParallax ? parallaxOpacity : 1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animationDurations.slow }}
    >
      {/* Advanced animated gradient background */}
      {enableGradientAnimation && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Primary gradient layer with enhanced animations */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, ${sectionConfig.gradientColors[0]})`,
            }}
            animate={{
              background: [
                `linear-gradient(45deg, ${sectionConfig.gradientColors[0]})`,
                `linear-gradient(135deg, ${sectionConfig.gradientColors[1]})`,
                `linear-gradient(225deg, ${sectionConfig.gradientColors[0]})`,
                `linear-gradient(315deg, ${sectionConfig.gradientColors[1]})`,
                `linear-gradient(45deg, ${sectionConfig.gradientColors[0]})`,
              ]
            }}
            transition={{
              duration: enablePerformanceMode ? 12 : 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Secondary radial gradient layer */}
          <motion.div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${sectionConfig.gradientColors[1]})`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
              background: [
                `radial-gradient(circle at 30% 40%, ${sectionConfig.gradientColors[1]})`,
                `radial-gradient(circle at 70% 60%, ${sectionConfig.gradientColors[0]})`,
                `radial-gradient(circle at 40% 80%, ${sectionConfig.gradientColors[1]})`,
                `radial-gradient(circle at 60% 20%, ${sectionConfig.gradientColors[0]})`,
                `radial-gradient(circle at 30% 40%, ${sectionConfig.gradientColors[1]})`,
              ]
            }}
            transition={{
              duration: enablePerformanceMode ? 15 : 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Tertiary conic gradient layer for advanced color transitions */}
          <motion.div
            className="absolute inset-0 mix-blend-soft-light opacity-30"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, ${sectionConfig.gradientColors[0]}, ${sectionConfig.gradientColors[1]}, ${sectionConfig.gradientColors[0]})`,
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: enablePerformanceMode ? 20 : 15,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
          />

          {/* Animated mesh gradient overlay for depth */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, ${sectionConfig.gradientColors[0]}, transparent 50%),
                radial-gradient(ellipse at 80% 80%, ${sectionConfig.gradientColors[1]}, transparent 50%),
                radial-gradient(ellipse at 80% 20%, ${sectionConfig.gradientColors[0]}, transparent 50%),
                radial-gradient(ellipse at 20% 80%, ${sectionConfig.gradientColors[1]}, transparent 50%)
              `,
            }}
            animate={{
              opacity: [0.1, 0.25, 0.1],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: enablePerformanceMode ? 18 : 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>
      )}

      {/* Enhanced mouse-following particles with trail effects */}
      {enableMouseFollowing && !prefersReducedMotion && !deviceInfo.isMobile && mouseFollowingParticles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        >
          {/* Core particle with enhanced glow */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: particle.color }}
            animate={{
              boxShadow: [
                `0 0 ${particle.size * 2}px ${particle.color}`,
                `0 0 ${particle.size * 4}px ${particle.color}`,
                `0 0 ${particle.size * 2}px ${particle.color}`,
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
          
          {/* Outer glow ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border opacity-40"
            style={{ 
              borderColor: particle.color,
              borderWidth: '1px',
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: index * 0.15,
            }}
          />
          
          {/* Inner pulse effect */}
          <motion.div 
            className="absolute inset-1 rounded-full blur-sm"
            style={{ backgroundColor: particle.color }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.8, 0.2, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          />
        </motion.div>
      ))}
      {/* Animated particles */}
      {!prefersReducedMotion && particlePositions.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            rotate: particle.rotation,
          }}
          animate={{
            x: enableMouseInteraction ? mouseX.get() * particle.parallaxStrength * 100 : 0,
            y: enableMouseInteraction ? mouseY.get() * particle.parallaxStrength * 50 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
          }}
        >
          {renderShape(particle.shape, particle.size)}
        </motion.div>
      ))}

      {/* Floating geometric shapes */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute backdrop-blur-sm"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: shape.rotation 
          }}
          animate={{
            opacity: [shape.opacity * 0.5, shape.opacity, shape.opacity * 0.5],
            scale: [0.8, 1.2, 0.8],
            rotate: prefersReducedMotion ? shape.rotation : [
              shape.rotation, 
              shape.rotation + 180, 
              shape.rotation + 360
            ],
            x: enableMouseInteraction ? mouseX.get() * shape.parallaxStrength * 100 : 0,
            y: enableMouseInteraction ? mouseY.get() * shape.parallaxStrength * 50 : 0,
          }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : animationDurations.floating + shape.delay,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        >
          {renderShape(
            shape.shape, 
            shape.size, 
            `bg-gradient-to-br from-current to-transparent border border-current/20`
          )}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: shape.color,
              borderRadius: shape.shape === 'circle' ? '50%' : '0',
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ParticleBackground;