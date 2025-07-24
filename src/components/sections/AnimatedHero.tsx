import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { announceToScreenReader } from '../../utils/accessibility';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { 
  staggerContainer, 
  fadeInUp, 
  scaleIn,
  hoverScale,
  gradientTextVariants
} from '../../utils/animationVariants';
import { 
  easingFunctions, 
  animationDurations, 
  staggerTimings
} from '../../utils/easingFunctions';

interface AnimatedHeroProps {
  isVisible: boolean;
  onScrollToSection: (sectionId: string) => void;
}



// Floating geometric shapes component with parallax
const FloatingShapes: React.FC<{ 
  prefersReducedMotion: boolean;
  mouseX: any;
  mouseY: any;
}> = ({ prefersReducedMotion, mouseX, mouseY }) => {

  const shapes = [
    { id: 1, size: 60, x: '10%', y: '20%', delay: 0, parallaxStrength: 0.02 },
    { id: 2, size: 40, x: '85%', y: '15%', delay: 1, parallaxStrength: 0.015 },
    { id: 3, size: 80, x: '15%', y: '70%', delay: 2, parallaxStrength: 0.025 },
    { id: 4, size: 50, x: '80%', y: '75%', delay: 1.5, parallaxStrength: 0.018 },
    { id: 5, size: 35, x: '50%', y: '10%', delay: 0.5, parallaxStrength: 0.012 },
    { id: 6, size: 45, x: '90%', y: '45%', delay: 2.5, parallaxStrength: 0.022 },
  ];

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: mouseX.get() * shape.parallaxStrength * 100,
            y: mouseY.get() * shape.parallaxStrength * 50,
          }}
          transition={{
            duration: animationDurations.floating + shape.id,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Ripple effect component for buttons
const RippleButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  className: string;
  ariaLabel: string;
  type?: "button" | "submit" | "reset";
  prefersReducedMotion: boolean;
}> = ({ children, onClick, onKeyDown, className, ariaLabel, type = "button", prefersReducedMotion }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      onKeyDown={onKeyDown}
      className={`${className} relative overflow-hidden`}
      aria-label={ariaLabel}
      type={type}
      variants={hoverScale}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ isVisible, onScrollToSection }) => {

  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const heroRef = useRef<HTMLElement>(null);
  
  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Scroll-based parallax
  const { scrollY } = useScroll();
  const scrollParallaxY = useTransform(scrollY, [0, 500], [0, -150]);
  const scrollOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const backgroundParallaxY = useTransform(scrollY, [0, 400], [0, -100]);
  
  // Mobile and touch detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calculate all animation durations using the single prefersReducedMotion value and mobile optimization
  const smoothDuration = prefersReducedMotion ? 0.01 : (isMobile ? animationDurations.smooth * 0.7 : animationDurations.smooth);
  const normalDuration = prefersReducedMotion ? 0.01 : (isMobile ? animationDurations.normal * 0.7 : animationDurations.normal);
  const slowDuration = prefersReducedMotion ? 0.01 : (isMobile ? animationDurations.slow * 0.7 : animationDurations.slow);
  const shortDelayDuration = prefersReducedMotion ? 0.01 : (isMobile ? 0.2 : 0.3);
  const longDelayDuration = prefersReducedMotion ? 0.01 : (isMobile ? 1.5 : 2);

  // Mouse move handler for parallax effect (disabled on mobile for performance)
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center (-1 to 1)
      const x = (event.clientX - centerX) / (rect.width / 2);
      const y = (event.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion, isMobile]);

  // Touch interaction handler for mobile devices
  useEffect(() => {
    if (!isTouchDevice || !heroRef.current) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Subtle parallax effect on touch (reduced for performance)
      const x = (touch.clientX - centerX) / (rect.width / 2) * 0.3;
      const y = (touch.clientY - centerY) / (rect.height / 2) * 0.3;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleTouchEnd = () => {
      // Reset parallax on touch end
      mouseX.set(0);
      mouseY.set(0);
    };

    const heroElement = heroRef.current;
    heroElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    heroElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      heroElement.removeEventListener('touchstart', handleTouchStart);
      heroElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchDevice, mouseX, mouseY]);

  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    }
  }, [isVisible, controls]);

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleScrollToProjects = () => {
    onScrollToSection('projects');
    announceToScreenReader('Navigating to projects section');
  };

  const handleDownloadCV = () => {
    announceToScreenReader('CV download initiated');
    console.log('Download CV clicked');
  };

  // Animation variants for hero elements
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTimings.normal,
        delayChildren: 0.2,
      },
    },
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: smoothDuration,
        ease: easingFunctions.easeOutBack,
      },
    },
  };

  // Gradient animation will be handled with CSS animations instead of Framer Motion
  // to avoid TypeScript issues with backgroundPosition

  return (
    <section 
      ref={heroRef}
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      role="banner"
      aria-label="Hero section - Introduction"
    >
      {/* Floating background shapes with scroll parallax */}
      <motion.div
        style={{ 
          y: prefersReducedMotion || isMobile ? 0 : scrollParallaxY,
          opacity: prefersReducedMotion ? 1 : scrollOpacity
        }}
      >
        <FloatingShapes 
          prefersReducedMotion={prefersReducedMotion} 
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </motion.div>

      {/* Animated gradient background with scroll parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
        style={{ 
          y: prefersReducedMotion || isMobile ? 0 : backgroundParallaxY,
          opacity: prefersReducedMotion ? 1 : scrollOpacity
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: slowDuration }}
      />

      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        style={{ 
          y: prefersReducedMotion || isMobile ? 0 : useTransform(scrollY, [0, 300], [0, -50])
        }}
      >
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate={controls}
          className="relative"
        >
          <motion.div 
            variants={containerVariants}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl"
          >
            <header>
              {/* Animated name with typewriter effect */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                variants={fadeInUp}
              >
                <motion.span 
                  className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent bg-[length:200%_100%]"
                  variants={gradientTextVariants}
                  role="text"
                  aria-label={`${personalInfo.name}, Portfolio`}
                >
                  {personalInfo.name}
                </motion.span>
              </motion.h1>

              {/* Animated title */}
              <motion.h2 
                className="text-2xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: normalDuration,
                  ease: easingFunctions.easeOutCubic 
                }}
              >
                <motion.span 
                  className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent bg-[length:200%_100%]"
                  variants={gradientTextVariants}
                  role="text"
                  aria-label={`Professional title: ${personalInfo.title}`}
                >
                  {personalInfo.title}
                </motion.span>
              </motion.h2>
            </header>

            {/* Animated tagline */}
            <motion.p 
              className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
              role="text"
              aria-label={`Professional summary: ${personalInfo.tagline} with ${personalInfo.yearsOfExperience} years of experience`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: normalDuration,
                delay: shortDelayDuration,
                ease: easingFunctions.easeOutCubic 
              }}
            >
              {personalInfo.tagline} - {personalInfo.yearsOfExperience} years of experience delivering exceptional user experiences
            </motion.p>

            {/* Animated CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center" 
              role="group" 
              aria-label="Call to action buttons"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={scaleIn}>
                <RippleButton
                  onClick={handleScrollToProjects}
                  onKeyDown={(e) => handleKeyDown(e, handleScrollToProjects)}
                  className="backdrop-blur-md bg-gradient-to-r from-blue-500/80 to-purple-500/80 border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                  ariaLabel="View my work - Navigate to projects section"
                  prefersReducedMotion={prefersReducedMotion}
                >
                  View My Work
                </RippleButton>
              </motion.div>
              
              <motion.div variants={scaleIn}>
                <RippleButton
                  onClick={handleDownloadCV}
                  onKeyDown={(e) => handleKeyDown(e, handleDownloadCV)}
                  className="backdrop-blur-md bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 hover:shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                  ariaLabel="Download CV - Download resume as PDF"
                  prefersReducedMotion={prefersReducedMotion}
                >
                  <Download size={20} aria-hidden="true" />
                  Download CV
                </RippleButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
        onClick={() => onScrollToSection('about')}
        onKeyDown={(e) => handleKeyDown(e, () => onScrollToSection('about'))}
        aria-label="Scroll down to about section"
        type="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: longDelayDuration,
            duration: normalDuration 
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div 
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300"
          animate={{ 
            y: prefersReducedMotion ? 0 : [0, -8, 0] 
          }}
          transition={{ 
            duration: animationDurations.epic,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <ChevronDown size={24} className="text-white/60" aria-hidden="true" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default AnimatedHero;