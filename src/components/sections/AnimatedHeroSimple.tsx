import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { ChevronDown, Download, Code, Smartphone, Zap, Cpu, Database, Globe, GitBranch, Layers, Monitor, Tablet, Watch } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedHeroProps {
  isVisible: boolean;
  onScrollToSection: (sectionId: string) => void;
}

const AnimatedHeroSimple: React.FC<AnimatedHeroProps> = ({ isVisible, onScrollToSection }) => {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const heroRef = useRef<HTMLElement>(null);
  
  // Simple state management
  const [isMobile, setIsMobile] = useState(false);
  
  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mouse move handler for parallax effect
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      
      mouseX.set(x);
      mouseY.set(y);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion, isMobile]);
  
  // Animation control
  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    }
  }, [isVisible, controls]);

  const handleScrollToProjects = () => {
    console.log('View My Work button clicked - scrolling to projects title');
    
    // First try to scroll to the projects heading specifically
    const projectsHeading = document.getElementById('projects-heading');
    if (projectsHeading) {
      console.log('Found projects heading, scrolling to title');
      projectsHeading.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    } else {
      // Fallback to the projects section
      console.log('Projects heading not found, trying section scroll');
      if (onScrollToSection) {
        onScrollToSection('projects');
      } else {
        // Final fallback to native scroll
        console.log('Using fallback scroll method');
        const projectsElement = document.getElementById('projects');
        if (projectsElement) {
          projectsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        } else {
          console.error('Projects section not found');
        }
      }
    }
  };

  const handleDownloadCV = () => {
    console.log('Download CV clicked');
    // Open CV in new tab
    window.open('https://drive.google.com/file/d/1bvbe4tazhV1FnnCgLY9OXytBJyHfEzSy/view?usp=sharing', '_blank');
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <motion.section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: prefersReducedMotion ? 0.01 : 0.5,
            staggerChildren: prefersReducedMotion ? 0 : 0.1,
          },
        },
      }}
    >
      {/* Background gradient - light theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80" />
      
      {/* Floating geometric shapes */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg rotate-45 blur-lg"
            animate={{
              y: [0, 15, 0],
              x: [0, -15, 0],
              rotate: [45, 90, 45],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-lg"
            animate={{
              y: [0, -25, 0],
              x: [0, 20, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-xl rotate-12 blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              rotate: [12, -12, 12],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
      
      {/* Floating tech icons */}
      {!prefersReducedMotion && (
        <>
          {/* Flutter/Code related icons */}
          <motion.div
            className="absolute top-32 right-32 text-blue-400/40"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Code size={32} />
          </motion.div>
          
          {/* Mobile/Smartphone icons */}
          <motion.div
            className="absolute bottom-32 left-32 text-purple-400/40"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Smartphone size={28} />
          </motion.div>
          
          {/* Performance/Speed icon */}
          <motion.div
            className="absolute top-1/2 left-16 text-cyan-400/40"
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap size={24} />
          </motion.div>
          
          {/* CPU/Processing icon */}
          <motion.div
            className="absolute top-20 left-1/4 text-indigo-400/35"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Cpu size={26} />
          </motion.div>
          
          {/* Database icon */}
          <motion.div
            className="absolute bottom-20 right-1/4 text-green-400/35"
            animate={{
              y: [0, 18, 0],
              x: [0, -8, 0],
              rotate: [0, -12, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Database size={24} />
          </motion.div>
          
          {/* Globe/Web icon */}
          <motion.div
            className="absolute top-40 right-16 text-orange-400/35"
            animate={{
              y: [0, -18, 0],
              rotate: [0, 25, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <Globe size={22} />
          </motion.div>
          
          {/* Git/Version Control icon */}
          <motion.div
            className="absolute bottom-40 left-20 text-pink-400/35"
            animate={{
              y: [0, 15, 0],
              x: [0, 12, 0],
              rotate: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <GitBranch size={20} />
          </motion.div>
          
          {/* Layers/Architecture icon */}
          <motion.div
            className="absolute top-1/3 right-20 text-violet-400/35"
            animate={{
              y: [0, -14, 0],
              x: [0, -6, 0],
              rotate: [0, 18, 0],
            }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <Layers size={25} />
          </motion.div>
          
          {/* Monitor/Desktop icon */}
          <motion.div
            className="absolute bottom-1/3 right-12 text-teal-400/35"
            animate={{
              y: [0, 16, 0],
              rotate: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            <Monitor size={23} />
          </motion.div>
          
          {/* Tablet icon */}
          <motion.div
            className="absolute top-1/4 left-12 text-emerald-400/35"
            animate={{
              y: [0, -16, 0],
              x: [0, 8, 0],
              rotate: [0, 22, 0],
            }}
            transition={{
              duration: 5.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
          >
            <Tablet size={21} />
          </motion.div>
          
          {/* Watch/Wearable icon */}
          <motion.div
            className="absolute bottom-1/4 left-1/3 text-rose-400/35"
            animate={{
              y: [0, 14, 0],
              x: [0, -10, 0],
              rotate: [0, -25, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <Watch size={18} />
          </motion.div>
          
          {/* Flutter Icon - Center Right */}
          <motion.div
            className="absolute top-1/2 right-16 text-blue-500/50 transform -translate-y-1/2"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.314 0L2.3 12 6 15.7 19.7 2h-5.386zm-.7 11.9L9.4 16.1 13 19.7 17.2 15.5 13.614 11.9z"/>
            </svg>
          </motion.div>
          
          {/* Android Icon */}
          <motion.div
            className="absolute bottom-16 right-1/3 text-green-500/45"
            animate={{
              y: [0, 18, 0],
              x: [0, -12, 0],
              rotate: [0, -18, 0],
            }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
            </svg>
          </motion.div>
          
          {/* iOS/Apple Icon */}
          <motion.div
            className="absolute top-1/3 left-1/4 text-gray-600/45"
            animate={{
              y: [0, -16, 0],
              x: [0, 8, 0],
              rotate: [0, 12, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.2,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </motion.div>
        </>
      )}
      
      {/* Orbital rings around content */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-96 h-96 border border-blue-200/30 rounded-full">
              <motion.div
                className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400/60 rounded-full -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-80 h-80 border border-purple-200/20 rounded-full">
              <motion.div
                className="absolute top-1/4 right-0 w-2 h-2 bg-purple-400/60 rounded-full translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[28rem] h-[28rem] border border-cyan-200/25 rounded-full">
              <motion.div
                className="absolute bottom-1/4 left-0 w-2.5 h-2.5 bg-cyan-400/60 rounded-full -translate-x-1/2 translate-y-1/2"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>
          </motion.div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          style={{
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
          }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: prefersReducedMotion ? 0.01 : 0.4 },
            },
          }}
        >
          {/* 3D Name with enhanced effects */}
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 relative"
            whileHover={prefersReducedMotion ? {} : { 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            <motion.span 
              className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent relative inline-block"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
              }}
              animate={prefersReducedMotion ? {} : {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {personalInfo.name}
              
              {/* Glowing effect behind text */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl -z-10"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
            
            {/* Floating particles around name */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute -top-4 -left-4 w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-purple-400 rounded-full"
                  animate={{
                    y: [0, -15, 0],
                    x: [0, -8, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute -bottom-2 left-8 w-1 h-1 bg-cyan-400 rounded-full"
                  animate={{
                    y: [0, 15, 0],
                    x: [0, -5, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </>
            )}
          </motion.h1>
          
          <motion.p
            className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto relative"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: prefersReducedMotion ? 0.01 : 0.3, delay: prefersReducedMotion ? 0 : 0.1 },
              },
            }}
          >
            <motion.span
              animate={prefersReducedMotion ? {} : {
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {personalInfo.tagline}
            </motion.span>
            
            {/* Subtle underline animation */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={prefersReducedMotion ? { width: 0 } : { width: '60%' }}
              transition={{
                duration: 1.5,
                delay: 0.8,
                ease: "easeOut",
              }}
            />
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: prefersReducedMotion ? 0.01 : 0.3, delay: prefersReducedMotion ? 0 : 0.2 },
              },
            }}
          >
            <motion.button
              onClick={handleScrollToProjects}
              onKeyDown={(e) => handleKeyDown(e, handleScrollToProjects)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View my projects"
              whileHover={prefersReducedMotion ? {} : { 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              style={{
                background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={prefersReducedMotion ? {} : { x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">View My Work</span>
            </motion.button>
            
            <motion.button
              onClick={handleDownloadCV}
              onKeyDown={(e) => handleKeyDown(e, handleDownloadCV)}
              className="group relative px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full backdrop-blur-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Download my CV"
              whileHover={prefersReducedMotion ? {} : { 
                scale: 1.05,
                borderColor: '#8B5CF6',
                color: '#8B5CF6',
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)",
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            >
              <motion.div
                className="flex items-center"
                whileHover={prefersReducedMotion ? {} : { x: 2 }}
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Download CV
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: prefersReducedMotion ? 0.01 : 0.3, delay: prefersReducedMotion ? 0 : 0.3 },
          },
        }}
      >
        <button
          onClick={() => onScrollToSection('about')}
          onKeyDown={(e) => handleKeyDown(e, () => onScrollToSection('about'))}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-full p-2"
          aria-label="Scroll to about section"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </button>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedHeroSimple;